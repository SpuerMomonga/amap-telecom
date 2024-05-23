declare global {

  interface Window {
    BMapGL: typeof BMapGL;
  }

  namespace BMapGL {
    export class Map {
      constructor(container: String | HTMLElement, opts?: MapOptions);
      /**
       * 初始化地图
       * @param center 地图中心点
       * @param zoom 地图初始缩放级别
       */
      centerAndZoom(center: Point | string, zoom: number);
      enableScrollWheelZoom(bool: boolean);
      getBounds(): Bounds;
      /**
       * 获取地图缩放级别
       * @returns {number} 地图缩放级别
       */
      getZoom(): number;
      getPanes(): MapPanes;
      getSize(): Size;
      addEventListener(event: string, handler: () => void);
      addOverlay(overlay: Overlay);
      pointToOverlayPixel(point: Point): Pixel;
      addNormalLayer(layer: NormalLayer);
    }

    export class Point {
      constructor(lng: number, lat: number);
      lng: number;
      lat: number;
    }

    export class Size {
      constructor(width: number, height: number);
      width: number;
      height: number;
    }

    export class Pixel {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }

    export interface MapOptions {
      minZoom?: number;
      maxZoom?: number;
    }

    export interface MapPanes {
      floatPane: HTMLElement;
      markerMouseTarget: HTMLElement;
      floatShadow: HTMLElement;
      labelPane: HTMLElement;
      markerPane: HTMLElement;
    }

    export class TileLayer {
      constructor(opts?: TileLayerOptions);
    }

    export class NormalLayer {
      constructor(opts?: NormalLayerOptions);
      onAdd(map: Map, gl: GL);
      preRender(map: Map, matrix: Matrix, opt: Object);
      render(gl: GL, matrix: Matrix, opt: Object);
      getPickedItem(index: number, model: string);
      afterRender(gl: GL, matrix: Matrix);
      onDestroy(map: Map, gl: GL)
      onHide(map: Map, gl: GL);
      onShow(map: Map, gl: GL);
      doOnceDraw();
      setZIndex(zIndex: number);
      setZIndexTop();
      setUpLevel();
      setDownLevel();
      getZIndex(): number;
      setVisible(bool: boolean);
      getVisible(): boolean;
      setOpacity(opacity: number);
      getOpacity(): number;
      setMinZoom(zoom: number);
      getMinZoom(): number;
      setMaxZoom(zoom: number);
      getMaxZoom(): number;
    }

    export class GL {
      canvas: HTMLCanvasElement;
    }

    export class Matrix {
    }

    export class Bounds {
      constructor(sw: Point, ne: Point);
      getSouthWest(): Point;
      getNorthEast(): Point;
    }

    export interface NormalLayerOptions {
      visible?: boolean;
      zIndex?: number;
      opacity?: number;
      minZoom?: number;
      maxZoom?: number;
      enablePicked?: boolean;
      autoSelect?: boolean;
      popEvent?: boolean;
      pickWidth?: number;
      pickHeight?: number;
    }

    export interface TileLayerOptions {
      transparentPng?: boolean;
      tileUrlTemplate?: string;
      zIndex?: number;
    }

    export class Overlay {
      constructor();
      initialize(map: Map);
      draw();
    }
  }
}

export { }