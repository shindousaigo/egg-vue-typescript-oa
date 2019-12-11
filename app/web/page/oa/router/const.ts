export namespace Const {

  export const Separator = '/'
  export const MatchSymbol = ':'
  export const OtherRegex = '*'

  export const OaBase = '/oa'

  export const NotFound = '404'

  export const DashboardBase = '/dashboard'
  export const DashboardComponentRegex = 'component'
  export const DashboardWorkAll = 'work-all'
  export const DashboardWorkProcess = 'work-process'
  export const DashboardWorkOver = 'work-over'
  export const DashboardWorkWait = 'work-wait'
  export const DashboardAttendance = 'attendance'
  export const DashboardUserinfo = 'userinfo'

  export const ApprovalBase = '/approval'
  export const ApprovalComponentRegex = 'component'
  export const ApprovalApplicationDetail = 'application-detail'
  export const ApprovalApplicationDetailComponentRegex = 'adcomponent'
  export const ApprovalApplicationDetailSerialNumberRegex = 'adserial'

  export enum ApprovalApplication {
    attendance = 'attendance',
    overtime = 'overtime',
    demand = 'demand',
    leave = 'leave',
    admission = 'admission',
    dismission = 'dismission'
  }

  export const BackstageBase = '/backstage'
  export const BackstageUserTable = 'user-table'
  export const BackstageLeaveInfoTable = 'leave-info-table'
  export const BackstageUserEdit = 'user-edit'
  export const BackstageUseridRegex = 'userid'

}
