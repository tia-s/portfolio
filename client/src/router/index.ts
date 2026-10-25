import { createRouter, createWebHistory } from 'vue-router'
import PortfolioPage from '../views/PortfolioPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: PortfolioPage },
    { path: '/fr', component: PortfolioPage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
})

export default router
