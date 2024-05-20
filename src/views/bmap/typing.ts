export type CreateTile = (
  x: number,
  y: number,
  z: number,
  success: (ele: HTMLCanvasElement) => void,
  fail: () => void
) => void;

export type TileFlexibleLayerOptions = {
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
  createTile: CreateTile;

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

export type CacheOptions = {
  /**
   * 缓存数量
   */
  cacheLength?: number;

  /**
   * 是否启用缓存
   */
  enabled?: boolean;
}