<template>
  <div class="demo" style="width: 100%; height: 300px">
    <elinebar type="category" direction="vertical" :data="flag ? lines : singleLine"/> <br><br>
    <au-button @click="flag = !flag">交换数据</au-button>
    <elinebar :data="flag ? singleLine : lines"/> <br><br>
    <au-button @click="renderSoft">平滑灌数</au-button> <br><br>
    <au-button @click="removeStack">取消堆叠</au-button>
  </div>
</template>
<script>
import { Elinebar } from '../../components/charts'
export default {
  name: 'chart-demo',
  components: { Elinebar },
  data () {
    return {
      flag: false,
      lines: [
        {
          name: '线1',
          unit: '',
          axisName: '一个轴',
          stack: '',
          points: [
            // 一个点
            {
              x: 1520748000000,
              y: 200,
              more: {
                'key1': 'value1',
                'key2': 'value2'
              }
            },
            {
              x: 1520758000000,
              y: 300,
              more: {
                'key1': 'value1',
                'key2': 'value2'
              }
            },
            {
              x: 1520768000000,
              y: 240,
              more: {
                'key1': 'value3',
                'key2': 'value4'
              }
            },
            {
              x: 1520778000000,
              y: 500,
              more: {
                'key1': 'value5',
                'key2': 'value6'
              }
            },
            {
              x: 1520788000000,
              y: 300,
              more: {
                'key1': 'value7',
                'key2': 'value8'
              }
            }
          ]
        },
        {
          name: '线2',
          unit: '单位',
          axisName: '另一个轴',
          stack: '',
          points: [
            // 一个点
            // 一个点
            {
              x: 1520748000000,
              y: 134,
              more: {
                'key1': 'value9',
                'key2': 'value10'
              }
            },
            {
              x: 1520758000000,
              y: 534,
              more: {
                'key1': 'value11',
                'key2': 'value12'
              }
            },
            {
              x: 1520768000000,
              y: 225,
              more: {
                'key1': 'value13',
                'key2': 'value14'
              }
            },
            {
              x: 1520778000000,
              y: 663,
              more: {
                'key1': 'value15',
                'key2': 'value16'
              }
            },
            {
              x: 1520788000000,
              y: 323,
              more: {
                'key1': 'value17',
                'key2': 'value18'
              }
            }
          ]
        },
        {
          name: '线3',
          unit: '',
          axisName: '一个不会出现的轴',
          stack: '',
          points: [
            // 一个点
            // 一个点
            {
              x: 1520748000000,
              y: 242
            },
            {
              x: 1520758000000,
              y: 234
            },
            {
              x: 1520768000000,
              y: 523
            },
            {
              x: 1520778000000,
              y: 234
            },
            {
              x: 1520788000000,
              y: 112
            }
          ]
        }
      ],
      singleLine: [
        {
          name: '线1',
          unit: '',
          axisName: '一个轴',
          stack: '',
          points: [
            {
              x: 1520748000000,
              y: 134,
              more: {
                'key1': 'value9',
                'key2': 'value10'
              }
            },
            {
              x: 1520758000000,
              y: 534,
              more: {
                'key1': 'value11',
                'key2': 'value12'
              }
            },
            {
              x: 1520768000000,
              y: 225,
              more: {
                'key1': 'value13',
                'key2': 'value14'
              }
            },
            {
              x: 1520778000000,
              y: 663,
              more: {
                'key1': 'value15',
                'key2': 'value16'
              }
            },
            {
              x: 1520788000000,
              y: 323,
              more: {
                'key1': 'value17',
                'key2': 'value18'
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    renderSoft () {
      this.lines = [
        {
          name: '线1',
          type: 'bar',
          stack: 'a',
          area: true,
          axisName: '一个轴',
          points: [
            // 一个点
            {
              x: 1520748000000,
              y: 200
            },
            {
              x: 1520758000000,
              y: 300
            },
            {
              x: 1520768000000,
              y: 240
            },
            {
              x: 1520778000000,
              y: 500
            },
            {
              x: 1520788000000,
              y: 300
            }
          ]
        },
        {
          name: '线2',
          stack: 'a',
          area: true,
          axisName: '一个轴',
          points: [
            // 一个点
            // 一个点
            {
              x: 1520748000000,
              y: 334
            },
            {
              x: 1520758000000,
              y: 543
            },
            {
              x: 1520768000000,
              y: 134
            },
            {
              x: 1520778000000,
              y: 678
            },
            {
              x: 1520788000000,
              y: 457
            }
          ]
        }
      ]
    },
    removeStack () {
      this.lines = [
        {
          name: '线1',
          unit: '',
          type: 'line',
          axisName: '一个轴',
          stack: null,
          area: false,
          points: [
            // 一个点
            {
              x: 1520748000000,
              y: 200
            },
            {
              x: 1520758000000,
              y: 300
            },
            {
              x: 1520768000000,
              y: 240
            },
            {
              x: 1520778000000,
              y: 500
            },
            {
              x: 1520788000000,
              y: 300
            }
          ]
        },
        {
          name: '线2',
          unit: '单位',
          type: 'bar',
          axisName: '一个轴',
          stack: null,
          area: false,
          points: [
            // 一个点
            // 一个点
            {
              x: 1520748000000,
              y: 334
            },
            {
              x: 1520758000000,
              y: 543
            },
            {
              x: 1520768000000,
              y: 134
            },
            {
              x: 1520778000000,
              y: 678
            },
            {
              x: 1520788000000,
              y: 457
            },
            {
              x: 1520798000000,
              y: 334
            },
            {
              x: 152080000000,
              y: 543
            },
            {
              x: 1520818000000,
              y: 134
            },
            {
              x: 1520828000000,
              y: 678
            },
            {
              x: 1520838000000,
              y: 457
            }
          ]
        }
      ]
    }
  }
}
</script>
