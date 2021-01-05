/* App.store.js */

import { getField, updateField } from 'vuex-map-fields';

const getDefaultAppState = () => {
  return {
    // the actual app state goes here
    app: {
      online: true,
      serversResponding: true,
      isLoading: false,
      initialLoading: true,
      isPageHidden: document.hidden,
      commentsCleared: false,
      apiTimeout: 0,
      toasts: [],

      today: false,
      tomorrow: false,
      dailyURLString: false,
      tomorrowURLString: false,

      pauseStaggering: false,
      userScrolledUp: false, // disables sticky scroll
      scrollPaused: false, // when adding a comment
      stickyScroll: true,
      displayOldComments: false,
      displayTrump: false,
      displayGod: false,
      isPrivate: false,
      screenWidth: 0,
      optimizeCount: 0,

      modals: {
        showSettingsModal: false,
        showUpdateModal: false,
        showSubredditModal: false,
        showStatsModal: false,
        showThreadsModal: false,
      },

      build: '05.01.2020',
      version: '0.0.1', // must match with settings.version
    }
  }
}

// State object
const state = getDefaultAppState()

// Getter functions
const getters = {
  getField, // for v-models
}

// Actions
const actions = {}

// Mutations
const mutations = {
  updateField, // for v-models

  UPDATE_PROPERTY (state, payload) {
    if (typeof payload.key !== 'undefined' && typeof payload.value !== 'undefined') {
      state.app[payload.key] = payload.value
    }
  },

  RESET_APP (state) {
    Object.assign(state, getDefaultAppState())
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
