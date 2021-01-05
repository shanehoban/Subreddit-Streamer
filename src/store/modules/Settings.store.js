/* Settings.store.js */

import { getField, updateField } from 'vuex-map-fields';

const getDefaultSettingsState = () => {
  return {  
    settings: {
      uid: (Math.random()*1e20).toString(36), // for logging in to reddit
      debug: process.env.VUE_APP_DEBUG_MODE === 'true' ? true : false,
      disableConsoleLogs: false,
      disableAnimations: false,
      theme: 'dark-theme',
      showBotComments: true,
      showUsernames: true,
      showTimestamps: false,
      showPostTitles: false,
      hideReplyIcons: false,
      hideCommentBoxes: false,
      hideUpvoteBtns: false,

      subreddit: 'askreddit',
      defaultSubreddit: 'askreddit',
      
      commentFilter: {
        filterEnabled: false,
        filterPermalink: false,
        filterTitle: false,
      },

      // wsb related
      disableEasterEggs: false,
      hidePostLabels: false,

      version: '0.0.1', // must match with app.version
    },
  }
}

// State object
const state = getDefaultSettingsState()

// Getter functions
const getters = {
  getField, // for v-models
}

// Actions
const actions = {}

// Mutations
const mutations = {
  updateField, // for v-models

  UPDATE_SETTING (state, payload) {
    if (typeof payload.key !== 'undefined' && typeof payload.value !== 'undefined') {
      state.settings[payload.key] = payload.value

      if (payload.key === 'theme') {
        document.body.classList = payload.value
      }
    }
  },

  RESET_SETTINGS (state) {
    Object.assign(state, getDefaultSettingsState())
    document.body.classList = state.settings.theme
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
