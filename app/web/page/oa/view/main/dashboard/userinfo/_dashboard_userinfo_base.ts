import { Component, Vue, Provide } from "vue-property-decorator";

@Component<DashboardUserinfoBase>({
  created() {
    this.$dispatch.user_overtime_detail({
      userid: this.$state.userid
    });
    this.$dispatch.user_annual_leave_detail({
      userid: this.$state.userid
    });
    this.$dispatch.leave_type_list();
  }
})
export default class DashboardUserinfoBase extends Vue {
  static OvertimeTypeMap = ["", "加班", "结算到工资", "HR"];
  static UserStatusMap = ["实习生", "试用期", "正式员工", "离职员工"];
  get userinfo() {
    const _cache = Object.assign(
      {},
      this.$state.user_overtime_detail,
      this.$state.user_annual_leave_detail
    );
    const _userinfo = Object.assign(
      {},
      this.$getters.user_dictionary
        ? this.$getters.user_dictionary[this.$state.userid]
        : {},
      this.$state.user_info
    );
    return Object.assign({}, _cache, _userinfo);
  }
  get position() {
    return this.userinfo.position;
  }
  get employeeNumber() {
    return this.userinfo.employeeNumber;
  }
  get telephone() {
    return this.userinfo.telephone;
  }
  get userName() {
    return this.userinfo.userName;
  }
  get userStatus() {
    return DashboardUserinfoBase.UserStatusMap[this.userinfo.userStatus];
  }
  get entryDate() {
    return this.userinfo.entryDate;
  }
  get correctionDate() {
    return this.userinfo.correctionDate;
  }
  get newContractDate() {
    return this.userinfo.newContractDate;
  }
  get contractExpirationDate() {
    return this.userinfo.contractExpirationDate;
  }
  get overtimeInfoList() {
    if (this.userinfo.user_overtime_detail) {
      const list = this.userinfo.user_overtime_detail.overtimeInfoList.sort(
        function (a, b) {
          return (
            new Date(b.overtimeDate).getTime() -
            new Date(a.overtimeDate).getTime()
          );
        }
      );
      return list;
    }
  }
  get overtimeUseDetailInfoList() {
    if (this.userinfo.user_overtime_detail) {
      return this.userinfo.user_overtime_detail.useDetailInfoList;
    }
  }
  get produceDetailInfoList() {
    if (this.userinfo.user_annual_leave_detail) {
      return this.userinfo.user_annual_leave_detail.produceDetailInfoList.sort(
        function (a, b) {
          return (
            new Date(b.expireDate).getTime() - new Date(a.expireDate).getTime()
          );
        }
      );
    }
  }
  get annualLeaveUseDetailInfoList() {
    if (this.userinfo.user_annual_leave_detail) {
      return this.userinfo.user_annual_leave_detail.useDetailInfoList;
    }
  }
  get overtimeAvailable() {
    if (this.userinfo.user_overtime_detail) {
      const add = this.userinfo.user_overtime_detail.overtimeInfoList
        .map(item => item.overtimeTotal)
        .reduce((a, b) => a + b);
      const minus = this.userinfo.user_overtime_detail.useDetailInfoList
        .map(item => -item.duration)
        .reduce((a, b) => a + b);
      return add + minus
    }
  }
  get annualLeaveAvailable() {
    if (this.userinfo.user_annual_leave_detail) {
      return this.userinfo.user_annual_leave_detail.produceDetailInfoList
        .map(item => item.availableLeave)
        .reduce((a, b) => a + b)
    }
  }
}