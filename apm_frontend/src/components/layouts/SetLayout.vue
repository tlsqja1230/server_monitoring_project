<template>
    <component :is="layout">
      <slot></slot>
    </component>
</template>

<script>
  import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
  export default {
    name: 'SetLayout',
    components:{
        DefaultLayout
    },
    data() {
        return {
            layout: this.$route.meta.layout? 'DefaultLayout' : this.$route.meta.layout
        }
    }
  }
</script>