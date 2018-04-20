<style lang="scss" scoped>
.top4 {
  &-view {
    height: 229px;
  }
}
</style>

<template>
  <div class="top4-view">
    <canvas ref="main"></canvas>
  </div>
</template>

<script>
import { top4 } from './drawable';
import isEmpty from 'ramda/src/isEmpty'

export default {
  name: "top4-view",
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
    dropped: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    dataSource() {
      this.repaint();
    },
    dropped() {
      this.repaint();
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    repaint() {
      this.$nextTick(() => {
        this.release();

        if (isEmpty(this.dataSource))
          return false;
        
        const canvas = this.$refs.main;
        const render = top4(canvas);

        this.releaseStage = render(this.dataSource, this.dropped);
      });
    },
    release() {
      if (this.releaseStage) {
        this.releaseStage();
        this.releaseStage = void 0;
      }
    }
  }
}
</script>
