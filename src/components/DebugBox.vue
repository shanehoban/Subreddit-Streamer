<template>
  <div class="debug-box">
      <!-- <div>screenWidth: <code>{{ app.screenWidth }}</code></div> -->
      <!-- <div>commentCount: <code>{{ comments.commentCount }}</code></div>
      <div>commentIDCount: <code>{{ comments.commentIDCount }}</code></div> -->
      <div>loaded: <code>{{comments.commentsLoadedCount}}/{{comments.commentCount}}</code></div>
      <div>loadLimit: <code>{{ config.loadLimit }}</code></div>
      <div>averageThroughput: <code>{{ stats.averageThroughput }}%</code></div>

      <div class="form-check hide-on-mobile">
        <input type="checkbox" class="form-check-input input-success" id="disableConsoleLogs" v-model="disableConsoleLogs">
        <label class="form-check-label" for="disableConsoleLogs">disable logs</label>
      </div>

      <div><button @click="debug = false">debug off</button></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    computed: {
    ...mapState('App', ['app']),
    ...mapState('Config', ['config']),
    ...mapState('Stats', ['stats']),
    ...mapState('Comments', ['comments']),

    ...mapFields('Settings', [
      'settings.disableConsoleLogs',
      'settings.debug',
      ]),
  },
}
</script>

<style lang="scss" scoped>
  
  .debug-box {
    position: fixed;
    left: 20px;
    top: 20px;
    padding: 11px;
    font-size: 10px;
    z-index: 90;
    color: #fff;
    border-radius: 5px;
    background: #000;
    opacity: 0.75;

    @include w768 {
      font-size: 13px;
    }

    .form-check {
      min-height: 0;
    }

    code {
      background: #000;
      color: $light-green;
      font-weight: bold;
    }

    button {
      border-radius: 4px;
      border: 0;
      margin-top: 3px;
      background:#000;
      color: lime;
    }
  }

</style>