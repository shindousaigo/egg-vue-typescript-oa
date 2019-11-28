<template>
  <div class="approval">
    <div class="description">
      <div>
        于上月（{{ lastStartTime }} 至 {{ lastEndTime }}）已补签上班卡{{
          lastOnSize
        }}次，下班卡{{ lastOffSize }}次
      </div>
      <div>
        于本月（{{ curStartTime }} 至 {{ curEndTime }}）已补签上班卡{{
          curOnSize
        }}次，下班卡{{ curOffSize }}次
      </div>
      <div>备注</div>
      <div v-html="description"></div>
    </div>
    <div>
      {{ curApprovalInfo }}
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ApprovalBase, DashBoardWorkProcess } from "../../router/const";
import moment from "moment";
import Base from "./base";
import { ACTIONS } from "../../store/actions/types";
import { Or } from "../../../../typings/global";

@Component<Attendance>({
  async created() {
    this.curApprovalInfo;
    this.$dispatch
      .user_approval_check_in_record({
        startTime: this.lastStartTime,
        endTime: this.lastEndTime,
        userid: this.$state.userid
      })
      .then(data => {
        this.lastApprovalCheckInRecord = data;
      });
    this.$dispatch
      .user_approval_check_in_record({
        startTime: this.curStartTime,
        endTime: this.curEndTime,
        userid: this.$state.userid
      })
      .then(data => {
        this.curApprovalCheckInRecord = data;
      });
    this.submit({});
  }
})
export default class Attendance extends Base {
  model = {
    name: `shindousaigo`
  };
  curStartTime = this.$getters.attendance_date_scope[0];
  curEndTime = this.$getters.attendance_date_scope[1];
  lastStartTime = moment(this.curStartTime)
    .add(-1, "month")
    .format("YYYY-MM-DD");
  lastEndTime = moment(this.curEndTime)
    .add(-1, "month")
    .format("YYYY-MM-DD");
  lastApprovalCheckInRecord: Or<
    ACTIONS.User.Approval.CheckInRecord.State,
    null
  > = null;
  curApprovalCheckInRecord: Or<
    ACTIONS.User.Approval.CheckInRecord.State,
    null
  > = null;
  maxOnTimes = 2;
  maxOffTimes = 5;
  description = `1、此单用于未打卡情况的补充签到；<br/>2、因忘记而未打卡的成员，每人每月可补签${this
    .maxOnTimes + this.maxOffTimes}次（含${this.maxOnTimes}次上班卡${
    this.maxOffTimes
  }次下班），须注明未打卡原因；<br/>3、因外出办事而未打卡的成员，不限补签次数，不影响出勤，须注明外出办事地点、外出办事事由；<br/>4、纸质签卡单仅限于指纹无法打卡并且经由人力资源部确认的成员使用，且签卡需在每日9:30前完成，其余成员签卡无效；<br/>5、因设备问题无法打卡的成员请及时联系人事行政同事；<br/>6、未打卡且不履行签卡义务的成员，按旷工处理。`;

  get lastOnSize() {
    return this.lastApprovalCheckInRecord
      ? this.lastApprovalCheckInRecord.onInfoSize
      : "";
  }
  get lastOffSize() {
    return this.lastApprovalCheckInRecord.offInfoSize; // this.lastApprovalCheckInRecord
    // ? this.lastApprovalCheckInRecord.offInfoSize
    // : "";
  }
  get curOnSize() {
    return this.curApprovalCheckInRecord
      ? this.curApprovalCheckInRecord.onInfoSize
      : "";
  }
  get curOffSize() {
    return this.curApprovalCheckInRecord
      ? this.curApprovalCheckInRecord.offInfoSize
      : "";
  }
  attendanceProcessingMap() {
    this.$getters.user_approval_list_dictionary[DashBoardWorkProcess].map(
      info => {
        const s = info.type;
        // return
      }
    );
  }
}
</script>

<style lang="scss">
</style>
