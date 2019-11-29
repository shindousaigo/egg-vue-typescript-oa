import { Component, Prop, Vue } from "vue-property-decorator";
import { ACTIONS } from "../../store/actions/types";
import { Enum } from "../../store/actions";
import moment from "moment";

type UploadFileList = {
  name: string;
  percentage: number;
  raw: File;
  size: number;
  status: string;
  uid: number;
}[]
const Params = "params"
const Attendance = "attendance"
const Demand = "demand"
export type ApprovalParams = typeof Params
export type ApprovalParamsAttendance = typeof Attendance
export type ApprovalParamsDemand = typeof Demand

@Component<ApprovalBase>({
  created() {
    this.init()
  }
})
export default class ApprovalBase extends Vue {
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
    return this.userInfo.department.join(",")
  }

  [Params] = {
    [Attendance]: {
      applicationType: 1,
      userId: this.$state.userid,
      departmentId: "",
      checkInDate: "",
      checkInType: "",
      timeSlot: "",
      reason: ""
    },
    [Demand]: {
      /** 申请类型 */
      applicationType: 6,
      /** 需求部门id */
      departmentId: this.departmentId,
      /** 申请人 */
      userId: this.userInfo.userid,
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
    let params = this[Params][this.$state.route.params.component]
    if (params.fileList) {
      let formData = new FormData
      for (let key in params) {
        switch (key) {
          case "fileList":
            params.fileList.forEach((item, index) => {
              formData.set("file" + index, item.raw);
            });
            break;
          default:
            const val = (params[key] + "").trim();
            formData.set(key, val);
            break;
        }
      }
      params = formData
    }
    this.console.log(params)
    return
    // this.$dispatch.approval_application(params)
  }

  init() {
    if (this.query.serialNumber) {
      this.handleApprovalApplication(this.query.serialNumber)
      this.handleApprovalList(this.query.serialNumber)
    }
  }
}