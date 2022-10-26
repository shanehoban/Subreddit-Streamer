import Vue from 'vue'
import VueRouter from 'vue-router'

// App
import App from '@/views/App.vue'
import Subreddit from '@/views/Subreddit.vue'
import Streams from '@/views/Streams.vue'
import Auth from '@/views/Auth.vue'

Vue.use(VueRouter)

let routes = [
  // This is our non logged in 404 handler. It will match everything that is not above it
  { path: '/auth', component: Auth },

  { 
    path: '/',
    component: App,
    name: 'App',
    
    children: [
      { path: '/', component: Subreddit, name: 'Subreddit' },
      { path: '/stream', component: Streams, name: 'Streams' },
    ]
  },

  { path: '*', redirect: '/'}, // 4 oh 4
]

const router = new VueRouter({
  routes,
  mode: 'history', // will need htaccess for this to work
})

export default router
