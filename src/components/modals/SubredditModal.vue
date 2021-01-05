<template>
  <div class="modal-stuff">
    <h3>Change Subreddit</h3>
    <p>
      Stream comments from a different subreddit. enter the name of the subreddit only. e.g. for /r/{{ defaultSubreddit }}, you only need to type <code>{{ defaultSubreddit }}</code>
    </p>

    <div class="other-settings">

      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">/r/</span>
        </div>
        <input ref="subredditInput" class="form-control" type="text" v-model="tempSubreddit">
      </div>
      
    </div>

    <p>
      <small>
        Changing the subreddit will clear all comments previously loaded
      </small>
    </p>
  
    <hr>

    <div class="btn-list modal-menu">
      <span>
        <button class="reset-settings-btn btn btn-danger" @click="tempSubreddit = defaultSubreddit">Reset Subreddit</button> 
      </span>
      <span>
        <button class="btn btn-dark" @click="()=>{tempSubreddit = subreddit; showSubredditModal = false;}">Cancel</button>
        <button @click="()=>{ subreddit = tempSubreddit; showSubredditModal = false }" class="btn btn-primary">Update Subreddit</button>
      </span>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  data() {
    return {
      tempSubreddit: ''
    }
  },
  
  computed: {
    ...mapFields('App', [
      'app.modals.showSubredditModal',
    ]),

    ...mapFields('Settings', [
      'settings.subreddit',
      'settings.defaultSubreddit',
    ]),
  },

  watch: {
    subreddit: function (newVal) {
      this.tempSubreddit = newVal
    },

    showSubredditModal: function (newVal) {
      if (newVal) {
        this.$nextTick(function(){
          this.$refs.subredditInput.focus() // why doesnt work
        })
      }
    },
  },

  mounted () {
    this.tempSubreddit = this.subreddit
  },
}
</script>

<style lang="scss" scoped>
  .modal-stuff {
    max-width: 550px;
  }

  .other-settings {
    padding: 15px;
    border-radius: 5px;
    background: var(--bg-dark);
    margin-bottom: 15px;
  }
</style>