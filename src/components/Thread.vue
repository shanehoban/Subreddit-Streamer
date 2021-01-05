<template>
  <div :class="'thread-container ' + thread.threadClass">
    <div class="thread-main-content">
      <div class="thread-content" @click="applyFilter">
        <div class="thread-title">
          <span v-if="thread.threadClass !== ''" :class="'color-circle ' + thread.threadClass" :aria-label="thread.threadLabel" data-balloon-pos="up-left"></span>
          {{ thread.title }}
        </div>
        <div class="thread-meta">
          <span class="thread-author">{{ thread.author }}</span>
          <span class="thread-timestamp">{{ $helpers.getTimestamp(thread.created_utc) }}</span>
        </div>
      </div>
      <div class="thread-link">
        <a @click="$event.stopPropagation();" class="btn btn-outline-light" :href="'https://www.reddit.com' + thread.permalink" target="_blank">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link-45deg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
          </svg>
        </a>
      </div>
    </div>

    <CommentBox v-if="!settings.hideCommentBoxes" :comment="thread" :isThread="true" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import CommentBox from '@/components/CommentBox.vue'

export default {
  components: {
    CommentBox,
  },

  props: {
    thread: Object,
  },

  computed: {
    ...mapState('Settings', ['settings']),
    ...mapState('App', ['app']),

    ...mapFields('App', [
      'app.modals.showThreadsModal',
    ]),

    ...mapFields('Settings', [
      'settings.commentFilter.filterEnabled',
      'settings.commentFilter.filterPermalink',
      'settings.commentFilter.filterTitle',
    ]),
  },

  methods: {
    applyFilter (e) {
      e.preventDefault()
      e.stopPropagation()
      this.filterEnabled = true
      this.filterPermalink = this.thread.permalink
      this.filterTitle = this.thread.title
      this.showThreadsModal = false
      this.$helpers.toast('Filter enabled')
    },
  },
}
</script>

<style lang="scss" scoped>

  .thread-container {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 7px 10px;
    margin: 8px 0;
    border-radius: 5px;
    background-color: var(--bg-light);
    transition: background-color 0.25s ease;
  }

  .thread-main-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;

    .thread-content {
      cursor: pointer;
    }
  }

  .thread-title {
    font-family: $title-font;
    padding-right: 20px;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .color-circle {
      flex-shrink: 0;
      margin-right: 5px;
    }
  }

  .thread-meta {
    font-size: 11px;

    .thread-author {
      margin-right: 10px;
      opacity: 0.5;

      .light-theme & {
        opacity: 0.8;
      }
    }

    .thread-timestamp {
      font-size: 10px;
      opacity: 0.25;
    }
  }


  .thread-link .btn {
    font-size: 18px;
  }
</style>