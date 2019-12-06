import { DashboardWorkAll, DashboardWorkProcess, DashboardWorkWait, DashboardWorkOver } from "../../router/const";
import { ACTIONS } from "../actions/types";

export namespace GETTERS {

  namespace Department {
    type Tree = ACTIONS.Department.List.Item & {
      children?: Tree[]
    }
    namespace ID {
      type Dictionary = {
        [id: string]: Tree
      } | undefined
    }
  }

  namespace Approval {
    namespace Type {
      type Dictionary = {
        [type: string]: {
          key: string
          label: string
          applicationType: number
        }
      }
    }
  }

  namespace User {
    type Dictionary = {
      [userid: string]: ACTIONS.User.List.Item
    } | undefined
    namespace Approval {
      namespace List {
        type wait = typeof DashboardWorkWait
        type process = typeof DashboardWorkProcess
        type over = typeof DashboardWorkOver
        interface Item extends ACTIONS.User.Approval.List.Item {
          type: wait | process | over
        }
        type Dictionary = {
          [key in wait | process | over]: Item[]
        }
      }

    }
  }

  namespace Attendance {
    interface PageRecord {
      [date: string]: ACTIONS.Attendance.PageRecord.AttendancePageRecordItem["remark"]
    }
    type DateScope = [string, string]
  }

  namespace Leave {
    namespace Type {
      interface Dictionary {
        [type: string]: ACTIONS.Leave.Type.List.LeaveType
      }
    }
  }

}










