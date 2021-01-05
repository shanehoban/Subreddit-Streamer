<template>
  <div class="modal-stuff text-center">
    <h3>A new version is available</h3>
    <p>
      You will need to reload in order to use it
      <br>
      <small class="text-muted">if you have the site open in another tab, please also close that</small>
    </p>

    

    <div class="modal-buttons">
      <button class="btn btn-success" @click="reloadApp">Update</button>
    </div>
    
    <div class="whats-new">
      <h5>Whats New?</h5>

      <div class="news-list">
        <div class="news">added ability to login through reddit</div>
        <div class="news">added ability to reply to comments</div>
        <div class="news">added ability to comment directly to threads</div>
        <div class="news">added ability upvote comments</div>
        <div class="news">overhauled the themes and colour schemes</div>
      </div>

      <div class="old-news">
        <h6>Previous Updates</h6>
        <div class="news-list">
          <div class="news"> added clear comment button </div>
          <div class="news"> optimized sticky scroll for user experience </div>
          <div class="news"> implimented an optimizer to reduce load on reddit servers </div>
          <div class="news"> added the ability to change subreddit </div>
          <div class="news"> added post titles </div>
          <div class="news"> added timestamps </div>
          <div class="news"> added comment authors &amp; flair </div>
          <div class="news"> added theme changing (dark/light) </div>
        </div>
      </div>

      <div class="modal-buttons">
        <button class="btn btn-primary" @click="reloadApp">Update</button>
        <a class="btn btn-dark" :href="'mailto:' + config.emailAddress" target="_blank">Help</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapState, mapMutations } from 'vuex'

export default {
    computed: {
    ...mapState('Config', ['config']),

    ...mapFields('App', [
      'app.modals.showUpdateModal',
    ]),

  },

  methods: {
    // the only persistent store is settings, and auth
    ...mapMutations('Auth', ['RESET_AUTH']),
    ...mapMutations('Settings', ['RESET_SETTINGS']),


    reloadApp() {
      this.RESET_AUTH()
      this.RESET_SETTINGS()
      location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
  .modal-stuff {
    max-width: 500px;
    padding: 30px;
  }

  .modal-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 20px 0;
  }

  .whats-new {
    opacity: 0.8;
  }

  .news-list {
    font-size: 13px;

    .news {
      margin-bottom: 5px;
    }
  }

  .old-news {
    opacity: 0.6;
    margin-top: 20px;
  }
</style>