<template>
  <div class="user-table">
    <el-table
      border
      size="small"
      :data="data"
      :style="{
        width: `${1 + 160 + 130 + 196 + 190 + 54}px`,
        margin: `0 0 26px 0`
      }"
    >
      <el-table-column label="用户ID" width="160">
        <template slot slot-scope="{ row }">
          {{ row }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="130">
        <template slot slot-scope="{ row }">
          {{ parseName(row) }}
        </template>
      </el-table-column>
      <el-table-column label="部门" width="196">
        <template slot slot-scope="{ row }">
          {{ parseDepartment(row) }}
        </template>
      </el-table-column>
      <el-table-column label="职位" width="190">
        <template slot slot-scope="{ row }">
          <span v-if="getPosition(row)"> {{ getPosition(row) }}</span>
          <font-awesome-icon
            v-else
            icon="ban"
            :style="{ padding: '0 0 0 2px' }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="more" width="54" header-align="center">
        <template slot="header" slot-scope>
          <i class="el-icon-document"></i>
        </template>
        <template slot slot-scope="{ row }">
          <el-row type="flex" justify="center">
            <a href="javascript:void(0)" @click="edit_detail.call(this, row)">
              编辑
            </a>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <ElButton
      class="annual-leave"
      type="primary"
      icon="el-icon-search"
      @click="annual_leave_query"
    >
      <span class="query">年假查询</span>
    </ElButton>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class UserTable extends Vue {
  @Prop() data!: any[];
  async edit_detail(userid) {
    await this.$confirm(
      `确认进入 ${this.$getters.user_dictionary[userid].name} 的编辑页面？`
    );
    this.$router.push({
      path: `/backstage/user-edit/${userid}`
    });
  }
  async annual_leave_query() {
    await this.$dispatch.leave_info({
      userIds: this.data
    });
    this.$router.push({
      path: "/backstage/leave-info-table"
    });
  }
  parseDepartment(row: string) {
    if (this.$getters.user_dictionary && this.$getters.department_id_dictionary)
      return this.$getters.user_dictionary[row].department
        .map(
          department_id =>
            this.$getters.department_id_dictionary[department_id].name
        )
        .join(" 、");
  }
  parseName(row: string) {
    return (
      this.$getters.user_dictionary && this.$getters.user_dictionary[row].name
    );
  }
  getPosition(row: string) {
    return (
      this.$getters.user_dictionary &&
      this.$getters.user_dictionary[row].position
    );
  }
}
</script>
<style scoped lang="scss">
.user-table {
  .annual-leave {
    position: absolute;
    right: -50px;
    top: 2px;
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