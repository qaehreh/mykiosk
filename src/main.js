import {createApp} from "vue";
// import '../src/assets/css/app.css';
// import '../src/assets/css/app.css.map';
import App from "./App.vue";
import router from "./routes";
import store from './store'

// import "./assets/css/app.css";

createApp(App).use(router).use(store).mount("#app");
