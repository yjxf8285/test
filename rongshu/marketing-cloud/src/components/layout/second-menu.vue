/*
 * @Author: AnThen
 * @Date: 2017-08-11 19:42:14
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-30 17:28:08
 */
<style lang="scss" scoped>
.call-menu {
  float: left;
  width: 323px; height: 100%;
  border-top: 1px solid rgba(255,255,255,0.3);
  .seen-btn {
    float: left;
    width: 20px; height: 100%;
    background-color: rgba(51,51,51,1);
    .right {
      margin-top: 46px;
      font-size: 22px;
      height: 30px;
      color: rgba(153,153,153,1);
      background-color: rgba(255,255,255,0.1);
      &:hover {
        color: rgba(255,255,255,1);
        background-color: rgba(255,255,255,0.3);}
    }
  }
  .second-menu{
    float: left;
    width: 303px; height: 100%;
    border-left: 1px solid rgba(255,255,255,0.1);
    background-color: rgba(33,33,33,1);
    .operate {
      width: 100%; height: 100%;
      position: relative;
      padding: {
        top: 46px;
        left: 19px;
      }
      input {
        width: 256px; height: 30px;
        padding-left: 12px;
        font-size: 12px;
        outline: none;
        &:hover {
          border: none;
          color: white;
          background-color: rgba(0,150,136,0.3)
        }
      }
      .left {
        float: right;
        font-size: 22px;
        width:20px; height: 30px;
        color: rgba(153,153,153,1);
        background-color: rgba(255,255,255,0.1);
        &:hover {
          color: rgba(255,255,255,1);
          background-color: rgba(255,255,255,0.3);
        }
      }
      .search {
        position: absolute;
        top: 52.1px; right: 35px;
        z-index: 1;
        font-size: 14px;
        color: rgba(153,153,153,1);
      }
      ol {
        position: absolute;
        top: 100px; bottom: 80px;
        padding-right: 10px;
        overflow-x: hidden;
        overflow-y: auto;
        li + li {
          margin-top: 8px;
        }
        li:first-child { cursor: pointer; }
        li {
          position: relative;
          width: 256px; height: 106px;
          padding-left: 14px;
          background-color: rgba(255,255,255,0.1);
          &:hover .mount{
            visibility: visible;
            background-color: rgba(255,183,77,0.4);
          }
          .mount {
            visibility: hidden;
            z-index: 2;
            position: absolute;
            left: 0px;
            width: 256px; height: 106px;
            color: rgba(255,255,255,1);
            font-size: 36px;
            text-align: center;
            line-height: 106px;
            span {
              font-size: 14px;
            }
          }
          &:hover .layer{
            visibility: visible;
            background-color: rgba(0,0,0,0.6);
          }
          .layer {
            visibility: hidden;
            z-index: 1;
            position: absolute;
            left: 0px;
            width: 256px; height: 106px;
          }
          .title {
            font-size: 14px;
            padding-top: 14px;
            color: rgba(204,204,204,1);
          }
          .point {
            position: absolute;
            top: 29px;
            padding-right: 14px;
            font-size: 12px;
            padding-top: 9px;
            color: rgba(153,153,153,1);
          }
          .people {
            font-size: 12px;
            padding-top: 45px;
            color: rgba(153,153,153,1);
            .logo {
              float: left;
              font-size: 14px;
              padding: {
                top: 2px;
                right: 8px;
              }
            }
          }
          .status {
            position: relative;
            color: rgba(153,153,153,1);
            right: 14px;
            margin-top: -18.5px;
            float: right;
            i {
              font-size: 14px;
              position: absolute;
              float: right;
              left: -17px;
              top: 2px;
            }
            .i-correct {
              color: rgba(76,175,80,1);
            }
          }
        }
      }
      button {
        position: absolute;
        left: 19px; bottom: 12.5px;
        width: 256px; height: 50px;
        font-size: 16px;
        background-color: rgba(0,150,136,1);
        border: none;
        color: #fff;
        outline: none;
        &:hover {background-color: rgba(77,182,172,1);}
        .create {
          position: absolute;
          font-size: 18px;
          float: left;
          left: 75px; bottom: 14.5px;
        }
      }
    }
  }
}
.call-menu.min{width: 20px;}
</style>
<template>
  <div class="call-menu" :class="callMenuClassName">
    <div class="second-menu" v-show="seen">
      <div class="operate">
        <i class="icon fa fa-angle-left left" @click="callSeen()"></i>
        <input placeholder="输入旅程名称搜索"></input>
        <span><i class="icon fa fa-search search"></i></span>
        <ol>
          <li v-for="piece in list.data" :key="list.data.indexOf(piece)" @click="linkView(piece)">
            <div class="layer" v-if="piece.releaseStatus"></div>
            <div class="mount" v-if="piece.releaseStatus"><span>昨日</span>{{ piece.lastdayCoverted }}<span>人完成旅程</span></div>
            <div class="title">{{ piece.journeyName }}</div>
            <div class="people"><i class="icon fa fa-user logo"></i>{{ piece.groupName }}</div>
            <div class="status"><i class="icon fa fa-check i-correct" v-if="piece.releaseStatus"></i><i class="icon fa fa-clipboard" v-if="!piece.releaseStatus"></i>{{ piece.releaseStatus ? "已发布" : "草稿" }}</div>
            <div class="point">{{ piece.description }}</div>
          </li>
        </ol>
        <button><i class="icon fa fa-plus-square create"></i>创建旅程</button>
      </div>
    </div>
    <div class="seen-btn">
      <i class="icon fa fa-angle-right right" @click="callSeen()" v-show="!seen"></i>
    </div>
  </div>
</template>
<script>
import httpProxy from '../../test/httpProxy';
import api from '../../constants/api';

export default {
  name: 'second-menu',
  props: ['mainMenu'],
  data () {
    return {
      topBcnSecond: this.GLOBAL.bcn.second,
      callMenuClassName: '',
      seen: true,
      list: {}
    }
  },
  watch: {
    mainMenu: {
      deep: true,
      handler (val) {
        this.fetch()
      }
    }
  },
  mounted () {
    this.getJourneyList()
  },
  methods: {
    async getJourneyList() {
      const url = api.WEB.JOURNEY_LIST;
      const response = await httpProxy.request(url);
      this.list = response;
    },
    linkView(piece) {
      if(piece.releaseStatus) {
        this.callSeen()
        this.$router.push({
          path: '/journey/view/',
          query: {
            id: piece.journeyId,
            name: piece.journeyName
          }
        })
      }
    },
    callSeen() {
      this.seen = !this.seen
      if (this.seen) {
        this.callMenuClassName = ''
      } else {
        this.callMenuClassName = 'min'
      }
      this.$emit("watchSecondMenu",this.seen)
    }
  }
}
</script>
