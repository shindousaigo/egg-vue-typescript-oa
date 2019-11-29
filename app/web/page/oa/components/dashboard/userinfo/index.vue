<template>
  <div class="userinfo">
    <div class="title">
      <span class="userid"> {{ $state.userid }} </span>
      <span class="position">{{ position }}</span>
    </div>
    <div class="userinfo-item" v-for="item in infoItems" :key="item.key">
      <el-tag>{{ item.label }}： {{ getData(item.key) }}</el-tag>
    </div>
    <div class="userinfo-item">
      <el-tag>
        可用调休： {{ overtimeAvailable }}
        <el-popover
          popper-class="userinfo-popper"
          placement="right"
          trigger="click"
        >
          <font-awesome-icon icon="info-circle" slot="reference" />
          <div slot class="info-circle-wrap">
            <el-table
              border
              size="mini"
              :data="overtimeInfoList"
              :style="{
                width: `${120 + 100 + 90 + 1}px`
              }"
            >
              <el-table-column class-name="overtime-detail-title">
                <template slot="header" slot-scope="{}">
                  <div class="overtime-detail-box">加班新增明细</div>
                </template>
                <el-table-column width="120">
                  <template slot="header" slot-scope="{}">
                    日期
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ row.overtimeDate }}
                  </template>
                </el-table-column>
                <el-table-column width="100">
                  <template slot="header" slot-scope="{}">
                    时长
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ $hours(row.overtimeTotal) }}
                    <font-awesome-icon icon="long-arrow-alt-up" />
                  </template>
                </el-table-column>
                <el-table-column width="90">
                  <template slot="header" slot-scope="{}">
                    类型
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ getOvertimeType(row.overtimeType) }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-table
              border
              :style="{
                width: `${120 + 100 + 90 + 1}px`
              }"
              size="mini"
              :data="overtimeUseDetailInfoList"
            >
              <el-table-column class-name="overtime-detail-title">
                <template slot="header" slot-scope="{}">
                  <div class="overtime-detail-box">调休使用明细</div>
                </template>
                <el-table-column width="120">
                  <template slot="header" slot-scope="{}">
                    日期
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ row.useDate }}
                  </template>
                </el-table-column>
                <el-table-column width="100">
                  <template slot="header" slot-scope="{}">
                    时长
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ $hours(row.duration) }}
                    <font-awesome-icon icon="long-arrow-alt-down" />
                  </template>
                </el-table-column>
                <el-table-column width="90">
                  <template slot="header" slot-scope="{}">
                    类型
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ getLeaveName(row) }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-popover>
      </el-tag>
    </div>
    <div class="userinfo-item">
      <el-tag>
        年假： {{ annualLeaveAvailable }}
        <el-popover
          popper-class="userinfo-popper"
          placement="right"
          trigger="click"
        >
          <font-awesome-icon icon="info-circle" slot="reference" />
          <div slot class="info-circle-wrap">
            <el-table
              border
              :style="{
                width: `${120 + 120 + 90 + 1}px`
              }"
              size="mini"
              :data="produceDetailInfoList"
              :row-class-name="getProduceDetailInfoListRowClassName"
            >
              <el-table-column class-name="overtime-detail-title">
                <template slot="header" slot-scope="{}">
                  <div class="overtime-detail-box">年假新增明细</div>
                </template>
                <el-table-column width="120">
                  <template slot="header" slot-scope="{}">
                    起始时间
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ row.produceDate }}
                  </template>
                </el-table-column>
                <el-table-column width="120">
                  <template slot="header" slot-scope="{}">
                    失效时间
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ row.expireDate }}
                  </template>
                </el-table-column>
                <el-table-column width="90" class-name="annual-duration">
                  <template slot="header" slot-scope="{}">
                    时长
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ $hours(row.availableLeave) }}
                    <font-awesome-icon
                      v-if="row.isAvailable"
                      icon="long-arrow-alt-up"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-table
              border
              size="mini"
              :data="annualLeaveUseDetailInfoList"
              :style="{
                width: `${120 + 90 + 1}px`
              }"
            >
              <el-table-column class-name="overtime-detail-title">
                <template slot="header" slot-scope="{}">
                  <div class="overtime-detail-box">年假使用明细</div>
                </template>
                <el-table-column width="120">
                  <template slot="header" slot-scope="{}">
                    日期
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ row.useDate }}
                  </template>
                </el-table-column>
                <el-table-column width="90">
                  <template slot="header" slot-scope="{}">
                    时长
                  </template>
                  <template slot slot-scope="{ row }">
                    {{ $hours(row.duration) }}
                    <font-awesome-icon icon="long-arrow-alt-down" />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-popover>
      </el-tag>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import * as _ from "lodash";
import { ACTIONS } from "../../../store/actions/types";
@Component<Userinfo>({
  async created() {
    this.$dispatch.user_info({
      userid: this.$state.userid
    });
    this.$dispatch.user_overtime_detail({
      userid: this.$state.userid
    });
    this.$dispatch.user_annual_leave_detail({
      userid: this.$state.userid
    });
    this.$dispatch.leave_type_list();
  }
})
export default class Userinfo extends Vue {
  static OvertimeTypeMap = ["", "加班", "结算到工资", "HR"];
  static UserStatusMap = ["实习生", "试用期", "正式员工", "离职员工"];
  get userinfo() {
    const _cache = Object.assign(
      {},
      this.$state.user_overtime_detail,
      this.$state.user_annual_leave_detail
    );
    const _userinfo = Object.assign(
      {},
      this.$getters.user_dictionary[this.$state.userid],
      this.$state.user_info
    );
    return Object.assign({}, _cache, _userinfo);
  }
  get position() {
    return this.userinfo.position;
  }
  get employeeNumber() {
    return this.userinfo.employeeNumber;
  }
  get telephone() {
    return this.userinfo.telephone;
  }
  get name() {
    return this.userinfo.name;
  }
  get userStatus() {
    return Userinfo.UserStatusMap[this.userinfo.userStatus];
  }
  get entryDate() {
    return this.userinfo.entryDate;
  }
  get correctionDate() {
    return this.userinfo.correctionDate;
  }
  get newContractDate() {
    return this.userinfo.newContractDate;
  }
  get contractExpirationDate() {
    return this.userinfo.contractExpirationDate;
  }
  get overtimeInfoList() {
    if (this.userinfo.user_overtime_detail) {
      const list = this.userinfo.user_overtime_detail.overtimeInfoList.sort(
        function(a, b) {
          return (
            new Date(b.overtimeDate).getTime() -
            new Date(a.overtimeDate).getTime()
          );
        }
      );
      return list;
    }
  }
  get overtimeUseDetailInfoList() {
    if (this.userinfo.user_overtime_detail) {
      return this.userinfo.user_overtime_detail.useDetailInfoList;
    }
  }
  get produceDetailInfoList() {
    if (this.userinfo.user_annual_leave_detail) {
      return this.userinfo.user_annual_leave_detail.produceDetailInfoList.sort(
        function(a, b) {
          return (
            new Date(b.expireDate).getTime() - new Date(a.expireDate).getTime()
          );
        }
      );
    }
  }
  get annualLeaveUseDetailInfoList() {
    if (this.userinfo.user_annual_leave_detail) {
      return this.userinfo.user_annual_leave_detail.useDetailInfoList;
    }
  }
  get overtimeAvailable() {
    if (this.userinfo.user_overtime_detail) {
      const add = this.userinfo.user_overtime_detail.overtimeInfoList
        .map(item => item.overtimeTotal)
        .reduce((a, b) => a + b);
      const minus = this.userinfo.user_overtime_detail.useDetailInfoList
        .map(item => -item.duration)
        .reduce((a, b) => a + b);
      return this.$hours(add + minus);
    }
  }
  get annualLeaveAvailable() {
    if (this.userinfo.user_annual_leave_detail) {
      return this.$hours(
        this.userinfo.user_annual_leave_detail.produceDetailInfoList
          .map(item => item.availableLeave)
          .reduce((a, b) => a + b)
      );
    }
  }
  getOvertimeType(overtimeType) {
    return Userinfo.OvertimeTypeMap[overtimeType];
  }
  getData(key) {
    return this[key];
  }
  getLeaveName(
    row: ACTIONS.User.AnnualLeave.Detail.State["user_annual_leave_detail"]["useDetailInfoList"][0]
  ) {
    const type = this.$getters.leave_type_dictionary[row.leaveType];
    return (type && type.leaveName) || "";
  }
  getProduceDetailInfoListRowClassName({ row }) {
    return `produce-detail-info-list${row.isAvailable ? "" : " disabled"}`;
  }
  infoItems = [
    {
      label: "工号",
      key: "employeeNumber"
    },
    {
      label: "姓名",
      key: "name"
    },
    {
      label: "电话",
      key: "telephone"
    },
    {
      label: "状态",
      key: "userStatus"
    },
    {
      label: "入职日期",
      key: "entryDate"
    },
    {
      label: "转正日期",
      key: "correctionDate"
    },
    {
      label: "新签合同日期",
      key: "newContractDate"
    },
    {
      label: "合同到期时间",
      key: "contractExpirationDate"
    }
  ];
}
</script>
<style scoped  lang="scss">
.userinfo {
  font-family: "Raleway", sans-serif;
  color: #606266;
  .title {
    position: relative;
    display: inline-block;
    margin: 22px 0 24px 0;

    .userid {
      text-transform: uppercase;
      letter-spacing: 4px;
      font-size: 30px;
    }
    .position {
      bottom: -8px;
      right: -2px;
      font-size: 14px;
      letter-spacing: 10px;
      color: #909399;
      z-index: -1;
      position: absolute;
    }
  }
  .fa-info-circle {
    cursor: pointer;
    font-size: 16px;
    margin: 0 0 0 4px;
  }
  .userinfo-item {
    line-height: 48px;
  }
}
</style>
<style lang="scss">
.info-circle-wrap {
  float: left;
  max-height: 98vh;
  overflow: auto;
  padding: 6px;
  .el-table {
    float: left;
    margin: 8px;
  }
}
.userinfo-popper {
  padding: 0;
}
.overtime-detail-title {
  padding: 0;
  background: #fff !important;
  font-size: 14px;
  font-weight: 700;
  .overtime-detail-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.produce-detail-info-list.disabled {
  color: #c0c4cc;
}
.fa-long-arrow-alt-up {
  font-size: 13px;
}
</style>
