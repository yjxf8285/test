<style lang='scss' scoped>
.lost {
  &-view {
    height: 152px;
  }
}
</style>

<template>
  <div class='lost-view'>
    <canvas ref='main'></canvas>
  </div>
</template>

<script>
import { lost } from './drawable';

import isEmpty from 'ramda/src/isEmpty';

export default {
  name: 'lost-view',
  props: {
    dataSource: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    dataSource() {
      this.repaint();
    },
  },
  mounted() {
  },
  beforeDestroy() {
    this.release();
  },
  methods: {
    repaint() {
      this.$nextTick(() => {
        this.release();

        if (isEmpty(this.dataSource))
          return false;

        const canvas = this.$refs.main;
        const render = lost(canvas);

        this.releaseStage = render(this.dataSource);
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
