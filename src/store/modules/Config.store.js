/* Config.store.js */

import { getField, updateField } from 'vuex-map-fields';

const getDefaultConfigState = () => {
  return {   
    config: {
      emailAddress: 'shanehoban@gmail.com',
      loadTimeout: 9856,
      loadLimit: 69,

      // these are phrases that tag the comment as from a bot
      botPhrases: [
        'I am a bot', // auto mod?
        'im a bot', // auto mod?
        '[**CLICK THIS LINK**]', // remind me bot
        'option pricing bot', // ronseal
        'A Submission was Spammed by Vote', // WSB vote bot
        'your post has been removed by vote', // also WSB vote bot
        'Click to Vote', // also WSB vote bot
        'Download via redditsave.com', // SaveVideo bot
        'removal request for savevideo', // SaveVideo bot
        'ɴᴏᴡ ᴘʟᴀʏɪɴɢ:', // alexa
        'to=resavr_bot',
      ],
    },
  }
}

// State object
const state = getDefaultConfigState()

// Getter functions
const getters = {
  getField, // for v-models
}

// Actions
const actions = {}

// Mutations
const mutations = {
  updateField, // for v-models

  RESET_CONFIG (state) {
    Object.assign(state, getDefaultConfigState())
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
