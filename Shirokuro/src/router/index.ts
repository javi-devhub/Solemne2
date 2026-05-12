import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
    },
    {
      path: '/pause',
      name: 'pause',
      component: () => import('@/views/PauseView.vue'),
    },
    {
      path: '/victory',
      name: 'victory',
      component: () => import('@/views/VictoryView.vue'),
    },
    {
      path: '/defeat',
      name: 'defeat',
      component: () => import('@/views/DefeatView.vue'),
    },
  ],
})

export default router
