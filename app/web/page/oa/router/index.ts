import Vue from 'vue';
import VueRouter from 'vue-router';
import { View } from "./view";
import { Const } from "./const";

Vue.use(VueRouter);

function components(component: any, base = Const.OaBase): any {
  return {
    [Const.OaBase]: {
      default: () => component,
      aside: () => View.AsideView,
      header: () => View.HeaderView,
    },
    [Const.BackstageBase]: {
      default: () => component,
      tree: () => View.BackstageDepartmentTreeView
    },
  }[base]
}

const DashboardConfig = {
  path: Const.DashboardBase,
  components: components(View.DashboardView),
  children: [
    {
      path: '',
      redirect: [Const.DashboardBase, Const.DashboardWorkAll].join(Const.Separator),
    },
    {
      path: Const.MatchSymbol + Const.DashboardComponentRegex,
      components: {
        [Const.DashboardWorkAll]: () => View.DashboardWorkView,
        [Const.DashboardWorkProcess]: () => View.DashboardWorkView,
        [Const.DashboardWorkWait]: () => View.DashboardWorkView,
        [Const.DashboardWorkOver]: () => View.DashboardWorkView,
        [Const.DashboardUserinfo]: () => View.DashboardUserinfoView,
        [Const.DashboardAttendance]: () => View.DashboardAttendanceView,
        [Const.NotFound]: () => View.NotFoundView,
      }
    },
  ]
}
const ApprovalConfig = {
  path: Const.ApprovalBase,
  components: components(View.ApprovalView),
  children: [
    {
      name: Const.ApprovalApplicationDetail,
      path: Const.ApprovalApplicationDetail,
      component: () => View.ApprovalApplicationDetailView,
      children: [
        {
          name: Const.ApprovalApplicationDetail,
          path: [Const.MatchSymbol + Const.ApprovalApplicationDetailComponentRegex, Const.MatchSymbol + Const.ApprovalApplicationDetailSerialNumberRegex].join(Const.Separator),
          component: () => View.ApprovalApplicationDetailView
        }
      ]
    },
    {
      path: Const.MatchSymbol + Const.ApprovalComponentRegex,
      components: Object.assign({
        [Const.NotFound]: () => View.NotFoundView,
      }, View.ApprovalApplication.Views)
    }
  ]
}
const BackstageConfig = {
  path: Const.BackstageBase,
  redirect: [Const.BackstageBase, Const.BackstageUserTable].join(Const.Separator),
  components: components(View.BackstageView),
  children: [
    {
      name: Const.BackstageUserTable,
      path: Const.BackstageUserTable,
      components: components(View.BackstageUserTableView, Const.BackstageBase),
    },
    {
      path: Const.BackstageLeaveInfoTable,
      components: components(View.BackstageLeaveInfoTableView, Const.BackstageBase),
    },
    {
      path: Const.BackstageUserEdit + Const.Separator + Const.MatchSymbol + Const.BackstageUseridRegex,
      components: components(View.BackstageUserEditView, Const.BackstageBase),
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
