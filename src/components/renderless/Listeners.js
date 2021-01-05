import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  render: () => null,

  data () {
    return {
      lastScrollTop: window.pageYOffset,
    }
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Settings', ['settings']),

    ...mapFields('App', [
      'app.isPageHidden',
      'app.screenWidth',
      'app.online',
      'app.scrollPaused',
      'app.userScrolledUp',
      'app.pauseStaggering',
      'app.stickyScroll',
    ]),

    ...mapFields('Settings', [
      'settings.debug',
    ]),
  },

  methods: {
    setScreenWidth () {
      this.screenWidth = window.innerWidth
    },

    updateScreenWidth () {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(this.setScreenWidth, 500);
    },

    updateOnlineStatus (e) {
      this.$helpers.debugEnabled() && console.log('online status changed:', e)
      if(e.type === 'offline'){
        this.online = false
      }
      if(e.type === 'online'){
        this.online = true
      }
    },

    getScrollPercent () {
      let h = document.documentElement
      let b = document.body
      let st = 'scrollTop'
      let sh = 'scrollHeight'

      return Math.floor((h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100)
    },

    konamiCodes () {
      let pattern = ['d', 'e', 'b', 'u', 'g']
      let current = 0
      let me = this

      let keyHandler = function (event) {
        if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
          current = 0
          return
        }
        current++

        if (pattern.length === current) {
          current = 0
          me.debug  = (me.debug) ? false : true
        }
      }

      document.addEventListener('keydown', keyHandler, false);
    },
  },

  created () {
    window.addEventListener('resize', this.updateScreenWidth)
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  },

  destroyed () {
    window.removeEventListener('resize', this.updateScreenWidth)
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  },

  watch: {
    stickyScroll: function (newVal) {
      this.scrollPaused = false
      newVal && !this.userScrolledUp && this.$helpers.scrollToBottom()
    },
  },

  mounted () {
    this.konamiCodes()
    
    let start
    let me = this
    this.screenWidth = window.innerWidth
    this.online = navigator && navigator.onLine

    this.lastScrollPct = this.getScrollPercent()

    document.addEventListener('scroll', function () {
      start = window.pageYOffset || document.documentElement.scrollTop
      if (start > me.lastScrollTop && me.getScrollPercent() >= 98){
        // downscroll code
        me.userScrolledUp = false
        me.pauseStaggering = false
        me.scrollingEventTriggered = false
      } else {
        // scrolling up
        if (me.stickyScroll && !me.scrollingEventTriggered && me.getScrollPercent() < 98) {
          me.userScrolledUp = true
          me.pauseStaggering = true
          me.scrollingEventTriggered = true
        }
      }
      // For Mobile or negative scrolling reset to 0
      me.lastScrollTop = start <= 0 ? 0 : start
    }, false)

    document.addEventListener('visibilitychange', () => {
      this.isPageHidden = document.hidden
      this.$helpers.debugEnabled() && console.log('isPageHidden:', this.isPageHidden)
    }, false)

    if (!this.debug) {
      this.debug = window.location.href.indexOf('_debug') > -1 ? true : false
    }

    if (window.location.href.indexOf('_debug=false') > -1) {
      this.debug = false
    }
  }
}