<template>
  <div class="calendar">
    <el-table
      border
      size="mini"
      align="center"
      :data="tableData"
      @cell-click="cellClick"
      style="min-width: 1000px; width: 1000px;"
    >
      <el-table-column
        :index="k"
        :key="v.prop"
        :label="v.label"
        v-for="(v, k) in columns"
        :class-name="`date-wrap${k >= 5 ? ' weekdays' : ''}`"
      >
        <template slot slot-scope="{ row }">
          <div class="date-box" :class="`${isToday(row[k]) ? 'cur' : ''}`">
            <span>{{ row[k] }}</span>
            <div v-if="hasRemak(row[k])">
              <a
                :key="index"
                style="display: block"
                href="javascript:void(0)"
                @click="exceptionHandler.call(this, row[k])"
                v-for="(item, index) in pageRecord[row[k]].split(',')"
                :style="{
                  color: $attendanceException(item) ? 'red' : 'blue'
                }"
              >
                {{ item }}
              </a>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="record-wrap">
      <div>
        查询打卡记录(当天数据会有延迟)
      </div>
      <div>
        {{ punchRecordDate }}
      </div>
      <div v-if="record.length">
        <span v-for="item in record" :key="item" class="punch-record-item">
          {{ item.substr(11) }}
        </span>
      </div>
      <div v-else>
        <div>
          没有任何打卡记录
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import moment from "moment";

@Component
export default class Calendar extends Vue {
  weekdays = 7;
  columns: {
    label: string;
    prop: string;
  }[] = [
    { label: "星期一", prop: "monday" },
    { label: "星期二", prop: "tuesday" },
    { label: "星期三", prop: "wednesday" },
    { label: "星期四", prop: "thursday" },
    { label: "星期五", prop: "friday" },
    { label: "星期六", prop: "saturday" },
    { label: "星期日", prop: "sunday" }
  ];
  defaultDate = moment(new Date()).format("YYYY-MM-DD");
  punchRecordDate = "";
  get record() {
    let record = [];
    if (this.punchRecordDate) {
      record = this.$state.attendance_punch_record;
    }
    return record;
  }
  get tableData() {
    const data = [];
    const start = this.$getters.attendance_date_scope[0];
    const end = this.$getters.attendance_date_scope[1];
    this.$dispatch.attendance_page_record({
      userid: this.$state.userid,
      startTime: start,
      endTime: end
    });
    const startMoment = moment(start);
    const startWeekday = startMoment.weekday();
    const rows = 6;
    for (let row = 0; row < rows; row++) {
      let line = [];
      let date = "";
      for (let weekday = 1; weekday <= this.weekdays; weekday++) {
        if (!row) {
          if (weekday === startWeekday) {
            date = start;
          } else if (weekday > startWeekday) {
            date = startMoment.add(1, "day").format("YYYY-MM-DD");
          }
        } else {
          date = startMoment.add(1, "day").format("YYYY-MM-DD");
        }
        line.push(date);
        if (date === end) {
          break;
        }
      }
      data.push(line);
      if (date === end) {
        break;
      }
    }
    return data;
  }
  isToday(date) {
    let isToday;
    if (!this.punchRecordDate) {
      if (date === this.defaultDate) {
        isToday = true;
        this.query(date);
      }
    } else {
      isToday = this.punchRecordDate === date;
    }
    return isToday;
  }
  async query(date) {
    const data = await this.$dispatch.attendance_punch_record({
      userid: this.$state.userid,
      date
    });
    this.punchRecordDate = date;
  }
  cellClick(row, column) {
    const date = row[column.index];
    date && this.query(date);
  }
  hasRemak(date) {
    return this.pageRecord && this.pageRecord[date];
  }
  get pageRecord() {
    return this.$getters.attendance_page_record;
  }
  async exceptionHandler(date) {
    await this.$confirm("跳转补签申请页面？");
    this.$router.push({
      path: "/approval/attendance",
      query: {
        date: date
      }
    });
  }
}
</script>

<style lang="scss">
.calendar {
  .date-wrap {
    height: 100px;
    cursor: pointer;
    padding: 0 !important;
    &.weekdays {
      .date-box {
        background: rgba(105, 105, 105, 0.2);
      }
    }
    .date-box {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      line-height: 24px;
      &.cur {
        background: #ffebeb;
      }
    }
  }
  .record-wrap {
    margin: 12px 0 24px 8px;
    color: #606266;
    font-size: 14px;
    line-height: 28px;
  }
  .punch-record-item {
    font-size: 13px;
    color: #fff;
    padding: 0 10px;
    line-height: 20px;
    border-radius: 5px;
    display: inline-block;
    background: #000;
    margin: 5px 16px 0 0;
    &:last-of-type {
      background: #f89401;
    }
    &:first-of-type {
      background: #468877;
    }
  }
}
</style>
