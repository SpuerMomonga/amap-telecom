export function lngLatToTile(point: BMapGL.Point, resolution: number): BMapGL.Pixel {
  const { BD09toBD09MC } = useCoordTransform();
  const [x, y] = BD09toBD09MC([point.lng, point.lat])
  const tileX = x / (256 * resolution);
  const tileY = y / (256 * resolution);
  return new BMapGL.Pixel(Math.floor(tileX), Math.floor(tileY));
}

export function tileToLngLat(
  pixel: BMapGL.Pixel,
  resolution: number
): BMapGL.Point {
  const { BD09MCtoBD09 } = useCoordTransform();
  const x = pixel.x * 256 * resolution;
  const y = pixel.y * 256 * resolution;
  const lngLat = BD09MCtoBD09([x, y]);
  return new BMapGL.Point(lngLat[0], lngLat[1]);
}

export function spiralMatrixFromCenter(startRow: number, endRow: number, startCol: number, endCol: number) {
  const matrix: { x: number, y: number }[][] = [];
  for (let y = startCol; y <= endCol + 1; y++) {
    const matrixRow = [];
    for (let x = startRow; x <= endRow + 1; x++) {
      matrixRow.push({ x, y })
    }
    matrix.push(matrixRow);
  }
  debugger;
  console.log(matrix);
  // 层级
  let layer = Math.ceil(Math.min(matrix.length, matrix[0].length) / 2);
  // 当前遍历次数
  let index = 0;
  // 总的需要遍历的数量
  let elemNum = matrix.length * matrix[0].length
  // 步进数量
  let rs = matrix[0].length - layer * 2, cs = matrix.length - layer * 2;
  // 步幅
  let steps = 0;
  // 坐标
  let r = layer - 1, c = layer;
  // true 表示横走, false 表示竖走
  let or = true;
  // let cd = 1, rd = 0;
  let d = 1;
  let turns = 0;
  if (matrix.length > matrix[0].length) {
    or = false;
  }
  while (index < elemNum) {
    steps = or ? rs : cs;

    for(let i = 0; i < steps; i++) {
      let result = {}
      if(or) {
        r += d;
        result = matrix[c][r];
        console.log(c,r,"cr")
      } else {
        c += d;
        result = matrix[c][r];
        console.log(c,r,"cr")
      }
      console.log(result, 'a');
      index ++;
    }
    console.log("-------------");

    or = !or;

    turns ++;
    if(turns % 2 === 0) {
      rs += 1;
      cs += 1;
      d = -d
    } 
  }
}

export function useCoordTransform() {

  const MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
  const LLBAND = [75, 60, 45, 30, 15, 0];
  const MC2LL = [
    [
      1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
      200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339,
      2.57121317296198, -0.03801003308653, 17337981.2,
    ],
    [
      -7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289,
      96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737,
      -16.50741931063887, 2.28786674699375, 10260144.86,
    ],
    [
      -3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
      59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908,
      -3.29883767235584, 0.32710905363475, 6856817.37,
    ],
    [
      -1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
      40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263,
      0.12923347998204, -0.04625736007561, 4482777.06,
    ],
    [
      3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
      23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273,
      0.03430082397953, -0.00466043876332, 2555164.4,
    ],
    [
      2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
      7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596,
      0.00010322952773, -0.00000323890364, 826088.5,
    ],
  ];
  const LL2MC = [
    [
      -0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340,
      26112667856603880, -35149669176653700, 26595700718403920,
      -10725012454188240, 1800819912950474, 82.5,
    ],
    [
      0.0008277824516172526, 111320.7020463578, 647795574.6671607,
      -4082003173.641316, 10774905663.51142, -15171875531.51559,
      12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5,
    ],
    [
      0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662,
      79682215.47186455, -115964993.2797253, 97236711.15602145,
      -43661946.33752821, 8477230.501135234, 52.5,
    ],
    [
      0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245,
      992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312,
      144416.9293806241, 37.5,
    ],
    [
      -0.0003441963504368392, 111320.7020576856, 278.2353980772752,
      2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236,
      -2710.55326746645, 1405.483844121726, 22.5,
    ],
    [
      -0.0003218135878613132, 111320.7020701615, 0.00369383431289,
      823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199,
      8.77738589078284, 0.37238884252424, 7.45,
    ],
  ];

  function transform(x: number, y: number, factors: number[]): [number, number] {
    const cc = Math.abs(y) / factors[9];

    let xt = factors[0] + factors[1] * Math.abs(x);
    let yt =
      factors[2] +
      factors[3] * cc +
      factors[4] * cc ** 2 +
      factors[5] * cc ** 3 +
      factors[6] * cc ** 4 +
      factors[7] * cc ** 5 +
      factors[8] * cc ** 6;

    xt *= x < 0 ? -1 : 1;
    yt *= y < 0 ? -1 : 1;
    return [xt, yt];
  }
  function BD09toBD09MC(coord: [number, number]): [number, number] {
    const [lng, lat] = coord;
    let factors: number[] = [];
    for (let i = 0; i < LLBAND.length; i++) {
      if (Math.abs(lat) > LLBAND[i]) {
        factors = LL2MC[i];
        break;
      }
    }
    return transform(lng, lat, factors);
  }
  function BD09MCtoBD09(coord: [number, number]): [number, number] {
    const [x, y] = coord;
    let factors: number[] = [];
    for (let i = 0; i < MCBAND.length; i++) {
      if (y >= MCBAND[i]) {
        factors = MC2LL[i];
        break;
      }
    }
    return transform(x, y, factors);
  }

  /**
   * 经纬度点计算容器内像素坐标
   * @param param0 
   * @param coord 
   * @returns 
   */
  function pointToPixel({ x, y, z }: { x: number, y: number, z: number }, coord: [number, number]) {
    // 计算栅格编号的墨卡托坐标
    const res = Math.pow(2, 18 - z);
    const minx = (x - 1) * res * 256
    const miny = (y - 1) * res * 256
    const [mcx, mcy] = BD09toBD09MC(coord);
    return [
      Math.round((mcx - minx) / res),
      Math.round((mcy - miny) / res)
    ]
  }

  return { BD09toBD09MC, BD09MCtoBD09, pointToPixel }
}