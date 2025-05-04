<script setup lang="ts"></script>

<template>
  <header class="app_header">
    <span class="app-header__title">Title here</span>
  </header>
</template>

<style lang="css" scoped>
.app_header {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: var(--sz-titlebar-height);
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  padding: 0 12px;
  z-index: 1;
}

:root[data-os="macos"] .app-header__title {
  flex: 1;
  text-align: center;
}
</style>
