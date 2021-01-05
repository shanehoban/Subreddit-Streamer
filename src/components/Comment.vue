<template>
  <div :class="'comment-container ' 
    + (comment.isABot ? ' bot-comment' : '') 
    + (!settings.disableAnimations && !app.isPageHidden ? ' fadeInUp' : '') 
    + (settings.showPostTitles ? ' show-post-title' : '')"
    ref="commentContainer" 
    :aria-label="comment.isABot ? 'this comment was made by a bot?' : false" 
    :data-balloon-pos="comment.isABot ? 'up' : false"
    :data-isabot="comment.isABot"
    @click="botClicked">

    <div v-if="settings.showPostTitles" class="link-title">
      <a :href="comment.link_permalink" target="_blank">
        {{ comment.link_title }}
      </a>
    </div>

    <span class="comment-main">          
      <span class="comment-meta">

        <span v-show="auth.access_token && !settings.hideUpvoteBtns && !comment.isABot" class="vote-icons">
          <button v-show="!voted" class="btn unvoted" @click="upVote" :disabled="app.apiTimeout > 0 || voting || !auth.access_token" aria-label="updoot" data-balloon-pos="up-left" >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M3.204 11L8 5.519 12.796 11H3.204zm-.753-.659l4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z"/>
            </svg>
          </button>


          <button v-show="voted" class="btn voted fadeIn" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
              <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
            </svg>
          </button>
        </span>

        <span v-if="settings.showUsernames" class="comment-username">
          <span v-if="settings.showUsernames" class="author"><a :href="comment.authorURL" target="_blank">{{comment.author}}</a></span> 
          <span v-if="comment.author_flair_text" class="author-flair">{{comment.author_flair_text}}</span>
        </span> 

        <span v-if="comment.hasParent && !settings.hideReplyIcons" class="comment-parent-icon" aria-label="this is a reply to another comment" data-balloon-pos="up-left">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-reply-fill reply-icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.079 11.9l4.568-3.281a.719.719 0 0 0 0-1.238L9.079 4.1A.716.716 0 0 0 8 4.719V6c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/>
          </svg>
        </span>

        <span v-if="settings.showTimestamps" class="comment-timestamp">{{ $helpers.getTimestamp(comment.created_utc) }}</span> 
      </span>

      <a :class="('comment ' + comment.threadClass)" 
        :href="'https://www.reddit.com' + comment.permalink" 
        :aria-label="comment.link_title"
        target="_blank">
          {{ comment.body }}
      </a>
        
      <span v-if="comment.threadClass !== ''" :class="'color-circle floating ' + comment.threadClass" :aria-label="comment.threadLabel" data-balloon-pos="up-right"></span>

    </span> <!-- end comment-main -->

    <CommentBox v-if="!settings.hideCommentBoxes" :comment="comment" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CommentBox from '@/components/CommentBox.vue'

export default {
  components: {
    CommentBox,
  },

  props: {
    comment: Object,
  },

  data () {
    return {
      voted: false,
      voting: false,
      reauthenticated: false,
    }
  },

  computed: {
    ...mapState('Settings', ['settings']),
    ...mapState('App', ['app']),
    ...mapState('Auth', ['auth']),
  },

  methods: {
    upVote () {
      if (!this.voted) {
        this.voting = true
        this.$helpers.debugEnabled() && console.log('trying to vote:', this.comment)

        let data = new FormData()
        data.append('id', this.comment.name)
        data.append('dir', 1)
        
        const config = {
          headers: { 
            'Authorization': 'Bearer '+ this.auth.access_token,
            // 'User-Agent': 'web:' + this.client + ':' + this.app.build + ' (by /u/H_o)', // browsers do not allow this
          }
        }

        this.$axios.post(
          'https://oauth.reddit.com/api/vote',
          data,
          config,
        ).then((response) => {
          if(response.status === 200) {
            this.$helpers.debugEnabled() && console.log('vote response', response)
            this.reauthenticated = false

            if (response.data && response.data.json && response.data.json.errors[0]) {
              this.$helpers.throwError('vote error', response.data.json.errors[0][1], true)
              this.$helpers.toast(response.data.json.errors[0][1], 'danger')
              this.voting = false
            } else {
              // all gucci
              this.$helpers.toast('Upvoted', 'success')
              this.voted = true
              this.apiTimeout = 5000
            }
          } else {
            this.$helpers.throwError('Voting Error', response)
            this.voting = false
          }
        }).catch((error) => {
          // Error 😨
          this.voting = false

          if (error.response && error.response.status) {
            switch (error.response.status) {
              case 401: // Fallthrough
              case 403:
                if (!this.reauthenticated) {
                this.reauthenticated = true // only try to reauth once

                this.$helpers.toast('Logging in again', 'primary')
                
                this.$api.getAccessToken().then((response) => {
                  this.$helpers.debugEnabled() && console.log('get access response', response)
                    if (response.success) {
                      this.upVote()
                    } else {
                      this.$helpers.toast('Cant authorize you', 'danger')
                    }
                  })
                }
              break; // 401
              default :
                this.$helpers.toast('Something else went wrong', 'danger')
              break;
            }
          } else {
            this.$helpers.throwError('Vote response error', error)
          }
        })
      } else {  // end if this.comment is set
        // comment is not set, something seriously wrong
        this.$helpers.throwError('Already voted')
      }
    },
  
    botClicked (e) {
      if(e.currentTarget.hasAttribute('data-isabot')) {
        e.currentTarget.removeAttribute('data-isabot')
        e.preventDefault()
      }
    },

    scrollAfterMount () {
      if (!this.comment.isOld) {
        this.app.stickyScroll && !this.app.userScrolledUp && !this.app.scrollPaused && this.$helpers.scrollToBottom()
      }
    }
  },

  mounted () {
    this.$refs.commentContainer.addEventListener('animationend', (e) => {
      e.currentTarget.classList.remove('fadeInUp')
      this.scrollAfterMount()
    })

    if (!this.comment.isOld) {
      this.scrollAfterMount()
    }
  },
}
</script>

<style lang="scss">

  .comment-container {
    max-height: 3000px; // chrome text issue
    position: relative;
    margin: 8px 0;
    border-radius: 5px;
    padding: 10px;
    background-color: var(--bg-light);
    transition: background-color 0.25s ease;

    &.bot-comment {
      display: none;
      
      .show-bot-comments & { display: block; }
      .comment-box { display: none; }
    }

    &[data-isabot="true"] {
      max-height: 70px;
      overflow: hidden;
      position: relative;

      & * {
        opacity: 0.5;
      }
      
      .comment {
        font-size: 12px;
      }

      .light-theme & {
        opacity: 0.5;
      }
    }

    .comment-parent-icon {
      font-size: 9px;
      margin-right: 4px;
      color: var(--text-jet);
      bottom: 2px;
    }

    .hide-post-labels & {
      .color-circle.floating {
        display: none;
      }
    }

    a:hover {
      color: inherit;
    }
  } // end comment-container

  .link-title {
    font-size: 13px;
    opacity: 0.5;
    transition: opacity 0.25s ease;

    &:hover {
      opacity: 0.75;
    }

    .light-theme & {
      opacity: 0.75;

      &:hover {
        opacity: 0.95;
      }
    }

    a {
      color: inherit;
    }
  }

  a.comment {
    max-height: 3000px; // chrome text issue
    font-size: 15px;
    color: inherit;
    padding-right: 5px;
    text-decoration: none;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;

    .show-post-title & {
      margin-top: 4px;
    }

    p {
      margin-bottom: 8px;
    }

    p:last-of-type {
      margin-bottom: 0;
    }
  } // end .comment

  .comment-main {
    flex-grow: 1;
  }

  .comment-meta {
    font-size: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;

    a {
      color: inherit;
    }

    .vote-icons {
      margin-right: 3px;
      
      .btn {
        padding: 0;
        color: inherit;
        display: inline-flex;
        font-size: 17px;
        opacity: 0.5;
        transition: opacity 0.25s ease;
        box-shadow: none;
        position: relative;
        bottom: 1px;

        &:hover {
          opacity: 1;
        }

        &.voted,
        &.voted:disabled {
          opacity: 1;
          color: $orange;
        }
      }
    }

    .author,
    .comment-timestamp {
      opacity: 0.6;
    }

    .author {
      margin-right: 5px;
      transition: opacity 0.25s ease;

      &:hover {
        opacity: 1;
      }
    }

    .author-flair {
      font-size: 11px;
      border-radius: 4px;
      margin-right: 5px;
      color: #b388ff;
      opacity: 0.75;
    }

    .comment-timestamp {
      font-size: 9px;
    }
  }

</style>