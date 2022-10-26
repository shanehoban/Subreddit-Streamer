<template>
  <div class="app-view">

    <DebugBox v-if="debug" />

    <ModalWrapper :showIf="showSettingsModal" :modalContent="SettingsModal" />
    <ModalWrapper :showIf="showUpdateModal" :modalContent="UpdateModal" />
    <ModalWrapper :showIf="showSubredditModal" :modalContent="SubredditModal" />
    <ModalWrapper :showIf="showStatsModal" :modalContent="StatsModal" />
    <ModalWrapper :showIf="showThreadsModal" :modalContent="ThreadsModal" />

    <LoadingOverlay v-show="initialLoading" />

    <div v-show="!initialLoading" class="main-app">
      
      <div class="app-wrapper" v-if="!error">
        <router-view></router-view>
      </div>

      <div class="nav-container" v-if="!error">
        <FloatyNav />
        <BottomNav />
      </div>

      <div class="error-text" v-else>
        <h2 v-if="!isPrivate">Oopsie daisy</h2>
        <h2 v-else>
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-lock2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"/>
            <path fill-rule="evenodd" d="M8 5a1 1 0 0 0-1 1v1h2V6a1 1 0 0 0-1-1zm2 2.076V6a2 2 0 1 0-4 0v1.076c-.54.166-1 .597-1 1.224v2.4c0 .816.781 1.3 1.5 1.3h3c.719 0 1.5-.484 1.5-1.3V8.3c0-.627-.46-1.058-1-1.224z"/>
          </svg>
        </h2>

        <p>Your subreddit is set to:</p>
        <p class="fs-5">
          <code>
            <a :href="'https://www.reddit.com/r/' + subreddit +'?ref=subreddit-streamer'" target="_blank">
              {{subreddit}}
            </a>
          </code>
        </p>
        <p>{{errorText}}</p>

        <div v-if="subreddit !== 'askreddit' && !isPrivate">
          <p class="text-muted">If the subreddit doesn't exist, or reddits servers are on fire, this could also be the problem.</p>
        </div>

        <p>
          <button class="btn btn-success" @click="resetSubreddit">Reset Subreddit</button>
        </p>
        <small>it resets back to 
          <code>
            <a :href="'https://www.reddit.com/r/' + defaultSubreddit +'?ref=subreddit-streamer'" target="_blank">{{ defaultSubreddit }}</a>
          </code>
        </small>
      </div>
    </div> <!-- end main app -->

    <Renderless />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import endpoints from '@/global/endpoints'

import DebugBox from '@/components/DebugBox.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ModalWrapper from '@/components/modals/ModalWrapper.vue'
import SettingsModal from '@/components/modals/SettingsModal.vue'
import UpdateModal from '@/components/modals/UpdateModal.vue'
import SubredditModal from '@/components/modals/SubredditModal.vue'
import StatsModal from '@/components/modals/StatsModal.vue'
import ThreadsModal from '@/components/modals/ThreadsModal.vue'
import FloatyNav from '@/components/FloatyNav.vue'
import BottomNav from '@/components/BottomNav.vue'
import Renderless from '@/components/renderless/Renderless'

// const marked = require("marked")

export default {
  components: {
    DebugBox,
    LoadingOverlay,
    ModalWrapper,
    FloatyNav,
    BottomNav,
    Renderless,
  },
  data() {
    return {
      SettingsModal,
      UpdateModal,
      SubredditModal,
      StatsModal,
      ThreadsModal,

      staggeringStarted: false,
      stopStaggering: false,
      commentInterval: false,
      timerInterval: false,
      updateRequired: false,

      resizeTimer: null,
      error: false,
      errorText: '',
      tempHTML: document.createElement('div'),
    }
  },

  computed: {
    ...mapState('Settings', ['settings']),
    ...mapState('Config', ['config']),
    ...mapState('Stats', ['stats']),
    ...mapState('Comments', ['comments']),

    ...mapFields('App', [
      'app.online',
      'app.serversResponding',
      'app.isLoading',
      'app.initialLoading',
      'app.isPrivate',
      'app.optimizeCount',
      'app.version',
      'app.commentsCleared',
      'app.pauseStaggering',
      
      'app.today',
      'app.tomorrow',
      'app.dailyURLString',
      'app.tomorrowURLString',

      'app.modals.showSettingsModal',
      'app.modals.showUpdateModal',
      'app.modals.showSubredditModal',
      'app.modals.showStatsModal',
      'app.modals.showThreadsModal',
    ]),

    ...mapFields('Config', [
      'config.loadTimeout',
      'config.loadLimit',
    ]),

    ...mapFields('Settings', [
      'settings.debug',
      'settings.disableConsoleLogs',
      'settings.defaultSubreddit',
      'settings.subreddit',
      'settings.theme',
    ]),
  
    ...mapFields('Stats', [
      'stats.startStats',
      'stats.resetStats',
      'stats.ajaxCount',
      'stats.timeToNextLoad',
    ]),

    ...mapFields('Comments', [
      'comments.commentCount',
      'comments.commentIDs',
      'comments.commentIDCount',
      'comments.commentBuffer',
    ]),
  },

  methods: {
    ...mapMutations('Settings', ['UPDATE_SETTING']),
    
    ...mapMutations('Comments', [
      'ADD_COMMENT',
      'ADD_COMMENT_ID',
      'ADD_TO_BUFFER',
      'SPLICE_BUFFER',
      'RESET_COMMENTS'
    ]),

    resetSubreddit () {
      this.subreddit = this.defaultSubreddit
    },

    getCommentsFromResponse (response) {
      let comments = []
      if (response.data) {
        if (response.data.data && response.data.data.children && response.data.data.children.length > 0) {
          comments = response.data.data.children
        } else if (response.data.length > 1 && response.data[1] && response.data[1].data && response.data[1].data.children) {
          comments = response.data[1].data.children
        }
      }
      return comments
    },

    parseComments (comments) {
      let tempComment

      if (comments && comments.length > 0) {
        comments.sort((a, b) => {
          parseFloat(a.data.created_utc) - parseFloat(b.data.created_utc)
        })
      }

      comments.forEach((comment) => {
        if (comment.kind !== 't1' || !comment.data || !comment.data.body) {
          return
        }

        if (this.commentIDs.indexOf(comment.data.id) === -1) {
          this.ADD_COMMENT_ID(comment.data.id)
          this.commentIDCount++ // count unique comments loaded for optimizer

          // defaults
          tempComment = {}
          tempComment.isOld = false
          tempComment.isABot = false
          tempComment.threadClass = ''
          tempComment.threadLabel = ''
          tempComment.permalink = comment.data.permalink || false
          tempComment.permalink += '?ref=subreddit-streamer&context=1000'
          tempComment.link_permalink = comment.data.link_permalink
          tempComment.link_permalink += '?ref=subreddit-streamer'

          // Filter comments if filter applied
          if (this.settings.commentFilter.filterEnabled) {
            if (tempComment.link_permalink.indexOf(this.settings.commentFilter.filterPermalink) === -1) {
              return
            }
          }
          
          // this.tempHTML.innerHTML = marked(comment.data.body)
          // tempComment.body = this.tempHTML.innerText

          this.tempHTML = new DOMParser().parseFromString(comment.data.body_html, 'text/html')
          tempComment.html = this.tempHTML.documentElement.textContent

          tempComment.body = comment.data.body
          tempComment.id = comment.data.id
          tempComment.name = comment.data.name
          tempComment.parent_id = comment.data.parent_id
          tempComment.author = comment.data.author
          tempComment.author_flair_text = comment.data.author_flair_text
          tempComment.created_utc = comment.data.created_utc
          tempComment.link_title = comment.data.link_title
          // my attributes are camelcase
          tempComment.authorURL = 'https://www.reddit.com/u/' + tempComment.author + '?ref=subreddit-streamer'
          tempComment.hasParent = (comment.data.parent_id && comment.data.parent_id.indexOf('t1_') !== -1) ? true : false

          this.config.botPhrases.forEach((phrase) => {
            if (tempComment.body.indexOf(phrase) !== -1) {
              tempComment.isABot = true
            }
          })

          if (tempComment.permalink) {
            if (tempComment.permalink.indexOf('daily_discussion_thread_for') !== -1) {
              if (tempComment.permalink.indexOf(this.dailyURLString) !== -1) {
                tempComment.threadClass = ' todays-thread'
                tempComment.threadLabel = 'todays daily thread'
              }
            } else if (tempComment.permalink.indexOf('weekend_discussion_thread_for') !== -1) {
              tempComment.threadClass = ' weekend-thread'
              tempComment.threadLabel = 'weekend thread'
            } else if (tempComment.permalink.indexOf('what_are_your_moves_tomorrow') !== -1) {
              if (tempComment.permalink.indexOf(this.tomorrowURLString) > -1 || tempComment.permalink.indexOf(this.dailyURLString) > -1) {
                tempComment.threadClass = ' tomorrows-thread'
                tempComment.threadLabel = 'tomorrows moves thread'
              }
            }
          }

          this.ADD_TO_BUFFER(tempComment) // newest to be used first
          this.commentCount++
        }
      })

      if (!this.staggeringStarted) {
        this.staggeringStarted = true
        this.staggerComments()
        this.staggerInterval = setInterval(this.staggerComments, 500)
        this.initialLoading = false
      }
      // triggers optimization of polling limits
      this.optimizeCount++
    },

    loadComments () {
      if (this.isLoading && !this.error) {
        let endpoint = endpoints.subreddit(this.subreddit)
        
        // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
        this.$axios.get(endpoint + 'sort=new&limit=' + this.loadLimit).then((response) => {
          this.ajaxCount++

          if(response.status === 200) {
            this.serversResponding = true
            let comments = this.getCommentsFromResponse(response)
            
            if (comments.length > 0) {
              this.$helpers.debugEnabled() && console.log('ok boomer, comments: ', comments)
              this.parseComments(comments)
            } else {
              this.initialLoading = false
              this.error = true
              this.errorText = 'no comments found'
            }
          } else {
            this.$helpers.debugEnabled() && console.error('ok boomer: Something went wrong?')
          }
        }).catch((error) => {
          // Error 😨
          if (error.response) {
            /*
            * The request was made and the server responded with a
            * status code that falls out of the range of 2xx
            */
            this.$helpers.debugEnabled() && console.log('app error.response.data:', error.response.data);
            this.$helpers.debugEnabled() && console.log('app error.response.status:', error.response.status);
            this.$helpers.debugEnabled() && console.log('app error.response.headers:', error.response.headers);

            if (error.response.status === 500) {
              this.serversResponding = false
            } else if (error.response.status === 404) {
              this.error = true
              this.errorText = 'subreddit not found (404)'
            } else if (error.response.data) {
              this.$helpers.debugEnabled() && console.log('app error data: ', error.response.data)

              if (error.response.data.reason === 'private') {
                this.error = true
                this.isPrivate = true
                this.errorText = 'the sub is private yo.'
              }
            } else {
              this.error = true
              this.errorText = 'something aint right with the comment data'
            }
          } else if (error.request) {
            /*
            * The request was made but no response was received, `error.request`
            * is an instance of XMLHttpRequest in the browser and an instance
            * of http.ClientRequest in Node.js
            */
            this.$helpers.debugEnabled() && console.log('app error.request', error.request);

            if (error.request.readyState === 4) { // 4 = done
              // could be cors issue
              this.$helpers.debugEnabled() && console.log('app error.message', error.message)
              this.error = true
              this.errorText = 'Somethings not right'
            } else if (this.online) {
              // you are online, but servers are not responding, dont set an error - also dont set an error if offline
              this.serversResponding = false
            }
          } else {
              // Something happened in setting up the request and triggered an Error
              this.$helpers.debugEnabled() && console.log('app error.message', error.message)
              this.error = true
              this.errorText = 'Somethings not not wrong'
          }
          
          if (this.serversResponding) {
            this.initialLoading = false
            this.stopLoading()
          }
        })
      } else {
        this.$helpers.debugEnabled() && console.log('timer running but isLoading is set to false:', this.isLoading)

        if (this.error && this.isLoading) {
          this.stopLoading()
          this.$helpers.debugEnabled() && console.log('error has been set, stopping loading now')
        }
      }
    },

    stopLoading () {
      this.$helpers.debugEnabled() && console.log('stopping loading')
      this.stopStaggering = true
      this.staggeringStarted = false
      this.isLoading = false
    },

    startLoading (resetStats = false) {
      this.$helpers.debugEnabled() && console.log('starting loading')
      this.error = false
      this.stopStaggering = false
      this.pauseStaggering = false

      if (!this.isLoading) {
        this.isLoading = true

        if (!this.commentInterval) {
          this.loadComments()
          this.timeToNextLoad = this.loadTimeout // initial
          
          let me = this
          clearInterval(this.commentInterval)

          this.commentInterval = setInterval(() => {
            this.timeToNextLoad = this.loadTimeout
            me.loadComments()
          }, this.loadTimeout)
        }
      }

      this.resetStats = resetStats // will be picked up in Stats.js
      this.startStats = true // triggers Stats.js
    },

    getRandomNumber (max) {
      return Math.floor(Math.random() * max) + 1  
    },

    getStaggerLength (length) {
      let staggerLength = 1

      staggerLength = (length > 5) ? this.getRandomNumber(2) : staggerLength
      staggerLength = (length > 10) ? this.getRandomNumber(3) : staggerLength
      staggerLength = (length > 20) ? this.getRandomNumber(4) : staggerLength
      staggerLength = (length > 20) ? this.getRandomNumber(5) : staggerLength
      staggerLength = (length > 30) ? this.getRandomNumber(6) : staggerLength

      return staggerLength
    },

    staggerComments() {
      if (this.stopStaggering) {
        clearInterval(this.staggerInterval)
        this.stopStaggering = false
        this.staggeringStarted = false
        return
      }

      if (!this.pauseStaggering && this.commentBuffer.length > 0) {
        let length = this.initialLoading ? this.commentBuffer.length : this.getStaggerLength(this.commentBuffer.length)
        this.SPLICE_BUFFER(length)
      }
    },
  },

  watch: {
    subreddit () {
      this.stopLoading()
      this.initialLoading = true
      this.RESET_COMMENTS()
      this.startLoading(true) // true = reset stats
    },

    isLoading (newVal) {
      if (newVal) {
        this.startLoading()
      } else {
        this.stopLoading()
      }
    },

    commentsCleared (newVal) {
      if (newVal) {
        this.$helpers.debugEnabled() && console.log('comments cleared')
        this.stopLoading()
        this.commentsCleared = false
      }
    },
  },

  mounted() {
    // apply the current theme
    document.body.classList = this.theme

    let urlError = this.$route.query.error || false
    if (urlError) {
      this.$helpers.toast('An error occurred', 'danger')
    }
    let urlSuccess = this.$route.query.success || false
    if (urlSuccess) {
      this.$helpers.toast((urlSuccess === 'done') ? 'You are now logged in' : 'Success', 'success')
    }

    if (urlError || urlSuccess) {
      let query = Object.assign({}, this.$route.query);
      delete query.error;
      delete query.success;
      this.$router.replace({ query });
    }

    this.today = new Date()
    this.dailyURLString = '' + this.today.getDate() + '_' + this.today.getFullYear()
    this.tomorrow = new Date()
    this.tomorrow.setDate(this.today.getDate() + 1)
    this.tomorrowURLString = '' + this.tomorrow.getDate() + '_' + this.tomorrow.getFullYear()
    
    this.startLoading()

    if (this.version !== this.settings.version) {
      this.stopLoading()
      this.showUpdateModal = true
    }
  },
}
</script>

<style lang="scss" scoped>

  .experimental-features-on {
    position: fixed !important;
    cursor: default !important;
    bottom: 5px;
    left: 5px;
    z-index: 100;
    font-size: 10px;
    background: var(--bg-darkest);
    display: inline-flex;
    padding: 5px;
    border-radius: 5px;
    opacity: 0.75;

    @include w768 {
      padding: 10px;
      font-size: 20px;
    }
  }

  .app-view {
    position: relative;
    margin: 0 auto;
    margin-top: 35px;
  }

  .error-text {
    text-align: center;
    max-width: 85%;
    width: 450px;
    margin: 0 auto;
  }
</style>