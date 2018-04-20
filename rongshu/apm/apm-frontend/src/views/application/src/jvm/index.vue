<style lang="scss" scoped>
.grid-content {
  border-width: 1px;
  border-style: solid;
  line-height: 105px;
  height: 105px;
  text-align: center;
  label {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 25px;
  }
  span {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    line-height: 25px;
    padding: 0px 10px;
  }
}
</style>
<template>
  <div>
    <top-bar title="JVM" @barChange="barChange"></top-bar>
    <div class="common-container">
      <div class="content grid-container">
        <el-row :gutter="1">
          <el-col :span="2" class="">
            <div class="theme-border-color-base grid-content">
              <label>JVM版本</label>
            </div>
          </el-col>
          <el-col :span="12" class="">
            <div class="theme-border-color-base grid-content">
              <span v-html="formattedVmVersion"></span>
            </div>
          </el-col>
          <el-col :span="2" class="">
            <div class="theme-border-color-base grid-content">
              <label>容器</label>
            </div>
          </el-col>
          <el-col :span="8" class="">
            <div class="theme-border-color-base grid-content">
              <span>{{ container }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="common-container" v-if="isJrockit">
      <div class="header-title">{{jrockitHeapusedData.title}}</div>
      <chart-lines :data="jrockitHeapusedData.data" :title="jrockitHeapusedData.title"></chart-lines>
    </div>
    <div class="common-container" v-if="isJrockit">
      <div class="header-title">{{jrockitunHeapUsedData.title}}</div>
      <chart-lines :data="jrockitunHeapUsedData.data" :title="jrockitunHeapUsedData.title"></chart-lines>
    </div>
    <div class="common-container" v-if="isJrockit">
      <div class="header-title">{{nurseryData.title}}</div>
      <chart-lines :data="nurseryData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isJrockit">
      <div class="header-title">{{jrockitoldSpaceData.title}}</div>
      <chart-lines :data="jrockitoldSpaceData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isJrockit">
      <div class="header-title">{{classMemoryData.title}}</div>
      <chart-lines :data="classMemoryData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isJrockit">
      <div class="header-title">{{classBlockMemoryData.title}}</div>
      <chart-lines :data="classBlockMemoryData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isHotSpot">
      <div class="header-title">{{heapUsedData.title}}</div>
      <chart-lines v-if="isHotSpot" :data="heapUsedData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isHotSpot">
      <div class="header-title">{{edenSpaceLineData.title}}</div>
      <chart-lines :data="edenSpaceLineData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isHotSpot">
      <div class="header-title">{{survivorSpaceLineData.title}}</div>
      <chart-lines :data="survivorSpaceLineData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isHotSpot">
      <div class="header-title">{{oldGenData.title}}</div>
      <chart-lines :data="oldGenData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isHotSpot&&jvmVersion<180">
      <div class="header-title">{{permGenData.title}}</div>
      <chart-lines :data="permGenData.data"></chart-lines>
    </div>
    <div class="common-container" v-if="isHotSpot&&jvmVersion>=180">
      <div class="header-title">{{metaSpaceData.title}}</div>
      <chart-lines :data="metaSpaceData.data"></chart-lines>
    </div>
    <div class="common-container">
      <div class="header-title">{{newGcTimeData.title}}</div>
      <chart-mix-line-bar :showHeader="false" :data="newGcTimeData.data" :link="newGcTimeData.link" :options="newGcTimeData.options"></chart-mix-line-bar>
    </div>
    <div class="common-container">
      <div class="header-title">{{oldGcTimeData.title}}</div>
      <chart-mix-line-bar  :showHeader="false" :data="oldGcTimeData.data" :link="oldGcTimeData.link" :options="oldGcTimeData.options"></chart-mix-line-bar>
    </div>

    <div class="common-container" v-if="isHotSpot">
      <div class="header-title">{{codeCacheData.title}}</div>
      <chart-lines v-if="isHotSpot" :data="codeCacheData.data"></chart-lines>
    </div>
    <div class="common-container">
      <div class="header-title">{{classCountData.title}}</div>
      <chart-lines :data="classCountData.data"></chart-lines>
    </div>
    <div class="common-container">
      <div class="header-title">{{threadCountData.title}}</div>
      <chart-lines :data="threadCountData.data"></chart-lines>
    </div>
  </div>
</template>
<script>
import TnBar from '_charts/topn-bar'
import ChartLines from '_charts/chart-lines'
import ChartMixLineBar from '_charts/chart-mix-line-bar'
import { Row, Col } from 'element-ui'
import topBarQuery from '../../../../components/mixin/topBarQuery'

export default {
  name: 'jvm',
  components: {
    'tn-bar': TnBar,
    'chart-lines': ChartLines,
    'chart-mix-line-bar': ChartMixLineBar,
    'el-row': Row,
    'el-col': Col
  },
  mixins: [topBarQuery],
  data() {
    return {
      topBarData: [],
      jvmVersion: '',
      vmVersion: '',
      isHotSpot: false,
      isJrockit: false,
      formattedVmVersion: '',
      container: '',
      queryData: {},
      environmentData: {},
      jrockitHeapusedData: {
        title: '堆使用情况',
        data: {},
        loading: false
      },
      jrockitunHeapUsedData: {
        title: '非堆使用情况',
        data: {},
        loading: false
      },
      nurseryData: {
        title: 'Nursery',
        data: {},
        loading: false
      },
      jrockitoldSpaceData: {
        title: 'Old Space',
        data: {},
        loading: false
      },
      classMemoryData: {
        title: 'Class Memory',
        data: {},
        loading: false
      },
      classBlockMemoryData: {
        title: 'ClassBlock Memory',
        data: {},
        loading: false
      },
      heapUsedData: {
        title: '堆使用情况',
        data: {},
        loading: false
      },
      edenSpaceLineData: {
        title: 'Eden space使用情况',
        data: {},
        loading: false
      },
      survivorSpaceLineData: {
        title: 'Survivor Space',
        data: {},
        loading: false
      },
      oldGenData: {
        title: 'Old Gen',
        data: {},
        loading: false
      },
      permGenData: {
        title: 'Perm Gen',
        data: {},
        loading: false
      },
      metaSpaceData: {
        title: 'MetaSpace',
        data: {},
        loading: false
      },
      newGcTimeData: {
        title: '新生代GC',
        link: '',
        data: [],
        options: {},
        loading: false
      },
      oldGcTimeData: {
        title: '老生代GC',
        link: '',
        data: [],
        options: {},
        loading: false
      },
      gcTimeData: {
        title: 'GC次数与耗时',
        link: '',
        data: {},
        loading: false
      },
      codeCacheData: {
        title: 'Code Cache',
        data: {},
        loading: false
      },
      classCountData: {
        title: 'Class数量',
        data: {},
        loading: false
      },
      threadCountData: {
        title: '线程数',
        data: {},
        loading: false
      }
    }
  },
  watch: {
    vmVersion(v) {
      let filterVersion = ''
      let version = 0
      let versions = []
      if (this.vmVersion) {
        /* eslint-disable  */
        var result = /^java version\s([0-9\.]+)/i.exec(this.vmVersion);
        if (result) {
          filterVersion = result[1];
        }
        versions = filterVersion.split(".");
        versions.reverse().forEach((num, index) => {
          version += num * Math.pow(10, index);
        });
      }

      this.jvmVersion = version;
      this.isJrockit = /oracle jrockit/i.test(this.vmVersion);
      this.isHotSpot = /java hotspot/i.test(this.vmVersion);
      this.formattedVmVersion = this.vmVersion.replace(/\n/g, "<br />");
    },
    environmentData: {
      deep: true,
      handler(v) {
        if (v) {
          this.vmVersion = v.vmVersion;
          if (v.serverMetaData && v.serverMetaData.length > 0) {
            this.container = v.serverMetaData[0].serverType;
          } else {
            this.container = "";
          }
        } else {
          this.vmVersion = "";
          this.container = "";
        }
      }
    }
  },
  computed: {},
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData; // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.queryData = {
        condition: {
          aggrInterval: this.aggrInterval,
          startTime: this.startTime,
          endTime: this.endTime
        }
      };
      this.renderCharts();
    },
    computeOptions(resData) {
      let that = this;
      let maxArr = [];
      let gcTitle = "";
      resData.forEach((e, i) => {
        gcTitle = e.title;
        e.list.forEach((h, k) => {
          maxArr[i] = Math.max(maxArr[i] || 0, h.y);
        });
      });

      maxArr = maxArr.map(item => {
        let max = Math.ceil(item / 50) * 50;
        return max;
      });

      let times = maxArr[0] / maxArr[1];

      let base = Math.floor(maxArr[1] / 5);

      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          formatter: params => {
            let arr = [];
            arr.push(gcTitle + "(GC时间)");
            arr.push(
              "从" +
                params[0].data.data.startTime +
                "到" +
                params[0].data.data.endTime
            );
            params.forEach((e, i) => {
              if (/(gccount)/gi.test(e.seriesName)) {
                arr.push("GC次数：" + e.data.data.y.toFixed(0) + "次");
              } else {
                arr.push("GC耗时：" + e.data.data.y.toFixed(3) + "ms");
              }
            });
            return arr.join("<br />");
          }
        },
        legend: {
          data: resData.map(e => {
            return e.title + "(" + e.name + ")";
          }),
          top: "bottom"
        },
        series: resData.map((e, i) => {
          return {
            name: e.title + "(" + e.name + ")",
            type: i === 0 ? "bar" : "line",
            barMaxWidth: 15,
            yAxisIndex: i,
            data: e.list.map((item, index) => {
              return {
                value: [item.x, item.y],
                data: item
              };
            })
          };
        }),
        yAxis: resData.map((e, i) => {
          let max = maxArr[i];

          let ya = {
            type: "value",
            name: e.name === 'gcTime' ? 'gcTime(ms)': e.name,
            min: 0,
            max: max,
            interval: i === 0 ? base * times : base,
            axisLabel: {
              show: true,
              formatter: value => {
                return value.toFixed(0);
              }
            },
            axisPointer: {
              show: true,
              label: {
                precision: 0
              }
            }
          };
          return ya;
        })
      };
    },
    // JrockitHeapusedData
    getJrockitHeapusedData(query) {
      let vm = this;
      vm.api
        .getJrockitHeapusedData({
          data: query
        })
        .done(res => {
          if (res.code === 0) {
            vm.jrockitHeapusedData.data = res || {};
          }
        });
    },
    // jrockitunHeapUsedData
    getjrockitunHeapUsedData(query) {
      let vm = this;
      vm.api
        .getjrockitunHeapUsedData({
          data: query
        })
        .done(res => {
          if (res.code === 0) {
            vm.jrockitunHeapUsedData.data = res || {};
          }
        });
    },
    // nurseryData
    getnurseryData(query) {
      let vm = this;
      vm.api
        .getnurseryData({
          data: query
        })
        .done(res => {
          if (res.code === 0) {
            vm.nurseryData.data = res || {};
          }
        });
    },
    // jrockitoldSpaceData
    getjrockitoldSpaceData(query) {
      let vm = this;
      vm.api
        .getjrockitoldSpaceData({
          data: query
        })
        .done(res => {
          if (res.code === 0) {
            vm.jrockitoldSpaceData.data = res || {};
          }
        });
    },
    // classMemoryData
    getclassMemoryData(query) {
      let vm = this;
      vm.api
        .getclassMemoryData({
          data: query
        })
        .done(res => {
          if (res.code === 0) {
            vm.classMemoryData.data = res || {};
          }
        });
    },
    // classBlockMemoryData
    getclassBlockMemoryData(query) {
      let vm = this;
      vm.api
        .getclassBlockMemoryData({
          data: query
        })
        .done(res => {
          if (res.code === 0) {
            vm.classBlockMemoryData.data = res || {};
          }
        });
    },
    // 堆使用情况
    getHeapUsedData(query) {
      let vm = this;
      vm.api
        .getHeapUsedData({
          data: Object.assign(
            {
              size: 5
            },
            query
          ),
          beforeSend() {
            vm.heapUsedData.loading = true;
          }
        })
        .done(res => {
          vm.heapUsedData.data = res || {};
        })
        .always(() => {
          vm.heapUsedData.loading = false;
        });
    },
    // 渲染 Eden space使用情况
    getEdenSpaceLineData(query) {
      let vm = this;
      vm.api
        .getEdenSpaceLineData({
          data: Object.assign(
            {
              size: 5
            },
            query
          ),
          beforeSend() {
            vm.edenSpaceLineData.loading = true;
          }
        })
        .done(res => {
          vm.edenSpaceLineData.data = res || {};
        })
        .always(() => {
          vm.edenSpaceLineData.loading = false;
        });
    },
    // 渲染 Survivor Space
    getSurvivorSpaceLineData(query) {
      let vm = this;
      vm.api
        .getSurvivorSpaceLineData({
          data: query,
          beforeSend() {
            vm.survivorSpaceLineData.loading = true;
          }
        })
        .done(res => {
          vm.survivorSpaceLineData.data = res || {};
        })
        .always(() => {
          vm.survivorSpaceLineData.loading = false;
        });
    },
    // 渲染 Old Gen
    getOldGenData(query) {
      let vm = this;
      vm.api
        .getOldGenData({
          data: query,
          beforeSend() {
            vm.oldGenData.loading = true;
          }
        })
        .done(res => {
          vm.oldGenData.data = res || [];
        })
        .always(() => {
          vm.oldGenData.loading = false;
        });
    },
    // 渲染 Perm Gen
    getPermGenData(query) {
      let vm = this;
      vm.api
        .getPermGenData({
          data: query,
          beforeSend() {
            vm.permGenData.loading = true;
          }
        })
        .done(res => {
          vm.permGenData.data = res || {};
        })
        .always(() => {
          vm.permGenData.loading = false;
        });
    },
    // 获取应用环境数据
    getAppEnvironmentData(query) {
      let vm = this;
      return vm.api
        .getAppEnvironment({
          data: query
        })
        .done(res => {
          if (res.code === 0) {
            vm.environmentData = res.data;
          }
        });
    },
    getMetaSpaceData(query) {
      let vm = this;
      // 渲染 MetaData
      vm.api
        .getMetaSpaceData({
          data: query,
          beforeSend() {
            vm.metaSpaceData.loading = true;
          }
        })
        .done(res => {
          vm.metaSpaceData.data = res || {};
        })
        .always(() => {
          vm.metaSpaceData.loading = false;
        });
    },
    getNewGcTimeData(query) {
      let vm = this;
      // 渲染 新生代GC次数与耗时
      vm.api
        .getNewGcTimeData({
          data: query,
          beforeSend() {
            vm.newGcTimeData.loading = true;
          }
        })
        .done(res => {
          vm.newGcTimeData.data = res.data || [];
          vm.newGcTimeData.options = vm.computeOptions(Array.reverse(res.data));
        })
        .always(() => {
          vm.newGcTimeData.loading = false;
        });
    },
    getOldGcTimeData(query) {
      let vm = this;
      // 渲染 老生代GC次数与耗时
      vm.api
        .getOldGcTimeData({
          data: query,
          beforeSend() {
            vm.oldGcTimeData.loading = true;
          }
        })
        .done(res => {
          vm.oldGcTimeData.data = res.data || {};
          vm.oldGcTimeData.options = vm.computeOptions(Array.reverse(res.data));
        })
        .always(() => {
          vm.oldGcTimeData.loading = false;
        });
    },
    getCodeCacheData(query) {
      let vm = this;
      // 渲染 Code Cache
      vm.api
        .getCodeCacheData({
          data: query,
          beforeSend() {
            vm.codeCacheData.loading = true;
          }
        })
        .done(res => {
          vm.codeCacheData.data = res || {};
        })
        .always(() => {
          vm.codeCacheData.loading = false;
        });
    },
    getClassCountData(query) {
      let vm = this;
      // 渲染 Class数量
      vm.api
        .getClassCountData({
          data: query,
          beforeSend() {
            vm.classCountData.loading = true;
          }
        })
        .done(res => {
          vm.classCountData.data = res || {};
        })
        .always(() => {
          vm.classCountData.loading = false;
        });
    },
    getThreadCountData(query) {
      let vm = this;

      // 渲染 线程数
      vm.api
        .getThreadCountData({
          data: query,
          beforeSend() {
            vm.threadCountData.loading = true;
          }
        })
        .done(res => {
          vm.threadCountData.data = res || {};
        })
        .always(() => {
          vm.threadCountData.loading = false;
        });
    },
    renderCharts() {
      let vm = this;
      let query = this.queryData;
      vm.getAppEnvironmentData(query).then(function() {
        vm.getHeapUsedData(query);
        vm.getEdenSpaceLineData(query);
        setTimeout(function() {
          vm.getSurvivorSpaceLineData(query);
          vm.getOldGenData(query);
          vm.getPermGenData(query);
          vm.getMetaSpaceData(query);
          vm.getNewGcTimeData(query);
          vm.getOldGcTimeData(query);
        }, 500);
        setTimeout(function() {
          vm.getCodeCacheData(query);
          vm.getClassCountData(query);
          vm.getThreadCountData(query);
          vm.getclassBlockMemoryData(query);
          vm.getjrockitoldSpaceData(query);
          vm.getjrockitunHeapUsedData(query);
          vm.getnurseryData(query);
          vm.getclassMemoryData(query);
          vm.getjrockitunHeapUsedData(query);
          vm.getJrockitHeapusedData(query);
        }, 800);
      });
    }
  }
};
</script>
