/*
 * @Author: AnThen
 * @Date: 2017-08-12 12:30:25
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-30 17:22:14
 */
<style lang="scss" scoped>
.journey {
  height: 100%;
  text-align: center;
  color: rgba(102, 102, 102, 1.0);
  border-top: 1px solid rgba(51,51,51,0.9);
  .inner-borders {
    height: 100%;
    border: {
      bottom: 24px solid rgba(51,51,51,1);
      top: 24px solid rgba(51,51,51,1);
      right: 24px solid rgba(51,51,51,1);
    }
    img {
    margin-top: 48px;
    }
    .title {
      padding-top: 12.7vw;
      font: {
        height: 12px;
        size: 34px;
        weight: bold;
      }
    }
    .introduction {
      padding-top: 30px;
      font: {
        size: 16px;
      }
    }
  }
}
</style>
<template>
  <div class="journey">
    <div class="inner-borders">
      <div class="title">
      欢迎使用瑞雪营销云
      </div>
      <div class="introduction">
        <p>旅程是由一组用户行为定义出来的数据视图，该视图体现了企业与客</p>
        <p>户之间的接触点、业务路径.通过观察特定意义的旅程，从而洞察企业</p>
        <p>的业务问题以及客户的用户体验。</p>
      </div>
      <img :src="img" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'journey',
  data () {
    return {
      topBcnRoot: this.GLOBAL.bcn.root,
      topBcnSecond: this.GLOBAL.bcn.second,
      img: require('../../assets/img/create-journey-tip.png')
    }
  },
  mounted () {
    this.topBcnRoot.icon = 'fa-paper-plane'
    this.topBcnRoot.name = '客户旅程'
    this.topBcnRoot.link = ''
    this.topBcnSecond.name = ''
    this.topBcnSecond.link = ''
  },
  methods: {}
}
</script>

