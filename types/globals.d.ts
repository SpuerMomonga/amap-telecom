declare global {

  interface Window {
    BMapGL: typeof BMapGL;
  }

  namespace BMapGL {
    export class Map {
      constructor(id: string);
      centerAndZoom(center: Point , zoom: number);
      enableScrollWheelZoom(bool: boolean);
    }

    export class TileLayer {
      constructor(opts?: TileLayerOptions);
    }

    export interface TileLayerOptions {
      transparentPng?: boolean;
      tileUrlTemplate?: string;
      zIndex?: number;
    }
  }
}

export {}