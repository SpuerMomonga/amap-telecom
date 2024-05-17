import gcoord from 'gcoord';

export interface FlexibleLayerOptions {
  url?: string;
  blend?: boolean;
  cacheSize?: number;
  createTile: () => void;
  params?: any;
  zooms?: [number, number];
  opacity?: number;
  zIndex?: number;
  visible?: boolean;
}

export class FlexibleDemo extends BMapGL.Overlay {

  static readonly TILE_SIZE = 256;

  // 地图实例
  private map: BMapGL.Map;

  private grids: string[][] = [];

  private timeout: any;

  private createTile: (x: number, y: number, z: number, success: () => void, fail: () => void) => void;

  // 构造器
  constructor(map: BMapGL.Map, opt: FlexibleLayerOptions) {
    super();
    this.map = map;
    // 初始化
    this.initialize();

    this.createTile = opt.createTile;
  }

  initialize() {

  }

  /**
   * 初始化并监听地图移动事件
   */
  private initialize() {
    // 首次加载调用绘制
    this.drawGrids();

    // 鼠标拖动事件
    this.map.addEventListener("dragend", () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.drawGrids();
      }, 400)
    });

    // 鼠标缩放事件
    this.map.addEventListener("zoomend", () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.drawGrids();
      }, 400)
    });
  }

  /**
   * 获取当前屏幕可视区域内所有瓦片编号
   */
  private getGridSerial() {
    const bounds = this.map.getBounds();
    // 获取屏幕左下角坐标
    const southWest = bounds.getSouthWest();
    // 获取屏幕右上角坐标
    const northEast = bounds.getNorthEast();

    const zoom = this.map.getZoom();
    const resolution = Math.pow(2, 18 - zoom);

    // 获取屏幕左下角和右上角经纬度对应的网格坐标
    const [minX, minY] = this.lngLatToGrid([southWest.lng, southWest.lat], resolution);
    const [maxX, maxY] = this.lngLatToGrid([northEast.lng, northEast.lat], resolution);

    this.grids = [];
    console.log(minX, minY, maxX, maxY);
    for (let x = minX; x <= maxX; x++) {
      let gridsRow = [];
      for (let y = minY; y <= maxY; y++) {
        gridsRow.push(`${x},${y},${zoom}`);
      }
      this.grids.push(gridsRow);
    }
  }

  /**
   * 调用批量绘制方法
   */
  private drawGrids() {
    this.getGridSerial();
    this.grids.forEach((row) => {
      row.forEach((item) => {
        const [x, y, z] = item.split(",");
        this.createTile(parseInt(x), parseInt(y), parseInt(z), this.drawGrid, this.fail)
      })
    })
  }

  /**
   * 把单个格子绘制上屏幕
   */
  private drawGrid() {
    // DOTO
  }

  private fail() {
    // DOTO
  }

  /**
   * 经纬度转栅格编号
   * @param input 
   */
  public lngLatToGrid(input: [any, any], resolution: number) {
    const [x, y] = gcoord.transform(input, gcoord.BD09, gcoord.BD09MC);
    const tileX = x / (Flexible.TILE_SIZE * resolution);
    const tileY = y / (Flexible.TILE_SIZE * resolution);
    return [Math.floor(tileX), Math.floor(tileY)];
  }

}