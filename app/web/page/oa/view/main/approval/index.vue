<template>
  <div class="approval">
    <router-view :name="component"></router-view>
    <router-view :name="ApprovalApplicationDetail"></router-view>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ApprovalBase,
  NotFound,
  ApprovalComponentRegex,
  ApprovalApplicationDetail,
  MatchSymbol,
  ApprovalApplicationDetailComponentRegex
} from "web/page/oa/router/const";

@Component<Approval>({})
export default class Approval extends Vue {
  get component() {
    if (this.$state.route.params[ApprovalComponentRegex]) {
      const routeConfig = this.$router.currentRoute.matched.find(({ path }) =>
        path.endsWith(MatchSymbol + ApprovalComponentRegex)
      );
      return Object.keys(routeConfig.components).includes(
        this.$state.route.params[ApprovalComponentRegex]
      )
        ? this.$state.route.params[ApprovalComponentRegex]
        : NotFound;
    }
  }
}
</script>

<style lang="scss">
.approval {
  overflow: auto;
}
</style>
