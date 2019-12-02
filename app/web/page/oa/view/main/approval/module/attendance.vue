<template>
  <div class="attendance">
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
      <div class="notify-box">
        <div
          :key="item.date"
          v-for="item in this.$state.attendance_page_record"
        >
          <el-button
            class="notify"
            :disabled="
              tableData.map(item => item.checkInDate).includes(item.date)
            "
            v-if="
              ['迟到', '未打卡', '旷工', '下班未打卡'].includes(item.remark)
            "
            @click="add.call(this, item.date)"
          >
            <div class="line">
              {{ item.date }}
            </div>
            <div class="line" style="color: red;">
              {{ item.remark }}
            </div>
          </el-button>
        </div>
      </div>

      <div class="table-wrap">
        <el-table
          border
          class="table"
          :data="tableData"
          :style="`width: ${154 + 124 + 114 + 320 + 78 + 1}px;`"
        >
          <el-table-column label="日期" width="154">
            <template slot slot-scope="{ row, colunm, $index }">
              <el-date-picker
                size="small"
                type="date"
                style="width: 132px;"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                @change="checkInDateChange"
                v-model="tableData[$index].checkInDate"
                v-required="tableData[$index].checkInDate"
              >
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="类别" width="124">
            <template slot slot-scope="{ row, colunm, $index }">
              <el-select
                size="small"
                placeholder="请选择"
                @change="checkInTypeChange"
                v-model="tableData[$index].checkInType"
                v-required="tableData[$index].checkInType"
              >
                <el-option
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  v-for="item in checkInTypeOptions"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="时段" width="114">
            <template slot slot-scope="{ row, colunm, $index }">
              <el-select
                size="small"
                placeholder="请选择"
                @change="timeSlotChange"
                v-model="tableData[$index].timeSlot"
                v-required="tableData[$index].timeSlot"
              >
                <el-option
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  v-for="item in timeSlotOptions"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="320">
            <template slot slot-scope="{ row, colunm, $index }">
              <el-input
                autosize
                type="textarea"
                @change="reasonChange"
                v-model="tableData[$index].reason"
                v-required="tableData[$index].reason"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="78">
            <template slot slot-scope="{ row, colunm, $index }">
              <el-button
                size="small"
                @click="del.call(this, $index)"
                :disabled="tableData.length === 1"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          class="submit"
          type="primary"
          icon="el-icon-search"
          v-required="submit"
          size="small"
        >
          <span class="query">提交</span>
        </el-button>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ApprovalBase } from "web/page/oa/router/const";
import moment from "moment";
import Base from "./_base";
import { ACTIONS } from "web/page/oa/store/actions/types";
import { Enum } from "web/page/oa/store/actions";

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
    this.$state.attendance_page_record[0].remark;
  }
})
export default class Attendance extends Base {
  curStartTime = this.$getters.attendance_date_scope[0];
  curEndTime = this.$getters.attendance_date_scope[1];
  lastStartTime = moment(this.curStartTime)
    .add(-1, "month")
    .format("YYYY-MM-DD");
  lastEndTime = moment(this.curEndTime)
    .add(-1, "month")
    .format("YYYY-MM-DD");
  lastApprovalCheckInRecord?: ACTIONS.User.Approval.CheckInRecord.State = {} as any;
  curApprovalCheckInRecord?: ACTIONS.User.Approval.CheckInRecord.State = {} as any;
  maxOnTimes = 2;
  maxOffTimes = 5;
  description = `1、此单用于未打卡情况的补充签到；<br/>2、因忘记而未打卡的成员，每人每月可补签${this
    .maxOnTimes + this.maxOffTimes}次（含${this.maxOnTimes}次上班卡${
    this.maxOffTimes
  }次下班），须注明未打卡原因；<br/>3、因外出办事而未打卡的成员，不限补签次数，不影响出勤，须注明外出办事地点、外出办事事由；<br/>4、纸质签卡单仅限于指纹无法打卡并且经由人力资源部确认的成员使用，且签卡需在每日9:30前完成，其余成员签卡无效；<br/>5、因设备问题无法打卡的成员请及时联系人事行政同事；<br/>6、未打卡且不履行签卡义务的成员，按旷工处理。`;

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

  tableData = [this.tableDataItem(this.$state.route.query.date)];

  checkInTypeOptions = [
    {
      label: "忘记打卡",
      value: 1
    },
    {
      label: "外出办事",
      value: 2
    }
  ];

  timeSlotOptions = [
    {
      label: "上班",
      value: 1
    },
    {
      label: "下班",
      value: 2
    },
    {
      label: "全天",
      value: 3
    }
  ];

  checkInDateChange(date: Date) {
    this.params.checkInDate = this.tableData
      .map(item => item.checkInDate)
      .join(",");
  }

  checkInTypeChange(date: Date) {
    this.params.checkInType = this.tableData
      .map(item => item.checkInType)
      .join(",");
  }

  timeSlotChange(date: Date) {
    this.params.timeSlot = this.tableData.map(item => item.timeSlot).join(",");
  }

  reasonChange(date: Date) {
    this.params.reason = this.tableData.map(item => item.reason).join("|");
  }

  add(date?) {
    const filter = this.tableData.filter(item => !item.checkInDate);
    if (filter.length > 0) {
      const tableData = [];
      this.tableData.forEach(item => {
        if (item.checkInDate) {
          tableData.push(item);
        }
      });
      this.tableData = tableData;
    }
    this.tableData.push(this.tableDataItem(date));
  }

  del(index) {
    this.tableData.splice(index, 1);
  }
}
</script>

<style lang="scss">
.attendance {
  .description {
    max-width: 1000px;
    margin: 32px 0 0 16+16px;
    color: rgba(96, 98, 102, 0.7);
    font-size: 13px;
    line-height: 24px;
  }
  .notify-box {
    display: flex;
    max-width: 1000px;
    flex-wrap: wrap;
    margin: 16px 0 0 8+16px;
  }
  .notify {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 120px;
    height: 90px;
    margin: 8px;
    border: 1px solid rgba(96, 98, 102, 0.2);
    &.el-button.is-disabled {
      border-color: rgb(235, 238, 245);
      .line {
        color: rgba(96, 98, 102, 0.3) !important;
      }
    }
    .line {
      color: rgba(96, 98, 102, 0.7);
      line-height: 26px;
      font-size: 13px;
    }
  }
  .table {
    margin: 8px 0 0 16+16px;
  }
  .table-wrap {
    position: relative;
  }
  .submit {
    position: absolute;
    top: 2px;
    left: 840px;
    width: 19px;
    padding: 12px 12px 8px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #4a77ac;
    .query {
      writing-mode: vertical-lr;
      margin: 8px 0 0 -8px;
      font-size: 13px;
      letter-spacing: 2px;
    }
  }
}
</style>
