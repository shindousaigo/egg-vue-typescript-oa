import State from "../state";
import { DashBoardWorkProcess, DashBoardWorkWait, DashBoardWorkOver } from "../../router/const";
import moment from "moment"
import { GETTERS } from "./getters";

const Methods = "methods"
export type GettersMethods = typeof Methods

export default class Getters {
  public [Methods] = {
    get user_dictionary(): GETTERS.User.Dictionary {
      // @ts-ignore
      return function (state: State) {
        const user_dictionary: GETTERS.User.Dictionary = {}
        if (state.user_list.length) {
          state.user_list.forEach(user => {
            user_dictionary[user.userid] = user
          })
        }
        return user_dictionary
      }
    },
    get leave_type_dictionary(): GETTERS.Leave.Type.Dictionary {
      // @ts-ignore
      return function (state: State) {
        const initialData = {}
        if (state.leave_type_list.length) {
          state.leave_type_list.forEach(item => {
            initialData[item.id] = item
          })
        }
        return initialData
      }
    },
    get department_tree(): GETTERS.Department.Tree {
      // @ts-ignore
      return function (state: State) {
        // @ts-ignore
        let tree: GETTERS.Department.Tree = []
        if (state.department_list.length) {
          tree = Getters.Instance.parse(state)
        }
        return tree
      }
    },
    get department_id_dictionary(): GETTERS.Department.ID.Dictionary {
      // @ts-ignore
      return function (state: State) {
        let dictionary: GETTERS.Department.ID.Dictionary = {}
        if (state.department_list.length) {
          state.department_list.forEach(department => {
            dictionary[department.id] = department
          })
        }
        return dictionary
      }
    },
    get user_approval_list_dictionary(): GETTERS.User.Approval.List.Dictionary {
      // @ts-ignore
      return function (state: State) {
        const Wait = DashBoardWorkWait as typeof DashBoardWorkWait
        const Process = DashBoardWorkProcess as typeof DashBoardWorkProcess
        const Over = DashBoardWorkOver as typeof DashBoardWorkOver
        const dictionary: GETTERS.User.Approval.List.Dictionary = {
          [Wait]: [],
          [Process]: [],
          [Over]: [],
        }
        if (state.user_approval_list.length) {
          state.user_approval_list.forEach(item => {
            if (item.result === 3) {
              if (state.userid === item.userId) {
                const listItem: GETTERS.User.Approval.List.Item = Object.assign({}, { type: Process }, item)
                dictionary[Process].push(listItem)
              } else {
                const listItem: GETTERS.User.Approval.List.Item = Object.assign({}, { type: Wait }, item)
                dictionary[Wait].push(listItem)
              }
            } else {
              const listItem: GETTERS.User.Approval.List.Item = Object.assign({}, { type: Over }, item)
              dictionary[Over].push(listItem)
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