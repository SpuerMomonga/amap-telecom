<template>
  <div class="bmap-telecom" id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { TileFlexibleLayer } from "./TileFlexibleLayer";
import { WorkerQueue } from "./WorkerQueue";
import { tileToLngLat, useCoordTransform } from "../../utils/bmapUtils";

const queue = new WorkerQueue();

onMounted(() => {
  var map = new BMapGL.Map("container");

  // createWorker(hello);
  map.centerAndZoom("重庆市", 13); // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true);
  let count = 1;
  const layer = new TileFlexibleLayer({
    createTile: (
      x: number,
      y: number,
      z: number,
      success: (ele: CanvasImageSource) => void,
      fail: () => void
    ) => {
      // const a = Math.floor(Math.random() * 1000000);
      // console.time(a.toString());

      // console.log(`第${count++}次请求${x}-${y}-${z}`);

      queue
        .enqueueTask<CanvasImageSource>(
          (x: number, y: number, z: number) => {
            const canvas = new OffscreenCanvas(256, 256);
            const ctx = canvas.getContext(
              "2d"
            ) as OffscreenCanvasRenderingContext2D;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "#ff0000";
            ctx.strokeStyle = "#FF0000";
            ctx.strokeRect(0, 0, 256, 256);
            ctx.fillText("(" + [x, y, z].join(",") + ")", 10, 30);
            return canvas.transferToImageBitmap();
          },
          x,
          y,
          z
        )
        .then((res) => {
          // console.timeEnd(a.toString());
          success(res);
        })
        .catch(() => {
          fail();
        });
    },
  });
  map.addOverlay(layer);
});
</script>

<style scoped>
.bmap-telecom {
  min-width: 100vw;
  min-height: 100vh;
}
</style>
