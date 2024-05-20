<template>
  <div class="bmap-telecom" id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { TileFlexibleLayer } from "./TileFlexibleLayer";

function createWorker() {
  const blob = new Blob([], {type: 'text/javascript'});
  return new Worker(URL.createObjectURL(blob));
}

onMounted(() => {
  var map = new BMapGL.Map("container");

  map.centerAndZoom("重庆市", 13); // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true);
  let count = 1
  const layer = new TileFlexibleLayer({
    createTile: (
      x: number,
      y: number,
      z: number,
      success: (ele: HTMLCanvasElement) => void,
      fail: () => void
    ) => {
      console.time()
      var c = document.createElement("canvas");
      c.width = c.height = 256;

      var cxt = c.getContext("2d") as CanvasRenderingContext2D;
      cxt.font = "15px Verdana";
      cxt.fillStyle = "#ff0000";
      cxt.strokeStyle = "#FF0000";
      cxt.strokeRect(0, 0, 256, 256);
      cxt.fillText("(" + [x, y, z].join(",") + ")", 10, 30);
      console.log(`第${count++}次请求${x}-${y}-${z}`)
      console.timeEnd()
      // 通知API切片创建完成
      success(c);
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
