import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

// 模拟耗时操作
setTimeout(() => {
  createApp(App).mount("#app");
  const splashElem = document.getElementById("app-splash");
  if (splashElem) {
    splashElem.style.display = "none";
  }
}, 2000);

