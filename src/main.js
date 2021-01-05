// Track setTimeouts and setIntervals when debug is on only
if (process.env.VUE_APP_DEBUG_MODE === 'true' || window.location.href.indexOf('_debug') > -1) { 
  window.originalSetTimeout = window.setTimeout
  window.originalClearTimeout = window.clearTimeout
  window.activeTimers = 0
  window.setTimeout = function(func, delay) {
      window.activeTimers++
      return window.originalSetTimeout(func, delay)
  }
  window.clearTimeout = function(timerID) {
      window.activeTimers--
      window.originalClearTimeout(timerID)
  }

  window.originalSetInterval = window.setInterval
  window.originalClearInterval = window.clearInterval
  window.activeIntervals = 0
  window.setInterval = function (func, delay) {
      if(func && delay){
        window.activeIntervals++
      }
      return window.originalSetInterval(func,delay)
  }
  window.clearInterval = function (intervalId) {
      // JQuery sometimes hands in true which doesn't count
      if(intervalId !== true){
        window.activeIntervals--
      }
      return window.originalClearInterval(intervalId)
  }
} 

import Vue from 'vue'
import 'es6-promise/auto'
import router from '@/router'
import store from '@/store'

import axios from 'axios'
import helpers from '@/global/helpers'
import api from '@/global/api'

import 'balloon-css/balloon.min.css'
import 'notyf/notyf.min.css'

import '@/assets/scss/all.scss'

Vue.config.productionTip = false

let $axios = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a response interceptor
$axios.interceptors.response.use(function (response) {
  process.env.VUE_APP_DEBUG_MODE === 'true' && console.log('Axios received response: ', response)

  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  process.env.VUE_APP_DEBUG_MODE === 'true' && console.log('Axios received error: ', error)
  process.env.VUE_APP_DEBUG_MODE === 'true' && console.log('Error response: ', error.response)

  return Promise.reject(error);
})

Vue.prototype.$axios = $axios

const helpersPlugin = {
  install () {
    Vue.helpers = helpers
    Vue.prototype.$helpers = helpers
  }
}
Vue.use(helpersPlugin)

const apiPlugin = {
  install () {
    Vue.api = api
    Vue.prototype.$api = api
  }
}
Vue.use(apiPlugin)

new Vue({
  router,
  store
}).$mount('#App')
