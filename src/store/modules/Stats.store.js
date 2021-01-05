/* Stats.store.js */

import { getField, updateField } from 'vuex-map-fields';

const getDefaultStatsState = () => {
  return {
    stats: {
      startStats: false, // used to trigger stats polling
      resetStats: false, // used in Stats.js to know if the stats should be reset (like if switching subreddit)

      timeElapsed: 1, // total time here
      timeSpentLoading: 1,
      timeToNextLoad: false,
      secondsToNextLoad: false,
      ajaxCount: 0,
      commentsPerMinute: 0, // total comments per minute
      averageCommentsPerMinute: 0,
      maxCommentsPerMinute: 420, // by default
      averageThroughput: 0, // is a percentage of recents
      totalThroughput: 0, // is a percentage
      recentCommentsPerMinute: [], // array of # comments in past 10 seconds
      recentThroughputs: [], // array of throughput % in past 10 seconds
    },
  }
}

// State object
const state = getDefaultStatsState()

// Getter functions
const getters = {
  getField, // for v-models
}

// Actions
const actions = {}

// Mutations
const mutations = {
  updateField, // for v-models

  ADD_TO_ARRAY (state, payload) {
    if (state.stats[payload.key].length >= 5) {
      state.stats[payload.key].shift()
    }

    state.stats[payload.key].push(payload.value)
  },

  RESET_STATS (state) {
    Object.assign(state, getDefaultStatsState())
  },
}

export default {
  // Make sure all modules in the store are namespaced (so we can access them via eg. User/login)
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
