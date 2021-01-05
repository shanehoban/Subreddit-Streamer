<template>
  <div class="bottom-nav">
    <nav :data-loading="isLoading">
      <div class="left-nav">
        <button @click="isLoading = false" class="btn btn-danger stop-btn">
          Stop <span class="hide-on-mobile">Loading</span>
        </button>
       
       <button @click="isLoading = true" class="btn btn-success start-btn">
          <span class="hide-on-mobile">Load </span> More
        </button>
      </div>

      <div class="center-nav">
        <button @click="showThreadsModal = true" :class="'btn btn-'+ (filterEnabled ? 'primary is-enabled' : 'dark is-disabled') + ' filter-btn'">
          <span class="hide-on-mobile">View</span> Threads
          <span class="on-off-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-on enabled" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-off disabled" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>
            </svg>
          </span>
        </button>
      </div>

      <div class="right-nav">
        <button @click="toggleStickyScroll" :class="'btn btn-'+ (stickyScroll && !scrollPaused && !userScrolledUp ? 'primary is-enabled' : 'dark is-disabled') +' sticky-scroll-btn'">
            <span class="hide-on-mobile">Auto</span> <span>Scroll </span> 
            <span class="on-off-icons">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-on enabled" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-off disabled" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>
              </svg>
            </span>
        </button>
      </div>
    </nav>

    <div class="app-copyright">&copy; {{ currentYear }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  data () {
    return {
      currentYear: (new Date()).getFullYear()
    }
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Settings', ['settings']),

    ...mapFields('Settings', [
      'settings.debug',
      'settings.commentFilter.filterEnabled',
    ]),

    ...mapFields('App', [
      'app.scrollPaused',
      'app.userScrolledUp',
      'app.stickyScroll',
      'app.isLoading',
      'app.pauseStaggering',
      'app.displayTrump',
      'app.displayGod',
      'app.modals.showThreadsModal',
    ]),

  },

  methods: {
    toggleStickyScroll () {
      if (this.userScrolledUp && this.stickyScroll) {
        this.userScrolledUp = false
        this.scrollPaused = false
        this.pauseStaggering = false
        this.$helpers.scrollToBottom()
      } else {
        this.stickyScroll = !this.stickyScroll
      }
    },
  }
}
</script>

<style lang="scss" scoped>

  .bottom-nav {
    background-color: var(--bg-darker);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    z-index: 50;
  }
  
  nav {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    color: inherit;

    &[data-loading="true"] {
      .stop-btn { display: inline-block; }
      .start-btn { display: none; }
    }
    
    .left-nav,
    .center-nav,
    .right-nav {
      position: relative;
      flex-grow: 1;
    }

    .left-nav { text-align: left ;}
    .center-nav { text-align: center ;}
    .right-nav { text-align: right ;}

    .stop-btn { display: none; }
    .start-btn { display: inline-block; }

    .on-off-icons {
      display: none;

      @include w360 {
        display: inline-block;
        margin-left: 3px;
      }
    }

    .sticky-scroll-btn,
    .filter-btn {    
      .enabled,
      .disabled{ 
        display: none;
        position: relative;
        top: -1px;
        transition: all 0.25s ease;
      }

      &.is-disabled .disabled { display: inline-block; }
      &.is-enabled .enabled { display: inline-block; }

      &.is-enabled .enabled { color: #4cc751;  }
      &.is-disabled .disabled { color: #f44336; }
    }

    .high-iq-person {
      display: none;
      position: absolute;
      width: 100px;
      left: -80px;
      bottom: 45px;

      @include w768 {
        display: inline-block;
      }
    }
  }

  .app-copyright {
    position: fixed;
    font-family: $title-font;
    font-size: 10px;
    opacity: 0.5;
    pointer-events: none;
    top: 5px;
    right: 5px;
    text-align: center;
    
    @include w768 {
      top: unset;
      left: unset;
      bottom: 5px;
    }
  }
</style>