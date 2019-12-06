<template>
  <div class="header">
    <div
      class="logo-container"
      :style="{
        width: `${Container.aside_width}px`,
        height: `${Container.header_height + Container.aside_margin_top}px`
      }"
    >
      <img class="logo" :src="avatar" />
    </div>
    <div class="operator">
      <div class="o-item" @click="$router.push('/dashboard/userinfo')">
        用户信息
      </div>
      <div class="o-item" @click="$notify.error(`退出失败`)">退出用户</div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import Container from "web/page/oa/view/container.vue";

@Component
export default class HeaderBar extends Vue {
  get info() {
    if (this.$getters.user_dictionary)
      return this.$getters.user_dictionary[this.$state.userid];
  }
  get avatar() {
    return this.info ? this.info.avatar : require(`web/page/oa/assets/rg.png`);
  }
  @Inject() Container!: Container;
}
</script>
<style lang="scss">
.header {
  width: inherit;
  height: inherit;
  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 54px;
  }
  .operator {
    font-size: 14px;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // width: 150px;
    .o-item {
      cursor: pointer;
      padding: 0 12px;
      height: 100%;
      display: flex;
      align-items: center;
      &:last-of-type {
        margin: 0 16px;
        // padding: 0 16px;
      }
      &:hover {
        background: #909399;
      }
    }
  }
}
</style>
