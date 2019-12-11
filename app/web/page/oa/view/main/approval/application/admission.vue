<template>
  <div class="approval leave">
    <card addSubmit>
      <el-row type="flex">
        <span class="label">*工号：</span>
        <el-input
          size="mini"
          clearable
          style="width: 160px;"
          v-model="params.employeeNumber"
          v-required="params.employeeNumber"
        ></el-input>
      </el-row>
      <el-row type="flex">
        <span class="label">*中文名：</span>
        <el-input
          size="mini"
          clearable
          style="width: 160px;"
          v-model="params.userNameCn"
          v-required="params.userNameCn"
        ></el-input>
      </el-row>
      <el-row type="flex">
        <span class="label">*英文名：</span>
        <el-input
          size="mini"
          clearable
          style="width: 160px;"
          v-model="params.userNameEn"
          v-required="params.userNameEn"
        ></el-input>
      </el-row>

      <el-row type="flex">
        <span class="label">*入职时间：</span>
        <el-date-picker
          size="mini"
          type="date"
          style="margin: 0 16px 0 0; width: 180px;"
          placeholder="选择日期"
          value-format="yyyy-MM-dd hh:mm:ss"
          v-model="params.entryDate"
          v-required="params.entryDate"
        >
        </el-date-picker>
      </el-row>
      <el-row type="flex">
        <span class="label">*所属公司：</span>
        <el-select
          style="width: 130px"
          size="mini"
          filterable
          clearable
          v-model="params.companyId"
          v-required="params.companyId"
        >
          <el-option
            v-for="option in options.companyId"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-row>
      <el-row type="flex">
        <span class="label">*所属部门：</span>
        <el-select
          style="width: 180px"
          size="mini"
          filterable
          clearable
          v-model="params.departmentName"
          v-required="params.departmentName"
        >
          <el-option
            v-for="option in options.department"
            :key="option.value"
            :value="option.label"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-row>
      <el-row type="flex">
        <span class="label">*职位名称：</span>
        <el-input
          size="mini"
          clearable
          style="width: 160px;"
          v-model="params.position"
          v-required="params.position"
        ></el-input>
      </el-row>

      <el-row type="flex">
        <span class="label">*业务导师：</span>
        <el-input
          size="mini"
          clearable
          style="width: 160px;"
          v-model="params.businessTutorUserName"
          v-required="params.businessTutorUserName"
        ></el-input>
      </el-row>

      <el-row type="flex">
        <span class="label">*汇报上级：</span>
        <el-input
          size="mini"
          clearable
          style="width: 160px;"
          v-model="params.spervisorUserName"
          v-required="params.spervisorUserName"
        ></el-input>
      </el-row>

      <el-row type="flex">
        <span class="label">*电脑配置：</span>
        <el-select
          style="width: 180px"
          size="mini"
          filterable
          clearable
          v-model="params.computerConfiguration"
          v-required="params.computerConfiguration"
        >
          <el-option
            v-for="option in options.computerConfiguration"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-row>

      <el-row type="flex">
        <span class="label">*办公用品：</span>
        <el-select
          style="width: 180px"
          size="mini"
          filterable
          clearable
          v-model="params.isOfficeSupplies"
          v-required="params.isOfficeSupplies"
        >
          <el-option
            v-for="option in options.isOfficeSupplies"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-row>

      <el-row type="flex">
        <span class="label">其他配置：</span>
        <el-input
          size="mini"
          type="textarea"
          clearable
          v-model="params.otherConfiguration"
        ></el-input>
      </el-row>

      <el-row type="flex" class="full" style="flex-direction: column;">
        <span class="label full">可上传文件（可选）： </span>
        <el-row type="flex" style="margin-top: 8px; margin-bottom: 0;">
          <el-upload
            ref="upload"
            action
            drag
            multiple
            :auto-upload="false"
            :before-upload="() => false"
            :on-change="onFileChanged"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-row>
      </el-row>
    </card>
  </div>
</template>
 
<script lang="ts">
import moment from "moment";
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import ApprovalApplicationBase from "./_approval_application_base";
import { ACTIONS } from "../../../../store/actions/types";

@Component<Leave>({
  components: {
    card: require(`./_item/card.vue`).default
  },
})
export default class Leave extends ApprovalApplicationBase {
  onFileChanged(file, fileList) {
    this.params.fileList = fileList;
  }
}
</script>

<style lang="scss">
.approval.leave {
  .el-row {
    .label {
      width: 102px;
      &.invalid {
        color: red;
      }
    }
    margin: 14px 0;
    line-height: 26px;
    font-size: 13px;
    textarea {
      min-height: 56px !important;
    }
  }
}
</style>
