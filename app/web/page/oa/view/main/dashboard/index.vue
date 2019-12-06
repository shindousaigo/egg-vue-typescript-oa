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
            {{ status[component] ? `${status[component]}` : `处理中心` }}
          </el-badge>
        </template>
        <el-menu-item
          :index="[DashboardBase, DashboardWorkProcess].join(Separator)"
          :route="{
            path: [DashboardBase, DashboardWorkProcess].join(Separator)
          }"
        >
          {{ status[DashboardWorkProcess] }}
        </el-menu-item>
        <el-menu-item
          :index="[DashboardBase, DashboardWorkWait].join(Separator)"
          :route="{ path: [DashboardBase, DashboardWorkWait].join(Separator) }"
        >
          {{ status[DashboardWorkWait] }}
        </el-menu-item>
        <el-menu-item
          :index="[DashboardBase, DashboardWorkOver].join(Separator)"
          :route="{ path: [DashboardBase, DashboardWorkOver].join(Separator) }"
        >
          {{ status[DashboardWorkOver] }}
        </el-menu-item>
        <el-menu-item
          :index="[DashboardBase, DashboardWorkAll].join(Separator)"
          :route="{ path: [DashboardBase, DashboardWorkAll].join(Separator) }"
        >
          {{ status[DashboardWorkAll] }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item
        :index="[DashboardBase, DashboardAttendance].join(Separator)"
        :route="{ path: [DashboardBase, DashboardAttendance].join(Separator) }"
      >
        考勤系统
      </el-menu-item>
      <el-menu-item
        :index="[DashboardBase, DashboardUserinfo].join(Separator)"
        :route="{ path: [DashboardBase, DashboardUserinfo].join(Separator) }"
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
  DashboardComponentRegex,
  MatchSymbol
} from "../../../router/const";

@Component<Dashboard>({
  mounted() {
    this.$state_route_path();
  }
})
export default class Dashboard extends Vue {
  get component() {
    return Object.keys(
      this.$router.currentRoute.matched.find(({ path }) =>
        path.endsWith(MatchSymbol + DashboardComponentRegex)
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
    left: 0;
    top: 80px;
    width: 100%;
    min-width: 1080px;
    bottom: 14px;
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    box-sizing: border-box;
    padding-left: 40px;
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
