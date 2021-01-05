<template>
  <div :class="'comment-feed' 
    + (settings.showBotComments ? ' show-bot-comments' : '')
    + (settings.hidePostLabels ? ' hide-post-labels' : '')">

    <!-- OLD COMMENTS -->
    <div v-show="oldCommentsShown || (comments.oldCommentsBuffer.length > 0 && !oldCommentsShown)" class="old-comments">
      <div class="older-comments-btn" v-show="comments.oldCommentsBuffer.length > 0">
        <button class="btn btn-primary" @click="startShowingOldComments">show older comments</button>
      </div>

      <Comment :comment="comment" v-for="comment in comments.oldComments" :key="comment.id" />
      
      <div class="old-comments-hr">
        <hr> 
        
        <span class="old-comments-text-bg">
          <span class="old-comments-text">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
            </svg>

            old comments

            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
            </svg>
          </span>
        </span>
      </div>
    </div>
    
    <Comment :comment="comment" v-for="comment in comments.comments" :key="comment.id" />

    <div v-if="comments.comments.length === 0" class="no-comments-block">
      <div class="no-comments-content">
        <div>No comments loaded yet</div>
        <button v-if="!isLoading" @click="isLoading = true" class="btn btn-light load-em-btn">Start Loading</button>
        <div v-else class="loading-countdown">Checking again in <code>{{ stats.secondsToNextLoad }}</code> seconds</div>
      </div>
    </div>

  </div> <!-- end comment feed -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import Comment from '@/components/Comment.vue'

export default {
  components: {
    Comment,
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Settings', ['settings']),
    ...mapState('Comments', ['comments']),
    ...mapState('Stats', ['stats']),

    ...mapFields('App', [
      'app.isLoading',
      'app.displayGod',
    ]),

    ...mapFields('Comments', [
      'comments.oldCommentsShown',
    ]),
  },

  methods: {
    ...mapActions('Comments', ['showOldComments']),

    startShowingOldComments () {
      this.oldCommentsShown = true
      this.showOldComments()
    },
  },
}
</script>

<style lang="scss" scoped>

  .comment-feed {
    margin-top: 30px;
    position: relative;
    margin-bottom: 110px;

    @include w768 {
      margin-bottom: 75px;
    }
  }

  .old-comments {
    .older-comments-btn {
      text-align: center;
      margin-bottom: 25px;
    }
  }

  .old-comments-hr {
    position: relative;

    .old-comments-text-bg {
      position: absolute;
      top: -5px;
      line-height: 1;
      font-size: 10px;
      left: 50%;
      margin-left: -50px;
      width: 100px;
      text-align: center;
      background-color: var(--bg);
    }

    .old-comments-text {
      opacity: 0.3
    }
  }

  .god-container {
    display: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 70px;
    left: 50%;
    z-index: 10;

    @include w768 {
      display: flex;
    }

    .god {
      position: absolute;
      bottom: -20px;
      pointer-events: none;
      filter: drop-shadow(0 0 20px #ffe559);
    }
  }

  .no-comments-block {
    text-align: center;
    position: fixed;
    bottom: 150px;
    left: 0;
    right: 0;
    line-height: 1;
    font-family: $title-font;

    @include w768 {
      bottom: 50%;
      margin-bottom: -45px;
    }

    .load-em-btn,
    .loading-countdown {
      margin-top: 20px;
    }
  }

  .no-comments-content {
    font-size: 13px;
    display: inline-block;
    padding: 20px 15px;
    border-radius: 5px;
    background: var(--bg-light);

    code {
      line-height: 1;
    }
  }

</style>