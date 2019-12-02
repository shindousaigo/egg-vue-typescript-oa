import Vue from 'vue';
import VueRouter from 'vue-router';
import { DashboardView, ApprovalView, BackstageView, AsideView, HeaderView, DashboardWorkView, DashboardAttendanceView, DashboardUserinfoView, BackstageUserTableView, BackstageLeaveInfoTableView, BackstageUserEditView, BackstageDepartmentTreeView, ApprovalAttendanceView, ApprovalDemandView, NotFoundView } from "./vues";
import { DashboardBase, DashboardWorkAll, DashboardAttendance, OtherRegex, Separator, BackstageBase, OaBase, DashboardUserinfo, BackstageUserTable, BackstageLeaveInfoTable, BackstageUserEdit, BackstageUserEditRegex, ApprovalAttendance, ApprovalBase, ApprovalDemand, ApprovalComponentRegex, NotFound, DashboardWorkProcess, DashboardWorkWait, DashboardWorkOver, DashboardComponentRegex } from "./const";

Vue.use(VueRouter);

function components(component: any, base = OaBase): any {
  return {
    [OaBase]: {
      default: () => component,
      aside: () => AsideView,
      header: () => HeaderView,
    },
    [BackstageBase]: {
      default: () => component,
      tree: () => BackstageDepartmentTreeView
    },
  }[base]
}

const DashboardConfig = {
  path: DashboardBase,
  components: components(DashboardView),
  children: [
    {
      path: '',
      redirect: DashboardBase + DashboardWorkAll,
    },
    {
      path: DashboardComponentRegex,
      components: {
        [DashboardWorkAll]: () => DashboardWorkView,
        [DashboardWorkProcess]: () => DashboardWorkView,
        [DashboardWorkWait]: () => DashboardWorkView,
        [DashboardWorkOver]: () => DashboardWorkView,
        [DashboardUserinfo]: () => DashboardUserinfoView,
        [DashboardAttendance]: () => DashboardAttendanceView,
        [NotFound]: () => NotFoundView,
      }
    },
  ]
}
const ApprovalConfig = {
  path: ApprovalBase,
  components: components(ApprovalView),
  children: [
    {
      path: ApprovalComponentRegex,
      components: {
        [NotFound]: () => NotFoundView,
        [ApprovalAttendance]: () => ApprovalAttendanceView,
        [ApprovalDemand]: () => ApprovalDemandView
      }
    }
  ]
}
const BackstageConfig = {
  path: BackstageBase,
  redirect: BackstageBase + BackstageUserTable,
  components: components(BackstageView),
  children: [
    {
      name: BackstageUserTable,
      path: BackstageUserTable,
      components: components(BackstageUserTableView, BackstageBase),
    },
    {
      path: BackstageLeaveInfoTable,
      components: components(BackstageLeaveInfoTableView, BackstageBase),
    },
    {
      path: BackstageUserEdit + Separator + BackstageUserEditRegex,
      components: components(BackstageUserEditView, BackstageBase),
    },
    {
      path: OtherRegex,
      redirect: BackstageBase + BackstageUserTable,
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
        redirect: DashboardBase,
      },
    ]
  })
}
