import { Component, Vue, Provide } from "vue-property-decorator";
import HeaderBase from "../../../_header_base";

@Component<DashboardUserinfoBase>({
  created() {
    this.$dispatch.user_info({
      userid: this.$state.userid
    })
    this.$dispatch.user_overtime_detail({
      userid: this.$state.userid
    });
    this.$dispatch.user_annual_leave_detail({
      userid: this.$state.userid
    });
    this.$dispatch.leave_type_list();
  }
})
export default class DashboardUserinfoBase extends HeaderBase {

  static _ins: DashboardUserinfoBase
  static get instance() {
    return this._ins || new DashboardUserinfoBase
  }
  constructor() {
    super()
    DashboardUserinfoBase._ins = this
  }

  static OvertimeTypeMap = ["", "加班", "结算到工资", "HR"];
  static UserStatusMap = ["实习生", "试用期", "正式员工", "离职员工"];

  get userInfo() {
    return this.$state.user_info
  }

  get userOvertimeDetail() {
    return this.$state.user_overtime_detail
  }

  get userAnnualLeaveDetail() {
    return this.$state.user_annual_leave_detail
  }

  get userName() {
    return this.userInfo && this.userInfo.userName;
  }

  get userId() {
    return this.userInfo && this.userInfo.userId;
  }

  get employeeNumber() {
    return this.userInfo && this.userInfo.employeeNumber;
  }

  get userStatus() {
    return this.userInfo && DashboardUserinfoBase.UserStatusMap[this.userInfo.userStatus];
  }

  get entryDate() {
    return this.userInfo && this.userInfo.entryDate;
  }

  get correctionDate() {
    return this.userInfo && this.userInfo.correctionDate;
  }

  get newContractDate() {
    return this.userInfo && this.userInfo.newContractDate;
  }

  get contractExpirationDate() {
    return this.userInfo && this.userInfo.contractExpirationDate;
  }

  get overtimeInfoList() {
    if (this.userOvertimeDetail) {
      return this.userOvertimeDetail.overtimeInfoList.sort(
        function (pre, next) {
          return new Date(next.overtimeDate).getTime() - new Date(pre.overtimeDate).getTime()
        }
      )
    }
  }

  get overtimeUseDetailInfoList() {
    if (this.userOvertimeDetail) {
      return this.userOvertimeDetail.useDetailInfoList;
    }
  }

  get produceDetailInfoList() {
    if (this.userAnnualLeaveDetail) {
      return this.userAnnualLeaveDetail.produceDetailInfoList.sort(
        function (pre, next) {
          return new Date(next.expireDate).getTime() - new Date(pre.expireDate).getTime()
        }
      )
    }
  }

  get annualLeaveUseDetailInfoList() {
    if (this.userAnnualLeaveDetail) {
      return this.userAnnualLeaveDetail.useDetailInfoList;
    }
  }

  get overtimeAvailable() {
    if (this.userOvertimeDetail) {
      const add = this.userOvertimeDetail.overtimeInfoList
        .map(item => item.overtimeTotal)
        .reduce((a, b) => a + b);
      const minus = this.userOvertimeDetail.useDetailInfoList
        .map(item => -item.duration)
        .reduce((a, b) => a + b);
      return add + minus
    }
  }

  get annualLeaveAvailable() {
    if (this.userAnnualLeaveDetail) {
      return this.userAnnualLeaveDetail.produceDetailInfoList
        .map(item => item.availableLeave)
        .reduce((a, b) => a + b)
    }
  }
}