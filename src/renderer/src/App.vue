<script setup lang="ts">
import Versions from "./components/Versions.vue";
import TitleBar from "./components/TitleBar.vue";
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
  <TitleBar />
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

.main {
  position: fixed;
  left: 0;
  top: var(--sz-titlebar-height);
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px;
}
</style>
