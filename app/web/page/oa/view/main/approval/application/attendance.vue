<template>
  <div class="approval attendance">
    <card>
      <span class="line" v-html="text.lastMonth" />
      <span class="line" v-html="text.curMonth" />
      <span class="line remark" v-html="text.remark" />
      <span class="line description" v-html="text.description" />
    </card>
    <card addSubmit>
      <div class="exception-wrapper">
        <div
          :key="item.date"
          v-for="item in this.$state.attendance_page_record"
        >
          <el-button
            @click="add.call(this, item.date)"
            v-if="$attendanceException(item.remark)"
            :disabled="attendanceExceptionIsDisabled(item.date)"
          >
            <div class="date text">
              {{ item.date }}
            </div>
            <div class="remark text" style="color: red;">
              {{ item.remark }}
            </div>
          </el-button>
        </div>
        <el-button @click="add.call(this, ``)">
          <i class="el-icon-plus"></i>
        </el-button>
      </div>

      <el-table
        border
        :data="tableData"
        :style="{
          width: 160 + 135 + 120 + 400 + 88 + 1 + 'px'
        }"
      >
        <el-table-column :label="detail.checkInDate.label" width="160">
          <template slot slot-scope="{ row, colunm, $index }">
            <el-date-picker
              size="mini"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="updateChange"
              v-model="tableData[$index].checkInDate"
              v-required="tableData[$index].checkInDate"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column :label="detail.checkInType.label" width="135">
          <template slot slot-scope="{ row, colunm, $index }">
            <el-select
              size="mini"
              placeholder="请选择"
              @change="updateChange"
              v-model="tableData[$index].checkInType"
              v-required="tableData[$index].checkInType"
            >
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in options.checkInType"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="detail.timeSlot.label" width="120">
          <template slot slot-scope="{ row, colunm, $index }">
            <el-select
              size="mini"
              placeholder="请选择"
              @change="updateChange"
              v-model="tableData[$index].timeSlot"
              v-required="tableData[$index].timeSlot"
            >
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in options.timeSlot"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="detail.reason.label" width="400">
          <template slot slot-scope="{ row, colunm, $index }">
            <el-input
              autosize
              type="textarea"
              @change="updateChange"
              v-model="tableData[$index].reason"
              v-required="tableData[$index].reason"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="88">
          <template slot slot-scope="{ row, colunm, $index }">
            <el-button
              size="mini"
              @click="del.call(this, $index)"
              :disabled="tableData.length === 1"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </card>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ApprovalBase } from "web/page/oa/router/const";
import moment from "moment";
import { ACTIONS } from "web/page/oa/store/actions/types";
import { Enum } from "web/page/oa/store/actions";
import * as _ from "lodash";
import Base, { ApprovalParamsModel, ApprovalParamsAttendance } from "../base";

@Component<Attendance>({
  async created() {
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
    this.$dispatch.attendance_page_record({
      userid: this.$state.userid,
      startTime: this.curStartTime,
      endTime: this.curEndTime
    });
    this.add(this.$state.route.query.date as string | undefined);
  },
  components: {
    card: require("../card.vue").default
  }
})
export default class Attendance extends Base {
  params: typeof Base[ApprovalParamsModel][ApprovalParamsAttendance];
  curStartTime = this.$getters.attendance_date_scope[0];
  curEndTime = this.$getters.attendance_date_scope[1];
  lastStartTime = moment(this.curStartTime)
    .add(-1, "month")
    .format("YYYY-MM-DD");
  lastEndTime = moment(this.curEndTime)
    .add(-1, "month")
    .format("YYYY-MM-DD");
  lastApprovalCheckInRecord?: ACTIONS.User.Approval.CheckInRecord.State = "" as any;
  curApprovalCheckInRecord?: ACTIONS.User.Approval.CheckInRecord.State = "" as any;
  maxOnTimes = 2;
  maxOffTimes = 5;
  get text() {
    return {
      description: `1、此单用于未打卡情况的补充签到；<br/>2、因忘记而未打卡的成员，每人每月可补签${this
        .maxOnTimes + this.maxOffTimes}次（含${this.maxOnTimes}次上班卡${
        this.maxOffTimes
      }次下班），须注明未打卡原因；<br/>3、因外出办事而未打卡的成员，不限补签次数，不影响出勤，须注明外出办事地点、外出办事事由；<br/>4、纸质签卡单仅限于指纹无法打卡并且经由人力资源部确认的成员使用，且签卡需在每日9:30前完成，其余成员签卡无效；<br/>5、因设备问题无法打卡的成员请及时联系人事行政同事；<br/>6、未打卡且不履行签卡义务的成员，按旷工处理。`,
      remark: "备注：",
      lastMonth: `${this.lastStartTime} 至 ${this.lastEndTime} 已补签上班卡${this.lastOnSize}次，下班卡${this.lastOffSize}次`,
      curMonth: `${this.curStartTime} 至 ${this.curEndTime} 已补签上班卡${this.curOnSize}次，下班卡${this.curOffSize}次`
    };
  }

  get lastOnSize() {
    return this.lastApprovalCheckInRecord.onInfoSize;
  }
  get lastOffSize() {
    return this.lastApprovalCheckInRecord.offInfoSize;
  }
  get curOnSize() {
    return this.curApprovalCheckInRecord.onInfoSize;
  }
  get curOffSize() {
    return this.curApprovalCheckInRecord.offInfoSize;
  }

  tableData = [] as {
    checkInDate: string;
    checkInType: string;
    timeSlot: string;
    reason: string;
  }[];

  tableDataItem(date?) {
    return Object.assign(
      {},
      {
        checkInDate: date ? date : "",
        checkInType: "",
        timeSlot: "",
        reason: ""
      }
    );
  }

  add(date?: string) {
    let tableData = [],
      filters = this.tableData.filter(item => !item.checkInDate),
      hasBlankDate = filters.length !== 0;
    if (hasBlankDate && date) {
      filters[0].checkInDate = date;
    } else {
      this.tableData.push(this.tableDataItem(date));
    }
    this.updateChange();
  }

  del(index) {
    this.tableData.splice(index, 1);
    this.updateChange();
  }

  updateChange() {
    let checkInDate = [],
      checkInType = [],
      timeSlot = [],
      reason = [];
    this.tableData.forEach(item => {
      checkInDate.push(item.checkInDate);
      checkInType.push(item.checkInType);
      timeSlot.push(item.timeSlot);
      reason.push(item.reason);
    });
    this.params.checkInDate = checkInDate.join(",");
    this.params.checkInType = checkInType.join(",");
    this.params.timeSlot = timeSlot.join(",");
    this.params.reason = reason.join("|");
  }

  attendanceExceptionIsDisabled(date: string) {
    return this.tableData.map(item => item.checkInDate).includes(date);
  }
}
</script>

<style lang="scss">
.approval.attendance {
  font-size: 13px;
  line-height: 24px;
  .line {
    display: flex;
    color: rgba(96, 98, 102, 0.7);
    &.remark {
      margin: 5px 0 2px 0;
    }
    &.description {
      margin: 0 0 0 8px;
    }
  }
  .exception-wrapper {
    display: flex;
    flex-wrap: wrap;
    .el-button {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 120px;
      height: 88px;
      margin: 8px 24px 8px 0;
      border: 1px solid rgba(96, 98, 102, 0.2);
      &.el-button.is-disabled {
        border-color: rgb(235, 238, 245);
        .text {
          color: rgba(96, 98, 102, 0.3) !important;
        }
      }
      .text {
        font-size: 13px;
        line-height: 24px;
        color: rgba(96, 98, 102, 0.7);
      }
    }
  }

  .el-table {
    position: relative;
    margin: 16px 0 16px 0;
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
  .el-table {
    .cell {
      padding: 6px 16px !important;
    }
  }
}
</style>
