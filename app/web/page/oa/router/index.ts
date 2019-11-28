import Vue from 'vue';
import VueRouter from 'vue-router';
import { DashboardView, ApprovalView, BackstageView, AsideView, HeaderView, DashboardWorkView, DashboardAttendanceView, DashBoardUserinfoView } from "./vues";
import { DashBoardBase, DashBoardWorkAll, DashBoardWorkRegex, DashBoardAttendance, OtherRegex, Separator, BackstageBase, OaBase, DashBoardUserinfo } from "./const";

Vue.use(VueRouter);

function components(component: any): any {
  return {
    default: () => component,
    aside: () => AsideView,
    header: () => HeaderView,
  }
}
const DashboardConfig = {
  path: DashBoardBase,
  redirect: DashBoardBase + DashBoardWorkAll,
  components: components(DashboardView),
  children: [
    {
      path: DashBoardWorkRegex,
      component: () => DashboardWorkView,
    },
    {
      path: DashBoardAttendance,
      component: () => DashboardAttendanceView,
    },
    {
      path: DashBoardUserinfo,
      component: () => DashBoardUserinfoView,
    },
    {
      path: OtherRegex,
      redirect: DashBoardBase + DashBoardWorkAll,
    },
  ]
}
const ApprovalConfig = {
  path: '/approval/:component',
  components: components(ApprovalView)
}
const BackstageConfig = {
  path: BackstageBase,
  redirect: '/backstage/user-table',
  components: components(BackstageView),
  children: [
    {
      name: 'user-table',
      path: 'user-table',
      component: () => import('web/page/oa/components/user_table.vue'),
    },
    {
      path: 'leave-info-table',
      component: () => import('web/page/oa/components/leave_info_table.vue'),
    },
    {
      path: 'user-edit/:userid',
      component: () => import('web/page/oa/components/user_edit.vue'),
    },
    {
      path: OtherRegex,
      redirect: '/backstage/user-table',
    }
  ]
}

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: OaBase,
    routes: [
      DashboardConfig,
      ApprovalConfig,
      BackstageConfig,
      {
        path: OtherRegex,
        redirect: DashBoardBase,
      },
    ]
  })
}
