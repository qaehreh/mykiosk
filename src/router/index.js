import { createRouter, createWebHistory } from 'vue-router'

// 연결할 각 컴포넌트 import (src/views폴더 아래 컴포넌트들 생성해둠)
import HelloWorld from '../components/HelloWorld.vue'
import TheWelcome from '../components/TheWelcome.vue'
import WelcomeItem from '../components/WelcomeItem.vue'

// 라우터 설계
const routes = [
    { path: '/', component:HelloWorld},
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
