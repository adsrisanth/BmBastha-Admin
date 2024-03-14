import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Banner from '../views/Banners.vue'
import SignIn from '@/Stuff/SignIn.vue'
import loader from '@/Stuff/loader.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/banner',
      name:'banner',
      component: Banner 
    },
    {
      path:'/admin',
      name: 'admin',
      component: SignIn
    },
    {
      path:'/load',
      name:'load',
      component: loader
    }
  ]
})

export default router
