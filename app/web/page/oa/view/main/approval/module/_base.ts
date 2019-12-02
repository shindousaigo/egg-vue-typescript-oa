import { Component, Prop, Vue } from "vue-property-decorator";
// @ts-ignore
import { ACTIONS } from "web/page/oa/store/actions/types";
// @ts-ignore
import { Enum } from "web/page/oa/store/actions/index"
// @ts-ignore
import { ApprovalAttendance, ApprovalDemand } from "../../../../router/const";
import moment from "moment"

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

@Component<Base>({
  created() {
    this.init()
  }
})
export default class Base extends Vue {
  query: {
    date?: string
    serialNumber?: string
  } = this.$state.route.query
  approvalApplicationDetail: ACTIONS.Approval.Application.Detail.State = {} as any
  approvalList: ACTIONS.Approval.List.State = []
  curApprovalInfo: ACTIONS.Approval.List.Item = {} as any
  nextApproverId: string[] = []
  nextApproverName: string[] = [];

  get userInfo() {
    return this.$getters.user_dictionary[this.$state.userid]
  }

  get departmentId() {
    return this.userInfo && this.userInfo.department.join(",")
  }

  params_model = {
    [ApprovalAttendance]: {
      applicationType: 1,
      userId: this.$state.userid,
      departmentId: this.departmentId,
      checkInDate: "",
      checkInType: "",
      timeSlot: "",
      reason: ""
    },
    [ApprovalDemand]: {
      /** 申请类型 */
      applicationType: 6,
      /** 需求部门id */
      departmentId: this.departmentId,
      /** 申请人 */
      userId: this.$state.userid,
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

  get params() {
    const params = this.params_model[this.$state.route.params.component]
    return params
  }

  handleApprovalApplication(serialNumber: string) {
    this.$dispatch.approval_application_detail({
      serialNumber
    }).then(data => {
      this.approvalApplicationDetail = data
    })
  }

  handleApprovalList(serialNumber: string) {
    this.$dispatch.approval_list({
      serialNumber
    }).then(data => {
      this.approvalList = data
      this.approvalList.forEach(item => {
        if (item.approvalResult === Enum.ApprovalResult.Pending) {
          this.curApprovalInfo = item
          if (item.nextApproverId) {
            this.nextApproverId = item.nextApproverId.split(",")
          }
          if (item.nextApproverName) {
            this.nextApproverName = item.nextApproverName.split(",")
          }
        }
      })
    })
  }

  submit() {
    let formData: FormData
    if (this.params.fileList) {
      formData = new FormData
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
      formData.forEach(function (v, k) {
        console.log(k, v)
      })
    } else {
      formData = this.params
      console.log(formData)
    }
    return
    // this.$dispatch.approval_application(formData)
  }

  init() {
    if (this.query.serialNumber) {
      this.handleApprovalApplication(this.query.serialNumber)
      this.handleApprovalList(this.query.serialNumber)
    }
  }
}