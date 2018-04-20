/*
 * @Author: yanghaotian
 * @Date: 2017-08-14 18:55:24
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-31 14:24:35
 */
<style lang="scss" scoped>
@import '~vars';
@import '~mixin';
  .top-menu {
    display: inline;
    .logo {
      float: left;
      height: 50px; width: 240px;
      background-color: rgba(0, 150, 136, 1.0);
      .box {
        position: relative;
        top: 8.5px;
        left: 16px;
        width: 29px; height: 29px;
        border: { radius: 50%; }
        background-color: rgba(0, 0, 0, 0.3);
        &:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.4);
        }
        .icon{
          position: relative;
          top: 6.75px;
          left: 6.5px;
          width: 16px; height: 16px;
          color: rgba(255,255,255,1);}
      }
      svg {
        fill: rgba(255,255,255,1);
        position: relative;
        left: 85px;
        top: -22px;
        height: 32px;
        width: 121px;
      }
    }
    .nav {
      position: relative;
      float: left;
      color: rgba($grey,1);
      height: 100%;
      @include flex-display;
      @include flex-align-items(center);
      margin-left: 16px;
      .icon {float: left; width: 18px; height: 18px; overflow: hidden;}
      .name {float: left; font-size: 14px; margin-left: 6px;}
      .link {cursor: pointer;}
      .link:hover {color: rgba($greyMedium,1);}
      .gt{float: left; margin-left: 6px; font-size: 14px;}
    }
    .carte {
      float: right;
      .ol {
        float: right;
        .li {
          float: right;
          cursor: pointer;
          .box {
            display: table-cell; vertical-align: middle; // set img vertical center
            width: 52px; height: 52px;
            &:hover { background-color: rgba(0,150,136,0.6); }
          }
          .menu {
            width: 50px; height: 50px;
            background-color: rgba(255,82,82,1.0);
            &:hover { background-color: rgba(255,82,82, 0.9); }
          }
          .line {
            border: {
              left: 1px solid ;
              color: rgba(255,255,255,0.3);
            }
          }
          .tip {
            line-height: 50px; // set img vertical center
            color: rgba(204,204,204,0.7);
            font-size: 12px;
            padding-right: 20px;
            cursor: default;
          }
          i {
            width: 52px; height: 52px;
            color: rgba(255,255,255,1);
            &:hover { background-color: rgba(0,150,136,0.6); }
          }
          img {
            clear: both;    // set
            display: block; // img
            margin:auto;    // horizontal center
          }
        }
      }
    }
  }
</style>
<template>
  <div class="top-menu">
    <div class="logo">
        <div class="box">
          <div class="icon fa" :class="left_menu.icon"></div>
        </div>

          <svg id="svg-logo" data-name="svg-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 30.92">
            <title>MC logo</title>
            <path d="M14.38,30.74a1.3,1.3,0,0,1-.31.12,1.3,1.3,0,0,0,.31-.12l9.79-5.65h0Z" transform="translate(0 -0.08)"/>
            <path d="M24.16,25.05l.18-.09h0l-.18.09Z" transform="translate(0 -0.08)"/>
            <path d="M24.47,24.9l-.31.19h0l.31-.19Z" transform="translate(0 -0.08)"/>
            <path d="M24.38,24.94l.47-.29-.47.29Z" transform="translate(0 -0.08)"/>
            <path d="M16.76,18.69h1.86v-5.4C18.62,11.8,17.74,11,16,11H9.64c-1.73,0-2.56.81-2.56,2.29v5.4H8.8v-5c0-.36.36-.53,1-.53h6c.64,0,1,.17,1,.53v5Z" transform="translate(0 -0.08)"/>
            <path d="M.64,23.7A2.06,2.06,0,0,1,0,22.62,1.83,1.83,0,0,0,.64,23.7Z" transform="translate(0 -0.08)"/>
            <polygon points="11.85 17.08 11.85 18.61 13.71 18.61 13.71 14.1 11.85 14.1 11.85 17.08"/>
            <path d="M0,22.62a1.2,1.2,0,0,1,0-.18A.81.81,0,0,0,0,22.62Z" transform="translate(0 -0.08)"/>
            <path d="M27.93,21.48l-.76,0a34.49,34.49,0,0,0-5.74.89L18.82,23a27.89,27.89,0,0,1-5.77.74,14.57,14.57,0,0,1-3.32-.37C8.15,23,7.43,21.31,6.37,21a5,5,0,0,1-3.12-2.48,4.73,4.73,0,0,1,0-4h0A5,5,0,0,1,3.5,14a4.91,4.91,0,0,1,1-1.2c.71-.62,1.57-.47,1.6-1.39A5.09,5.09,0,0,1,8.19,7.7a5.53,5.53,0,0,1,3.28-.92,6.58,6.58,0,0,1,1.7.27,3,3,0,0,1,.71.4c.85.59,2,1.56,2,1.56h0a4.58,4.58,0,0,1,1.82-.35,4.78,4.78,0,0,1,1.52.2,4,4,0,0,1,1.36.72s5.35,3.78.14,8.6A10.51,10.51,0,0,1,18,19.51a5.31,5.31,0,0,1-.89.71h0a19.29,19.29,0,0,0,2-.39,16.65,16.65,0,0,1,4-.47,18.75,18.75,0,0,1,4.08.44V8.57a1.78,1.78,0,0,0-.82-1.36L14.39.27a1.76,1.76,0,0,0-1.58,0L.82,7.2A1.72,1.72,0,0,0,.05,8.57v9.26a5.08,5.08,0,0,0,0,.64l0,4a1.2,1.2,0,0,0,0,.18A2.06,2.06,0,0,0,.64,23.7l.15.1,12,6.94a1.61,1.61,0,0,0,.79.19,1.61,1.61,0,0,1-.79-.19L.79,23.8l-.15-.1a5.29,5.29,0,0,0,1.74,1.09L11,30.16a3.47,3.47,0,0,0,4.37.06l8-4.62s.28-.21.77-.52l-9.79,5.65a1.3,1.3,0,0,1-.31.12,1.3,1.3,0,0,0,.31-.12l9.79-5.65.31-.19h0l-.31.19.89-.51.35-.19h0l.19-.11a16.48,16.48,0,0,1,7.34-2h0A14.27,14.27,0,0,0,27.93,21.48ZM24.35,25l-.18.09h0l.18-.09Zm0,0h0l.47-.29Z" transform="translate(0 -0.08)"/>
            <path d="M32.94,22.29h0Z" transform="translate(0 -0.08)"/>
            <polygon points="33 22.21 33 22.21 33 22.21 33 22.21"/>
            <circle cx="24.16" cy="25.09" transform="translate(-9.49 16.03) rotate(-31.14)"/>
            <path d="M36,16l2-.43V11.38h-1.7V10.32h1.7V6.78H36V5.72h4.88V6.78H39v3.54h1.59v1.06H39v4l1.88-.45q0,.33,0,1.19-1.91.43-4.7,1.12Zm5.42-3.72h2.87q.19-.72.35-1.4H41.06v-1h9.72v1h-5l-.46,1.4h4.86V17q0,1.82-1.64,1.82l-1.24,0q-.08-.45-.18-.91h-.64V13.31H45v4.78H44V13.31h-1.5V19H41.38ZM48.61,9V8.61h-7V5.32h1.1V7.59h2.38V4.35h1.1V7.59h2.38V5.32h1.1V9Zm-.19,8.74q.69,0,.68-.82V13.31H47.53V17.7A6.08,6.08,0,0,0,48.42,17.78Z" transform="translate(0 -0.08)"/>
            <path d="M51.83,6.91h6.25v-1H52.9v-1H64.24v1h-5v1h6.27V9.62H64.35V7.86H59.21v4.2H58.08V7.86H53V9.62H51.83Zm.63,10.45H63.28V16H53V15H63.28V13.67H52.63v-1H64.38V19h-1.1v-.6H52.45Zm1.37-8.52h3.41v.89H53.82Zm0,1.88h3.41v.89H53.82Zm6.24-1.88h3.42v.89H60.06Zm0,1.88h3.42v.89H60.06Z" transform="translate(0 -0.08)"/>
            <path d="M75.65,4.32h1.09V5.54H81.2v1H76.73v.89H75.65V6.52H72.12v.89H71V6.52H66.63v-1H71V4.32h1.09V5.54h3.53Zm-8.58,3.5H80.71v2.72H79.58V8.8H68.2v1.74H67.07Zm1.25,6.67H79.46V19H78.33v-.75H69.45V19H68.32ZM69.39,9.9h9v3.72H77.25v-.34H70.53v.34H69.39Zm8.93,5.51H69.45v1.95h8.87Zm-1.07-4.59H70.53v1.53h6.73Z" transform="translate(0 -0.08)"/>
            <path d="M81.72,8.95A18.31,18.31,0,0,0,84,4.35l1.12.37q-.4,1-.86,1.92H87v1H83.76A24.07,24.07,0,0,1,82.35,10,8.71,8.71,0,0,0,81.72,8.95Zm5.21,6.77A9.69,9.69,0,0,0,87,17q-1,.46-2.22,1.22a3,3,0,0,0-.63.51l-.79-1a1.44,1.44,0,0,0,.48-1.12V13.3h-2v-1h2v-2h-1v-1h3.8v1H84.94v2H87v1H84.94v3.54Q86,16.26,86.93,15.72ZM87,5.44l.82-.63A25.38,25.38,0,0,1,90,7.19L89,8A27.94,27.94,0,0,0,87,5.44ZM88.61,19H87.53V8.59h3.41V4.36h1.15V8.59h3.56v8.63Q95.64,19,94,19q-.83,0-2.37,0-.09-.55-.21-1.22,1.4.09,2.13.09,1,0,1-.83V15.53H88.61Zm5.94-9.3H88.61v1.83h5.94Zm-5.94,4.75h5.94V12.61H88.61ZM93,7.39a26.9,26.9,0,0,0,2.05-2.53l1,.74q-.91,1.1-2.23,2.49Z" transform="translate(0 -0.08)"/>
            <path d="M106.71,12.52q2.2,2.46,4.38,5.21l-1.12.83q-.54-.74-1.07-1.44-5.34.19-9,.42a7.43,7.43,0,0,0-1.21.24l-.59-1.37a4.4,4.4,0,0,0,1.49-1.15,33.83,33.83,0,0,0,3-4.2H97.16V10h14.56v1.1h-7.58a62.33,62.33,0,0,1-3.86,5.26q5.08-.13,7.82-.24-1.18-1.51-2.37-2.92ZM98.54,5.41h11.78v1.1H98.54Z" transform="translate(0 -0.08)"/>
            <path d="M40,27H38.9l-.71-1.17a1.8,1.8,0,0,0-.36-.47.49.49,0,0,0-.3-.1h-.29V27h-1v-4.5h1.58q1.61,0,1.61,1.22a1.2,1.2,0,0,1-.27.79,1.43,1.43,0,0,1-.74.46h0a1.59,1.59,0,0,1,.69.69Zm-2.76-3.77v1.3h.47a.75.75,0,0,0,.54-.2.65.65,0,0,0,.2-.49q0-.61-.73-.61Z" transform="translate(0 -0.08)"/>
            <path d="M44.08,25.09q0,2-1.87,2t-1.81-2V22.52h1v2.62q0,1.13.89,1.12t.87-1.08V22.52h1Z" transform="translate(0 -0.08)"/>
            <path d="M46,22.52V27h-1v-4.5Z" transform="translate(0 -0.08)"/>
            <path d="M50.68,27H49.54l-.81-1.49a1.27,1.27,0,0,1-.09-.29h0a2.11,2.11,0,0,1-.1.3L47.71,27H46.56L48,24.77l-1.32-2.25h1.17l.67,1.38a2.27,2.27,0,0,1,.14.37h0c0-.12.09-.25.15-.39l.74-1.36h1.07l-1.36,2.23Z" transform="translate(0 -0.08)"/>
            <path d="M54.86,25.09q0,2-1.87,2t-1.81-2V22.52h1v2.62q0,1.13.89,1.12t.87-1.08V22.52h1Z" transform="translate(0 -0.08)"/>
            <path d="M58.52,27H55.85v-4.5h2.56v.78h-1.6v1.06H58.3v.78H56.81v1.09h1.71Z" transform="translate(0 -0.08)"/>
            <path d="M65.15,27V24.29q0-.38,0-1h0a5.19,5.19,0,0,1-.14.58L63.92,27h-.77L62,23.95a6,6,0,0,1-.14-.61h0q0,.57,0,1.14V27H61v-4.5h1.4l1,2.72a3.3,3.3,0,0,1,.17.63h0a6.56,6.56,0,0,1,.19-.64l1-2.72H66.1V27Z" transform="translate(0 -0.08)"/>
            <path d="M71.06,27H70l-.34-1H68l-.33,1h-1l1.65-4.5h1.13Zm-1.61-1.77-.51-1.56a1.7,1.7,0,0,1-.07-.39h0a1.65,1.65,0,0,1-.08.38l-.51,1.57Z" transform="translate(0 -0.08)"/>
            <path d="M75.34,27H74.24l-.71-1.17a1.8,1.8,0,0,0-.36-.47.49.49,0,0,0-.3-.1h-.29V27h-1v-4.5H73.2q1.61,0,1.61,1.22a1.2,1.2,0,0,1-.27.79,1.43,1.43,0,0,1-.74.46h0a1.59,1.59,0,0,1,.69.69Zm-2.76-3.77v1.3h.47a.75.75,0,0,0,.54-.2.65.65,0,0,0,.2-.49q0-.61-.73-.61Z" transform="translate(0 -0.08)"/>
            <path d="M79.45,27H78.24l-1.36-2a1.36,1.36,0,0,1-.12-.24h0V27h-1v-4.5h1v2.13h0a2.1,2.1,0,0,1,.13-.24l1.29-1.89h1.15l-1.61,2.15Z" transform="translate(0 -0.08)"/>
            <path d="M82.57,27H79.91v-4.5h2.56v.78h-1.6v1.06h1.49v.78H80.87v1.09h1.71Z" transform="translate(0 -0.08)"/>
            <path d="M86.47,23.3H85.18V27h-1V23.3H82.94v-.78h3.53Z" transform="translate(0 -0.08)"/>
            <path d="M88,22.52V27h-1v-4.5Z" transform="translate(0 -0.08)"/>
            <path d="M93.08,27h-1l-1.91-2.91a3.45,3.45,0,0,1-.22-.37h0c0,.16,0,.39,0,.72V27h-.91v-4.5h1L92,25.35l.22.36h0a4.32,4.32,0,0,1,0-.62V22.52h.91Z" transform="translate(0 -0.08)"/>
            <path d="M97.79,26.72a3.2,3.2,0,0,1-1.62.38,2.33,2.33,0,0,1-1.7-.6,2.2,2.2,0,0,1-.62-1.65,2.31,2.31,0,0,1,.68-1.73,2.47,2.47,0,0,1,1.8-.67,3.55,3.55,0,0,1,1.26.2v.91a2.51,2.51,0,0,0-1.28-.3,1.39,1.39,0,0,0-1.06.42,1.8,1.8,0,0,0,0,2.22,1.29,1.29,0,0,0,1,.4,1.4,1.4,0,0,0,.61-.12v-.92h-.91v-.77h1.87Z" transform="translate(0 -0.08)"/>
            <path d="M103.67,26.86a2.92,2.92,0,0,1-1.28.24,2.16,2.16,0,0,1-1.61-.61,2.22,2.22,0,0,1-.6-1.62,2.38,2.38,0,0,1,.67-1.75,2.31,2.31,0,0,1,1.72-.68,3.11,3.11,0,0,1,1.1.17v.93a2,2,0,0,0-1-.27,1.38,1.38,0,0,0-1.06.42,1.55,1.55,0,0,0-.4,1.1,1.51,1.51,0,0,0,.38,1.07,1.32,1.32,0,0,0,1,.4,2.12,2.12,0,0,0,1.1-.29Z" transform="translate(0 -0.08)"/>
            <path d="M107.11,27h-2.64v-4.5h1v3.72h1.68Z" transform="translate(0 -0.08)"/><path d="M107.27,24.83a2.43,2.43,0,0,1,.62-1.72,2.12,2.12,0,0,1,1.63-.66,2,2,0,0,1,1.55.64,2.35,2.35,0,0,1,.59,1.65,2.41,2.41,0,0,1-.61,1.71,2.28,2.28,0,0,1-3.18,0A2.28,2.28,0,0,1,107.27,24.83Zm1-.05a1.73,1.73,0,0,0,.32,1.07,1,1,0,0,0,.87.42,1.05,1.05,0,0,0,.88-.4,1.69,1.69,0,0,0,.31-1.07,1.82,1.82,0,0,0-.3-1.11,1,1,0,0,0-.86-.41,1.06,1.06,0,0,0-.89.42A1.72,1.72,0,0,0,108.28,24.78Z" transform="translate(0 -0.08)"/>
            <path d="M116.06,25.09q0,2-1.87,2t-1.81-2V22.52h1v2.62q0,1.13.89,1.12t.87-1.08V22.52h1Z" transform="translate(0 -0.08)"/>
            <path d="M117,27v-4.5h1.55q2.4,0,2.4,2.19a2.2,2.2,0,0,1-.67,1.68,2.43,2.43,0,0,1-1.73.63Zm1-3.72v2.93h.52a1.42,1.42,0,0,0,1.07-.41,1.53,1.53,0,0,0,.39-1.1,1.36,1.36,0,0,0-.41-1,1.49,1.49,0,0,0-1.06-.38Z" transform="translate(0 -0.08)"/>
          </svg>
    </div>
    <div class="nav">
      <div v-if="topBcn.root.show">
        <div class="icon fa" :class="topBcn.root.icon"></div>
        <div class="name"
        :class="topBcn.root.nameClass"
        @click="pageLink(topBcn.root.link)">{{topBcn.root.name}}</div>
      </div>
      <div v-if="topBcn.second.show">
        <div class="gt">&gt;</div>
        <div class="name"
        :class="topBcn.second.nameClass"
        @click="pageLink(topBcn.second.link)">{{topBcn.second.name}}</div>
      </div>
      <div v-if="topBcn.third.show">
        <div class="gt">&gt;</div>
        <div class="name"
        :class="topBcn.third.nameClass"
        @click="pageLink(topBcn.third.link)">{{topBcn.third.name}}</div>
      </div>
    </div>
    <div class="carte">
      <ol class="ol">
        <li class="li">
          <div class="box menu">
            <img :src="icons.app_icon" />
          </div>
        </li>
        <li class="li">
          <div class="box line">
            <img :src="icons.user_profile" />
          </div>
        </li>
        <li class="li">
          <i class="icon fa line" :class="icons.cog"></i>
        </li>
        <li class="li">
          <i class="icon fa line" :class="icons.question"></i>
        </li>
        <li class="li">
          <i class="icon fa line" :class="icons.envelope"></i>
        </li>
        <li class="li">
          <i class="icon fa line" :class="icons.home"></i>
        </li>
        <li class="li">
          <div class="box line">
            <img :src="icons.full_screen" />
          </div>
        </li>
        <li class="li">
          <div class="tip">
            欢迎使用瑞雪营销云！
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
export default {
  name: 'top-menu',
  data () {
    return {
      topBcn: this.GLOBAL.bcn,
      left_menu: {
        icon: 'fa-bars'
      },
      icons: {
        app_icon: require('../../assets/img/app-icon.png'),
        full_screen: require('../../assets/img/full-screen.png'),
        user_profile: require('../../assets/img/user-profile.png'),
        home: 'fa-home',
        envelope: 'fa-envelope-o',
        cog: 'fa-cog',
        question: 'fa-question'
      }
    }
  },
  mounted () {},
  watch: {
    topBcn: {
      deep: true,
      handler (val) {
        if (val.root.icon&&val.root.name)
          {this.rootBcn(val.root)}
          else {
            this.topBcn.root.show = false
            this.topBcn.root.icon = ''
            this.topBcn.root.name = ''
            this.topBcn.root.nameClass = ''
          }
        if (val.second.name)
          {this.secondBcn(val.second)}
          else {
            this.topBcn.second.show = false
            this.topBcn.second.icon = ''
            this.topBcn.second.name = ''
            this.topBcn.second.nameClass = ''
          }
      }
    }
  },
  methods: {
    rootBcn (val) {
      this.topBcn.root.show = true
      if (this.topBcn.root.link) {
        this.topBcn.root.nameClass = 'link'
      } else {
        this.topBcn.root.nameClass = ''
      }
    },
    secondBcn (val) {
      this.topBcn.second.show = true
      if (this.topBcn.second.link) {
        this.topBcn.second.nameClass = 'link'
      } else {
        this.topBcn.second.nameClass = ''
      }
    },
    thirdBcn (val) {
      //三级面包屑
    },
    pageLink (link) {
      console.log('跳转地址')
      console.log(link)
    }
  }
}
</script>

