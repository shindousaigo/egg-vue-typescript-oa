<template>
  <div class="dashboard">
    <el-menu
      ref="menu"
      :router="true"
      class="el-menu"
      mode="horizontal"
      menu-trigger="click"
    >
      <el-submenu :index="DashboardBase" class="dashboard-submenu">
        <template slot="title">
          <el-badge
            :value="workWaitCount"
            class="notification"
            :hidden="workWaitCount === 0"
          >
            {{ status[$path] ? `${status[$path]}` : `处理中心` }}
          </el-badge>
        </template>
        <el-menu-item
          :index="DashboardBase + DashboardWorkProcess"
          :route="{ path: DashboardBase + DashboardWorkProcess }"
        >
          {{ status[DashboardWorkProcess] }}
        </el-menu-item>
        <el-menu-item
          :index="DashboardBase + DashboardWorkWait"
          :route="{ path: DashboardBase + DashboardWorkWait }"
        >
          {{ status[DashboardWorkWait] }}
        </el-menu-item>
        <el-menu-item
          :index="`${DashboardBase}${DashboardWorkOver}`"
          :route="{ path: `${DashboardBase}${DashboardWorkOver}` }"
        >
          {{ status[DashboardWorkOver] }}
        </el-menu-item>
        <el-menu-item
          :index="`${DashboardBase}${DashboardWorkAll}`"
          :route="{ path: `${DashboardBase}${DashboardWorkAll}` }"
        >
          {{ status[DashboardWorkAll] }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item
        :index="`${DashboardBase}${DashboardAttendance}`"
        :route="{ path: `${DashboardBase}${DashboardAttendance}` }"
      >
        考勤系统
      </el-menu-item>
      <el-menu-item
        :index="`${DashboardBase}${DashboardUserinfo}`"
        :route="{ path: `${DashboardBase}${DashboardUserinfo}` }"
      >
        用户信息
      </el-menu-item>
    </el-menu>

    <router-view class="router-view" :name="component"></router-view>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  DashboardWorkProcess,
  DashboardWorkOver,
  DashboardWorkWait,
  DashboardWorkAll,
  ApprovalBase,
  NotFound,
  DashboardBase,
  DashboardComponentRegex
} from "../../../router/const";

@Component<Dashboard>({
  mounted() {
    this.$state_route_path();
  }
})
export default class Dashboard extends Vue {
  get component() {
    return Object.keys(
      this.$router.currentRoute.matched.find(
        item => item.path === DashboardBase + DashboardComponentRegex
      ).components
    ).includes(this.$state.route.params.component)
      ? this.$state.route.params.component
      : NotFound;
  }
  @Watch("$state.route.path")
  $state_route_path() {
    const activeIndex = this.$state.route.path;
    this.$refs.menu["activeIndex"] = activeIndex;
  }
  status = {
    [DashboardWorkProcess]: "正在办理",
    [DashboardWorkWait]: "等待办理",
    [DashboardWorkOver]: "完成办理",
    [DashboardWorkAll]: "全部办理"
  };
  get workWaitCount() {
    return this.$getters.user_approval_list_dictionary[DashboardWorkWait]
      .length;
  }
}
</script>
<style scoped lang="scss">
.dashboard {
  position: relative;
  padding: 16px 0 0 32px;
  display: flex;
  flex-direction: column;
  .el-menu {
    width: 1000px;
  }
  .router-view {
    position: absolute;
    left: 32 + 8px;
    bottom: 14px;
    right: 0;
    top: 80px;
    overflow: auto;
  }
  .dashboard-submenu {
    .notification {
      line-height: 20px;
    }
  }
}
</style>
<style lang="scss">
.dashboard {
  .dashboard-submenu {
    .notification {
      .el-badge__content {
        position: static;
        transform: translate(0, -50%);
      }
    }
  }
}
</style>
