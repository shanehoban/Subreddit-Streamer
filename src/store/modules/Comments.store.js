/* Comments.store.js */

import { getField, updateField } from 'vuex-map-fields';

const getDefaultCommentsState = () => {
  return {
    comments: {
      oldCommentsBuffer: [], // buffer of old comments
      oldComments: [], // the old comments to be shown
      showOlderIncrement: 15, // the increments of old comments to be shown
      oldCommentsShown: false,

      defaultCommentsShown: 100,
      commentIDs: [],
      commentBuffer: [],
      comments: [],
      commentsLoadedCount: 0,
      commentCount: 0,
      commentIDCount: 0,
    }
  }
}

// State object
const state = getDefaultCommentsState()

// Getter functions
const getters = {
  getField, // for v-models
}

// Actions
const actions = {
  showOldComments (context) {
    context.commit('SHOW_OLDER_COMMENTS')
  }
}

// Mutations
const mutations = {
  updateField, // for v-models

  ADD_COMMENT (state, payload) {
    if (state.comments.comments.length >= state.comments.defaultCommentsShown) {
      let comment = state.comments.comments.splice(0, 1)[0]
          comment.isOld = true
      
      state.comments.oldCommentsBuffer.unshift(comment) // adds to the front of the array
      state.comments.comments.push(payload)

      if (state.comments.oldCommentsBuffer.length > 250 && state.comments.oldCommentsBuffer.length % 2 === 0) {
        state.comments.oldCommentsBuffer.splice(state.comments.oldCommentsBuffer.length/2, state.comments.oldCommentsBuffer.length)
      }
    } else {
      state.comments.comments.push(payload)
    }

    state.comments.commentsLoadedCount++
  },

  ADD_COMMENT_ID (state, payload) {
    state.comments.commentIDs.push(payload)
  },

  ADD_TO_BUFFER (state, payload) {
    state.comments.commentBuffer.unshift(payload) // newest to be used first
  },

  SPLICE_BUFFER (state, payload) {
    let tempBuffer = state.comments.commentBuffer.splice(0, payload)
    let me = this
        
    tempBuffer.forEach((comment) => {
      // yes it must be namespaced, dumb
      me.commit('Comments/ADD_COMMENT', comment)
    })
  },

  SHOW_OLDER_COMMENTS (state) {
    if (state.comments.oldCommentsBuffer.length > 0) {
      let bufferLength = state.comments.oldCommentsBuffer.length
      let lengthToShow = (bufferLength > state.comments.showOlderIncrement) ? state.comments.showOlderIncrement : bufferLength
      
      let comments = state.comments.oldCommentsBuffer.splice(0, lengthToShow)

      comments.forEach((comment) => {
        if (state.comments.oldComments.indexOf(comment) === -1) {
          state.comments.oldComments.unshift(comment)
        }
      })
    }
  },

  RESET_COMMENTS (state) {
    Object.assign(state, getDefaultCommentsState())
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
