import State from "../state";
import moment from "moment"
import { GETTERS } from "./types";
import { Const } from "../../router/const";

const Methods = "methods"
export type GettersMethods = typeof Methods

export default class Getters {
  public [Methods] = {
    get user_dictionary(): GETTERS.User.Dictionary {
      // @ts-ignore
      return function (state: State) {
        if (state.user_list.length) {
          return Object.fromEntries(state.user_list.map(user => {
            return [user.userid, user]
          }))
        }
      }
    },
    get leave_type_dictionary(): GETTERS.Leave.Type.Dictionary {
      // @ts-ignore
      return function (state: State) {
        if (state.leave_type_list.length) {
          return Object.fromEntries(state.leave_type_list.map(item => {
            return [item.id, item]
          }))
        }
      }
    },
    get department_tree(): GETTERS.Department.Tree {
      // @ts-ignore
      return function (state: State) {
        if (state.department_list) {
          return Getters.Instance.parse(state)
        }
      }
    },
    get department_id_dictionary(): GETTERS.Department.ID.Dictionary {
      // @ts-ignore
      return function (state: State, getters: Getters[GettersMethods]) {
        if (state.department_list.length && getters.department_tree) {
          return Object.fromEntries(
            state.department_list.map(department => [department.id, department])
          )
        }
      }
    },
    get user_approval_list_dictionary(): GETTERS.User.Approval.List.Dictionary {
      // @ts-ignore
      return function (state: State) {
        const dictionary: GETTERS.User.Approval.List.Dictionary = {
          [Const.DashboardWorkWait]: [],
          [Const.DashboardWorkProcess]: [],
          [Const.DashboardWorkOver]: [],
        }
        if (state.user_approval_list.length) {
          state.user_approval_list.forEach(item => {
            if (item.result === 3) {
              if (state.userid === item.userId) {
                const listItem: GETTERS.User.Approval.List.Item = Object.assign({}, { type: Const.DashboardWorkProcess as typeof Const.DashboardWorkProcess }, item)
                dictionary[Const.DashboardWorkProcess].push(listItem)
              } else {
                const listItem: GETTERS.User.Approval.List.Item = Object.assign({}, { type: Const.DashboardWorkWait as typeof Const.DashboardWorkWait }, item)
                dictionary[Const.DashboardWorkWait].push(listItem)
              }
            } else {
              const listItem: GETTERS.User.Approval.List.Item = Object.assign({}, { type: Const.DashboardWorkOver as typeof Const.DashboardWorkOver }, item)
              dictionary[Const.DashboardWorkOver].push(listItem)
            }
          })
        }
        return dictionary
      }
    },
    get attendance_page_record(): GETTERS.Attendance.PageRecord {
      // @ts-ignore
      return function (state: State) {
        let pageRecord: GETTERS.Attendance.PageRecord = {}
        if (state.attendance_page_record) {
          state.attendance_page_record.forEach(record => {
            pageRecord[record.date] = record.remark
          })
        }
        return pageRecord
      }
    },
    get attendance_date_scope(): GETTERS.Attendance.DateScope {
      // @ts-ignore
      return function (state: State) {
        let dateScope: GETTERS.Attendance.DateScope
        const date = state.attendance_date.getDate()
        const mounth = state.attendance_date.getMonth()
        const year = state.attendance_date.getFullYear()
        const startDate = 25
        const endDate = 24
        const startMoment = moment(new Date(year, mounth, startDate))
        const endMoment = moment(new Date(year, mounth, endDate))
        if (date < startDate) {
          dateScope = [
            startMoment.add(-1, "month").format("YYYY-MM-DD"),
            endMoment.format("YYYY-MM-DD")
          ];
        } else {
          dateScope = [
            startMoment.format("YYYY-MM-DD"),
            endMoment.add(1, "month").format("YYYY-MM-DD")
          ];
        }
        return dateScope
      }
    },
    get approval_type_dictionary(): GETTERS.Approval.Type.Dictionary {
      // @ts-ignore
      return function (state: State) {
        const dictionary: GETTERS.Approval.Type.Dictionary = {}
        state.approval_type_list.forEach(function (item) {
          dictionary[item.applicationType] = item
        })
        return dictionary
      }
    },
  }
  private parse(s_tate: State, parentid = 0) {
    if (s_tate.department_list)
      return s_tate.department_list.filter(el => el.parentid === parentid).map(el => {
        return Object.assign(el, {
          children: (() => {
            return this.parse(s_tate, el.id) || []
          })()
        })
      })
  }
  public get map() {
    return Object.fromEntries(
      Object.keys(Getters.Instance[Methods]).map(
        fn => [fn, Getters.Instance[Methods][fn]]
      )
    )
  }
  private static Ins: Getters
  static get Instance() {
    return this.Ins || new Getters
  }
  constructor() {
    Getters.Ins = this
  }
}