import { Vue } from "vue-property-decorator";
import moment from "moment"
import { ACTIONS } from "../../../../store/actions/types";
import { RgServerBaseUrl } from "../../../../const_oa";

export default class ApprovalApplicationConfig extends Vue {

  static _ins: ApprovalApplicationConfig
  static get instance() {
    return this._ins || new ApprovalApplicationConfig
  }
  constructor() {
    super()
    ApprovalApplicationConfig._ins = this
  }

  get component() {
    return this.$state.route.params[this.ApprovalComponentRegex] || this.$state.route.params[this.ApprovalApplicationDetailComponentRegex]
  }

  get departmentId() {
    if (this.$getters.user_dictionary) {
      return this.$getters.user_dictionary[this.$state.userid].department.join(',')
    }
  }

  get applicationDate() {
    return moment().format("YYYY-MM-DD")
  }

  get options() {
    return ApprovalApplicationConfig.OptionsModel[this.component] || {}
  }

  get description() {
    return ApprovalApplicationConfig.DescpritionModel[this.component] || {}
  }

  static ParamsModel = {
    [ApprovalApplicationConfig.instance.ApprovalAttendance]: {
      /** 申请类型 */
      applicationType: "1",
      /** 申请人 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 需求部门id */
      get departmentId() { return ApprovalApplicationConfig.instance.departmentId },
      /** 申请日期	 */
      get applicationDate() { return ApprovalApplicationConfig.instance.applicationDate },
      /** 补签日期 */
      checkInDate: "",
      /** 补签原因 */
      checkInType: "",
      /** 补签时段 */
      timeSlot: "",
      /** 补签备注 */
      reason: "",
      /** 文件列表 */
      fileList: ""
    },
    [ApprovalApplicationConfig.instance.ApprovalOvertime]: {
      /** 申请类型 */
      applicationType: "2",
      /** 申请人 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 需求部门id */
      get departmentId() { return ApprovalApplicationConfig.instance.departmentId },
      /** 申请日期	 */
      get applicationDate() { return ApprovalApplicationConfig.instance.applicationDate },
      reason: "",
      startTime: "",
      endTime: "",
      duration: "",
    },
    [ApprovalApplicationConfig.instance.ApprovalLeave]: {
      /** 申请类型 */
      applicationType: "3",
      /** 申请人	 */
      userId: ApprovalApplicationConfig.instance.$state.$state.userid,
      /** 需求部门id */
      get departmentId() { return ApprovalApplicationConfig.instance.departmentId },
      /** 申请日期	 */
      get applicationDate() { return ApprovalApplicationConfig.instance.applicationDate },
      leaveType: "",
      childrenType: "",
      startTime: "",
      endTime: "",
      duration: 0,
      reason: "",
      handover: "",
    },
    [ApprovalApplicationConfig.instance.ApprovalDemand]: {
      /** 申请类型 */
      applicationType: "6",
      /** 申请人 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 需求部门id */
      get departmentId() { return ApprovalApplicationConfig.instance.departmentId },
      /** 申请日期	 */
      get applicationDate() { return ApprovalApplicationConfig.instance.applicationDate },
      /** 需求岗位 */
      position: "",
      /** 需求人数 */
      positionNumber: "",
      /** 期待到岗日 */
      arrivalDate: "",
      /** 岗位定编人数 */
      fixedPeople: "",
      /** 岗位现有人数 */
      alreadyPeople: "",
      /** 需求原因 */
      demandCause: "",
      /** 主要工作职责 */
      jobResponsibilities: "",
      /** 年龄 */
      age: "",
      /** 学历 */
      education: "",
      /** 专业 */
      profession: "",
      /** 性别 */
      gender: "0",
      /** 建议薪资范围 */
      salaryRange: "",
      /** 特殊要求 */
      specialRequirements: "",
      /** 文件列表 */
      fileList: ""
    },
  }

  static OptionsModel = {
    [ApprovalApplicationConfig.instance.ApprovalAttendance]: {
      checkInType: [
        {
          label: "忘记打卡",
          value: "1"
        },
        {
          label: "外出办事",
          value: "2"
        }
      ],
      timeSlot: [
        {
          label: "上班",
          value: "1"
        },
        {
          label: "下班",
          value: "2"
        },
        {
          label: "全天",
          value: "3"
        }
      ]
    },
    [ApprovalApplicationConfig.instance.ApprovalDemand]: {
      demandCause: [
        { value: "1", label: "离职补充" },
        { value: "2", label: "员工内部调动补充" },
        { value: "3", label: "拟替换不合格者" },
        { value: "4", label: "工作量增加" },
        { value: "5", label: "新业务拓展" },
      ],
      gender: [
        {
          label: "不限",
          value: "0"
        },
        {
          label: "男",
          value: "1"
        },
        {
          label: "女",
          value: "2"
        },
      ]
    }
  }

  private static DescriptionModelTpl(label: string, valuefn?: string | ((applicationDetail: ACTIONS.Approval.Application.Detail.State, key: string) => string)) {
    return {
      label,
      value(applicationDetail: ACTIONS.Approval.Application.Detail.State, key: string) {
        if (valuefn) {
          if (typeof valuefn === 'string') {
            const ddq = applicationDetail[key].split(valuefn)
            if (ApprovalApplicationConfig.instance.options[key]) {
              return ddq.map(item => {
                return ApprovalApplicationConfig.instance.options[key].find(option => option.value == item).label
              }).join('，')
            } else {
              return ddq.map(item => {
                return (item + "").replace(/\n/g, '</br>')
              }).join('，')
            }
          } else {
            return valuefn(applicationDetail, key)
          }
        } else {
          return ApprovalApplicationConfig.instance.options[key] ? ApprovalApplicationConfig.instance.options[key].find(option => option.value == applicationDetail[key]).label :
            (applicationDetail[key] + "").replace(/\n/g, '</br>')
        }
      }
    }
  }

  static DescpritionModel = {
    [ApprovalApplicationConfig.instance.ApprovalAttendance]: {
      checkInDate: ApprovalApplicationConfig.DescriptionModelTpl("补签日期", ","),
      checkInType: ApprovalApplicationConfig.DescriptionModelTpl("补签原因", ","),
      timeSlot: ApprovalApplicationConfig.DescriptionModelTpl("补签时段", ","),
      reason: ApprovalApplicationConfig.DescriptionModelTpl("补签备注", "|"),
    },
    [ApprovalApplicationConfig.instance.ApprovalOvertime]: {
      startTime: ApprovalApplicationConfig.DescriptionModelTpl("加班时段", function (detail: any, key) {
        const startTime = detail.startTime.split(',')
        const endTime = detail.endTime.split(',')
        return startTime.map((item, index) => {
          return [startTime[index] + ' 至 ' + endTime[index]]
        }).join('</br>')
      }),
      duration: ApprovalApplicationConfig.DescriptionModelTpl("加班时效", ","),
      reason: ApprovalApplicationConfig.DescriptionModelTpl("加班事由", ","),
    },
    [ApprovalApplicationConfig.instance.ApprovalDemand]: {
      age: ApprovalApplicationConfig.DescriptionModelTpl("年龄"),
      education: ApprovalApplicationConfig.DescriptionModelTpl("学历"),
      profession: ApprovalApplicationConfig.DescriptionModelTpl("专业"),
      gender: ApprovalApplicationConfig.DescriptionModelTpl("性别"),
      position: ApprovalApplicationConfig.DescriptionModelTpl("需求岗位", function (detail, key) {
        if (ApprovalApplicationConfig.instance.$getters.department_id_dictionary) {
          const departmentId: string = detail[key]
          return ApprovalApplicationConfig.instance.$getters.department_id_dictionary[departmentId].name
        }
        return ""
      }),
      positionNumber: ApprovalApplicationConfig.DescriptionModelTpl("需求人数"),
      demandCause: ApprovalApplicationConfig.DescriptionModelTpl("需求原因"),
      arrivalDate: ApprovalApplicationConfig.DescriptionModelTpl("期待到岗日"),
      fixedPeople: ApprovalApplicationConfig.DescriptionModelTpl("岗位定编人数"),
      alreadyPeople: ApprovalApplicationConfig.DescriptionModelTpl("岗位现有人数"),
      salaryRange: ApprovalApplicationConfig.DescriptionModelTpl("建议薪资范围", function (detail, key) {
        const range = detail[key].split(",")
        return range.join(' 至 ') + " 元/月"
      }),
      jobResponsibilities: ApprovalApplicationConfig.DescriptionModelTpl("主要工作职责"),
      specialRequirements: ApprovalApplicationConfig.DescriptionModelTpl("特殊要求（行业经验、地域 、相关企业工作经验等）"),
      annexPath: ApprovalApplicationConfig.DescriptionModelTpl("附件", function (detail, key) {
        const path = detail[key]
        return `<a href="${RgServerBaseUrl + '/file/download?filePath=' + path}" target="_blank">查看</a>`
      }),
    }
  }

  static PeriodModel = (function () {
    const options: {
      label: string;
      value: number;
    }[] = [];
    const map = {}
    for (let i = 6; i <= 23; i++) {
      if (i === 13) continue;
      const whole = {
        label: i + ":00",
        value: i
      }
      const half = {
        label: i + ":30",
        value: i + 0.5
      }
      options.push(whole);
      map[whole.value] = whole.label
      options.push(half);
      map[half.value] = half.label
    }
    return {
      options,
      map
    };
  })()

  get period() {
    return ApprovalApplicationConfig.PeriodModel
  }


}