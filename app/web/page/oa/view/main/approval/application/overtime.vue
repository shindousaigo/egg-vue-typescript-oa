<template>
  <div class="approval overtime">
    <card addSubmit>
      <el-row type="flex">
        <span class="label">*加班事由：</span>
        <el-input
          style="width: 180px"
          size="mini"
          type="number"
          v-model="params.age"
          v-required="params.age"
        >
        </el-input>
      </el-row>
    </card>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import Base, { ApprovalParamsModel, ApprovalParamsDemand } from "../base";

@Component<Demand>({
  components: {
    card: require(`../card.vue`).default
  },
  created() {}
})
export default class Demand extends Base {
  params: typeof Base[ApprovalParamsModel][ApprovalParamsDemand];
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
.approval.overtime {
}
</style>
