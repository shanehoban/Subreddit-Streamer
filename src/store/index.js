import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// This will import everything in the store/modules folder (with the name *.store.js)
import modules from './modules/_index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  /*
    Use strict mode when not building for production.
    Strict mode will throw an error in development mode if you don't use mutations to correctly alter vuex state
    Read: https://vuex.vuejs.org/guide/strict.html#strict-mode
   */
  strict: process.env.NODE_ENV !== 'production',
  plugins: [createPersistedState({
    paths: ['Auth', 'Settings']
  })]
})
