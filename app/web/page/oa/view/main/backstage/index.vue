<template>
  <div class="backstage" v-if="userListLen">
    <router-view
      name="tree"
      class="department-tree"
      :initUserList="initUserList"
      @update="departmentTreeUpdate"
    ></router-view>
    <router-view class="router-view" :data="user_list"></router-view>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component<Backstage>({})
export default class Backstage extends Vue {
  user_list = [];
  get userListLen() {
    return this.$state.user_list && this.$state.user_list.length;
  }
  get initUserList() {
    return this.$state.user_list.map(user => user.userid);
  }
  departmentTreeUpdate(user_list) {
    this.user_list = user_list;
  }
}
</script>
<style scoped lang="scss">
.backstage {
  display: flex;
  position: relative;
  overflow: auto;
  .department-tree {
    position: fixed;
    margin: 24px 0 0 50px;
  }
  .router-view {
    position: relative;
    margin: 26px 0 26px 356px;
  }
}
</style>
