<style>
.formatter-link {
  color: #2565f6;
}
</style>

<template>
  <a class="formatter-link"
    :href="link"
    @click.native="onClick">{{text}}</a>
</template>
<script>
export default {
  name: 'FormatterLink',
  data() {
    return {}
  },
  props: {
    options: Object,
    value: [String, Object],
    row: [Object],
    index: [Number]
  },
  computed: {
    text() {
      if (this.options.text) {
        return this.options.text(this.value, this.row, this.index)
      }
      return this.value
    },
    link() {
      if (this.options.link) {
        return this.options.link(this.value, this.row, this.index)
      }
      return 'javascript:void(0);'
    }
  },
  method: {
    onClick($event) {
      if (this.options.onclick) {
        this.options.onclick($event)
      }
    }
  }
}
</script>
