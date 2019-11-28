<template>
  <div class="dashboard">
    <el-menu
      ref="menu"
      :router="true"
      class="el-menu"
      mode="horizontal"
      menu-trigger="click"
    >
      <el-submenu :index="DashBoardBase" class="dashboard-submenu">
        <template slot="title">
          <el-badge
            :value="workWaitCount"
            class="notification"
            :hidden="workWaitCount === 0"
          >
            {{
              $path.startsWith(`work`) ? `${textDictionary[$path]}` : `处理中心`
            }}
          </el-badge>
        </template>
        <el-menu-item
          :index="DashBoardBase + DashBoardWorkProcess"
          :route="{ path: DashBoardBase + DashBoardWorkProcess }"
        >
          {{ textDictionary[DashBoardWorkProcess] }}
        </el-menu-item>
        <el-menu-item
          :index="DashBoardBase + DashBoardWorkWait"
          :route="{ path: DashBoardBase + DashBoardWorkWait }"
        >
          {{ textDictionary[DashBoardWorkWait] }}
        </el-menu-item>
        <el-menu-item
          :index="`${DashBoardBase}${DashBoardWorkOver}`"
          :route="{ path: `${DashBoardBase}${DashBoardWorkOver}` }"
        >
          {{ textDictionary[DashBoardWorkOver] }}
        </el-menu-item>
        <el-menu-item
          :index="`${DashBoardBase}${DashBoardWorkAll}`"
          :route="{ path: `${DashBoardBase}${DashBoardWorkAll}` }"
        >
          {{ textDictionary[DashBoardWorkAll] }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item
        :index="`${DashBoardBase}${DashBoardAttendance}`"
        :route="{ path: `${DashBoardBase}${DashBoardAttendance}` }"
      >
        考勤系统
      </el-menu-item>
      <el-menu-item
        :index="`${DashBoardBase}${DashBoardUserinfo}`"
        :route="{ path: `${DashBoardBase}${DashBoardUserinfo}` }"
      >
        用户信息
      </el-menu-item>
    </el-menu>

    <router-view class="router-view"></router-view>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  DashBoardWorkProcess,
  DashBoardWorkOver,
  DashBoardWorkWait,
  DashBoardWorkAll
} from "../../router/const";

@Component<Dashboard>({
  mounted() {
    this.$state_route_path();
  }
})
export default class Dashboard extends Vue {
  get $path() {
    return this.$state.route.path.split(`/`).splice(-1)[0] || "";
  }
  @Watch("$state.route.path")
  $state_route_path() {
    const activeIndex = this.$state.route.path;
    this.$refs.menu["activeIndex"] = activeIndex;
  }
  textDictionary = {
    [DashBoardWorkProcess]: "正在办理",
    [DashBoardWorkWait]: "等待办理",
    [DashBoardWorkOver]: "完成办理",
    [DashBoardWorkAll]: "全部办理"
  };
  get workWaitCount() {
    return this.$getters.user_approval_list_dictionary[DashBoardWorkWait].length;
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
