<template>
  <div :class="'comment-box ' + (replyHit ? 'reply-hit' : '')">
    <div class="published-list" v-if="publishedComments.length > 0">
      <div v-for="publishedComment in publishedComments" :key="publishedComment.id" class="published">
        <div class="published-label">you {{ isThread ? 'commented' : 'replied'}} at <span class="published-timestamp">{{ $helpers.getTimestamp(publishedComment.created_utc) }}</span>:</div>
        <div class="published-comment">{{ publishedComment.body }} <a :href="publishedComment.url"></a></div>
      </div>
    </div>

    <div v-if="(publishedComments.length === 0 || commentTimeoutCleared) && auth.access_token" class="comment-area">
      <span v-if="!replyHit" @click="replyClicked" class="reply-link link-primary">{{isThread ? 'add a comment' : 'reply'}}</span>

      <div v-show="replyHit" class="input-group">
        <textarea 
          ref="textarea"
          :class="'form-control' + ((userComment.length > 0) ? ' has-text' : '')" 
          @focus="pauseScrolling(true)"
          @blur="((userComment.length > 0) ? userComment = userComment.trim() : false); pauseScrolling(false);"
          :placeholder="placeholder" 
          rows="1" 
          v-model="userComment" 
          :disabled="app.apiTimeout > 0 || submitting || !auth.access_token" 
          maxlength="1000"></textarea>
        
        <button class="btn comment-btn" @click="submitComment" :disabled="app.apiTimeout > 0 || submitting || !auth.access_token">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply-fill" viewBox="0 0 16 16">
            <path d="M9.079 11.9l4.568-3.281a.719.719 0 0 0 0-1.238L9.079 4.1A.716.716 0 0 0 8 4.719V6c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="!auth.access_token" class="comment-box-overlay">
      <div class="overlay-content">
        <span class="text-muted">to {{isThread ? 'comment' : 'reply'}}, </span>
        <a :href="$helpers.getAuthURL()" class="link link-primary"><b> login with reddit</b></a> 
        <span class="text-muted"> or </span>
        <span class="link link-secondary" @click="hideCommentBoxes = true"><b>hide this</b></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  props: {
    comment: Object,
    isThread: Boolean, // if its a comment box on a thread or not
  },

  data () {
    return {
      replyHit: false,
      submitting: false,
      userComment: '',
      publishedComments: [],
      publishedCommentURL: false,
      client: process.env.VUE_APP_REDDIT_CLIENT_ID,
      reauthenticated: false,

      commentTimeoutCleared: false,

      placeholder: this.isThread ? 'comment on the thread...' : 'reply...',
    }
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Auth', ['auth']),
    ...mapState('Settings', ['settings']),

    ...mapFields('App', [
      'app.scrollPaused',
      'app.userScrolledUp',
      'app.stickyScroll',
      'app.apiTimeout',
    ]),

    ...mapFields('Settings', [
      'settings.hideCommentBoxes',
    ]),
  },

  methods: {
    pauseScrolling (paused) {
      this.scrollPaused = (this.isThread) ? this.scrollPaused : paused
    },

    replyClicked () {
      this.replyHit = true;
      this.$nextTick(function(){
        this.$refs.textarea.focus();
      })
    },

    submitComment () {
      if (this.userComment.length > 0 && this.comment && this.comment.name) {
        this.submitting = true
        this.$helpers.debugEnabled() && console.log('trying to comment:', this.userComment)

        let data = new FormData()
        data.append('api_type', 'json')
        data.append('thing_id', this.comment.name)
        data.append('richtext_json', this.userComment)
        data.append('text', this.userComment)
        
        const config = {
          headers: { 
            'Authorization': 'Bearer '+ this.auth.access_token,
            // 'User-Agent': 'web:' + this.client + ':' + this.app.build + ' (by /u/H_o)', // browsers do not allow this
          }
        }

        this.$axios.post(
          'https://oauth.reddit.com/api/comment',
          data,
          config,
        ).then((response) => {
          if(response.status === 200) {
            this.$helpers.debugEnabled() && console.log('comment published response', response)
            this.$helpers.debugEnabled() && console.log('comment published data', response.data)
            this.reauthenticated = false

            if (response.data && response.data.json && response.data.json.errors[0]) {
              this.$helpers.throwError('comment published error', response.data.json.errors[0][1], true)
              this.$helpers.toast(response.data.json.errors[0][1], 'danger')
              this.submitting = false
            } else {
              // all gucci
              this.userComment = ''
              this.$helpers.toast('Comment published', 'success')
              this.apiTimeout = 5000
              let tempComment = response.data.json.data.things[0].data
              
              this.publishedComments.push(tempComment)

              if (this.isThread) {
                setTimeout(() => {
                  this.commentTimeoutCleared = true
                  this.submitting = false
                }, 5000)
              }
            }
          } else {
            this.$helpers.throwError('comment published something went wrong', response)
            this.submitting = false
          }
        }).catch((error) => {
          // Error 😨
          this.submitting = false

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
                      this.submitComment()
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
            this.$helpers.throwError('Comment published error', error)
          }
        })
      } else {  // end if this.comment is set
        // comment is not set, something seriously wrong
        this.$helpers.throwError('Cant send an empty comment')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  
  .comment-box {
    position: relative;
    font-size: 13px;
    margin-top: 4px;

    &.reply-hit {
      margin-top: 8px;
    }

    .reply-link {
      cursor: pointer;
    }

    textarea:disabled,
    .btn:disabled {
      opacity: 0.4;
    }

    textarea {
      font-family: $title-font;
      padding: 8px;
      box-shadow: none;
      line-height: 1.3;
      max-height: 200px;
      height: auto;
      resize: none;
      transition: min-height 0.25s ease;
      background: var(--bg-light);
      border: 1px solid var(--bg);
      font-size: 13px;

      @include w768 {
        font-size: 14px;
      }
      
      .light-theme & {
        border: 1px solid var(--bg-dark);
      }
    }

    textarea.has-text,
    textarea:focus {
      min-height: 75px;
    }
  }

  .comment-btn {
    color: inherit;
    background: var(--bg-light);
    border: 1px solid var(--bg);
    line-height: 0;
    
    .light-theme & {
      border: 1px solid var(--bg-dark);
    }

    &:hover {
      color: inherit;
      filter: brightness(1.2);
    }
  }

  .published-list {
    margin: 5px 0;

    .published:not(:first-of-type) {
        margin-top: 5px;
    }
  }

  .published {
    padding-left: 10px;

    .published-label {
      font-size: 11px;
      opacity: 0.25;

      .published-timestamp {
        font-size: 10px;
      }
    }

    .published-comment {
      opacity: 0.85;
    }
  }

  .comment-box-overlay {
    font-size: 12px;
  }

</style>