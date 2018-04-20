<style lang="scss" scoped>
.journey {
  &-view {
    width: 100%;
    height: 100%;
    overflow: auto;

    .canvas {
      position: relative;
      z-index: 11;
      cursor: default;
      transition: 0.01s transform ease-out;
      background: #FFF url("../../assets/images/journey/cell.png") -3px 3px;
      &.drag {
        cursor: move;
      }
    }
  }
}
</style>

<template>
  <div class="journey-view">
    <canvas class="canvas" :class="canvasClassName" ref="main" style="visibility: hidden">我们不再支持化石级浏览器, 请升级浏览器以支持canvas</canvas>
  </div>
</template>

<script>
import { journey } from './drawable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import isEmpty from 'ramda/src/isEmpty';
import findIndex from 'ramda/src/findIndex';
import propEq from 'ramda/src/propEq';
import lensPath from 'ramda/src/lensPath';
import view from 'ramda/src/view';
import clone from 'ramda/src/clone';

import {
  MODE,
  NODE_COLORS,
} from './constants/define';

const createObservable = 
  (targetRef) => 
  (eventName) => 
  Observable
  .fromEvent(targetRef, eventName)
  .map(e => e.node);

export default {
  name: 'journey-view',
  props: {
    scale: {
      type: Number,
      default: 1.0,
    },
    dataSource: {
      type: Object,
      default() {
        return {};
      }
    },
    mode: {
      type: Number,
      default: MODE.NORMAL,
    },
    onModeChange: {
      type: Function,
    },
    onNodeSelectedChange: {
      type: Function,
    },
    onLostAnalysis: {
      type: Function,
    },
    onMenuChange: {
      type: Function,
    },
  },
  data() {
    return {
      canvasClassName: '',
      selectedNodes: [],
      currentXIndex: -1,
    }
  },
  watch: {
    dataSource() {
      this.repaint();
    },
    scale() {
      this.repaint();
    },
    mode() {
      this.repaint();
    },
  },
  mounted() {
    const canvas = this.$refs.main;
    const flow = createObservable(canvas);

    this.nodeSelected$ = flow('nodeselected')
      .subscribe(this.selectNode);

    this.preCompare$ = flow('precompare')
      .subscribe(this.preCompare);

    this.lostAnalysis$ = flow('lostanalysis')
      .subscribe(this.lostAnalysis);

    this.showMenu$ = flow('showmenu')
      .subscribe(this.showMenu);

    this.normal$ = flow('normal')
      .subscribe(this.toNormal);
  },
  beforeDestroy() {
    this.preCompare$.unsubscribe();
    this.preCompare$ = void 0;

    this.nodeSelected$.unsubscribe();
    this.nodeSelected$ = void 0;

    this.lostAnalysis$.unsubscribe();
    this.lostAnalysis$ = void 0;

    this.showMenu$.unsubscribe();
    this.showMenu$ = void 0;

    this.normal$.unsubscribe();
    this.normal$ = void 0;
  },
  methods: {
    // 显示菜单
    showMenu(node) {
      const cloneNode = clone(node);
      const menuChange = this.onMenuChange;
      menuChange && menuChange(MODE.SHOW_MENU, cloneNode);
      // or
      // this.$emit('onModeChange', MODE.SHOW_MENU, node);
    },
    // 还原到正常模式
    toNormal(node) {
      const cloneNode = clone(node);
      const menuChange = this.onMenuChange;
      menuChange && menuChange(MODE.NORMAL, cloneNode);
      // or
      // this.$emit('onModeChange', MODE.NORMAL, node);
    },
    // 选择节点
    selectNode({ nodeId }) {
      const target = this.dataSource.nodes.filter((n) => n.props.nodeId === nodeId)[0];
      const index = this.selectedNodes.findIndex(n => n.props.nodeId === target.props.nodeId);

      if(index === -1) {
        this.selectedNodes.push(target);
      } else {
        this.selectedNodes.splice(index, 1);
      }

      const cloneSelectedNodes = clone(this.selectedNodes);
      const nodeSelectedChange = this.onNodeSelectedChange;
      nodeSelectedChange && nodeSelectedChange(cloneSelectedNodes);
      // or
      // this.$emit('onNodeSelectedChange', cloneSelectedNodes);
    },
    // 发起比较
    preCompare(node) {
      const { props: { x } } = node;
      this.currentXIndex = x;

      const cloneNode = clone(node);
      const modeChange = this.onModeChange;
      modeChange && modeChange(MODE.PRE_COMPARE, cloneNode);
      // or
      // this.$emit('onModeChange', MODE.PRE_COMPARE)
    },
    // 流失分析
    lostAnalysis(node) {
      const cloneNode = clone(node);
      const lostAnalysis = this.onLostAnalysis;
      lostAnalysis && lostAnalysis(cloneNode);
      // or
      // this.$emit('lostanalysis', cloneNode);
    },
    repaint() {
      this.$nextTick(() => {
        this.release();

        if (isEmpty(this.dataSource)) {
          return false;
        }

        const canvas = this.$refs.main;
        const render = journey(canvas);

        if (this.mode === MODE.PRE_COMPARE) {
          this.dataSource.currentXIndex = this.currentXIndex;
        } else {
          this.currentXIndex = this.dataSource.currentXIndex = -1;
        }

        this.selectedNodes = [];

        this.dataSource.scale = this.scale;
        this.dataSource.mode = this.mode;
        this.releaseStage = render(this.dataSource);

        canvas.style.visibility = 'visible';
      });
    },
    release() {
      if (this.releaseStage) {
        this.releaseStage();
        this.releaseStage = void 0;
      }
    },
  }
};
</script>
