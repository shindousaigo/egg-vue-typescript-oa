<template>
  <div class="demand">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input
          v-required="params.demand.position"
          v-model="params.demand.position"
          placeholder="审批人"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select
          v-required="params.demand.arrivalDate"
          v-model="params.demand.arrivalDate"
          placeholder="活动区域"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-upload
        ref="upload"
        class="upload-box"
        action
        drag
        multiple
        :auto-upload="false"
        :before-upload="() => false"
        :on-change="onFileChanged"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-form-item>
        <el-button type="primary" v-required="submit">submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Base from "./base";

@Component<Demand>({
  async created() {}
})
export default class Demand extends Base {
  onFileChanged(file, fileList) {
    this.params.demand.fileList = fileList;
  }
}
</script>

<style lang="scss">
</style>
