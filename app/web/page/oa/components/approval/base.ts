import { Component, Prop, Vue } from "vue-property-decorator";
import { ACTIONS } from "../../store/actions/types";
import { Enum } from "../../store/actions";
import { Or } from "../../../../typings/global";

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
  approvalApplicationDetail: Or<ACTIONS.Approval.Application.Detail.State, null> = null
  approvalList: ACTIONS.Approval.List.State = []
  curApprovalInfo: Or<ACTIONS.Approval.List.Item, null> = null
  nextApproverId: string[] = []
  nextApproverName: string[] = []

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

  submit(formData: ACTIONS.Approval.Application.Params) {
    this.$dispatch.approval_application(formData)
  }

  init() {
    if (this.query.serialNumber) {
      this.handleApprovalApplication(this.query.serialNumber)
      this.handleApprovalList(this.query.serialNumber)
    }
  }
}