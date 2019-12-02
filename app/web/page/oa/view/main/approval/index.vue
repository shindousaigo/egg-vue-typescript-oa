<template>
  <div class="approval">
    <router-view :name="component"></router-view>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ApprovalBase,
  NotFound,
  ApprovalComponentRegex
} from "web/page/oa/router/const";

@Component<Approval>({
  async created() {
    console.log(this.$state.route.path);
  }
})
export default class Approval extends Vue {
  get component() {
    return Object.keys(
      this.$router.currentRoute.matched.find(
        item => item.path === ApprovalBase + ApprovalComponentRegex
      ).components
    ).includes(this.$state.route.params.component)
      ? this.$state.route.params.component
      : NotFound;
  }
}
</script>

<style lang="scss">
</style>
