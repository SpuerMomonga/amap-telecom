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
      addOverlay(overlay: Overlay );
      pointToOverlayPixel(point: Point): Pixel;
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

    export class Bounds {
      constructor(sw: Point, ne: Point);
      getSouthWest(): Point;
      getNorthEast(): Point;
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