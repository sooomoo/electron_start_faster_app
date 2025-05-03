import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

import { getOSType } from "./utils/os";

document.documentElement.setAttribute("data-os", getOSType());
document.documentElement.setAttribute("data-theme", "dark");

// 模拟耗时操作
// setTimeout(() => {
//   createApp(App).mount("#app");
//   const splashElem = document.getElementById("app-splash");
//   if (splashElem) {
//     splashElem.style.display = "none";
//   }
// }, 200);
createApp(App).mount("#app");
const splashElem = document.getElementById("app-splash");
if (splashElem) {
  splashElem.style.transition = "opacity .5s ease";
  splashElem.style.opacity = "0";
  setTimeout(() => {
    splashElem.remove();
  }, 500);
}

const appElem = document.getElementById("app");
if (appElem) {
  appElem.style.transition = "opacity 1s ease";
  appElem.style.opacity = "1";
}
