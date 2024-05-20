import { lngLatToTile, tileToLngLat } from "../../utils/bmapUtils";
import { CreateTile, TileFlexibleLayerOptions } from "./typing";

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

  private ctx: CanvasRenderingContext2D;

  private minZoom: number = 6;

  private maxZoom: number = 21;

  private readonly tileSize: number = 256;

  private createTile: CreateTile;

  private timeoutID: number = 0;

  private zIndex: number;

  private visible: boolean;

  constructor(opts: TileFlexibleLayerOptions) {
    super();
    // 绘制方法
    this.createTile = opts.createTile;
    this.zIndex = opts.zIndex ?? 0;
    // 缩放等级
    const minZoom = opts.zooms?.[0];
    this.minZoom = minZoom && minZoom >= 6 ? minZoom : 6;
    const maxZoom = opts.zooms?.[1];
    this.maxZoom =
      maxZoom && maxZoom >= this.minZoom && maxZoom <= 21 ? maxZoom : 21;
    this.visible = opts.visible ?? true;
    // 初始化 canvas
    this.canvas = document.createElement("canvas");
    this.canvas.style.zIndex = this.zIndex.toString();
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  initialize(map: BMapGL.Map) {
    this.map = map;

    if (!this.visible) {
      this.hide();
    }

    this.adjustCanvasSize();

    map.getPanes().markerPane.appendChild(this.canvas);

    return this.canvas;
  }

  /**
   * 设置 canvas 比例
   */
  adjustCanvasRatio() {
    // TODO
  }

  /**
   * 设置 canvas 大小
   */
  adjustCanvasSize() {
    const { width, height } = (this.map as BMapGL.Map).getSize();
    const canvas = this.canvas;
    if (width !== canvas.width || height !== canvas.height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = canvas.width + "px";
      canvas.style.height = canvas.height + "px";
    }
  }

  draw() {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      this.drawTiles();
    }, 5);
  }

  private drawTiles() {
    const map = this.map as BMapGL.Map;
    // map是否改变大小
    this.adjustCanvasSize();

    // 获取地图 zoom
    const zoom = Math.floor(map.getZoom());

    // 清空上一次的绘制
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 不满足绘制条件
    if (zoom < this.minZoom || zoom > this.maxZoom) {
      // TODO
      return;
    }

    // 获取屏幕的经纬度
    const bounds = map.getBounds();
    // 获取屏幕左下角坐标
    const southWest = bounds.getSouthWest();
    // 获取屏幕右上角坐标
    const northEast = bounds.getNorthEast();

    // z 数据范围 [1 - 18]
    const z = zoom < 19 ? zoom : 18;

    const resolution = Math.pow(2, 18 - z);

    // 获取屏幕左下角和右上角经纬度对应的网格坐标
    const { x: minX, y: minY } = lngLatToTile(southWest, resolution);
    const { x: maxX, y: maxY } = lngLatToTile(northEast, resolution);

    // 绘制逻辑
    const drawTile = (x: number, y: number, z: number) => {
      return function (ele: HTMLCanvasElement) {
        // 根据栅格编号反推经纬度
        const res = Math.pow(2, 18 - z);
        const southWest = tileToLngLat(new BMapGL.Pixel(x, y), res);
        const northEast = tileToLngLat(new BMapGL.Pixel(x + 1, y + 1), res);
        // 计算屏幕坐标
        const { x: startX, y: startY } = map.pointToOverlayPixel(southWest);
        const { x: endX, y: endY } = map.pointToOverlayPixel(northEast);
        // 绘制方法
        ctx.drawImage(ele, startX, startY, startX - endX, startY - endY);
      };
    };

    for (let x = minX; x <= maxX + 1; x++) {
      for (let y = minY; y <= maxY + 1; y++) {
        this.createTile(x, y, z, drawTile(x, y, z), () => { });
      }
    }
  }

  /**
   * 获取瓦片
   * @param x 横向瓦片编号
   * @param y 纵向瓦片编号
   * @param z zoom 层级
   */
  private getTile(x: number, y: number, z: number): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      this.createTile(x, y, z, (ele: HTMLCanvasElement) => { resolve(ele) }, () => { reject() })
    })
  }

  /**
   * 获取容器 canvas
   * @returns canvas
   */
  getContainer() {
    return this.canvas;
  }

  /**
   * 显示图层
   */
  show() {
    if (!this.canvas) {
      (this.map as BMapGL.Map).addOverlay(this);
    }
    this.canvas.style.display = "block";
  }

  /**
   * 隐藏图层
   */
  hide() {
    this.canvas.style.display = "none";
  }

  /**
   * 设置zIndex
   * @param zIndex
   */
  setZIndex(zIndex: number) {
    this.zIndex = zIndex;
    this.canvas.style.zIndex = zIndex.toString();
  }

  /**
   * 获取zIndex
   * @returns
   */
  getZIndex() {
    return this.zIndex;
  }
}
