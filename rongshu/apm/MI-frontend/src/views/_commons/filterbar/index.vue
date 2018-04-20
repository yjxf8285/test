<style lang="scss" scoped>
.filterbar{
  background-color: #f7f9fb;
  padding: 10px;
}
</style>
<template src="./template.html">
</template>

<script>

export default {
  name: 'filterbar',
  data () {
    return {
      value: ['beijing'],
      multiple: false,
      placeholder: '请选择城市',
      conditions: [
        {text: '域名', value: 'domain'},
        {text: '域名', value: 'domain'}
      ]
    }
  },
  props: {

  },
  mounted () {

  },
  computed: {

  },
  watch: {

  },
  methods: {

  }
}
</script>
