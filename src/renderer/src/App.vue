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
