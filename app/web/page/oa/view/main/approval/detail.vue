<template>
  <div class="application-detail">
    <!-- 办理流程卡 -->
    <card>
      <div slot="header">
        <span>状态：</span>
        <span>{{ approvalStatus }}</span>
      </div>
      <div>
        <el-row type="flex">
          <span class="label">表单号：</span>
          <span>{{ applicationDetailSerialNumber }}</span>
        </el-row>
        <el-row type="flex">
          <span class="label">创建日期：</span>
          <span>{{ createTime }}</span>
        </el-row>
        <el-row type="flex">
          <span class="label">创建人：</span>
          <span>{{ creator }}</span>
        </el-row>
        <el-row type="flex">
          <span class="label">已审批：</span>
          <span :class="approved === nonnull && `disabled`">
            {{ approved }}
          </span>
        </el-row>
        <el-row type="flex">
          <span class="label">待审批：</span>
          <span :class="curApprove === nonnull && `disabled`">
            {{ curApprove }}
          </span>
        </el-row>
        <el-row type="flex">
          <span class="label">未审批：</span>
          <span :class="nextApprove === nonnull && `disabled`">
            {{ nextApprove }}
          </span>
        </el-row>
      </div>
    </card>
    <card style="padding-bottom: 40px;">
      <div v-for="item in detailList" :key="item">
        <el-row type="flex" v-if="approvalApplicationDetail[item]">
          <span class="label" style="max-width: 118px;">
            {{ description[item].label }}：</span
          >
          <span
            v-html="description[item].value(approvalApplicationDetail, item)"
          />
        </el-row>
      </div>

      <div
        class="comfirm"
        v-if="
          true ||
            (this.curApprovalInfo && this.curApprovalInfo.userId) ===
              $state.userid
        "
      >
        <el-button
          class="reject"
          size="small"
          type="primary"
          @click="confirm.call(this, Enum.ApprovalResult.Reject)"
        >
          否决
        </el-button>
        <el-button
          class="agree"
          size="small"
          type="primary"
          v-required="confirm"
        >
          同意
        </el-button>
      </div>
    </card>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ACTIONS } from "web/page/oa/store/actions/types";
import { Enum } from "web/page/oa/store/actions/index";
import ApprovalApplicationConfig from "./application/_approval_application_config";

@Component<ApplicationDetail>({
  async created() {
    this.handleApprovalApplication();
    this.handleApprovalList();
  },
  components: {
    card: require("./application/_item/card.vue").default
  }
})
export default class ApplicationDetail extends ApprovalApplicationConfig {
  nonnull = "无";
  approvalApplicationDetail?: ACTIONS.Approval.Application.Detail.State = "" as any;
  approvalList?: ACTIONS.Approval.List.State = "" as any;
  curApprovalInfo?: ACTIONS.Approval.List.Item = "" as any;
  nextApproverId: string[] = [];
  nextApproverName: string[] = [];

  get applicationDetailComponent() {
    return this.$state.route.params[
      this.ApprovalApplicationDetailComponentRegex
    ];
  }

  get applicationDetailSerialNumber() {
    return this.$state.route.params[
      this.ApprovalApplicationDetailSerialNumberRegex
    ];
  }

  get createTime() {
    if (this.approvalApplicationDetail)
      return this.approvalApplicationDetail.createTime;
  }

  get creator() {
    if (this.approvalApplicationDetail && this.$getters.user_dictionary)
      return [
        this.$getters.user_dictionary[this.approvalApplicationDetail.userId]
          .name,
        this.approvalApplicationDetail.userId
      ].join(" - ");
  }

  get approvalStatus() {
    return this.curApprovalInfo ? "正在审批" : "审批完成";
  }

  get approved() {
    if (this.$getters.user_dictionary && this.approvalList) {
      if (this.curApprovalInfo) {
        // 审批中
        const order = this.curApprovalInfo.order;
        return (
          this.approvalList
            .filter(item => item.order < order)
            .map(({ userId }) =>
              [this.$getters.user_dictionary[userId].name, userId].join(" - ")
            )
            .join("，") || this.nonnull
        );
      } else {
        // 审批完成
        return this.approvalList
          .map(({ userId }) =>
            [this.$getters.user_dictionary[userId].name, userId].join(" - ")
          )
          .join("，");
      }
    }
  }

  get curApprove() {
    if (this.$getters.user_dictionary) {
      if (this.curApprovalInfo) {
        const userId = this.curApprovalInfo.userId;
        return [
          this.$getters.user_dictionary[userId].name,
          this.curApprovalInfo.userId
        ].join(" - ");
      } else {
        return this.nonnull;
      }
    }
  }

  get nextApprove() {
    if (this.$getters.user_dictionary) {
      if (this.curApprovalInfo && this.curApprovalInfo.nextApproverId) {
        return [
          this.$getters.user_dictionary[this.curApprovalInfo.nextApproverId]
            .name,
          this.curApprovalInfo.nextApproverId
        ].join(" - ");
      } else {
        return this.nonnull;
      }
    }
  }

  get detailList() {
    return Object.keys(this.description);
  }

  handleApprovalApplication() {
    this.$dispatch
      .approval_application_detail({
        serialNumber: this.applicationDetailSerialNumber
      })
      .then(data => {
        this.approvalApplicationDetail = data;
      })
      .catch(error => {
        this.$router.go(-1);
      });
  }

  handleApprovalList() {
    this.$dispatch
      .approval_list({
        serialNumber: this.applicationDetailSerialNumber
      })
      .then(data => {
        this.approvalList = data;
        this.approvalList.forEach(item => {
          if (item.approvalResult === Enum.ApprovalResult.Pending) {
            this.curApprovalInfo = item;
            if (item.nextApproverId) {
              this.nextApproverId = item.nextApproverId.split(",");
            }
            if (item.nextApproverName) {
              this.nextApproverName = item.nextApproverName.split(",");
            }
          }
        });
      })
      .catch(error => {
        this.$router.go(-1);
      });
  }

  async confirm(approvalResult) {
    await this.$confirm("确定提交表单吗？");
    if (this.curApprovalInfo) {
      const data = Object.assign({}, this.curApprovalInfo, { approvalResult });
      this.$dispatch.approval_confirm(data).then(data => {
        this.$router.push({
          path: this.DashboardBase
        });
      });
    }
  }
}
</script>

<style lang="scss">
.application-detail {
  .item {
    display: flex;
    align-items: center;
  }
  .el-col {
    padding: 0;
    margin: 0;
    width: auto;
    &:first-child {
      margin-left: 10px;
    }
    &.label {
      display: flex;
      align-items: center;
      font-weight: bold;
      flex-shrink: 0;
    }
    &.value {
      margin: 0 24px 0 8px;
    }
    &.fixed {
      color: rgb(156, 156, 156);
      font-size: 16px;
    }
  }
  .el-input__inner {
    min-width: 60px;
  }
  .el-input__inner,
  .el-textarea__inner {
    font-size: 14px;
    background: transparent;
    border: 0;
    margin: 10px 0;
    padding: 0 8px;
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.5);
  }
  .el-textarea__inner {
    min-height: 48px !important;
    padding: 8px 12px;
    overflow: hidden;
  }
  .el-input__prefix {
    display: none;
  }
  .full {
    width: 100% !important;
    flex-shrink: 1;
  }
  .disabled {
    color: #c5cad3;
  }
  .el-card {
    .comfirm {
      position: absolute;
      bottom: 0;
      display: flex;
      width: 100%;
      left: 0;
      .agree,
      .reject {
        font-size: 14px;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 200px;
        height: 60px;
        border: 0;
        border-top-right-radius: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .agree {
        right: 0;
      }
      .reject {
        right: 200 + 40px;
        border-bottom-right-radius: 0;
      }
    }
  }
}
</style>
