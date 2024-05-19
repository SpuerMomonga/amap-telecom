import gcoord from "gcoord";

export function lngLatToTile(point: BMapGL.Point, resolution: number): BMapGL.Pixel {
  const [x, y] = gcoord.transform(
    [point.lng, point.lat],
    gcoord.BD09,
    gcoord.BD09MC
  );
  const tileX = x / (256 * resolution);
  const tileY = y / (256 * resolution);
  return new BMapGL.Pixel(Math.floor(tileX), Math.floor(tileY));
}

export function tileToLngLat(
  pixel: BMapGL.Pixel,
  resolution: number
): BMapGL.Point {
  const x = pixel.x * 256 * resolution;
  const y = pixel.y * 256 * resolution;
  const lngLat = gcoord.transform([x, y], gcoord.BD09MC, gcoord.BD09);
  return new BMapGL.Point(lngLat[0], lngLat[1]);
}
