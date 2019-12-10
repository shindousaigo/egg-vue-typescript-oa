
import { Component, Vue, Provide } from "vue-property-decorator";
import ApprovalApplicationConfig from "./_approval_application_config";
import { ACTIONS } from "../../../../store/actions/types";

@Component<ApprovalApplicationBase>({
  created() {
    this.params = Object.assign({}, ApprovalApplicationConfig.ParamsModel[this.component])
  },
})
export default class ApprovalApplicationBase extends ApprovalApplicationConfig {
  @Provide("provider")
  get provider() {
    return this
  }
  params: null | ACTIONS.Approval.Application.Params.Attendance | ACTIONS.Approval.Application.Params.Overtime | ACTIONS.Approval.Application.Params.Leave | ACTIONS.Approval.Application.Params.Demand = null
  async submit() {
    if (this.params) {
      const params = this.params
      const formData = new FormData
      Object.keys(params).forEach(function (key: string) {
        if (key === "fileList" && params.fileList.length) {
          params.fileList.forEach(function (item, index) {
            formData.set("file" + index, item.raw);
          })
        } else {
          const val = String(params[key]).trim()
          formData.set(key, val);
        }
      });
      const data = await this.$dispatch.approval_application(formData as any)
      data.code && this.$router.push({
        path: this.DashboardBase
      })
    }
  }
}

