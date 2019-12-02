<template>
  <div class="department-tree">
    <el-select
      multiple
      filterable
      size="small"
      placeholder="请搜索"
      v-model="filterCondition"
      :filter-method="filtermethod"
      :style="{ width: '226px', margin: '11px 18px 14px 18px' }"
    >
      <el-option
        v-for="item in filterList"
        :key="item.key"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-tree
      node-key="id"
      :data="departmentTreeList"
      :props="{ children: 'children', label: 'name' }"
      :current-node-key="currentNodeKey"
      :default-expanded-keys="[currentNodeKey]"
      @node-click="nodeclick"
    >
      <span class="tree-node" slot-scope="{ node }">
        <img
          class="department-tree-folder"
          :src="require(`web/page/oa/assets/department_tree_folder.png`)"
        />
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>
 
<script lang="ts">
type InitUserList = string[];

import _ from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TreeNode } from "element-ui/types/tree";
import { GETTERS } from "../../../store/getters/getters";

@Component<DepartmentsTree>({
  created() {
    this.nodeUsers = this.initUserList;
    this.nodemit(this.nodeUsers);
  }
})
export default class DepartmentsTree extends Vue {
  @Prop() initUserList!: InitUserList;
  filterList = [];
  lastNode = null;
  nodeUsers = [];
  filterCondition = [];
  get departmentTreeList() {
    return this.$getters.department_tree;
  }
  get currentNodeKey() {
    return this.departmentTreeList[0].id;
  }
  @Watch("filterCondition")
  $filterCondition(conditions: string[]) {
    const users = conditions.length
      ? _.uniq(
          _.flatMap(
            conditions.map(condition => {
              if (condition.includes(" - ")) {
                return [condition.split(" - ")[1]];
              } else {
                const ids = this.parseids(
                  this.$state.department_list.find(
                    department => department.name === condition.split("：")[1]
                  )
                );
                return this.$state.user_list
                  .filter(
                    el =>
                      el.department.find(id => ids.includes(id)) !== undefined
                  )
                  .map(user => user.userid);
              }
            })
          )
        )
      : this.nodeUsers;
    this.nodemit(users);
  }
  parseids(data: GETTERS.Department.Tree) {
    return _.flatMap([
      data.id,
      _.flatMap(
        data.children.map(el => {
          return this.parseids(el);
        })
      )
    ]);
  }
  nodemit(updateList: InitUserList) {
    this.$emit("update", updateList);
  }
  datacheck(data: GETTERS.Department.Tree) {
    if (data.parentid === 0) {
      this.nodeUsers = this.$state.user_list.map(el => el.userid);
    } else {
      const ids: number[] = this.parseids(data);
      this.nodeUsers = this.$state.user_list
        .filter(el => el.department.find(id => ids.includes(id)) !== undefined)
        .map(el => el.userid);
    }
    if (!this.filterCondition.length) this.nodemit(this.nodeUsers);
  }
  nodeclick(data: GETTERS.Department.Tree, node: TreeNode<any, any>) {
    if (this.lastNode) {
      if (node.id !== this.lastNode.id) {
        node.expanded = !node.expanded;
        this.datacheck(data);
      }
      this.lastNode = node;
    } else {
      this.lastNode = node;
      this.datacheck(data);
    }
  }
  filtermethod(condition: string) {
    let filterList = [];
    if (condition) {
      this.$state.user_list.forEach(user => {
        if (user.userid.includes(condition) || user.name.includes(condition)) {
          filterList.push({
            key: `${user.name} - ${user.userid}`,
            value: `${user.name} - ${user.userid}`,
            label: `${user.name} - ${user.userid}`
          });
        }
      });
      this.$state.department_list.forEach(department => {
        if (department.name.includes(condition)) {
          filterList.push({
            key: `部门：${department.name}`,
            value: `部门：${department.name}`,
            label: `部门：${department.name}`
          });
        }
      });
    }
    this.filterList = filterList;
  }
}
</script>
<style lang="scss">
.department-tree {
  .el-tag {
    padding: 0px 10px 0px 5px;
    height: 21px;
  }
  .tree-node {
    font-size: 14px;
  }
  .el-tree-node__expand-icon {
    font-size: 18px;
  }
  .el-tree-node__content {
    height: 32px;
  }
  .el-tree-node__content:hover {
    background: #edf1f5 !important;
  }
  .el-tree-node.is-current {
    > .el-tree-node__content {
      background: #4a77ac !important;
      color: #fff;
    }
  }
  .department-tree-folder {
    padding: 2px 3px 0 0px;
  }
}
</style>
