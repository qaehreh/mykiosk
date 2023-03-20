import { createRouter, createWebHistory } from 'vue-router'

// 연결할 각 컴포넌트 import (src/components폴더 아래 컴포넌트들 생성해둠)
import TheWelcome from '../components/ShoppingCart.vue'
import WelcomeItem from '../components/ShoppingCart.vue'

// 라우터 설계
const routes = [
    { path: '/1', component:TheWelcome},
    { path: '/2', component:WelcomeItem}
]

// 라우터 생성
const router = createRouter({
    history: createWebHistory(),
    routes
});

// 라우터 추출 (main.js에서 import)
export {router}
