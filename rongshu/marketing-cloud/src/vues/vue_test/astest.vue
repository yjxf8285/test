/*
 * @Author: AnThen
 * @Date: 2017-08-23 11:51:08
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-28 13:47:22
 */
<style lang="scss" scoped>
.dateRange{position: relative; min-width: 120px; min-height: 28px; display: -webkit-box;
  .icon{}
  .input-box{width: 150px; height: 28px;
    .input{width: 100%; height: 100%;}
  }
}
</style>
<template>
  <div>
    选择的时间: {{thisDate}}
    <div class="dateRange">
      <i class="icon fa fa-calendar"></i>
      <div class="input-box">
        <input
        type="text"
        placeholder="请选择日期"
        class="input"
        readonly="readonly"
        @focus="showDateBox"
        v-model="dateDisplay"/>
      </div>
    </div>
    <mc-dateRange
    :dateParam="dateParam"
    :display="dateDisplay"
    :dateBoxRegion="dateBoxRegion"
    v-on:getDate="listenAsDate"></mc-dateRange>
    <hr/>
    <mc-modal
      title="这是一个弹窗"
      :display="modalDisplay"
      @mc-modal-off="() => { this.modalDisplay = false }">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto natus debitis nesciunt nostrum quia modi, ea sit doloremque aspernatur quibusdam molestias omnis velit fuga praesentium, perferendis distinctio illum ullam sunt!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum soluta labore quibusdam exercitationem laboriosam. Dolorum quam provident tempora in facere facilis, cupiditate nesciunt id alias eligendi temporibus ex, aspernatur, libero.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi temporibus corporis dolore, perspiciatis nobis voluptatem unde perferendis dolorum sed voluptatibus consectetur nihil in, voluptatum quod possimus quae voluptate debitis. Itaque.</p>
    </mc-modal>
    <button @click="showModal">触发模态框</button>
  </div>
</template>
<script>
import dateRange from '../../components/mc-ui/components/date/range'
import mcModal from '../../components/mc-ui/components/modal'
export default {
  components: {
    'mc-dateRange': dateRange,
    'mc-modal': mcModal
  },
  data () {
    return {
      dateBoxRegion: false,
      thisDate: '',
      modalDisplay: false,
      dateParam: {
        start: '2017-6-22',
        end: '2017-8-22',
        lastSub: true,
        top: 40,
        left: 20
      },
      dateDisplay: '',
      dateDisplay1: '2017-7-23~2017-8-22'
    }
  },
  mounted () {

  },
  methods: {
    listenAsDate (val) {
      console.log(val)
      let valSp
      let from_time
      let to_time
      if (val) {
        valSp = val.split('~')
        from_time = new Date(Date.parse((valSp[0]).replace(/-/g,"/"))).getTime()
        to_time = new Date(Date.parse((valSp[1]).replace(/-/g,"/"))).getTime()
        this.thisDate = val
        this.dateDisplay = val
        console.log(from_time)
        console.log(to_time)
      }
      this.dateBoxRegion = false
    },
    showDateBox () {
      this.dateBoxRegion = true
    },
    showModal () {
      this.modalDisplay = true
    }
  }
}
</script>
