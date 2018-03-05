import Vue from 'vue'
import Router from 'vue-router'
import Profile from '@/components/Profile'
import Home from '@/components/Home'
import RetrievePassword from '@/components/RetrievePassword'
import NewPassword from '@/components/NewPassword'
import Verification from '@/components/Verification'
import Chat from '@/components/Chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/retrievePassword',
      name: 'retrievePassword',
      component: RetrievePassword
    },
    {
      path: '/newPassword/:token',
      name: 'newPassword',
      component: NewPassword
    },
    {
      path: '/verify/:token',
      name: 'verify',
      component: Verification
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    }

  ]
})
