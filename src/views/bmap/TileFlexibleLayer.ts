import { lngLatToTile, tileToLngLat } from "../../utils/bmapUtils";

type CreateTile = (
  x: number,
  y: number,
  z: number,
  success: (ele: HTMLCanvasElement) => void,
  fail: () => void
) => void;

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

  private minZoom: number = 6;

  private maxZoom: number = 21;

  private readonly tileSize: number = 256;

  private createTile: CreateTile;

  constructor(opts: TileFlexibleLayerOptions) {
    super();
    // 绘制方法
    this.createTile = opts.createTile;
    // 缩放等级
    const minZoom = opts.zooms?.[0];
    this.minZoom = minZoom && minZoom >= 6 ? minZoom : 6;
    const maxZoom = opts.zooms?.[1];
    this.maxZoom =
      maxZoom && maxZoom >= this.minZoom && maxZoom <= 21 ? maxZoom : 21;
    // 初始化 canvas
    this.canvas = document.createElement("canvas");
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
    const map = this.map as BMapGL.Map;
    // map是否改变大小
    const { width, height } = map.getSize();
    if (width !== this.canvas.width || height !== this.canvas.height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    // 获取屏幕的经纬度
    const bounds = map.getBounds();
    // 获取屏幕左下角坐标
    const southWest = bounds.getSouthWest();
    // 获取屏幕右上角坐标
    const northEast = bounds.getNorthEast();

    const zoom = Math.floor(map.getZoom());
    const resolution = Math.pow(2, 18 - zoom);
    console.log(southWest, northEast);
    // 获取屏幕左下角和右上角经纬度对应的网格坐标
    const { x: minX, y: minY } = lngLatToTile(southWest, resolution);
    const { x: maxX, y: maxY } = lngLatToTile(northEast, resolution);

    // 不满足绘制条件
    if (zoom < this.minZoom || zoom > this.maxZoom) {
      // TODO
      return;
    }

    if (zoom > 18) {
      return;
    }

    // 清空上一次的绘制
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, width, height);

    // 绘制逻辑
    const drawTile = (x: number, y: number, z: number) => {
      const _this = this;
      // 根据栅格编号反推经纬度
      const res = Math.pow(2, 18 - z);
      const southWest = tileToLngLat(new BMapGL.Pixel(x, y), res);
      const northEast = tileToLngLat(new BMapGL.Pixel(x + 1, y + 1), res);
      // 计算屏幕坐标
      const { x: startX, y: startY } = map.pointToOverlayPixel(southWest);
      const { x: endX, y: endY } = map.pointToOverlayPixel(northEast);
      // 绘制方法
      return function (ele: HTMLCanvasElement) {
        ctx.drawImage(ele, startX, startY, startX - endX, startY - endY);
      };
    };

    const z = zoom < 19 ? zoom : 18;

    for (let x = minX; x <= maxX + 1; x++) {
      for (let y = minY; y <= maxY + 1; y++) {
        console.log(minX, maxX, minY, maxY);
        const success = drawTile(x, y, z);
        this.createTile(x, y, z, success, () => {});
      }
    }
  }
}
