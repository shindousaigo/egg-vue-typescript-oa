<template>
  <div class="work">
    <el-table
      :data="list.slice(start, start + offset)"
      border
      size="small"
      :style="{
        width: `${220 + 220 + 220 + 160 + 140 + 1}px`,
        margin: `16px 0 0 0`
      }"
    >
      <el-table-column width="220">
        <template slot="header" slot-scope="{}">
          <div v-if="!isEditing" class="col-header">
            <span>流水号</span>
            <font-awesome-icon
              @click="toEdit.call(this, true)"
              icon="edit"
              style="font-size: 16px; cursor: pointer;"
            />
          </div>
          <div v-else class="col-header">
            <el-input
              style="padding: 0; top: -1px;"
              size="mini"
              v-model="filter.serialNumber"
              placeholder="流水号"
            ></el-input>
            <font-awesome-icon
              @click="toEdit.call(this, false)"
              icon="times"
              style="font-size: 19px; cursor: pointer; margin: 0 3px 0 10px;"
            />
          </div>
        </template>
        <template slot slot-scope="{ row }">
          <font-awesome-icon
            :icon="getSerialNumberFontAwesomeIcon(row)"
            style="font-size: 13px; margin: 0 4px 0 0;"
          />
          {{ row.serialNumber }}
        </template>
      </el-table-column>
      <el-table-column width="220">
        <template slot="header" slot-scope="{}">
          <div v-if="!isTyping" class="col-header">
            <span>流程类型</span>
            <font-awesome-icon
              @click="toType.call(this, true)"
              icon="caret-square-down"
              style="font-size: 16px; cursor: pointer;"
            />
          </div>
          <div v-else class="col-header">
            <el-select
              size="mini"
              v-model="filter.processType"
              multiple
              placeholder="流程类型"
            >
              <el-option
                v-for="(val, key) in processTypeOptions"
                :key="val.key"
                :label="val.label"
                :value="key * 1"
              >
              </el-option>
            </el-select>
            <font-awesome-icon
              @click="toType.call(this, false)"
              icon="times"
              style="font-size: 19px; cursor: pointer; margin: 0 3px 0 10px;"
            />
          </div>
        </template>
        <template slot slot-scope="{ row }">
          {{ getProcessTypeLabel(row) }}
        </template>
      </el-table-column>
      <el-table-column width="220">
        <template slot="header" slot-scope="{}">
          <div v-if="!isSelecting" class="col-header">
            <span>发起人</span>
            <font-awesome-icon
              @click="toSelect.call(this, true)"
              icon="caret-square-down"
              style="font-size: 16px; cursor: pointer;"
            />
          </div>
          <div v-else class="col-header">
            <el-select
              size="mini"
              v-model="filter.userId"
              multiple
              placeholder="发起人"
            >
              <el-option
                v-for="userid in userSelects"
                :key="userid"
                :label="userid"
                :value="userid"
              >
              </el-option>
            </el-select>
            <font-awesome-icon
              @click="toSelect.call(this, false)"
              icon="times"
              style="font-size: 19px; cursor: pointer; margin: 0 3px 0 10px;"
            />
          </div>
        </template>
        <template slot slot-scope="{ row }">
          {{ row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="160">
        <template slot slot-scope="{ row }">
          {{ row.createTime.slice(0, -2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot slot-scope="{ row }">
          <a href="javascript:void(0)" @click="detail.call(this, row)">
            查看
          </a>
          <a
            v-if="row.result === 3 && row.userId === $state.userid"
            href="javascript:void(0)"
            style="margin: 0 0 0 12px;"
            @click="del.call(this, row)"
          >
            删除
          </a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev,pager,next"
      :pageSize="offset"
      :total="list.length"
      @current-change="pageChange"
      style="margin: 12px 0 16px 0;"
    />
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import {
  Separator,
  DashBoardWorkOver,
  DashBoardWorkWait,
  DashBoardWorkProcess,
  DashBoardWorkAll,
  ApprovalBase
} from "../../router/const";
import _ from "lodash";
import { GETTERS } from "../../store/getters/getters";
import { ACTIONS } from "../../store/actions/actions";
@Component<Work>({
  async created() {
    this.queryList();
  }
})
export default class Work extends Vue {
  pageChange(page) {
    this.start = this.offset * (page - 1);
  }
  async detail(row: GETTERS.User.Approval.List.Item) {
    await this.$confirm(`确认进入 ${row.serialNumber} 表单？`, "查看");
    this.$router.push({
      path:
        ApprovalBase +
        this.$getters.approval_type_dictionary[row.processType].key,
      query: {
        serialNumber: row.serialNumber
      }
    });
  }
  async del(row: GETTERS.User.Approval.List.Item) {
    await this.$confirm(`确认删除 ${row.serialNumber} 表单？`, "删除");
    await this.$dispatch.approval_delete_application({
      serialNumber: row.serialNumber
    });
    this.queryList();
  }
  @Watch("$state.route.path")
  $StateRoutePath(val) {
    this.queryList();
  }
  queryList() {
    this.$dispatch.user_approval_list({
      userid: this.$state.userid
    });
  }
  private page_change(page) {
    this.start = this.offset * (page - 1);
  }
  private start = 0;
  private offset = 16;
  private filter = {
    serialNumber: "",
    processType: [],
    userId: []
  };
  private isEditing = false;
  private isTyping = false;
  private isSelecting = false;
  private userSelects = [];
  toEdit(isEditing) {
    this.isEditing = isEditing;
    if (!isEditing) {
      this.filter.serialNumber = "";
    }
  }
  toType(isTyping) {
    this.isTyping = isTyping;
    if (!isTyping) {
      this.filter.processType = [];
    }
  }
  toSelect(isSelecting) {
    this.isSelecting = isSelecting;
    if (!isSelecting) {
      this.filter.userId = [];
    } else {
      this.userSelects = _.uniq(this.list.map(item => item.userId));
    }
  }
  get list(): GETTERS.User.Approval.List.Item[] {
    const workType = this.$state.route.path.split(Separator).splice(-1)[0];
    let list: GETTERS.User.Approval.List.Item[];
    switch (workType) {
      case DashBoardWorkAll:
        list = Array.prototype.concat(
          [],
          this.$getters.user_approval_list_dictionary[DashBoardWorkWait],
          this.$getters.user_approval_list_dictionary[DashBoardWorkProcess],
          this.$getters.user_approval_list_dictionary[DashBoardWorkOver]
        );
        break;
      default:
        list = this.$getters.user_approval_list_dictionary[workType];
        break;
    }
    if (this.filter.serialNumber) {
      list = list.filter(item =>
        item.serialNumber.includes(this.filter.serialNumber)
      );
    }
    if (this.filter.processType.length) {
      list = list.filter(item =>
        this.filter.processType.includes(item.processType)
      );
    }
    if (this.filter.userId.length) {
      list = list.filter(item => this.filter.userId.includes(item.userId));
    }
    return list;
  }
  get processTypeOptions() {
    return this.$getters.approval_type_dictionary;
  }
  getProcessTypeLabel(row: GETTERS.User.Approval.List.Item) {
    return this.$getters.approval_type_dictionary[row.processType].label;
  }
  getSerialNumberFontAwesomeIcon(row: GETTERS.User.Approval.List.Item) {
    const IconMap = {
      [DashBoardWorkWait]: "envelope",
      [DashBoardWorkProcess]: "envelope-open",
      [DashBoardWorkOver]: "check-circle"
    };
    return IconMap[row.type];
  }
}
</script>
<style scoped lang="scss">
.work {
  .col-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
<style  lang="scss">
.work {
  th {
    padding: 0 !important;
    .el-input__suffix {
      height: 30px;
    }
    .el-select {
      padding: 0;
      line-height: 26px;
    }
    .el-select__tags {
      line-height: 26px;
      padding: 0;
      .el-tag {
        margin-top: 4px;
      }
    }
    .el-input {
      padding: 0;
    }
    .el-input__inner {
      height: 29px;
      top: -1px;
      position: relative;
    }
    .el-tag__close.el-icon-close {
      right: -5px;
    }
  }
}
</style>