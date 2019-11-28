<template>
  <el-popover
    width="322"
    trigger="click"
    ref="popover"
    placement="bottom-start"
    popper-class="attendance-date-picker"
  >
    <div slot>
      <div class="el-date-picker__header el-date-picker__header--bordered">
        <button
          type="button"
          v-if="level"
          aria-label="前一年"
          @click="offset -= 10"
          class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
        />
        <span
          role="button"
          @click="level = 1"
          class="el-date-picker__header-label"
        >
          {{ level ? `${yearStart} 年  -  ${yearEnd} 年` : `${curYear} 年` }}
        </span>
        <button
          v-if="level"
          type="button"
          aria-label="后一年"
          class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
          @click="offset += 10"
        />
      </div>
      <div class="el-picker-panel__content">
        <table class="el-year-table" v-show="level">
          <tbody>
            <tr v-for="(v, k) in 3" :key="v">
              <td
                :key="n"
                class="available"
                v-for="(n, m) in 4"
                :class="k * 4 + m === yearDigit && !offset ? `today` : ``"
              >
                <a
                  class="cell"
                  v-if="k * 4 + m <= 9"
                  @click="yearHandler.call(this, yearStart + k * 4 + m)"
                >
                  {{ yearStart + k * 4 + m }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="el-month-table" v-show="!level">
          <tbody>
            <tr v-for="(v, k) in 3" :key="v">
              <td
                :key="n"
                v-for="(n, m) in 4"
                :class="k * 4 + m === curMonth ? `today` : ``"
              >
                <a class="cell" @click="monthHandler.call(this, k * 4 + m)">
                  {{ monthList[k * 4 + m] }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-button slot="reference" size="mini">
      日期选择
    </el-button>
  </el-popover>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import moment from "moment";

@Component<DatePicker>({
  created() {
    this.emitChange(this.curDate);
  }
})
export default class DatePicker extends Vue {
  $refs: {
    popover: any;
  };
  offset = 0;
  curDate = this.$state.attendance_date;
  emitChange(v) {
    this.$commit.attendance_date(v);
  }
  @Watch("curDate")
  $curDate(v) {
    this.emitChange(v);
  }
  level = 0;
  monthList = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ];
  get date() {
    return new Date(this.$getters.attendance_date_scope[1]);
  }
  get curYear() {
    return this.date.getFullYear();
  }
  get curMonth() {
    return this.date.getMonth();
  }
  get formatDate() {
    return moment(this.date).format("YYYY-MM");
  }
  get yearDigit() {
    return this.curYear % 10;
  }
  get yearStart() {
    return this.curYear + this.offset - this.yearDigit;
  }
  get yearEnd() {
    return this.yearStart + 9;
  }
  monthHandler(month) {
    this.curDate = new Date(this.curYear, month);
    this.$refs.popover.showPopper = false;
  }
  yearHandler(year) {
    this.curDate = new Date(year, this.curMonth);
    this.offset = 0;
    this.level = 0;
  }
}
</script>

<style lang="scss">
.attendance-date-picker {
  padding: 0;
  .el-date-picker__header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 16px 24px 0 24px;
  }
  .el-picker-panel__icon-btn {
    margin-top: 0;
  }
  .el-date-picker__header-label {
    margin: 0 32px 0 32px;
  }
  .el-year-table {
    width: 100%;
    margin: 0 0 -12px 0;
  }
  .el-month-table {
    width: 100%;
    margin: 8px 0 0 0;
  }
}
</style>
