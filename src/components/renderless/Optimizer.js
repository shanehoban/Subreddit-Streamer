import { mapState, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  render: () => null,

  data () {
    return {
      intervalCount: 0,
      tempCommentsPerMin: 0,
      tempThroughput: 0,
      prevCommentIDCount: 0,
      commentsSinceLastInterval: 0,
    }
  },

  computed: {
    ...mapState('Settings', ['settings']),

    ...mapFields('App', [
      'app.optimizeCount',
    ]),

    ...mapFields('Stats', [
      'stats.timeSpentLoading',
      'stats.commentsPerMinute', //total
      'stats.totalThroughput',
      'stats.recentCommentsPerMinute', // array
      'stats.averageCommentsPerMinute', // average of recents
      'stats.maxCommentsPerMinute',
      'stats.recentThroughputs', // array
      'stats.averageThroughput', // average of recents
    ]),

    ...mapFields('Config', [
      'config.loadTimeout',
      'config.loadLimit',
    ]),

    ...mapFields('Comments', [
      'comments.commentIDCount',
    ]),
  },

  methods: {
    ...mapMutations('Stats', ['ADD_TO_ARRAY']),

    getAverageOfArray (array) {
      return Math.floor((array.reduce((a, b) => a + b, 0)/array.length)) || 0
    },

    isNumberBetween (number, low, high) {
      return (number >= low && number <= high)
    },
    
    optimize () {
      this.intervalCount++
      // # comments since last tick of this closure
      this.commentsSinceLastInterval = this.commentIDCount - this.prevCommentIDCount
      this.prevCommentIDCount = this.commentIDCount
      
      this.tempCommentsPerMin = Math.floor((60/(this.loadTimeout/1000))*this.commentsSinceLastInterval)
      this.tempThroughput = Math.floor((this.tempCommentsPerMin/this.maxCommentsPerMinute)*100)

      this.ADD_TO_ARRAY({
        key: 'recentCommentsPerMinute',
        value: this.tempCommentsPerMin
      })

      this.ADD_TO_ARRAY({
        key: 'recentThroughputs',
        value: this.tempThroughput
      })

      this.averageCommentsPerMinute = this.getAverageOfArray(this.recentCommentsPerMinute)
      this.averageThroughput = this.getAverageOfArray(this.recentThroughputs)

      if (this.averageThroughput < 5) {
        this.loadLimit -= 5
      } else if (this.averageThroughput < 10) {
        this.loadLimit -= 3
      } else if (this.averageThroughput < 50) {
        this.loadLimit -= 2
      } else if (this.averageThroughput > 80) {
        this.loadLimit += 10
      } else if (this.averageThroughput > 70) {
        this.loadLimit += 5
      } else if (this.averageThroughput > 60) {
        this.loadLimit += 3
      } else if (this.averageThroughput > 50) {
        this.loadLimit += 2
      }

      this.loadLimit = (this.loadLimit < 5) ? 5 : this.loadLimit
      this.loadLimit = (this.loadLimit > 69) ? 69 : this.loadLimit

      this.$helpers.debugEnabled() && console.log('optimizer: comments in past ' + (this.loadTimeout/1000) + ' seconds:', this.commentsSinceLastInterval)
    },
  },

  watch: {
    // this is incremented after comments are loaded & parsed
    optimizeCount () {
      this.optimize()
    },
  },
}