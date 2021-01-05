/* Config.store.js */

import { getField, updateField } from 'vuex-map-fields';

const getDefaultAuthState = () => {
  return {   
    auth: {
      access_token: false,
      refresh_token: false,
      expires_in: false,
      scope: false,
      token_type: false,
    },
  }
}

// State object
const state = getDefaultAuthState()

// Getter functions
const getters = {
  getField, // for v-models
}

// Actions
const actions = {}

// Mutations
const mutations = {
  updateField, // for v-models

  SET_AUTH (state, payload) {
    Object.assign(state.auth, payload)
  },

  RESET_AUTH (state) {
    Object.assign(state, getDefaultAuthState())
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
