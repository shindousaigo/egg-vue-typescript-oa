<template>
  <div class="attendance">
    <div style="position: relative;">
      <component class="date-picker" :is="require(`./date_picker`).default" />
      <el-row type="flex" justify="center" class="title">
        {{ dateScope }} 考勤记录
      </el-row>
      <el-button size="mini" class="download" @click="download">
        公司考勤.xls
      </el-button>
    </div>
    <component :is="require(`./calendar`).default" />
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import { RgServerBaseUrl } from "../../../../const_oa";

@Component<Attendance>({
  beforeDestroy() {
    this.$commit.attendance_date(new Date());
  }
})
export default class Attendance extends Vue {
  get dateScope() {
    return this.$getters.attendance_date_scope.join(` 至 `);
  }
  download() {
    window.open(
      `${RgServerBaseUrl}/file/attendance?startTime=${this.$getters.attendance_date_scope[0]}&endTime=${this.$getters.attendance_date_scope[1]}`
    );
  }
}
</script>
<style lang="scss">
.attendance {
  color: rgb(96, 98, 102);
  .date-picker {
    position: absolute;
    left: 0;
    top: -6px;
  }
  .title {
    z-index: -1;
    margin: 22px 0 16px 0;
    width: 980px;
  }
  .download {
    position: absolute;
    left: 902px;
    top: -6px;
  }
}
</style>
