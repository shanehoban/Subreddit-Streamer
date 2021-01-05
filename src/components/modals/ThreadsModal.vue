<template>
  <div class="modal-stuff">    
    <div class="loading-threads" v-if="threadsLoading && threads.threads.length === 0">
      <h5>Loading Threads</h5>
      <hr>

      <div class="loading-threads-spinner">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-repeat loading-icon spin" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
        </svg>
      </div>
    </div>

    <!-- else threads are loaded -->
    <div v-else>
      <div v-if="!error">
        <h3>Filter Comments</h3>

        <p>Click a thread below to start filtering comments from only that thread.</p>
        
        <hr>

        <Thread v-for="thread in threads.threads" :key="thread.id" :thread="thread" />
      </div>

      <!-- else there's an error -->
      <div v-else>
        <div class="error-text">
          <h6>An error occurred somewhere</h6>
          <p>{{errorText}}</p>
        </div>
      </div>
    </div>

    <hr>

    <div class="btn-list modal-menu">
      <span v-if="!filterEnabled && threads.threads.length === 0"></span>

      <span v-show="filterEnabled">
        <button @click="filterEnabled = false" class="btn btn-danger">Remove Filter</button>
      </span>
      <span v-show="threads.threads.length > 0">
        <button @click="loadThreads" class="btn btn-success" :disabled="threadsLoading">Load More</button>
      </span>
      <span v-show="threads.threads.length > 0">
        <button @click="refreshThreads()" class="btn btn-dark" :disabled="threadsLoading">Refresh</button>
      </span>
      <span>
        <button class="btn btn-primary" @click="showThreadsModal = false">Close</button>
      </span>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import endpoints from '@/global/endpoints'
import Thread from '@/components/Thread.vue'

export default {
  components: {
    Thread,
  },

  data () {
    return {
      error: false,
      errorText: '',
    }
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Settings', ['settings']),
    ...mapState('Threads', ['threads']),

    ...mapFields('App', [
      'app.modals.showThreadsModal',
      'app.dailyURLString',
      'app.tomorrowURLString',
    ]),

    ...mapFields('Settings', [
      'settings.debug',
      'settings.disableConsoleLogs',
      'settings.subreddit',
      'settings.theme',
      'settings.commentFilter.filterEnabled',
    ]),

    ...mapFields('Threads', [
      'threads.threadsLoading',
      'threads.threadCount',
      'threads.threadIDs',
      'threads.threadIDCount',
      'threads.lastThreadLoaded',
    ]),
  },

  methods: {
    ...mapMutations('Threads', [
      'ADD_THREAD',
      'ADD_THREAD_ID',
      'RESET_THREADS',
    ]),

    refreshThreads () {
      this.RESET_THREADS()
      this.loadThreads()
    },

    parseThreads (threads) {
      let tempThread

      threads.forEach((thread) => {
        if (thread.kind !== 't3' || !thread.data || !thread.data.title) {
          return
        }

        if (this.threadIDs.indexOf(thread.data.id) === -1) {
          this.ADD_THREAD_ID(thread.data.id)
          this.threadIDCount++ // count unique comments loaded for optimizer

          // defaults
          tempThread = {}
          tempThread.threadClass = ''
          tempThread.threadLabel = ''
          tempThread.name = thread.data.name
          tempThread.permalink = thread.data.permalink || false
          tempThread.permalink += '?ref=subreddit-streamer'
          
          tempThread.title = thread.data.title
          tempThread.id = thread.data.id
          tempThread.author = thread.data.author
          tempThread.author_flair_text = thread.data.author_flair_text
          tempThread.created_utc = thread.data.created_utc
          // my attributes are camelcase
          // placeholder

          if (tempThread.permalink) {
            if (tempThread.permalink.indexOf('daily_discussion_thread_for') !== -1) {
              if (tempThread.permalink.indexOf(this.dailyURLString) !== -1) {
                tempThread.threadClass = ' todays-thread'
                tempThread.threadLabel = 'todays daily thread'
              }
            } else if (tempThread.permalink.indexOf('weekend_discussion_thread_for') !== -1) {
              tempThread.threadClass = ' weekend-thread'
              tempThread.threadLabel = 'weekend thread'
            } else if (tempThread.permalink.indexOf('what_are_your_moves_tomorrow') !== -1) {
              if (tempThread.permalink.indexOf(this.tomorrowURLString) > -1 || tempThread.permalink.indexOf(this.dailyURLString) > -1) {
                // || tomorrows thread today - e.g. in the morning we are still on tomorrows thread
                tempThread.threadClass = ' tomorrows-thread'
                tempThread.threadLabel = 'tomorrows moves thread'
              }
            }
          }
          
          this.lastThreadLoaded = tempThread.name
          this.ADD_THREAD(tempThread) // newest to be used first
          this.threadCount++
        }
      }) // end foreach threads

      this.$nextTick(function(){
        this.threadsLoading = false
      })
    },
    
    getThreadsFromResponse (response) {
      let threads = []
      if (response.data) {
        if (response.data.data && response.data.data.children && response.data.data.children.length > 0) {
          threads = response.data.data.children
        } else if (response.data.length > 1 && response.data[1] && response.data[1].data && response.data[1].data.children) {
          threads = response.data[1].data.children
        }
      }
      return threads
    },

    loadThreads () {
      this.threadsLoading = true

      let endpoint = endpoints.threads(this.subreddit)
          endpoint += 'limit=' + this.threads.threadLoadLimit
          endpoint += (this.lastThreadLoaded) ? ('&after=' + this.lastThreadLoaded) : ''

      this.$helpers.debugEnabled() && console.log('loading threads from: ', endpoint)

      // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
      this.$axios.get(endpoint).then((response) => {
        if(response.status === 200) {
          let threads = this.getThreadsFromResponse(response)
          
          if (threads.length > 0) {
            this.$helpers.debugEnabled() && console.log('threads boomer threads: ', threads)
            this.parseThreads(threads)
          } else {
            this.error = true
            this.errorText = 'No threads found'
            this.threadsLoading = false
          }
        } else {
          this.$helpers.debugEnabled() && console.error('threads boomer: something went wrong...')
          this.threadsLoading = false
        }
      }).catch((error) => {
        // Error 😨
        if (error.response) {
          /*
          * The request was made and the server responded with a
          * status code that falls out of the range of 2xx
          */
          this.$helpers.debugEnabled() && console.log('threads error.response.data:', error.response.data);
          this.$helpers.debugEnabled() && console.log('threads error.response.status:', error.response.status);
          this.$helpers.debugEnabled() && console.log('threads error.response.headers:', error.response.headers);

          this.error = true
          this.errorText = 'Something is not right with the threads data'
          this.threadsLoading = false
        } else if (error.request) {
          /*
          * The request was made but no response was received, `error.request`
          * is an instance of XMLHttpRequest in the browser and an instance
          * of http.ClientRequest in Node.js
          */
          this.$helpers.debugEnabled() && console.log('threads error.request', error.request);
          this.error = true
          this.errorText = 'Server not responding'
          this.threadsLoading = false
        } else {
          // Something happened in setting up the request and triggered an Error
          this.$helpers.debugEnabled() && console.log('threads error.message', error.message)
          this.error = true
          this.errorText = 'Somethings not not wrong with threads data'
          this.threadsLoading = false
        }
      })
    },
  }, // end methods

  watch: {
    showThreadsModal (newVal) {
      if (newVal && !this.threadsLoading && this.threads.threads.length === 0) {
        this.threadsLoading = true
        this.loadThreads()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .modal-stuff {
    @include w768 { min-width: 500px; }
    @include w1024 { min-width: 775px; }
  }

  .loading-threads {
    .loading-threads-spinner {
      text-align: center;
      margin: 20px auto;
      font-size: 20px;
    }
  }

</style>