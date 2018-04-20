<style lang="scss" scoped>
  .page-404 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #2b8dd1;
  }

  .number-404 {
    padding-top: 100px;
    font-size: 200px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    p {
      font-size: 24px;
      font-weight: normal;
    }
    .desc {
      margin: 0;
    }
    .backHome {
      font-weight: normal;
      font-size: 18px;
      a {
        color: #ccc;
        text-decoration: none;
      }
      a:hover {
        color: #fff;
      }
    }
  }
</style>
<template>
  <div class="page-404 theme-background-color-primary">
    <div class="number-404">
      404
      <p class="desc">您访问的页面不存在</p>
      <p class="backHome">
        <router-link to="/">返回首页</router-link>
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'page404',
    mounted () {
      // this.desc = this.descs[(Math.random() * 4).toFixed(0)]
      console.info(this.descs[(Math.random() * 4).toFixed(0)])
    },
    data () {
      return {
        descs: [
          '哎呦~~~',
          'May the force be with you!',
          '客官，您走错房间了~',
          '请注意，您已进入无人区',
          'We are not here because we are free, we are here because we are not free'
        ],
        desc: ''
      }
    }
  }
</script>
