<template>
  <div class="approval">
    {{ $state.route.query.date }}
    {{ $state.route.query.type }}
    <component
      :is="
        require(`web/page/oa/components/approval/${$state.route.params.component}.vue`)
          .default
      "
    />
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ApprovalBase } from "../../router/const";

@Component<Approval>({
  async created() {
    console.log(this.$state.route.path.slice(ApprovalBase.length));
  }
})
export default class Approval extends Vue {}
</script>

<style lang="scss">
</style>
