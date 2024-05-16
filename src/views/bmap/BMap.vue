<template>
  <div class="bmap-telecom" id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Flexible } from "./Flexible";
onMounted(() => {
  var map = new BMapGL.Map("container");

  map.centerAndZoom("重庆市", 13); // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true);
  const flexible = new Flexible();
  console.log(flexible);
});
</script>

<style scoped>
.bmap-telecom {
  min-width: 100vw;
  min-height: 100vh;
}
</style>
