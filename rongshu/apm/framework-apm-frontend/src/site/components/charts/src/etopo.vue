<style lang="scss">
.chart-topo,
.chart {
  height: 100%;
}
@keyframes down {
    0% {
        transform: translateY(0px);
    }
    20% {
        transform: translateY(-2px);
    }
    50% {
        transform: translateY(2px);
    }
    75% {
        transform: translateY(1px);
    }
    100% {
        transform: translateY(0px);
    }
}

.topo.full {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: white;
}

.topo {
    width: 100%;
    height: 100%;
    position: relative;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.topo svg {
    width: 100%;
    height: 100%;
}

.topo svg g.node:hover {
    cursor: pointer;
}

.tooltip {
    position: absolute;
    float: left;
    left: -100000px;
    top: -100000;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 1px 1px 1px 1px #ccc;
    line-height: 22px;
    padding: 5px 10px;

    i {
        font-size: 18px;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 2px;
        border-bottom: 2px solid #ccc;
        box-sizing: border-box;
    }
    &.show {
        i {
            animation: down 0.5s ease-in;
            animation-delay: .5s;
            animation-iteration-count: 2;
        }
    }
}

.fade-enter-active {
    transition: all 0.5s ease;
}

.fade-leave-active {
    transition: all 0s ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}

.topo .slider {
    width: 10px;
    height: 200px;
    position: absolute;
    top: 50px;
    left: 15px;
    background: #f5f5f5;
    border: 1px solid #d7d7d7;
    border-radius: 12px;
    display: none;
}

.topo .slider .slider-thumb {
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background: #9aa3b2;
    margin-left: -2px;
    margin-top: 1px;
    box-shadow: 2px 2px 2px 2px rgba(255, 255, 255, 0.8);
    cursor: pointer;
}

.topo .toolbar {
    position: absolute;
    top: 10px;
    right: 10px;
}

.topo .toolbar img {
    cursor: pointer;
}

.topo .toolbar .restore {
    display: none;
}

.instances {
  font-size: 18px;
}

.adsFlowMapTextShadow {
  stroke: #FFFFFF;
  stroke-width: 4px;
  stroke-opacity: .8;
  fill: #FFFFFF;
  fill-opacity: 1;
}

.pie-summary {
  font-size: 10px;
}

.link line {
  stroke: #2693ff;
  stroke-width: 1;
}
.link.dash line {
  stroke-dasharray: 3;
}
.link line:hover {
  stroke-width: 2;
}
.hide {
  display: none;
}

.link path.arrow.playArrow {
  display: none;
}
.link path.bezer {
  fill: none;
  stroke: #2693ff;
  stroke-width: 1;
}
.link.dash path.bezer {
  stroke-dasharray: 3;
}
.link path.bezer:hover {
  stroke-width: 2;
}
.link path.arrow {
  fill: #2693ff;
}
.link .line-text {
  font-size: 10px;
  font-weight: "normal";
  font-style: "-apple-system,Microsoft Yahei,system-ui,BlinkMacSystemFont,Open Sans,Hiragino Sans GB,sans-serif";
  color: "#000";
}
.adsFlowMapTextShadow {
  stroke: #ffffff;
  stroke-width: 4px;
  stroke-opacity: 0.8;
  fill: #ffffff;
  fill-opacity: 1;
  font-size: 10px;
}
.real {
  text-anchor: middle;
  font-size: 10px;
}
</style>
<template>
  <div class="topo" ref="chart">
  </div>
</template>
<script>
import apmTopo from '../../topo/apm-topo'
export default {
  name: 'chart-topo',
  props: {
    data: {
      required: true
    }
  },
  watch: {
    data: {
      handler (v) {
        this.renderChart()
      }
    }
  },
  methods: {
    renderChart () {
      if (!this.chart) return
      console.log('topo update')
      console.log(this.data)
      this.chart.update(this.data)
    }
  },
  mounted () {
    this.chart = apmTopo.init(this.$refs.chart, this.data)
    console.log('topo init')
  }
}
</script>
