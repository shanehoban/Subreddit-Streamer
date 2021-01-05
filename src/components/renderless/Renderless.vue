<template>
  <div>
    <Listeners />
    <Stats />
    <Optimizer />
  </div>
</template>

<script>
import Listeners from '@/components/renderless/Listeners'
import Stats from '@/components/renderless/Stats'
import Optimizer from '@/components/renderless/Optimizer'

export default {
  components: {
    Listeners,
    Stats,
    Optimizer,
  }
}
</script>