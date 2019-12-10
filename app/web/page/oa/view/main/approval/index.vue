<template>
  <div class="approval">
    <router-view :name="component"></router-view>
    <router-view :name="ApprovalApplicationDetail"></router-view>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component<Approval>({})
export default class Approval extends Vue {
  get component() {
    if (this.$state.route.params[this.ApprovalComponentRegex]) {
      const routeConfig = this.$router.currentRoute.matched.find(({ path }) =>
        path.endsWith(this.MatchSymbol + this.ApprovalComponentRegex)
      );
      return Object.keys(routeConfig.components).includes(
        this.$state.route.params[this.ApprovalComponentRegex]
      )
        ? this.$state.route.params[this.ApprovalComponentRegex]
        : this.NotFound;
    }
  }
}
</script>

<style lang="scss">
.approval {
  overflow: auto;
}
</style>
