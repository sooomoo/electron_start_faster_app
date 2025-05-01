import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

// 模拟耗时操作
// setTimeout(() => {
//   createApp(App).mount("#app");
//   const splashElem = document.getElementById("app-splash");
//   if (splashElem) {
//     splashElem.style.display = "none";
//   }
// }, 200);
createApp(App).mount(document.body);
const splashElem = document.getElementById("app-splash");
if (splashElem) {
  splashElem.style.display = "none";
}
