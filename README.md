# map-telecom
电信业务相关地图应用

## 快速开始

自行在根目录下创建 index.html 文件

```html

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript" src="https://api.map.baidu.com/api?type=webgl&v=1.0&ak="></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key="></script>
    <title>MAP+TELECOM</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

安装

```sh

pnpm i

```

启动

```sh

pnpm dev

```

## 地图

### 高德地图

图层

[ ] 点位
[ ] 扇区
[ ] 热力
[ ] 轮廓
[ ] 栅格

### 百度地图

图层

[ ] 点位
[ ] 扇区
[ ] 热力
[ ] 轮廓
[ ] 栅格