import { mapState, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  render: () => null,

  data () {
    return {
      statsInterval: false,
    }
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Config', ['config']),
    ...mapState('Settings', ['settings']),

    ...mapFields('App', [
      'app.apiTimeout'
    ]),

    ...mapFields('Stats', [
      'stats.startStats',
      'stats.resetStats',
      'stats.commentsPerMinute',
      'stats.maxCommentsPerMinute',
      'stats.totalThroughput',
      'stats.timeElapsed',
      'stats.timeSpentLoading',
      'stats.timeToNextLoad',
      'stats.secondsToNextLoad',
    ]),

    ...mapFields('Comments', [
      'comments.commentCount'
    ]),
  },

  watch: {
    startStats: function (newVal) {
      if (newVal) {
        this.startPollingStats()
        this.startStats = false
      }
    },
  },

  methods: {
    ...mapMutations('Stats', ['RESET_STATS']),

    updateStats () {
      // total comments per minute of loading
      this.commentsPerMinute = Math.floor(this.commentCount/(this.timeSpentLoading/60))
      this.maxCommentsPerMinute = Math.floor((60000/this.config.loadTimeout)*this.config.loadLimit)
      this.totalThroughput = Math.floor((this.commentsPerMinute/this.maxCommentsPerMinute)*100)
      this.timeElapsed++

      if (this.app.isLoading) {
        this.timeSpentLoading++
      }

      this.timeToNextLoad = this.timeToNextLoad - 1000
      this.secondsToNextLoad = Number.parseFloat(this.timeToNextLoad / 1000).toFixed(0)
      this.secondsToNextLoad = this.secondsToNextLoad <= 0 ? 0 : this.secondsToNextLoad
      this.apiTimeout = ((this.apiTimeout - 1000) <= 0) ? 0 : this.apiTimeout - 1000
    },

    startPollingStats () {
      if (!this.statsInterval || this.resetStats) {

        clearInterval(this.statsInterval)
        this.statsInterval = setInterval(this.updateStats, 1000)

        if (this.resetStats) {
          this.$helpers.debugEnabled() && console.log('resetting stats')
          this.resetStats = false
          this.RESET_STATS()
        }
      }
    }
  },
}