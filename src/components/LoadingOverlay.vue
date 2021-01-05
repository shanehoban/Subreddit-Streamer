<template>
  <div class="loading-overlay">

    <div class="loading-img">
      <div>
        <!-- reddit logo -->
        <svg class="reddit-logo" width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 341.8 341.8" style="enable-background:new 0 0 341.8 341.8;" xml:space="preserve">
          <g id="Artwork">
            <g>
              <circle fill="#FF4500" cx="170.9" cy="170.9" r="85.5"/>
              <path fill="#FFFFFF" d="M227.9,170.9c0-6.9-5.6-12.5-12.5-12.5c-3.4,0-6.4,1.3-8.6,3.5c-8.5-6.1-20.3-10.1-33.3-10.6l5.7-26.7
                l18.5,3.9c0.2,4.7,4.1,8.5,8.9,8.5c4.9,0,8.9-4,8.9-8.9c0-4.9-4-8.9-8.9-8.9c-3.5,0-6.5,2-7.9,5l-20.7-4.4c-0.6-0.1-1.2,0-1.7,0.3
                c-0.5,0.3-0.8,0.8-1,1.4l-6.3,29.8c-13.3,0.4-25.2,4.3-33.8,10.6c-2.2-2.1-5.3-3.5-8.6-3.5c-6.9,0-12.5,5.6-12.5,12.5
                c0,5.1,3,9.4,7.4,11.4c-0.2,1.2-0.3,2.5-0.3,3.8c0,19.2,22.3,34.7,49.9,34.7s49.9-15.5,49.9-34.7c0-1.3-0.1-2.5-0.3-3.7
                C224.8,180.4,227.9,176,227.9,170.9z M142.4,179.8c0-4.9,4-8.9,8.9-8.9c4.9,0,8.9,4,8.9,8.9c0,4.9-4,8.9-8.9,8.9
                C146.4,188.7,142.4,184.7,142.4,179.8z M192.1,203.3c-6.1,6.1-17.7,6.5-21.1,6.5c-3.4,0-15.1-0.5-21.1-6.5c-0.9-0.9-0.9-2.4,0-3.3
                c0.9-0.9,2.4-0.9,3.3,0c3.8,3.8,12,5.2,17.9,5.2s14-1.4,17.9-5.2c0.9-0.9,2.4-0.9,3.3,0C193,201,193,202.4,192.1,203.3z
                M190.5,188.7c-4.9,0-8.9-4-8.9-8.9c0-4.9,4-8.9,8.9-8.9c4.9,0,8.9,4,8.9,8.9C199.4,184.7,195.4,188.7,190.5,188.7z"/>
            </g>
          </g>
          <g id="Spacing_Guide" style="display: none;">
            <rect style="display:inline;fill:none;stroke:#D8D8D8;stroke-width:0.5;stroke-miterlimit:10;" width="85.4" height="85.4"/>
            <rect style="display:inline;fill:none;stroke:#D8D8D8;stroke-width:0.5;stroke-miterlimit:10;" width="341.8" height="85.4"/>
            <rect y="256.3" style="display:inline;fill:none;stroke:#D8D8D8;stroke-width:0.5;stroke-miterlimit:10;" width="341.8" height="85.4"/>
            <rect style="display:inline;fill:none;stroke:#D8D8D8;stroke-width:0.5;stroke-miterlimit:10;" width="85.4" height="341.8"/>
            <rect x="256.4" style="display:inline;fill:none;stroke:#D8D8D8;stroke-width:0.5;stroke-miterlimit:10;" width="85.4" height="341.8"/>
          </g>
          </svg>
      </div>
    </div>

    <h3>Loading Comments</h3>
    
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-repeat loading-icon spin" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
      <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>

    <div class="loading-contact-btn">
      <small class="text-muted">if you keep seeing this page:</small>
      <br>
      <br>
      <a class="btn btn-dark" :href="'mailto:' + config.emailAddress" target="_blank">Help</a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('Settings', ['settings']),
    ...mapState('Config', ['config'])
  }
}
</script>

<style lang="scss" scoped>
  .loading-overlay {
    display: flex;
    padding: 35px 0;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg);
    align-items: center;
    text-align: center;
    z-index: 999;

    .loading-img {
      margin: 20px 0 30px;
    }

    .loading-icon {
      display: inline-block;
      font-size: 20px;
      font-weight: normal;
      margin-top: 25px;
    }

    .loading-contact-btn {
      margin-top: 25px;
    }
  }
</style>