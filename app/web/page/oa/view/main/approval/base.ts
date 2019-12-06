import moment from "moment"
import { Component, Vue, Provide } from "vue-property-decorator";
import { ACTIONS } from "../../../store/actions/types";
import { ApprovalAttendance, ApprovalDemand } from "../../../router/const";
import { RgServerBaseUrl } from "../../../const_oa";

type UploadFileList = {
  name: string;
  percentage: number;
  raw: File;
  size: number;
  status: string;
  uid: number;
}[]

const ParamsModel = "params_model"
export type ApprovalParamsModel = typeof ParamsModel
export type ApprovalParamsAttendance = typeof ApprovalAttendance
export type ApprovalParamsDemand = typeof ApprovalDemand

@Component<ApprovalBase>({
  created() {
    this.params = Object.assign({}, ApprovalBase.params_model[this.component])
  },
})
export default class ApprovalBase extends Vue {
  @Provide("provider")
  get provider() {
    return this
  }
  params: ACTIONS.Approval.Application.Params = "" as any
  private static ins: ApprovalBase
  public static get instance(): ApprovalBase {
    return this.ins || new ApprovalBase
  }
  constructor() {
    super()
    ApprovalBase.ins = this
  }

  private static ApplicationType = {
    [ApprovalAttendance]: "1" as "1",
    [ApprovalDemand]: "6" as "6",
  }

  static params_model = {
    [ApprovalAttendance]: {
      /** 申请类型 */
      applicationType: ApprovalBase.ApplicationType[ApprovalAttendance],
      /** 申请人 */
      userId: ApprovalBase.instance.$state.userid,
      /** 需求部门id */
      get departmentId() {
        return ApprovalBase.instance.departmentId
      },
      /** 补签日期 */
      checkInDate: "",
      /** 补签原因 */
      checkInType: "",
      /** 补签时段 */
      timeSlot: "",
      /** 补签备注 */
      reason: "",
      /** 文件列表 */
      fileList: [] as UploadFileList
    },
    [ApprovalDemand]: {
      /** 申请类型 */
      applicationType: ApprovalBase.ApplicationType[ApprovalDemand],
      /** 申请人 */
      userId: ApprovalBase.instance.$state.userid,
      /** 需求部门id */
      get departmentId() {
        return ApprovalBase.instance.departmentId
      },
      /** 申请日期	 */
      applicationDate: moment().format("YYYY-MM-DD"),
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
      fileList: [] as UploadFileList
    }
  }

  private static detial_model_item_tpl(label: string, valuefn?: (applicationDetail: ACTIONS.Approval.Application.Detail.State, key: string) => string) {
    return {
      label,
      value(applicationDetail: ACTIONS.Approval.Application.Detail.State, key: string) {
        return valuefn ? valuefn(applicationDetail, key) :
          ApprovalBase.instance.options[key] ? ApprovalBase.instance.options[key].find(option => option.value == applicationDetail[key]).label :
            (applicationDetail[key] + "").replace(/\n/g, '</br>')
      }
    }
  }

  private static detail_model = {
    [ApprovalAttendance]: {
      checkInDate: ApprovalBase.detial_model_item_tpl("补签日期"),
      checkInType: ApprovalBase.detial_model_item_tpl("补签原因"),
      timeSlot: ApprovalBase.detial_model_item_tpl("补签时段"),
      reason: ApprovalBase.detial_model_item_tpl("补签备注"),
    },
    [ApprovalDemand]: {
      age: ApprovalBase.detial_model_item_tpl("年龄"),
      education: ApprovalBase.detial_model_item_tpl("学历"),
      profession: ApprovalBase.detial_model_item_tpl("专业"),
      gender: ApprovalBase.detial_model_item_tpl("性别"),
      position: ApprovalBase.detial_model_item_tpl("需求岗位", function (detail, key) {
        if (ApprovalBase.instance.$getters.department_id_dictionary) {
          const departmentId: string = detail[key]
          return ApprovalBase.instance.$getters.department_id_dictionary[departmentId].name
        }
        return ""
      }),

      positionNumber: ApprovalBase.detial_model_item_tpl("需求人数"),
      demandCause: ApprovalBase.detial_model_item_tpl("需求原因"),
      arrivalDate: ApprovalBase.detial_model_item_tpl("期待到岗日"),
      fixedPeople: ApprovalBase.detial_model_item_tpl("岗位定编人数"),
      alreadyPeople: ApprovalBase.detial_model_item_tpl("岗位现有人数"),
      salaryRange: ApprovalBase.detial_model_item_tpl("建议薪资范围", function (detail, key) {
        const range = detail[key].split(",")
        return range.join(' 至 ') + " 元/月"
      }),
      jobResponsibilities: ApprovalBase.detial_model_item_tpl("主要工作职责"),
      specialRequirements: ApprovalBase.detial_model_item_tpl("特殊要求（行业经验、地域 、相关企业工作经验等）"),
      annexPath: ApprovalBase.detial_model_item_tpl("附件", function (detail, key) {
        const path = detail[key]
        return `<a href="${RgServerBaseUrl + '/file/download?filePath=' + path}" target="_blank">查看</a>`
      }),

    }
  }

  private static options_model = {
    [ApprovalAttendance]: {
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
    [ApprovalDemand]: {
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

  get departmentId() {
    return this.$getters.user_dictionary && this.$getters.user_dictionary[this.$state.userid].department.join(',')
  }

  get component() {
    return this.$state.route.params[this.ApprovalComponentRegex] || this.$state.route.params[this.ApprovalApplicationDetailComponentRegex]
  }

  get options() {
    return ApprovalBase.options_model[this.component]
  }

  get detail() {
    return ApprovalBase.detail_model[this.component]
  }

  async submit() {
    let formData = new FormData
    for (let key in this.params) {
      switch (key) {
        case "fileList":
          this.params.fileList.forEach((item, index) => {
            formData.set("file" + index, item.raw);
          });
          break;
        default:
          const val = (this.params[key] + "").trim();
          formData.set(key, val);
          break;
      }
    }
    const data = await this.$dispatch.approval_application(formData as any)
    data.code && this.$router.push({
      path: this.DashboardBase
    })
  }
}

