<script setup lang="ts">
import Versions from "./components/Versions.vue";
// import { onMounted } from "vue";

// const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

// onMounted(() => {
//   setTimeout(() => {
//     const splashElem = document.getElementById("app-splash");
//     if (splashElem) {
//       splashElem.style.display = "none";
//     }
//   }, 2000);
// });
</script>

<template>
  <header class="header">
    <span>Title here</span>
  </header>
  <main class="main">
    <img alt="logo" class="logo" src="./assets/electron.svg" />
    <Versions />
    <div>
      实际上这篇分享的内容没有太多看起来非常硬核的技术手段，更多的是对当前性能瓶颈的测量，以及更聪明的「重新排列组合」，或者说采用了一系列使体验更好的策略，这对用户体验的提升是巨大的。这也给了
      KAITIAN 很大的启发，基于这些，我们也重新审视并优化了 KAITIAN
      的启动速度，使 KAITIAN
      的启动由之前的接近3秒达到了500ms以内的速度，后面会分享一下基于这个分享的
      KAITIAN 启动速度优化过程。
    </div>
  </main>
</template>

<style lang="css" scoped>
.logo {
  height: 200px;
  width: 200px;
}

.header {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 36px;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  padding: 0 12px;
  z-index: 1;
  background-color: antiquewhite;
}

.main {
  position: fixed;
  left: 0;
  top: 36px;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
