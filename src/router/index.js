import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/timestamp'
    },
    {
      path: '/timestamp',
      name: 'timestamp',
      component: () => import('../views/TimestampConverter.vue')
    },
    {
      path: '/json',
      name: 'json',
      component: () => import('../views/JsonFormatter.vue')
    },
    {
      path: '/base64',
      name: 'base64',
      component: () => import('../views/Base64Converter.vue')
    }
  ]
})

export default router