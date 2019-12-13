<template>
  <div class="leave-info-table">
    <el-table
      border
      size="small"
      :data="tableData"
      :style="{
        width: `${1 + 160 + 130 + 135 + 135 + 135}px`
      }"
    >
      <el-table-column label="User ID" width="160">
        <template slot slot-scope="{ row }">
          {{ row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="130">
        <template slot slot-scope="{ row }">
          {{ parseName(row) }}
        </template>
      </el-table-column>
      <el-table-column label="年假可用天数" width="135">
        <template slot slot-scope="{ row }">
          {{ $hours(row.availableAnnualLeave) }}
        </template>
      </el-table-column>
      <el-table-column label="年假起始时间" width="135">
        <template slot slot-scope="{ row }">
          {{ row.startTime }}
        </template>
      </el-table-column>
      <el-table-column label="年假到期时间" width="135">
        <template slot slot-scope="{ row }">
          {{ row.endTime }}
        </template>
      </el-table-column>
    </el-table>

    <router-link :to="{ name: 'user-table' }">
      <ElButton
        class="annual-return"
        type="primary"
        icon="el-icon-caret-top"
        @click="$emit('return')"
      >
        <div class="txt">返回</div>
      </ElButton>
    </router-link>

    <ElButton
      class="annual-download"
      type="primary"
      icon="el-icon-download"
      @click="export_excel"
    >
      <div class="txt">表单下载</div>
    </ElButton>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import Container from "web/page/oa/view/container.vue";
import { ACTIONS } from "web/page/oa/store/actions/types";

@Component<LeaveInfoTable>({})
export default class LeaveInfoTable extends Vue {
  get tableData() {
    try {
      return this.$state.leave_info.leaveInfoList.filter(
        info => info.availableAnnualLeave
      );
    } catch (error) {
      this.$router.push({
        path: "/backstage"
      });
    }
  }
  export_excel() {
    const thead: string = (document.querySelector(
      ".el-table__header thead"
    ) as HTMLBodyElement).innerHTML;
    const tbody: string = (document.querySelector(
      ".el-table__body tbody"
    ) as HTMLBodyElement).innerHTML;
    const table = document.createElement("table");
    table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`;
    this.table_to_excel(table, false, Date.now() + ".xls");
  }
  table_to_excel = (() => {
    const uri = "data:application/vnd.ms-excel;base64,",
      template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) {
          return c[p];
        });
      };
    const dlink = document.createElement("a");
    dlink.id = "dlink";
    dlink.style.display = "none";
    document.body.appendChild(dlink);

    return function(table, name, filename) {
      const ctx = {
        worksheet: name || "Worksheet",
        table: table.innerHTML
      };
      dlink.href = uri + base64(format(template, ctx));
      dlink.download = filename;
      dlink.click();
    };
  })();
  parseName(row: ACTIONS.Leave.Info.AnnualLeaveInfoListItem) {
    return (
      this.$getters.user_dictionary &&
      this.$getters.user_dictionary[row.userId].name
    );
  }
}
</script>
<style scoped lang="scss">
.leave-info-table {
  position: relative;
  .annual-return,
  .annual-download {
    position: absolute;
    right: -50px;
    top: 2px;
    width: 19px;
    padding: 10px 12px 10px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #4a77ac;
    .txt {
      writing-mode: vertical-lr;
      margin: 8px 0 0 -7px;
      font-size: 13px;
      letter-spacing: 2px;
    }
  }
  .annual-download {
    top: 94px;
  }
}
</style>
