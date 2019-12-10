import { BOOLEAN_BY_NUMBER } from "../../../../typings/global";
import { Enum } from ".";
import ApprovalApplicationConfig from "../../view/main/approval/application/_approval_application_config";
import { Const } from "../../router/const";

export namespace ACTIONS {

  namespace Department {
    namespace List {
      interface Item {
        id: number
        name: string
        order: number
        parentid: number
      }
      type State = Item[]
    }
  }

  namespace Attendance {
    namespace PageRecord {
      interface Params {
        /** 用户ID */
        userid: string
        /** 需要查询的开始日期 格式如：2019- 02 - 25 */
        startTime: string
        /** 需要查询的结束日期 格式如：2019-03 - 24 */
        endTime: string
      }
      interface AttendancePageRecordItem {
        remark: string
        date: string
      }
      type State = AttendancePageRecordItem[]
    }
    namespace PunchRecord {
      interface Params {
        /** 用户ID */
        userid: string
        /** 需要查询的日期 格式如：2019-02-01 */
        date: string
      }
      type State = string[]
    }
  }

  namespace Approval {
    namespace Application {
      type State = {
        code: number
        message: string
      }
      type UploadFileList = {
        name: string;
        percentage: number;
        raw: File;
        size: number;
        status: string;
        uid: number;
      }[]
      type FileList = {
        fileList: UploadFileList
      }
      namespace Params {
        type Attendance = typeof ApprovalApplicationConfig["ParamsModel"][typeof Const.ApprovalAttendance] & FileList
        type Overtime = typeof ApprovalApplicationConfig["ParamsModel"][typeof Const.ApprovalOvertime] & FileList
        type Leave = typeof ApprovalApplicationConfig["ParamsModel"][typeof Const.ApprovalLeave] & FileList
        type Demand = typeof ApprovalApplicationConfig["ParamsModel"][typeof Const.ApprovalDemand] & FileList
      }
      namespace Detail {
        type State = State.Attendance
        namespace State {
          interface Attendance {
            checkInDate: string
            checkInType: string
            createTime: string
            departmentId: string
            serialNumber: string
            timeSlot: string
            userId: string
          }
        }
        interface Params {
          serialNumber: string
        }
      }
      namespace Delete {
        interface Params {
          serialNumber: string
        }
        type State = string
      }
    }
    namespace Confirm {
      type Params = Approval.List.Item
      interface State {
        code: number
        message: string
      }
    }
    namespace List {
      interface Item {
        approvalResult: Enum.ApprovalResult
        createTime: string
        departmentId: string
        id: string
        isEnd: BOOLEAN_BY_NUMBER
        nextApproverId?: string
        nextApproverName?: string
        nextDepartmentId: string
        order: number
        serialNumber: string
        userId: string
        userName: string
      }
      type State = Item[]
      interface Params {
        serialNumber: string
      }
    }
  }

  namespace User {
    namespace Permission {
      interface State {
        permissionLevel: number
        roleDescription: string
        roleId: number
        roleName: string
        roleStatus: number
      }
      interface Params {
        userid: string
      }
    }
    namespace List {
      interface Params {
        department_id: number
        fetch_child?: BOOLEAN_BY_NUMBER
        type?: "simplelist" | "list"
      }
      interface Item {
        userid: string
        name: string
        department: number[]
        order: number[]
        position: string
        mobile: string
        gender: string
        email: string
        is_leader_in_dept: number[]
        avatar: string
        telephone: string
        enable: number
        alias: string
        status: number
        addStates: string
        extattr: {
          attrs: {
            type: number,
            name: string
            text?: {
              value: string
            }
            web?: {
              url: string
              title: string
            }
            miniprogram?: {
              appid: string
              pagepath: string
              title: string
            }
          }[]
        },
        qr_code: string
        external_position: string
        external_profile: {
          external_corp_name: string,
          external_attr: {
            type: number,
            name: string
            text?: {
              value: string
            }
            web?: {
              url: string
              title: string
            }
            miniprogram?: {
              appid: string
              pagepath: string
              title: string
            }
          }[]
        }
      }
      type State = Item[]
    }
    namespace Info {
      interface Params {
        userid: string
      }
      interface State {
        alias: string
        contractExpirationDate: string
        correctionDate: string
        createTime: string
        department: string
        email: string
        employeeNumber: string
        enable: number
        entryDate: string
        eparationDate: string
        externalPosition: string
        gender: string
        id: number
        isAttendance: number
        isDepartmentHead: number
        isLeaderInDept: string
        mobile: string
        modifyTime: string
        newContractDate: string
        order: string
        position: string
        telephone: string
        userId: string
        userName: string
        userStatus: number
        workYears: number
      }
    }
    namespace Overtime {
      namespace Detail {
        interface State {
          user_overtime_detail: {
            hrSettingInfoList: {
              duration: number
              id: number
              leaveType: number
              settingDate: string
              settingType: number
              userId: string
            }[]
            overtimeInfoList: {
              overtimeDate: string
              overtimeTotal: number
              /** 1: "加班", 2: "结算到工资", 3: "HR" */
              overtimeType: string
              userId: string
            }[]
            useDetailInfoList: {
              duration: number
              leaveType: string
              useDate: string
              userId: string
            }[]
          }
        }
        interface Params {
          userid: string
        }
      }
    }
    namespace AnnualLeave {
      namespace Detail {
        interface Params {
          userid: string
        }
        interface UseDetailInfoListItem {
          duration: number
          leaveType: string
          useDate: string
          userId: string
        }
        interface State {
          user_annual_leave_detail: {
            hrSettingInfoList: {
              duration: number
              id: number
              leaveType: number
              settingDate: string
              settingType: number
              userId: string
            }[]
            produceDetailInfoList: {
              availableLeave: number
              expireDate: string
              id: number
              isAvailable: number
              isStateet: number
              leaveTotal: number
              produceDate: string
              useLeave: number
              userId: string
            }[]
            useDetailInfoList: UseDetailInfoListItem[]
          }
        }
      }
    }
    namespace Approval {
      namespace List {
        interface Params {
          userid: string
        }
        interface Item {
          createTime: string
          processType: number
          /**
           * 审批结果 1: 同意 2：驳回 3：审批中 4：已撤回
           */
          result: number
          serialNumber: string
          /** 是否有效 */
          status: number
          /** 审批发起人ID */
          userId: string
          /** 审批发起人名称 */
          userName: string
        }
        type State = Item[]
      }
      namespace CheckInRecord {
        interface Params {
          startTime: string
          endTime: string
          userid: string
        }
        interface ApprovalCheckInRecordInfo {
          /** 补签到日期 格式如：2019- 01 - 01 */
          checkInDate: string
          /** 补签原因 1：迟到 2：早退 3：旷工 */
          checkInReason: number
          checkInType: number
          id: number
          /** 是否补签 0：否 1：是 */
          isCheck: number
          /** 流水号 */
          serialNumber: string
          userId: string
        }
        interface State {
          offInfo: ApprovalCheckInRecordInfo[]
          offInfoSize: number
          onInfo: ApprovalCheckInRecordInfo[]
          onInfoSize: number
        }
      }
    }
  }

  namespace Leave {
    namespace Info {
      interface AnnualLeaveInfoListItem {
        availableAnnualLeave: number
        endTime: string
        startTime: string
        userId: string
      }
      type AnnualLeaveInfoList = AnnualLeaveInfoListItem[]
      interface AvailableLeaveInLieu {
        [userid: string]: number
      }
      interface State {
        availableLeaveInLieu: AvailableLeaveInLieu
        leaveInfoList: AnnualLeaveInfoList
      }
      interface Params {
        userIds: string[]
      }
    }
    namespace Type {
      namespace List {
        interface LeaveTypeBase {
          id: number
          leaveName: string
        }
        type LeaveType = LeaveTypeBase & {
          children?: LeaveType[]
        }
        type State = LeaveType[]
      }
    }
  }

}