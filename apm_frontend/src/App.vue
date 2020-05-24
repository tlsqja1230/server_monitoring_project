<template>
  <SetLayout>
    <router-view></router-view>
  </SetLayout>
</template>

<script>
  import SetLayout from '@/components/layouts/SetLayout.vue'
  export default {
    components:{
      SetLayout
    }
  }
</script>