import { Const } from "./const"
import { Notification } from "element-ui"
export namespace View {
  export const AsideView = import('web/page/oa/view/aside.vue')
  export const HeaderView = import('web/page/oa/view/header.vue')

  export const NotFoundView = import('web/page/oa/view/main/404.vue')

  export const DashboardView = import('web/page/oa/view/main/dashboard/index.vue')
  export const DashboardWorkView = import('web/page/oa/view/main/dashboard/work.vue')
  export const DashboardAttendanceView = import('web/page/oa/view/main/dashboard/attendance/index.vue')
  export const DashboardUserinfoView = import('web/page/oa/view/main/dashboard/userinfo/index.vue')

  export const ApprovalView = import('web/page/oa/view/main/approval/index.vue')
  export const ApprovalApplicationDetailView = import('web/page/oa/view/main/approval/detail.vue')
  export const ApprovalApplication = new Proxy({
    Views: {} as {
      [key in keyof typeof Const.ApprovalApplication]: Promise<typeof import('*.vue')>
    } & Object
  }, {
    get(target, key) {
      const missing: string[] = []
      const views = target.Views
      const files = (<any>require).context("web/page/oa/view/main/approval/application", false, /\.vue$/)
      files.keys().forEach((element: string) => {
        const k = element.slice(2, -4)
        const v = () => import('web/page/oa/view/main/approval/application/' + element.slice(2))
        Const.ApprovalApplication.hasOwnProperty(k) ? (views[k] = v) : missing.push(k)
      })
      if (missing.length) {
        console.error(missing.join(',') + ' of Const.ApprovalApplication is missing')
      }
      return views
    }
  })

  export const BackstageView = import('web/page/oa/view/main/backstage/index.vue')
  export const BackstageDepartmentTreeView = import('web/page/oa/view/main/backstage/department_tree.vue')
  export const BackstageUserTableView = import('web/page/oa/view/main/backstage/user_table.vue')
  export const BackstageLeaveInfoTableView = import('web/page/oa/view/main/backstage/leave_info_table.vue')
  export const BackstageUserEditView = import('web/page/oa/view/main/backstage/user_edit.vue')

}

