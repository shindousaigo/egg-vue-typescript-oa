import Vue from 'vue';
import VueRouter from 'vue-router';
import { DashboardView, ApprovalView, BackstageView, AsideView, HeaderView, DashboardWorkView, DashboardAttendanceView, DashboardUserinfoView, BackstageUserTableView, BackstageLeaveInfoTableView, BackstageUserEditView, BackstageDepartmentTreeView, ApprovalAttendanceView, ApprovalDemandView, NotFoundView, ApprovalApplicationDetailView, ApprovalOvertimeView, ApprovalLeaveView } from "./vues";
import { Const } from "./const";

Vue.use(VueRouter);

function components(component: any, base = Const.OaBase): any {
  return {
    [Const.OaBase]: {
      default: () => component,
      aside: () => AsideView,
      header: () => HeaderView,
    },
    [Const.BackstageBase]: {
      default: () => component,
      tree: () => BackstageDepartmentTreeView
    },
  }[base]
}

const DashboardConfig = {
  path: Const.DashboardBase,
  components: components(DashboardView),
  children: [
    {
      path: '',
      redirect: [Const.DashboardBase, Const.DashboardWorkAll].join(Const.Separator),
    },
    {
      path: Const.MatchSymbol + Const.DashboardComponentRegex,
      components: {
        [Const.DashboardWorkAll]: () => DashboardWorkView,
        [Const.DashboardWorkProcess]: () => DashboardWorkView,
        [Const.DashboardWorkWait]: () => DashboardWorkView,
        [Const.DashboardWorkOver]: () => DashboardWorkView,
        [Const.DashboardUserinfo]: () => DashboardUserinfoView,
        [Const.DashboardAttendance]: () => DashboardAttendanceView,
        [Const.NotFound]: () => NotFoundView,
      }
    },
  ]
}
const ApprovalConfig = {
  path: Const.ApprovalBase,
  components: components(ApprovalView),
  children: [
    {
      name: Const.ApprovalApplicationDetail,
      path: Const.ApprovalApplicationDetail,
      component: () => ApprovalApplicationDetailView,
      children: [
        {
          name: Const.ApprovalApplicationDetail,
          path: [Const.MatchSymbol + Const.ApprovalApplicationDetailComponentRegex, Const.MatchSymbol + Const.ApprovalApplicationDetailSerialNumberRegex].join(Const.Separator),
          component: () => ApprovalApplicationDetailView
        }
      ]
    },
    {
      path: Const.MatchSymbol + Const.ApprovalComponentRegex,
      components: {
        [Const.NotFound]: () => NotFoundView,
        [Const.ApprovalAttendance]: () => ApprovalAttendanceView,
        [Const.ApprovalDemand]: () => ApprovalDemandView,
        [Const.ApprovalOvertime]: () => ApprovalOvertimeView,
        [Const.ApprovalLeave]: () => ApprovalLeaveView,
      }
    }
  ]
}
const BackstageConfig = {
  path: Const.BackstageBase,
  redirect: [Const.BackstageBase, Const.BackstageUserTable].join(Const.Separator),
  components: components(BackstageView),
  children: [
    {
      name: Const.BackstageUserTable,
      path: Const.BackstageUserTable,
      components: components(BackstageUserTableView, Const.BackstageBase),
    },
    {
      path: Const.BackstageLeaveInfoTable,
      components: components(BackstageLeaveInfoTableView, Const.BackstageBase),
    },
    {
      path: Const.BackstageUserEdit + Const.Separator + Const.MatchSymbol + Const.BackstageUseridRegex,
      components: components(BackstageUserEditView, Const.BackstageBase),
    },
    {
      path: Const.OtherRegex,
      redirect: [Const.BackstageBase, Const.BackstageUserTable].join(Const.Separator),
    }
  ]
}

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: Const.OaBase,
    routes: [
      DashboardConfig,
      ApprovalConfig,
      BackstageConfig,
      {
        path: Const.OtherRegex,
        redirect: Const.DashboardBase,
      },
    ]
  })
}
