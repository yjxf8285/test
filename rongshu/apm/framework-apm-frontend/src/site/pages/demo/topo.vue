<template>
  <div class="demo" style="width: 100%; height: 500px">
    <Topo :data="data"/> <br><br>
  </div>
</template>
<script>
import { Topo } from '../../components/charts'
export default {
  name: 'chart-demo',
  components: { Topo },
  data () {
    return {
      data: {
        nodes: [
          {
            id: 'node1',
            name: 'node1'
          },
          {
            id: 'node2',
            name: 'node2'
          }
        ],
        links: [
          {
            source: 'node1',
            target: 'node2'
          }
        ]
      }
    }
  }
}
</script>
