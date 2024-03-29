import { ActionContext } from "vuex";
import State from "../state";
import { ACTIONS } from "./types";
import { Notification } from "element-ui"

const Methods = "methods"
export type ActionsMethods = typeof Methods
type ActionsPendingsV = {
  resolve: (r: any) => void,
  reject: (r: any) => void,
  promise: Promise<any>
}
export default class Actions {
  static pendings: Map<keyof Actions[ActionsMethods], ActionsPendingsV> = new Map
  private async fetch(url: keyof Actions[ActionsMethods], params?: any) {
    const config: RequestInit = {
      method: "POST"
    }
    if (params) {
      if (params instanceof FormData) {
        config.body = params
      } else {
        config.headers = {
          "content-type": "application/json"
        }
        config.body = JSON.stringify(params)
      }
    }
    // @ts-ignore
    const cache: ActionsPendingsV = {}
    cache.promise = new Promise(function (resolve, reject) {
      cache.resolve = resolve
      cache.reject = reject
    })
    !Actions.pendings.has(url) && Actions.pendings.set(url, cache)
    const response = await fetch(`/oa/action/${url}`, config)
    const res = await response.json()
    if (typeof res === "string") {
      cache.reject(res)
    } else {
      if (res.message) Notification.success(res.message)
      cache.resolve(res)
    }
    return cache.promise
  }

  public [Methods] = {
    /** 获取所有部门列表 */
    department_list: async (): Promise<ACTIONS.Department.List.State> => {
      const cahce = Actions.pendings.get("department_list")
      if (cahce) {
        return cahce.promise
      }
      const state = await this.fetch("department_list")
      this.state.$commit.department_list(state)
      return state
    },
    /** 获取用户考勤记录 */
    attendance_page_record: async (params: ACTIONS.Attendance.PageRecord.Params): Promise<ACTIONS.Attendance.PageRecord.State> => {
      const state = await this.fetch("attendance_page_record", params)
      this.state.$commit.attendance_page_record(state)
      return state
    },
    /** 查询指定日期的打卡记录 */
    attendance_punch_record: async (params: ACTIONS.Attendance.PunchRecord.Params): Promise<ACTIONS.Attendance.PunchRecord.State> => {
      const state = await this.fetch("attendance_punch_record", params)
      this.state.$commit.attendance_punch_record(state)
      return state
    },
    /** 根据流水号查询审批详细信息 */
    approval_list: async (params: ACTIONS.Approval.List.Params): Promise<ACTIONS.Approval.List.State> => {
      return this.fetch("approval_list", params)
    },
    /** 申请接口 */
    approval_application: async (params: ACTIONS.Approval.Application.Params): Promise<ACTIONS.Approval.Application.State> => {
      return this.fetch("approval_application", params)
    },
    /** 审核审批申请 */
    approval_confirm: async (params: ACTIONS.Approval.Confirm.Params): Promise<ACTIONS.Approval.Confirm.State> => {
      return this.fetch("approval_confirm", params)
    },
    /** 根据流水号查询申请详细信息 */
    approval_application_detail: async (params: ACTIONS.Approval.Application.Detail.Params): Promise<ACTIONS.Approval.Application.Detail.State> => {
      return this.fetch("approval_application_detail", params)
    },
    /** 获取用户权限数据 */
    approval_application_delete: async (params: ACTIONS.Approval.Application.Delete.Params): Promise<ACTIONS.Approval.Application.Delete.State> => {
      return this.fetch("approval_application_delete", params)
    },
    /** 获取用户权限数据 */
    user_permission: async (params: ACTIONS.User.Permission.Params): Promise<ACTIONS.User.Permission.State> => {
      const cahce = Actions.pendings.get("user_permission")
      if (cahce) {
        return cahce.promise
      }
      const state = await this.fetch("user_permission", params)
      this.state.$commit.user_permission(state)
      return state
    },
    /** 获取用户列表 */
    user_list: async (params: ACTIONS.User.List.Params): Promise<ACTIONS.User.List.State> => {
      const cahce = Actions.pendings.get("user_list")
      if (cahce) {
        return cahce.promise
      }
      params.fetch_child = 1
      params.type = "list"
      const state = await this.fetch("user_list", params)
      this.state.$commit.user_list(state)
      return state
    },
    /** 获取用户信息 */
    user_info: async (params: ACTIONS.User.Info.Params): Promise<ACTIONS.User.Info.State> => {
      const cahce = Actions.pendings.get("user_info")
      if (cahce) {
        return cahce.promise
      }
      const state = await this.fetch("user_info", params)
      this.state.$commit.user_info(state)
      return state
    },
    /** 获取加班数据 */
    user_overtime_detail: async (params: ACTIONS.User.Overtime.Detail.Params): Promise<ACTIONS.User.Overtime.Detail.State> => {
      const cahce = Actions.pendings.get("user_overtime_detail")
      if (cahce) {
        return cahce.promise
      }
      const state = await this.fetch("user_overtime_detail", params)
      this.state.$commit.user_overtime_detail(state)
      return state
    },
    /** 获取用户年假明细 */
    user_annual_leave_detail: async (params: ACTIONS.User.AnnualLeave.Detail.Params): Promise<ACTIONS.User.AnnualLeave.Detail.State> => {
      const cahce = Actions.pendings.get("user_annual_leave_detail")
      if (cahce) {
        return cahce.promise
      }
      const state = await this.fetch("user_annual_leave_detail", params)
      this.state.$commit.user_annual_leave_detail(state)
      return state
    },
    /** 根据用户id查询全部办理的审批 */
    user_approval_list: async (params: ACTIONS.User.Approval.List.Params): Promise<ACTIONS.User.Approval.List.State> => {
      const state = await this.fetch("user_approval_list", params)
      this.state.$commit.user_approval_list(state)
      return state
    },
    /** 查询补签到记录 */
    user_approval_check_in_record: async (params: ACTIONS.User.Approval.CheckInRecord.Params): Promise<ACTIONS.User.Approval.CheckInRecord.State> => {
      return this.fetch("user_approval_check_in_record", params)
    },
    /** 获取用户年假明细 */
    leave_info: async (params: ACTIONS.Leave.Info.Params): Promise<ACTIONS.Leave.Info.State> => {
      const cahce = Actions.pendings.get("leave_info")
      if (cahce) {
        return cahce.promise
      }
      const state = await this.fetch("leave_info", params)
      this.state.$commit.leave_info(state)
      return state
    },
    /** 获取假别类型 */
    leave_type_list: async (): Promise<ACTIONS.Leave.Type.List.State> => {
      const cahce = Actions.pendings.get("leave_type_list")
      if (cahce) {
        return cahce.promise
      }
      const state = await this.fetch("leave_type_list")
      this.state.$commit.leave_type_list(state)
      return state
    },
    /** 问卷查询 */
    questionnaire_query: async (params: ACTIONS.Approval.Application.Dismission.QuestionnaireQuery.Params): Promise<ACTIONS.Approval.Application.Dismission.QuestionnaireQuery.State> => {
      return this.fetch("questionnaire_query", params)
    },
  }
  public state!: State
  public get map() {
    return Object.fromEntries(Object.keys(Actions.Instance[Methods]).map(
      fn => [
        fn, (context: ActionContext<State, State>, params: any) => Actions.Instance[Methods][fn](params)
      ]
    ))
  }
  private static Ins: Actions
  static get Instance() {
    return this.Ins || new Actions
  }
  constructor() {
    Actions.Ins = this
  }
}
export namespace Enum {
  export enum ApprovalResult {
    /** 同意 */
    Agree = 1,
    /** 驳回 */
    Reject = 2,
    /** 待审批 */
    Pending = 3,
    /** 已转审 */
    Transfer = 4,
    /** 已撤回 */
    Withdraw = 5,
  }
}

