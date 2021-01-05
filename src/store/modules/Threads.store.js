/* Comments.store.js */

import { getField, updateField } from 'vuex-map-fields';

const getDefaultThreadsState = () => {
  return {
    threads: {
      threadsLoading: false,
      threadLoadLimit: 5,
      threadIDs: [],
      threads: [],
      threadCount: 0,
      threadIDCount: 0,
      lastThreadLoaded: false,
    }
  }
}

// State object
const state = getDefaultThreadsState()

// Getter functions
const getters = {
  getField, // for v-models
}

// Actions
const actions = {}

// Mutations
const mutations = {
  updateField, // for v-models

  ADD_THREAD (state, payload) {
    state.threads.threads.push(payload)
    state.threads.threadCount++
  },

  ADD_THREAD_ID (state, payload) {
    state.threads.threadIDs.push(payload)
    state.threads.threadIDCount++
  },

  RESET_THREADS (state) {
    Object.assign(state, getDefaultThreadsState())
  }
}

export default {
  // Make sure all modules in the store are namespaced (so we can access them via eg. User/login)
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
