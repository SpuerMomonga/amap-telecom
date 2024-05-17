
export interface TileFlexibleLayerOptions {

  /**
   * 缓存瓦片数量，默认 256
   */
  cacheSize?: number;

  /**
   * 需要绘制的 img 或者 canvas, 切片大小 256 * 256
   * @param x 切片横向编号
   * @param y 切片纵向编号
   * @param z 切片层级
   * @param success 当创建或者获取成功时请回调success(需要绘制的img或者canvas)
   * @param fail 不需要显示或者失败时请回调fail()
   * @returns 
   */
  createTile: (x: number, y: number, z: number, success: () => void, fail: () => void) => void;

  /**
   * 支持渲染的缩放等级[6 - 21]，默认 [6, 21]
   */
  zooms?: [number, number];

  /**
   * 瓦片透明度，默认 1
   */
  opacity?: number;

  /**
   * 是否显示，默认 true
   */
  visible?: boolean;

  /**
   * 图层叠加顺序
   */
  zIndex?: number;
}

/**
 * 使用 canvas 灵活绘制瓦片
 * # Example
 * ```ts
 *  const layer = new TileFlexibleLayer();
 *  map.addOverlay(layer);
 * ```
 */
export class TileFlexibleLayer extends BMapGL.Overlay {

  private map: BMapGL.Map | null = null;

  private canvas: HTMLCanvasElement;

  constructor(opts: TileFlexibleLayerOptions) {
    super();
    this.canvas = document.createElement('canvas');
  }

  initialize(map: BMapGL.Map) {
    this.map = map;

    const { width, height } = map.getSize();

    this.canvas.width = width;
    this.canvas.height = height;

    map.getPanes().markerPane.appendChild(this.canvas);

    return this.canvas;
  }

  draw() {
    // map是否改变大小
    const {width, height} = (this.map as BMapGL.Map).getSize();
    if (width !== this.canvas.width || height !== this.canvas.height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    console.log(this.map?.getZoom())
    // 绘制逻辑
  }

}