<template>
  <div class="modal-stuff">
    <div class="app-details" @click="developersDevelopers">
      <span class="app-build">build: {{ app.build }}</span> 
      <span class="app-version">{{ settings.version }}</span>
    </div>

    <h3>Info</h3>
    <p>
      This webapp polls all of <code>{{ settings.subreddit }}</code> for <code>{{ loadLimit }}</code> comments every <code>{{ loadTimeout/1000 }}</code> seconds with a peak throughput of <code>{{ stats.maxCommentsPerMinute }}</code> comments per minute.
    </p>
  
    <div class="other-settings">
      <h6>Settings</h6>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="showBotComments" v-model="showBotComments">
        <label class="form-check-label" for="showBotComments">Show bot comments</label>
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="showUsernames" v-model="showUsernames">
        <label class="form-check-label" for="showUsernames">Show usernames &amp; flair</label>
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="showTimestamps" v-model="showTimestamps">
        <label class="form-check-label" for="showTimestamps">Show timestamps</label>
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="hideReplyIcons" v-model="hideReplyIcons">
        <label class="form-check-label" for="hideReplyIcons">
          Hide reply icons
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-reply-fill reply-icon small-reply-icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.079 11.9l4.568-3.281a.719.719 0 0 0 0-1.238L9.079 4.1A.716.716 0 0 0 8 4.719V6c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/>
          </svg>
        </label>
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="showPostTitles" v-model="showPostTitles">
        <label class="form-check-label" for="showPostTitles">Show post titles</label>
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="hideCommentBoxes" v-model="hideCommentBoxes">
        <label class="form-check-label" for="hideCommentBoxes">Hide comment boxes/login text</label>
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="hideUpvoteBtns" v-model="hideUpvoteBtns">
        <label class="form-check-label" for="hideUpvoteBtns">Hide upvote buttons (if logged in)</label>
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="disableAnimations" v-model="disableAnimations">
        <label class="form-check-label" for="disableAnimations">Disable animations</label>
      </div>
    </div>

    <p>
      <small class="text-muted">
        You have loaded approx. <code>{{ stats.commentsPerMinute }}</code> comments per minute, and have been loading comments for <code>{{ stats.timeSpentLoading }}</code> seconds. loading more comments in <code>{{ stats.secondsToNextLoad }}</code> seconds.
      </small>
    </p>

    <hr>

    <div class="btn-list modal-menu">
      <span>
        <a class="btn btn-dark" :href="'mailto:' + config.emailAddress" target="_blank" :aria-label="config.emailAddress" data-balloon-pos="up"> Contact </a>
        <button class="reset-settings-btn btn btn-danger" @click="resetSettings">Reset Settings</button> 
      </span>
      <span>
        <button v-if="debug" @click="resetAllStates" class="btn btn-outline-info">Reset Vuex</button>
        <button v-if="debug" @click="toggleDebug" class="btn btn-outline-info">Debug Off</button>
        <button @click="showSettingsModal = false" class="btn btn-primary">Close</button>
      </span>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapState, mapMutations } from 'vuex'

export default {  
  data () {
    return {
      mobileTimeout: false,
      current: 0,
    }
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Settings', ['settings']),
    ...mapState('Config', ['config']),
    ...mapState('Stats', ['stats']),

    ...mapFields('App', [
      'app.modals.showSettingsModal',
    ]),

    ...mapFields('Config', [
      'config.loadTimeout',
      'config.loadLimit',
    ]),

    ...mapFields('Settings', [
      'settings.debug',
      'settings.showBotComments',
      'settings.showUsernames',
      'settings.showTimestamps',
      'settings.disableAnimations',
      'settings.showPostTitles',

      'settings.hideCommentBoxes',
      'settings.hideUpvoteBtns',

      'settings.hideReplyIcons',
      'settings.disableEasterEggs',
      'settings.hidePostLabels',
    ]),
  },

  methods: {
    ...mapMutations('App', ['RESET_APP']),
    ...mapMutations('Auth', ['RESET_AUTH']),
    ...mapMutations('Comments', ['RESET_COMMENTS']),
    ...mapMutations('Config', ['RESET_CONFIG']),
    ...mapMutations('Settings', ['RESET_SETTINGS']),
    ...mapMutations('Stats', ['RESET_STATS']),
    ...mapMutations('Threads', ['RESET_THREADS']),

    resetSettings () {
      this.showSettingsModal = false
      this.RESET_SETTINGS()
      this.$helpers.toast('Settings have been reset', 'success')
    },

    resetAllStates () {
      this.RESET_APP()
      this.RESET_AUTH()
      this.RESET_COMMENTS()
      this.RESET_CONFIG()
      this.RESET_SETTINGS()
      this.RESET_STATS()
      this.RESET_THREADS()
      location.reload()
    },

    toggleDebug () {
      this.debug = !this.debug
      this.$helpers.toast('Debug ' + ((this.debug) ? 'on' : 'off'))
    },

    debugClickChecker () {
      clearTimeout(this.mobileTimeout)
      this.current = 0
      this.mobileTimeout = false
    },

    developersDevelopers () {
      this.current++
      
      if (this.current > 4) {
        this.current = 0
        this.toggleDebug()
      }

      if (!this.mobileTimeout) {
        this.mobileTimeout = setTimeout(this.debugClickChecker, 2500)
      }
    }
  },
}
</script>

<style lang="scss" scoped>


  .app-details {
    font-family: $code-font;
    font-size: 12px;
    opacity: 0.3;
    text-align: center;
    -webkit-user-select: none;  
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: absolute;
    right: 5px;
    top: 5px;
    padding: 0 0 5px 5px;
    cursor: pointer;

    .light-theme & {
      opacity: 0.65;
    }

    .app-build {
      margin-right: 5px;
    }
  }

  .other-settings {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    background: var(--bg-light);
    border-radius: 5px;
    margin-bottom: 5px;

    @include w768 {
      padding: 15px;
    }

    .form-group {
      flex-basis: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;

      @include w768 {
        flex-basis: 50%;
      }

      input {
        margin-right: 7px;
      }

      span {
        flex-basis: 100%;
      }
    }

    h6 {
      margin-bottom: 10px;
      flex-basis: 100%;
    }

    .small-reply-icon {
      font-size: 10px;
      line-height: 1;
      vertical-align: middle;
      opacity: 0.5;
      margin-left: 2px;
    }

    .form-group:last-of-type {
      margin-bottom: 0;
    }

    .setting-info {
      flex-basis: 100%;
      display: inline-block;
      padding-right: 5px;
      margin-top: 5px;
    }
  }

</style>