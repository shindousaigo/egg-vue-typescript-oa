import moment from "moment"
import { ACTIONS } from "../../../../store/actions/types";
import { RgServerBaseUrl } from "../../../../const_oa";
import { Component, Vue, Provide } from "vue-property-decorator";
import DashboardUserinfoBase from "../../dashboard/userinfo/_dashboard_userinfo_base";
import HeaderBase from "../../../_header_base";

@Component<ApprovalApplicationConfig>({
  created() { }
})
export default class ApprovalApplicationConfig extends DashboardUserinfoBase {

  static _ins: ApprovalApplicationConfig
  static get instance() {
    return this._ins || new ApprovalApplicationConfig
  }
  constructor() {
    super()
    ApprovalApplicationConfig._ins = this
  }

  get StaticApprovalApplicationConfig() {
    return ApprovalApplicationConfig
  }

  get component() {
    return this.$state.route.params[this.ApprovalComponentRegex] || this.$state.route.params[this.ApprovalApplicationDetailComponentRegex]
  }

  get applicationDate() {
    return moment().format("YYYY-MM-DD")
  }

  get options() {
    return ApprovalApplicationConfig.OptionsModel
  }

  get description() {
    return ApprovalApplicationConfig.DescpritionModel[this.component] || {}
  }

  get period() {
    return ApprovalApplicationConfig.PeriodModel
  }

  static ParamsModel = {
    [ApprovalApplicationConfig.instance.ApprovalApplication.attendance]: {
      /** 申请类型 */
      applicationType: "1",
      /** 申请人 */
      userId: "",
      /** 需求部门id */
      departmentId: "",
      /** 申请日期	 */
      applicationDate: "",
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
    [ApprovalApplicationConfig.instance.ApprovalApplication.overtime]: {
      /** 申请类型 */
      applicationType: "2",
      /** 申请人 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 需求部门id */
      departmentId: "",
      /** 申请日期	 */
      applicationDate: "",
      reason: "",
      startTime: "",
      endTime: "",
      duration: "",
    },
    [ApprovalApplicationConfig.instance.ApprovalApplication.leave]: {
      /** 申请类型 */
      applicationType: "3",
      /** 申请人	 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 需求部门id */
      departmentId: "",
      /** 申请日期	 */
      applicationDate: "",
      leaveType: "",
      childrenType: "",
      startTime: "",
      endTime: "",
      duration: 0,
      reason: "",
      handover: "",
    },
    [ApprovalApplicationConfig.instance.ApprovalApplication.admission]: {
      /** 申请类型 */
      applicationType: "4",
      /** 申请人	 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 需求部门id */
      departmentId: "",
      /** 申请日期	 */
      applicationDate: "",
      /** 工号 */
      employeeNumber: "",
      /** 中文名 */
      userNameCn: "",
      /** 英文名 */
      userNameEn: "",
      /** 入职时间 */
      entryDate: "",
      /** 所属公司 */
      companyId: "",
      /** 所属部门 */
      departmentName: "",
      /** 职位名称 */
      position: "",
      /** 业务导师 */
      businessTutorUserName: "",
      /** 汇报上级 */
      spervisorUserName: "",
      /** 电脑配置 */
      computerConfiguration: "",
      /** 办公用品 */
      isOfficeSupplies: "",
      /** 其他配置 */
      otherConfiguration: "",
      /** 可上传文件 */
      fileList: ""
    },
    [ApprovalApplicationConfig.instance.ApprovalApplication.dismission]: {
      // return {
      /** 申请类型 */
      applicationType: "5",
      /** 申请人	 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 申请人部门id */
      departmentId: "",
      /** 申请日期	 */
      applicationDate: "",
      /** 申请人姓名 */
      userName: "",
      /** 职务 */
      position: "",
      /** 工号 */
      employeeNumber: "",
      /** 邮箱 */
      email: "",
      /** 入职日期 格式 例：2019-01-01 */
      entryDate: "",
      /** 预离职日期 格式 例：2019-01-01 */
      estimatedDepartureDate: "",
      /** 离职原因 */
      reason: "",
      /** 模板id 接口四，问卷查询接口获得 */
      templateId: "",
      /** 申请人填写问题 */
      applicantTopics: [],
      /** 人事填写问题 */
      personnelTopics: []
      // }
    },
    [ApprovalApplicationConfig.instance.ApprovalApplication.demand]: {
      /** 申请类型 */
      applicationType: "6",
      /** 申请人 */
      userId: ApprovalApplicationConfig.instance.$state.userid,
      /** 需求部门id */
      departmentId: "",
      /** 申请日期	 */
      applicationDate: "",
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
    }
  }

  static Cache = {}

  static OptionsModel = {
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
    ],
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
    ],
    get department() {
      const $cache = ApprovalApplicationConfig.instance.$cache, CacheKey = 'OptionsModel.department'
      if ($cache.get(CacheKey)) {
        return $cache.get(CacheKey)
      }
      const dictionary = ApprovalApplicationConfig.instance.$getters.department_id_dictionary
      if (dictionary) {
        let options = Object.keys(dictionary)
          .filter(
            id => !dictionary[id].children.length
          )
          .map(id => ({
            value: id,
            label: dictionary[id].name,
          }));
        $cache.set(CacheKey, options)
        return options
      }
    },
    companyId: [
      {
        value: "0",
        label: "逍遥盛世"
      },
      {
        value: "1",
        label: "昊立信"
      },
    ],
    computerConfiguration: [
      {
        value: "1",
        label: "普通电脑标配"
      },
      {
        value: "2",
        label: "美术电脑+手写板"
      },
      {
        value: "3",
        label: "普通电脑标配+固态硬盘"
      },
      {
        value: "4",
        label: "内外网双机"
      },
    ],
    isOfficeSupplies: [
      {
        value: "0",
        label: "未准备"
      },
      {
        value: "1",
        label: "已准备"
      }
    ]
  }

  static DescriptionModelTpl(label: string, valuefn?: string | ((detail: ACTIONS.Approval.Application.Detail.State, key: string) => string)) {
    return {
      label,
      value(detail: ACTIONS.Approval.Application.Detail.State, key: string) {
        if (valuefn) {
          if (typeof valuefn === 'string') {
            const ddq = detail[key].split(valuefn)
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
            return valuefn(detail, key)
          }
        } else {
          return ApprovalApplicationConfig.instance.options[key] ? ApprovalApplicationConfig.instance.options[key].find(option => option.value == detail[key]).label :
            (detail[key] + "").replace(/\n/g, '</br>')
        }
      }
    }
  }

  static DescpritionModel = {
    [ApprovalApplicationConfig.instance.ApprovalApplication.attendance]: {
      checkInDate: ApprovalApplicationConfig.DescriptionModelTpl("补签日期", ","),
      checkInType: ApprovalApplicationConfig.DescriptionModelTpl("补签原因", ","),
      timeSlot: ApprovalApplicationConfig.DescriptionModelTpl("补签时段", ","),
      reason: ApprovalApplicationConfig.DescriptionModelTpl("补签备注", "|"),
    },
    [ApprovalApplicationConfig.instance.ApprovalApplication.overtime]: {
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
    [ApprovalApplicationConfig.instance.ApprovalApplication.leave]: {
      leaveType: ApprovalApplicationConfig.DescriptionModelTpl("休假类别", function (detail, key) {
        const id = detail[key]
        if (ApprovalApplicationConfig.instance.$getters.leave_type_dictionary) {
          let add = "", item = ApprovalApplicationConfig.instance.$getters.leave_type_dictionary[id]
          if (item.children) {
            const find = item.children.find(_ => _.id === Number(detail.childrenType))
            add = find ? `（${find.leaveName}）` : add
          }
          return item.leaveName + add
        }
        return id
      }),
      startTime: ApprovalApplicationConfig.DescriptionModelTpl('休假时段', function (detail, key) {
        return [detail.startTime, detail.endTime].join(' 至 ') + '</br>' + '时段时效：' + ApprovalApplicationConfig.instance.$hours(detail.duration)
      }),
      reason: ApprovalApplicationConfig.DescriptionModelTpl('请假事由'),
      handover: ApprovalApplicationConfig.DescriptionModelTpl('交接事项'),
    },
    [ApprovalApplicationConfig.instance.ApprovalApplication.admission]: {
      employeeNumber: ApprovalApplicationConfig.DescriptionModelTpl('工号'),
      userNameCn: ApprovalApplicationConfig.DescriptionModelTpl('中文名'),
      userNameEn: ApprovalApplicationConfig.DescriptionModelTpl('英文名'),
      entryDate: ApprovalApplicationConfig.DescriptionModelTpl('入职时间', function (detail) {
        return detail.entryDate.slice(0, 10)
      }),
      companyId: ApprovalApplicationConfig.DescriptionModelTpl('所属公司'),
      departmentName: ApprovalApplicationConfig.DescriptionModelTpl('所属部门'),
      position: ApprovalApplicationConfig.DescriptionModelTpl('职位名称'),
      businessTutorUserName: ApprovalApplicationConfig.DescriptionModelTpl('业务导师'),
      spervisorUserName: ApprovalApplicationConfig.DescriptionModelTpl('汇报上级'),
      computerConfiguration: ApprovalApplicationConfig.DescriptionModelTpl('电脑配置'),
      isOfficeSupplies: ApprovalApplicationConfig.DescriptionModelTpl('办公用品'),

      otherConfiguration: ApprovalApplicationConfig.DescriptionModelTpl('其他配置'),

      annexPath: ApprovalApplicationConfig.DescriptionModelTpl("附件", function (detail, key) {
        const path = detail[key]
        return `<a href="${RgServerBaseUrl + '/file/download?filePath=' + path}" target="_blank">查看</a>`
      }),
    },
    [ApprovalApplicationConfig.instance.ApprovalApplication.demand]: {
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

}