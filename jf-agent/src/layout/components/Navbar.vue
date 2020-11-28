<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div class="index-header">
          <div class="index-header_item">
            <img src="./image/icon_nav_user.png" alt />
            欢迎登陆，(8663564265)河北卡钦服务商
          </div>
          <div class="index-header_item">
            <img src="./image/icon_nav_bell.png" alt />
            <!-- <router-link :to="{name:'business-notice'}">
              系统公告
              <span class="blue">（{{unreadMsgCount}}）</span>
            </router-link> -->
          </div>
          <div class="index-header_item" @click="logout">
            <img src="./image/icon_nav_quit.png" alt />
            安全退出
          </div>
        </div>
        <!-- 为修改成 导航栏-陆萌V0.1 注释此段20200507 -->
        <!-- <div class="index-header">
          <div class="index-brand">
            品牌：
            <el-select v-model="chooseBrand" size="mini">
              <el-option v-for="(i,index) in brandArray" :key="index" :value="i.name">{{ i.name }}</el-option>
            </el-select>
          </div>
          <div class="index-user">
            <img src="./image/icon_homepage_user@3x.png" alt />
            河北卡钦服务商
          </div>
        </div>-->

        <!-- <search id="header-search" class="right-menu-item" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->
        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>-->
      </template>
      <!-- 为修改成 导航栏-陆萌V0.1 注释此段20200507 -->
      <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>返回首页</el-dropdown-item>
          </router-link>
          <a href="javascript:;" id="JFPMOUTQQ">
            <el-dropdown-item>在线客服</el-dropdown-item>
          </a>
          <router-link to="/common-use/feedBack">
            <el-dropdown-item>意见反馈</el-dropdown-item>
          </router-link>
          <router-link to="/common-use/modify-password">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">安全退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      unreadMsgCount: 12,
      brandArray: [
        {
          value: "DIANPAY",
          name: "点付"
        },
        {
          value: "QUPAY-T",
          name: "趣付传统"
        },
        {
          value: "QUPAY-D",
          name: "趣付电签"
        },
        {
          value: "KSHUA",
          name: "开刷"
        }
      ],
      chooseBrand: ""
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
// <!-- 为修改成 导航栏-陆萌V0.1 注释此段20200507 -->
// 新增
.index-header {
  margin-right: 15px;
  display: flex;
  align-items: center;
  .index-header_item {
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin-left: 16px;
    display: flex;
    align-items: center;
    .blue {
      color: #409eff;
    }
    img {
      margin-right: 4px;
    }
  }
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    // line-height: 50px;
    display: flex;
    // <!-- 为修改成 导航栏-陆萌V0.1 注释此段20200507 -->
    // .index-header {
    //   height: 100%;
    //   display: flex;
    //   align-items: center;
    //   .index-brand {
    //     height: 100%;
    //     display: flex;
    //     align-items: center;
    //     font-size: 14px;
    //     color: rgba(0, 0, 0, 0.65);
    //     .el-select {
    //       width: 120px;
    //     }
    //   }
    //   .index-user {
    //     height: 100%;
    //     display: flex;
    //     align-items: center;
    //     font-size: 14px;
    //     color: rgba(0, 0, 0, 0.65);
    //     margin-left: 21px;
    //     margin-right: 18px;
    //     img {
    //       width: 24px;
    //       height: 24px;
    //       margin-right: 8px;
    //     }
    //   }
    // }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    //   <!-- 为修改成 导航栏-陆萌V0.1 注释此段20200507 -->
    // .avatar-container {
    //   margin-right: 30px;
    //   display: flex;
    //   align-items: center;
    //   .avatar-wrapper {
    //     // margin-top: 5px;
    //     position: relative;
    //     .user-avatar {
    //       cursor: pointer;
    //       width: 24px;
    //       height: 24px;
    //       border-radius: 3px;
    //     }

    //     .el-icon-caret-bottom {
    //       cursor: pointer;
    //       // position: absolute;
    //       // right: -20px;
    //       // top: 0;
    //       font-size: 12px;
    //     }
    //   }
    // }
  }
}
</style>
