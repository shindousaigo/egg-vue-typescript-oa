<template>
  <div class="approval overtime">
    <card addSubmit>
      <el-button class="add-button" @click="add.call(this, ``)">
        <i class="el-icon-plus"></i>
      </el-button>
      <el-table
        border
        :data="tableData"
        :style="{
          width: 380 + 600 + 88 + 1 + 'px'
        }"
      >
        <el-table-column label="加班时间" width="380">
          <template slot slot-scope="{ row, colunm, $index }">
            <el-date-picker
              size="mini"
              type="date"
              style="margin: 0 16px 0 0; width: 130px;"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="tableData[$index].date"
              v-required="tableData[$index].date"
              @change="onDateChange.call(this, $index)"
            >
            </el-date-picker>
            <el-select
              size="mini"
              style="width: 90px;"
              v-model="tableData[$index].startTime"
              v-required="tableData[$index].startTime"
              @change="onStartTimeChange.call(this, $index)"
            >
              <el-option
                v-for="item in period.options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span style="margin: 0 12px;">至</span>
            <el-select
              size="mini"
              style="width: 90px;"
              v-model="tableData[$index].endTime"
              v-required="tableData[$index].endTime"
              @change="onEndTimeChange.call(this, $index)"
            >
              <el-option
                v-for="item in period.options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="description.reason.label" width="600">
          <template slot slot-scope="{ row, colunm, $index }">
            <el-input
              autosize
              type="textarea"
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
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import ApprovalApplicationBase from "./_approval_application_base";
import { ACTIONS } from "../../../../store/actions/types";

@Component<Overtime>({
  components: {
    card: require(`./_item/card.vue`).default
  },
  created() {
    this.add();
  }
})
export default class Overtime extends ApprovalApplicationBase {
  period: ApprovalApplicationBase["period"];
  params: ACTIONS.Approval.Application.Params.Overtime;
  tableData = [] as {
    date: string;
    startTime: number;
    endTime: number;
    reason: string;
  }[];
  tableDataItem(date?) {
    return Object.assign(
      {},
      {
        date: "",
        startTime: "" as any,
        endTime: "" as any,
        reason: ""
      }
    );
  }
  add() {
    this.tableData.push(this.tableDataItem());
  }
  del(index) {
    this.tableData.splice(index, 1);
  }
  beforeSubmit() {
    const startTime = [],
      endTime = [],
      duration = [],
      reason = [];
    this.tableData.forEach(item => {
      const start = item.startTime,
        end = item.endTime;
      startTime.push(item.date + " " + this.period.map[start] + ":00");
      endTime.push(item.date + " " + this.period.map[end] + ":00");
      reason.push(item.reason);
      duration.push(
        Math.min(end - start + (start <= 12.5 && end > 12.5 ? -1.5 : 0), 7.5)
      );
    });
    this.params.startTime = startTime.join(",");
    this.params.endTime = endTime.join(",");
    this.params.duration = duration.join(",");
    this.params.reason = reason.join(",").trim();
  }
  submit = (submit => {
    return async errors => {
      this.beforeSubmit();
      return submit(errors);
    };
  })(this.submit);
  onEndTimeChange(index) {
    if (this.tableData[index].startTime) {
      if (this.tableData[index].endTime <= this.tableData[index].startTime) {
        this.tableData[index].endTime = "" as any;
      }
    }
  }
  onStartTimeChange(index) {
    if (this.tableData[index].endTime) {
      if (this.tableData[index].startTime > this.tableData[index].endTime) {
        this.tableData[index].endTime = "" as any;
      }
    }
  }
  onDateChange(index) {
    const date = this.tableData[index].date;
    if (this.tableData.filter(item => item.date === date).length > 1) {
      this.tableData[index].date = "";
    }
  }
}
</script>

<style lang="scss">
.approval.overtime {
  .add-button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 120px;
    height: 88px;
    margin: 8px 24px 8px 0;
    border: 1px solid rgba(96, 98, 102, 0.2);
  }
  .el-table {
    position: relative;
    margin: 32px 0 48px 0;
    .cell {
      padding: 6px 16px !important;
    }
  }
}
</style>
