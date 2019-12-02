<template>
  <div class="attendance">
    <el-row type="flex" justify="center" class="title">
      {{ dateScope }} 考勤记录
    </el-row>
    <el-button size="mini" class="download" @click="download">
      公司考勤.xls
    </el-button>
    <component class="date-picker" :is="require(`./date_picker`).default" />
    <component :is="require(`./calendar`).default" />
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import { RgServerBaseUrl } from '../../../../const_oa';

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
  .date-picker {
    position: absolute;
    left: 0;
    top: 15px;
  }
  .title {
    margin: 22px 0 16px 0;
    width: 980px;
  }
  .download {
    position: absolute;
    left: 902px;
    top: 15px;
  }
}
</style>
