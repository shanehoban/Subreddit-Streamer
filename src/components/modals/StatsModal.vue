<template>
  <div class="modal-stuff">
    <pre>{{ stats }}</pre>

    <hr>

    <div class="modal-menu">
      <button class="btn btn-danger" @click="showStatsModal = false">Close</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  computed: {
    ...mapState('Stats', ['stats']),

    ...mapFields('App', [
      'app.modals.showStatsModal',
    ]),
  },
}
</script>

<style lang="scss" scoped>
  .modal-menu {
    justify-content: flex-end;
  }
</style>