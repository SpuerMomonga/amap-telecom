<template>
  <div class="amap-telecom" id="container"></div>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';

onMounted(() => {
  var map = new AMap.Map("container", {
    zoom: 13,
    center: [116.39, 39.92],
  });

  var layer = new AMap.TileLayer.Flexible({
    cacheSize: 300,
    zIndex: 200,
    createTile: function (x: number, y: number, z: number, success: (ele: HTMLCanvasElement) => void, fail: () => void) {
      var c = document.createElement('canvas');
      c.width = c.height = 256;

      var cxt = c.getContext("2d") as CanvasRenderingContext2D;
      cxt.font = "15px Verdana";
      cxt.fillStyle = "#ff0000";
      cxt.strokeStyle = "#FF0000";
      cxt.strokeRect(0, 0, 256, 256);
      cxt.fillText('(' + [x, y, z].join(',') + ')', 10, 30);

      // 通知API切片创建完成
      success(c);
    }
  });
  
  layer.setMap(map);
});
</script>

<style scoped>
.amap-telecom {
  min-width: 100vw;
  min-height: 100vh;
}
</style>