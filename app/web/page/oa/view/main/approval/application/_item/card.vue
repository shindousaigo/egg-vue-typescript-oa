<template>
  <el-card class="card-submit" :class="addSubmit === null ? `` : `add-submit`">
    <slot />
    <el-button
      v-if="addSubmit !== null"
      type="primary"
      class="submit"
      :disabled="isDisabled"
      v-required="submit"
    >
      提交
    </el-button>
  </el-card>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import ApprovalApplicationBase from "../_approval_application_base";

@Component<CardSubmit>({})
export default class CardSubmit extends Vue {
  @Prop({
    default: null
  })
  addSubmit!: boolean;
  @Inject({
    from: "provider",
    default: {}
  })
  provider: ApprovalApplicationBase;
  async submit(error) {
    this.isDisabled = true;
    await this.provider.submit(error);
    this.isDisabled = false;
  }
  isDisabled = false;
  submitClick() {
    console.log("submitClick");
  }
}
</script>

<style lang="scss">
.card-submit {
  position: relative;
  margin: 32px;
  color: rgb(96, 98, 102);
  &.add-submit {
    padding-bottom: 40px;
  }
  .el-row--flex {
    min-height: 0 !important;
    margin: 8px 0;
    line-height: 23px;
    .label {
      flex-shrink: 0;
      margin-right: 10px;
    }
  }
  .el-card__header {
    width: 94%;
    margin: 8px 0 0 3%;
    font-size: 14px;
    padding: 16px 20px;
  }
  .el-card__body {
    width: 100%;
    margin: 8px 0;
    font-size: 14px;
    padding-left: 3.5%;
    padding-right: 3.5%;
    box-sizing: border-box;
  }
  .submit {
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
}
</style>
