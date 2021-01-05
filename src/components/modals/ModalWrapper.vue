<template>
  <transition
    :css="(app.isPageHidden === false && settings.disableAnimations === false) ? true : false"
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
    @before-enter="enterComplete = true"
    @before-leave="enterComplete = false">
    
    <div v-show="showIf" class="modal-wrapper">
      <transition
        :css="(app.isPageHidden === false && settings.disableAnimations === false) ? true : false"
        enter-active-class="zoomIn"
        leave-active-class="zoomOut">
          <component v-show="enterComplete" :is="modalContent"/>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    modalContent: Object,
    showIf: Boolean
  },

  data() {
    return {
      enterComplete: false
    }
  },

  computed: {
    ...mapState('App', ['app']),
    ...mapState('Settings', ['settings']),
  },
}
</script>