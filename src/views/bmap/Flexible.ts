export class Flexible extends BMapGL.NormalLayer {

  constructor(opts?: BMapGL.NormalLayerOptions) {
    super({
      ...opts,
      zIndex: 10,
    });
  }

  onAdd(map: BMapGL.Map, gl: BMapGL.GL) {
    // console.log("onAdd", gl);
  }

  preRender(map: BMapGL.Map, matrix: BMapGL.Matrix, opt: Object) {
    // console.log("preRender", map, matrix, opt);
  }

  render(gl: BMapGL.GL, matrix: BMapGL.Matrix, opt: Object) {
    console.log("render", gl, matrix, opt);
  }

  afterRender(gl: BMapGL.GL, matrix: BMapGL.Matrix) {
    // console.log("afterRender", gl, matrix);
  }

  onDestroy(map: BMapGL.Map, gl: BMapGL.GL) {
    // console.log("onDestroy", gl);
  }

  doOnceDraw() {
    // console.log("doOnceDraw");
  }

}