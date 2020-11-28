<!--
 * @Author: wuyulong
 * @Date: 2020-02-11 18:01:26
 * @LastEditTime: 2020-04-28 17:40:54
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/dashboard/index.vue
 -->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'


export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, jfUpload},
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
