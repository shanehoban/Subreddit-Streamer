<template>
  <div class="auth">

    <div v-if="!error">
      <h4>Loading...</h4>

      <div class="icon">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-repeat loading-icon spin" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
        </svg>
      </div>
    </div>

    <div v-else>
      {{ error }}
    </div>

    <div class="loading-contact-btn">
      <small class="text-muted">If you keep seeing this page:</small>
      <br>
      <br>

      <div class="btn-list">
        <router-link class="btn btn-primary" to="/">Go Back</router-link>
        <a class="btn btn-dark" :href="'mailto:' + config.emailAddress" target="_blank">Help</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      state: false,
      code: false,
      error: false,
    }
  },

  computed: {
    ...mapState('Auth', ['auth']),
    ...mapState('Settings', ['settings']),
    ...mapState('Config', ['config']),
  },

  methods: {
    ...mapMutations('Auth', ['SET_AUTH']),
  },

  mounted () {
    // apply the current theme
    document.body.classList = this.settings.theme

    this.state = this.$route.query.state || false
    this.code = this.$route.query.code || false

    if (this.state && this.code) {
      this.$api.getAccessToken(this.state, this.code).then((response) => {
        this.$helpers.debugEnabled() && console.log(response)

        if (response.success) {
          this.$router.push({ path: '/', query: { success: response.message }})
        } else {
          this.$router.push({ path: '/', query: { error:  response.message }})
        }
      })
    } else {
      this.$helpers.throwError('invalid params')
      this.error = 'You are missing things, this is not going to work.'
    }
  }
}
</script>

<style lang="scss" scoped>
  .auth {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;

    .icon {
      font-size: 24px;
      margin-top: 15px;
    }

    .loading-contact-btn {
      margin-top: 25px;
    }
  }
</style>