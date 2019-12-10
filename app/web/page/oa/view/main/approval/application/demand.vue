<template>
  <div class="approval demand">
    <card>
      <el-row type="flex">
        <span class="label">*{{ description.position.label }}：</span>
        <el-select
          style="width: 180px"
          size="mini"
          filterable
          clearable
          v-model="params.position"
          v-required="params.position"
        >
          <el-option
            v-for="option in departmentOptions"
            :key="option.id"
            :value="option.id"
            :label="option.name"
          ></el-option>
        </el-select>
      </el-row>
      <el-row type="flex">
        <span class="label">*{{ description.arrivalDate.label }}：</span>
        <el-date-picker
          style="width: 180px"
          size="mini"
          type="date"
          value-format="yyyy-MM-dd"
          v-model="params.arrivalDate"
          v-required="params.arrivalDate"
        ></el-date-picker>
      </el-row>
      <el-row type="flex">
        <span class="label">*{{ description.positionNumber.label }}：</span>
        <el-input
          style="width: 180px"
          size="mini"
          type="number"
          v-model="params.positionNumber"
          v-required="params.positionNumber"
        ></el-input>
      </el-row>
      <el-row type="flex">
        <span class="label">*{{ description.fixedPeople.label }}：</span>
        <el-input
          style="width: 180px"
          size="mini"
          type="number"
          v-model="params.fixedPeople"
          v-required="params.fixedPeople"
        ></el-input>
      </el-row>
      <el-row type="flex">
        <span class="label">*{{ description.alreadyPeople.label }}：</span>
        <el-input
          style="width: 180px"
          size="mini"
          type="number"
          v-model="params.alreadyPeople"
          v-required="params.alreadyPeople"
        ></el-input>
      </el-row>
      <el-row type="flex">
        <span class="label">*{{ description.demandCause.label }}：</span>
        <el-select
          style="width: 180px; margin: 0 16px 0 0;"
          size="mini"
          filterable
          clearable
          v-model="establishment"
          v-required="establishment"
          @change="params.demandCause = ``"
        >
          <el-option
            :key="option.value"
            :value="option.value"
            :label="option.label"
            v-for="option in establishmentOption"
          ></el-option>
        </el-select>
        <el-select
          style="width: 180px"
          size="mini"
          filterable
          clearable
          v-model="params.demandCause"
          v-required="params.demandCause"
        >
          <el-option
            v-for="option in options.demandCause.filter(item => {
              return (
                establishment &&
                (establishment === 1 ? item.value <= 3 : item.value > 3)
              );
            })"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-row>
      <el-row type="flex" class="full">
        <span class="label"
          >*{{ description.jobResponsibilities.label }}：</span
        >
        <el-input
          autosize
          type="textarea"
          v-model="params.jobResponsibilities"
          v-required="params.jobResponsibilities"
        ></el-input>
      </el-row>
    </card>
    <card addSubmit>
      <el-row type="flex">
        <span class="label">*{{ description.age.label }}：</span>
        <el-input
          style="width: 180px"
          size="mini"
          type="number"
          v-model="params.age"
          v-required="params.age"
        >
        </el-input>
      </el-row>

      <el-row type="flex">
        <span class="label">*{{ description.education.label }}：</span>
        <el-input
          style="width: 180px"
          size="mini"
          v-model="params.education"
          v-required="params.education"
        >
        </el-input>
      </el-row>

      <el-row type="flex">
        <span class="label">*{{ description.profession.label }}：</span>
        <el-input
          style="width: 180px"
          size="mini"
          v-model="params.profession"
          v-required="params.profession"
        >
        </el-input>
      </el-row>

      <el-row type="flex">
        <span class="label">*{{ description.gender.label }}：</span>
        <el-select
          style="width: 180px"
          size="mini"
          v-model="params.gender"
          v-required="params.gender"
        >
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in options.gender"
          />
        </el-select>
      </el-row>
      <el-row type="flex">
        <span class="label">*{{ description.salaryRange.label }}：</span>
        <el-input
          type="number"
          style="width: 180px"
          size="mini"
          v-model="salaryRangeMin"
          v-required="salaryRangeMin"
          @change="salaryRangeChange"
        ></el-input>
        <span style="margin: 0 12px;">至</span>
        <el-input
          type="number"
          style="width: 180px"
          size="mini"
          v-model="salaryRangeMax"
          v-required="salaryRangeMax"
          @change="salaryRangeChange"
        ></el-input>
        <span style="margin: 0 12px;">元/月</span>
      </el-row>
      <el-row type="flex" class="full" style="flex-direction: column;">
        <span class="label full">
          {{ description.specialRequirements.label }}：
        </span>
        <el-row type="flex" style="margin-top: 8px; margin-bottom: 0;">
          <el-input
            autosize
            type="textarea"
            v-model="params.specialRequirements"
          ></el-input>
        </el-row>
      </el-row>
      <el-row type="flex" class="full" style="flex-direction: column;">
        <span class="label full"> {{ description.annexPath.label }}： </span>
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
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import { ACTIONS } from "../../../../store/actions/types";
import ApprovalApplicationBase from "./_approval_application_base";

@Component<Demand>({
  components: {
    card: require(`./_item/card.vue`).default
  },
  created() {}
})
export default class Demand extends ApprovalApplicationBase {
  params: ACTIONS.Approval.Application.Params.Demand;
  establishment = "";
  establishmentOption = [
    {
      label: "编制内",
      value: 1
    },
    {
      label: "编制外",
      value: 2
    }
  ];
  salaryRangeMin = "";
  salaryRangeMax = "";

  get departmentOptions() {
    if (this.$getters.department_id_dictionary) {
      let departmentOptions = Object.keys(
        this.$getters.department_id_dictionary
      )
        .filter(
          id => !this.$getters.department_id_dictionary[id].children.length
        )
        .map(id => this.$getters.department_id_dictionary[id]);
      return departmentOptions;
    }
  }

  salaryRangeChange() {
    this.params.salaryRange = [this.salaryRangeMin, this.salaryRangeMax].join(
      ","
    );
  }

  onFileChanged(file, fileList) {
    this.params.fileList = fileList;
  }
}
</script>

<style lang="scss">
.approval.demand {
  .el-row {
    .label {
      width: 102px;
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
