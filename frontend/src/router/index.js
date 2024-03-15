import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Banner from '../views/BannersView.vue'
import SignIn from '@/Stuff/SignIn.vue'
import loader from '@/Stuff/loader.vue'
import Home from '@/views/HomeBarView.vue'
import Product from '@/views/ProductView.vue'
import Categories from '@/views/CategoriesView.vue'
import Orders from '@/views/OrdersView.vue'
import BrandsView from '@/views/BrandsView.vue'

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
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/product',
      name: 'product',
      component: Product
    },
    {
      path: '/categories',
      name:'categories',
      component: Categories
    },
    {
      path: '/brands',
      name:'brands',
      component: Brands
    },
    {
      path: '/orders',
      name:'orders',
      component: OrderView
    },
  ]
})

export default router
