<template>
  <div class="bmap-telecom" id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { TileFlexibleLayer } from "./TileFlexibleLayer";
import { WorkerQueue } from "./WorkerQueue";

const queue = new WorkerQueue();

function hello(x: number, y: number, z: number) {
  // self.onmessage = () => {
  const canvas = new OffscreenCanvas(256, 256);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.font = "15px Verdana";
  ctx.fillStyle = "#ff0000";
  ctx.strokeStyle = "#FF0000";
  ctx.strokeRect(0, 0, 256, 256);
  ctx.fillText("(" + [x, y, z].join(",") + ")", 10, 30);
  const imageBitmap = canvas.transferToImageBitmap();
  self.postMessage(imageBitmap);
  self.close();
  // }

}

function createWorker(fn: (x: number, y: number, z: number) => void, x: number, y: number, z: number) {
  const blob = new Blob([`(${fn.toString()})(${x},${y},${z})`], { type: 'text/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

onMounted(() => {
  var map = new BMapGL.Map("container");
  // createWorker(hello);
  map.centerAndZoom("重庆市", 13); // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true);
  let count = 1
  const layer = new TileFlexibleLayer({
    createTile: (
      x: number,
      y: number,
      z: number,
      success: (ele: HTMLCanvasElement | ImageBitmap) => void,
      fail: () => void
    ) => {
      const a = Math.floor(Math.random() * 1000000)
      console.time(a.toString());
      // const worker = createWorker(hello, x, y, z);
      // worker.postMessage({ x, y, z });
      // worker.onmessage = (e) => {
        console.log(`第${count++}次请求${x}-${y}-${z}`)
      //   success(e.data);
      //   console.timeEnd(a.toString())
      // };

      queue.enqueueTask<ImageBitmap>((x: number, y: number, z: number) => {
        const canvas = new OffscreenCanvas(256, 256);
        const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.font = "15px Verdana";
        ctx.fillStyle = "#ff0000";
        ctx.strokeStyle = "#FF0000";
        ctx.strokeRect(0, 0, 256, 256);
        ctx.fillText("(" + [x, y, z].join(",") + ")", 10, 30);
        return canvas.transferToImageBitmap();
      }, x, y, z).then(res => {
        console.timeEnd(a.toString())
        success(res);
      })
      // console.time()
      // var c = document.createElement("canvas");
      // c.width = c.height = 256;

      // var cxt = c.getContext("2d") as CanvasRenderingContext2D;
      // cxt.font = "15px Verdana";
      // cxt.fillStyle = "#ff0000";
      // cxt.strokeStyle = "#FF0000";
      // cxt.strokeRect(0, 0, 256, 256);
      // cxt.fillText("(" + [x, y, z].join(",") + ")", 10, 30);
      // console.log(`第${count++}次请求${x}-${y}-${z}`)
      // console.timeEnd()
      // // 通知API切片创建完成
      // success(c);
    },
  });
  map.addOverlay(layer);
});
</script>

<style scoped>
.bmap-telecom {
  min-width: 100vw;
  min-height: 100vh;
}
</style>
