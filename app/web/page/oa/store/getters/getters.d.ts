import { DashBoardWorkAll, DashBoardWorkProcess, DashBoardWorkWait, DashBoardWorkOver } from "../../router/const";
import { ACTIONS } from "../actions/types";

export namespace GETTERS {

  namespace Department {
    type Tree = ACTIONS.Department.List.Item & {
      children?: Tree[]
    }
    namespace ID {
      interface Dictionary {
        [id: string]: ACTIONS.Department.List.Item
      }
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
    interface Dictionary {
      [userid: string]: ACTIONS.User.List.Item
    }
    namespace Approval {
      namespace List {
        type wait = typeof DashBoardWorkWait
        type process = typeof DashBoardWorkProcess
        type over = typeof DashBoardWorkOver
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










