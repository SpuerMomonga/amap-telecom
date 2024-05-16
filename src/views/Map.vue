<template>
  <div class="amap-telecom">
    <div class="toggle-map">
      <n-button type="primary" @click="toggleMap">
        {{ mapType === "amap" ? "高德地图" : "百度地图" }}
      </n-button>
    </div>
    <n-card class="card-layer" title="数据图层" size="small">
      <n-checkbox-group v-model:value="layerCheck">
        <n-flex vertical>
          <n-checkbox value="dot" label="点位" />
          <n-checkbox value="sectors" label="扇区" />
          <n-checkbox value="heat" label="热力" />
          <n-checkbox value="outline" label="轮廓" />
          <n-checkbox value="grid" label="栅格" />
        </n-flex>
      </n-checkbox-group>
    </n-card>
    <AMap v-if="mapType === 'amap'" />
    <BMap v-else />
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard, NCheckboxGroup, NCheckbox, NFlex } from "naive-ui";
import AMap from "./amap/AMap.vue";
import BMap from "./bmap/BMap.vue";
import { ref } from "vue";

const mapType = ref("bmap");

const layerCheck = ref<string[]>([]);

function toggleMap() {
  mapType.value = mapType.value === "amap" ? "bmap" : "amap";
}
</script>

<style scoped>
.amap-telecom {
  min-width: 100vw;
  min-height: 100vh;
  position: relative;
}

.toggle-map {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
}

.card-layer {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
  width: 150px;
}
</style>
