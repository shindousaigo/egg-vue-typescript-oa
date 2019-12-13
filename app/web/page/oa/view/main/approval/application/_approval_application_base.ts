
import { Component, Vue, Provide } from "vue-property-decorator";
import ApprovalApplicationConfig from "./_approval_application_config";
import { ACTIONS } from "../../../../store/actions/types";

@Component<ApprovalApplicationBase>({
  created() {
    this.params = Object.assign({}, this.StaticApprovalApplicationConfig.ParamsModel[this.component])
  }
})
export default class ApprovalApplicationBase extends ApprovalApplicationConfig {
  @Provide("provider")
  get provider() {
    return this
  }

  params: ACTIONS.Approval.Application.Params | null = null

  parseParams() {
    const params = Object.assign({}, this.params)
    Object.keys(params).forEach(key => {
      if (!params[key] && this[key]) {
        params[key] = this[key]
      } else if (key === "applicantTopics" || key === "personnelTopics") {
        params[key] = JSON.stringify(params[key])
      }
    })
    return params
  }

  async submit(errors: string[]) {
    if (errors.length === 0) {
      const params = this.parseParams()
      if (params) {
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
        return data
      }
    } else {
      console.error(errors)
      return errors
    }
  }
}

