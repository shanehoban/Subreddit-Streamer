<template>
  <transition
    :css="(app.isPageHidden === false && settings.disableAnimations === false) ? true : false"
    enter-active-class="fadeInDown"
    leave-active-class="fadeOutUp">
      <div v-if="filterEnabled" class="filter-banner-container">
        <div class="filter-banner-content">
          <div class="left">
            <span class="banner-meta-text text-muted">Filtering <span class="hide-on-mobile">active for</span>: </span>

            <div class="comment-filter-title">
              {{ filterTitle }}
            </div>
          </div>

          <button class="btn remove-filter-btn" @click="disableFilter" aria-label="remove filter" data-balloon-pos="down">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  computed: {
    ...mapState('App', ['app']),
    ...mapState('Settings', ['settings']),

    ...mapFields('Settings', [
      'settings.commentFilter.filterEnabled',
      'settings.commentFilter.filterPermalink',
      'settings.commentFilter.filterTitle',
    ])
  },

  methods: {
    disableFilter () {
      this.filterEnabled = false
      this.$helpers.toast('Filter disabled')
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-banner-container {
    font-family: $title-font;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: var(--bg-light);
    border-bottom: 1px solid var(--bg-dark);
  }

  .filter-banner-content {
    padding: 10px 0;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .banner-meta-text {
    flex-shrink: 0;
  }

  .comment-filter-title {
    margin-left: 10px;
  }

  .remove-filter-btn,
  .remove-filter-btn:hover {
    margin-left: 10px;
    color: $red;
    display: inline-flex;
    padding: 7px 10px;
  }
</style>