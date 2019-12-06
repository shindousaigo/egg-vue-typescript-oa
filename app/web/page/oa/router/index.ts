import Vue from 'vue';
import VueRouter from 'vue-router';
import { DashboardView, ApprovalView, BackstageView, AsideView, HeaderView, DashboardWorkView, DashboardAttendanceView, DashboardUserinfoView, BackstageUserTableView, BackstageLeaveInfoTableView, BackstageUserEditView, BackstageDepartmentTreeView, ApprovalAttendanceView, ApprovalDemandView, NotFoundView, ApprovalApplicationDetailView } from "./vues";
import { DashboardBase, DashboardWorkAll, DashboardAttendance, OtherRegex, Separator, BackstageBase, OaBase, DashboardUserinfo, BackstageUserTable, BackstageLeaveInfoTable, BackstageUserEdit, ApprovalAttendance, ApprovalBase, ApprovalDemand, ApprovalComponentRegex, NotFound, DashboardWorkProcess, DashboardWorkWait, DashboardWorkOver, DashboardComponentRegex, ApprovalApplicationDetail, MatchSymbol, BackstageUseridRegex, ApprovalApplicationDetailComponentRegex, ApprovalApplicationDetailSerialNumberRegex } from "./const";

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
      redirect: [DashboardBase, DashboardWorkAll].join(Separator),
    },
    {
      path: MatchSymbol + DashboardComponentRegex,
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
      name: ApprovalApplicationDetail,
      path: ApprovalApplicationDetail,
      component: () => ApprovalApplicationDetailView,
      children: [
        {
          name: ApprovalApplicationDetail,
          path: [MatchSymbol + ApprovalApplicationDetailComponentRegex, MatchSymbol + ApprovalApplicationDetailSerialNumberRegex].join(Separator),
          component: () => ApprovalApplicationDetailView
        }
      ]
    },
    {
      path: MatchSymbol + ApprovalComponentRegex,
      components: {
        [NotFound]: () => NotFoundView,
        [ApprovalAttendance]: () => ApprovalAttendanceView,
        [ApprovalDemand]: () => ApprovalDemandView,
      }
    }
  ]
}
const BackstageConfig = {
  path: BackstageBase,
  redirect: [BackstageBase, BackstageUserTable].join(Separator),
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
      path: BackstageUserEdit + Separator + MatchSymbol + BackstageUseridRegex,
      components: components(BackstageUserEditView, BackstageBase),
    },
    {
      path: OtherRegex,
      redirect: [BackstageBase, BackstageUserTable].join(Separator),
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
