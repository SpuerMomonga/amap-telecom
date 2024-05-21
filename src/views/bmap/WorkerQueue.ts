export class WorkerQueue {

  #size = 0;

  #queue: Map<number, [(value: any) => void, (reason: any) => void]> = new Map();

  #taskId = 0;

  #workers: Map<number, string> = new Map();

  #freeWorkers: Map<number, Worker> = new Map();

  constructor(size = navigator.hardwareConcurrency - 1) {
    if (size < 1) throw new RangeError('size must greater than 0');
    this.#size = size;
  }

  /**
   * 添加任务
   * @param fn 需要执行的函数 
   */
  enqueueTask<T>(fn: Function | string, ...args: any[]) {
    const workerContext = 'data:text/javascript,' + 
    encodeURIComponent(`const __fn = ${fn.toString()};
      postMessage(__fn(${args})); self.close();`);
    const taskId = this.#taskId++;
    this.#workers.set(taskId, workerContext);
    return new Promise<T>((resolve, reject) => {
      this.#start(resolve, reject, taskId);
    });
  }

  #onFinish(taskId: number) {
    this.#freeWorkers.delete(taskId);
    if(this.#queue.size) {
      const firstKey = this.#queue.keys().next().value as number;
      const arr = this.#queue.get(firstKey) as any;
      this.#queue.delete(firstKey);
      this.#start(arr[0], arr[1], firstKey);
    }
  }

  /**
   * 执行任务
   */
  #start(resolve: (value: any) => void, reject: (reason: any) => void, taskId: number) {
    if (this.#freeWorkers.size <= this.#size) {
      const workerContext = this.#workers.get(taskId) as string;
      this.#workers.delete(taskId);
      const worker = new Worker(workerContext);
      worker.onmessage = e => {
        this.#onFinish(taskId);
        resolve(e.data);
      };
      worker.onerror = e => {
        this.#onFinish(taskId);
        reject(e.error);
      };
      this.#freeWorkers.set(taskId, worker);
    } else {
      this.#queue.set(taskId, [resolve, reject]);
    }
  }
}