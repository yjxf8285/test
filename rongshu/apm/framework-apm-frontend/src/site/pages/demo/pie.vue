<template>
  <div class="demo" style="width: 100%; height: 300px">
    <ChartPie :data="data"/> <br><br>
  </div>
</template>
<script>
import { ChartPie } from '../../components/charts'
export default {
  name: 'chart-demo',
  components: { ChartPie },
  data () {
    return {
      flag: false,
      data: {
        points: [
          {
            name: 'test1',
            value: 20
          },
          {
            name: 'test2',
            value: 30
          }
        ]
      }
    }
  }
}
</script>
