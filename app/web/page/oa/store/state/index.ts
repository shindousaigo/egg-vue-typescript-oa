import { Commit, Getters, Dispatch } from "../store"
import { Route } from "vue-router"
import { ACTIONS } from "../actions/types"

export type InitState = {
  [key in keyof State]: State[key]
}

export default class State {
  constructor(initState: InitState) {
    Object.keys(initState).forEach(key => {
      this[key] = initState[key]
    })
  }

  url = ""
  locale = ""
  origin = ""
  userid = ""
  route: Route = "" as any

  $state: State = this
  $commit: Commit = "" as any
  $getters: Getters = "" as any
  $dispatch: Dispatch = "" as any

  user_list: ACTIONS.User.List.State = []
  user_info: ACTIONS.User.Info.State = "" as any
  user_approval_list: ACTIONS.User.Approval.List.State = []
  user_overtime_detail: ACTIONS.User.Overtime.Detail.State = "" as any
  user_annual_leave_detail: ACTIONS.User.AnnualLeave.Detail.State = "" as any

  department_list: ACTIONS.Department.List.State = []

  leave_info: ACTIONS.Leave.Info.State = "" as any
  leave_type_list: ACTIONS.Leave.Type.List.State = []

  approval_type_list = [
    {
      key: "attendance",
      label: "补签申请",
      applicationType: 1,
    },
    {
      key: "overtime",
      label: "加班申请",
      applicationType: 2,
    },
    {
      key: "leave",
      label: "请休假申请",
      applicationType: 3,
    },
    {
      key: "admission",
      label: "新员工入职申请",
      applicationType: 4,
    },
    {
      key: "dismission",
      label: "离职申请",
      applicationType: 5,
    },
    {
      key: "demand",
      label: "人员需求申请",
      applicationType: 6,
    },
    {
      key: "business",
      label: "出差申请",
      applicationType: 7,
    },
    {
      key: "purchase",
      label: "采购申请",
      applicationType: 8,
    },
    {
      key: "displace",
      label: "新旧电脑置换",
      applicationType: 9,
    },
    {
      key: " card",
      label: "名片制作申请",
      applicationType: 10,
    },
    {
      key: "assets",
      label: "固定资产处置申请",
      applicationType: 11,
    },
    {
      key: "printed",
      label: "用印申请",
      applicationType: 12,
    },
    {
      key: "printed_qualification",
      label: "文印资质借用申请",
      applicationType: 13,
    },
    {
      key: "labor_contract_renewal",
      label: "劳动合同续签申请",
      applicationType: 14,
    },
  ]

  attendance_page_record: ACTIONS.Attendance.PageRecord.State = []
  attendance_punch_record: ACTIONS.Attendance.PunchRecord.State = "" as any
  attendance_date: Date = new Date
}
