<template>
  <div id="aside-scroll-wrapper">
    <div class="aside-sroller">
      <el-menu
        ref="menu"
        :router="true"
        text-color="#fff"
        active-text-color="#ffd04b"
        background-color="#545c64"
        :default-openeds="defaultOpeneds"
      >
        <el-menu-item :index="DashboardBase" :route="{ path: DashboardBase }">
          <font-awesome-icon
            icon="user-tag"
            :style="{ width: `1.1em`, margin: `0 .8em 0 1.05em` }"
          />
          <span slot="title">个人中心</span>
        </el-menu-item>
        <el-submenu :index="ApprovalBase">
          <template slot="title">
            <font-awesome-icon
              icon="file-alt"
              style="margin: 0 .8em 0 1.05em"
            />
            <span slot="title">
              审批{{
                $state.route.params[ApprovalApplicationDetailComponentRegex]
                  ? `详情`
                  : `申请`
              }}</span
            >
          </template>
          <el-menu-item
            v-for="item in $state.approval_type_list"
            :key="item.key"
            :index="[ApprovalBase, item.key].join(Separator)"
            :route="{ path: [ApprovalBase, item.key].join(Separator) }"
          >
            {{ item.label }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          :index="BackstageBase"
          :route="{ path: BackstageBase }"
          style="margin: 0 0 16px 0"
        >
          <font-awesome-icon icon="file" style="margin: 0 1.05em 0 1.05em" />
          <span slot="title">后台中心</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import IScroll from "iscroll";

@Component<AsideMenu>({
  async mounted() {
    this.$state_route_path();
    const menul = this.$refs.menu.$children[1];
    if (menul["opened"]) {
      for (let i = 0; i < 10; i++) {
        await new Promise(function(resolve) {
          setTimeout(function() {
            resolve();
          });
        });
      }
      this.initScroller();
    }
    menul.$watch("opened", async isOpen => {
      isOpen
        ? await new Promise(function(resolve) {
            setTimeout(() => resolve(), menul["showTimeout"]);
          })
        : await new Promise(function(resolve) {
            setTimeout(() => resolve(), menul["hideTimeout"]);
          });
      this.scroller.refresh();
    });
  }
})
export default class AsideMenu extends Vue {
  $refs: {
    menu: Vue;
  };
  scroller: {
    refresh: () => void;
  };
  @Watch("$state.route.path")
  $state_route_path() {
    let activeIndex;
    if (this.$state.route.path.startsWith(this.ApprovalBase)) {
      activeIndex = [
        this.ApprovalBase,
        this.$state.route.params[this.ApprovalComponentRegex] ||
          this.$state.route.params[this.ApprovalApplicationDetailComponentRegex]
      ].join(this.Separator);
    } else {
      activeIndex = this.$state.route.path.match(/\/\w*/)[0];
    }
    this.$refs.menu["activeIndex"] = activeIndex;
  }
  defaultOpeneds = [this.ApprovalBase];
  initScroller() {
    this.scroller = new IScroll("#aside-scroll-wrapper", {
      mouseWheel: true,
      scrollbars: true,
      interactiveScrollbars: true
      // shrinkScrollbars: "scale",
      // fadeScrollbars: true
    });
  }
}
</script>
<style lang="scss">
#aside-scroll-wrapper {
  width: inherit;
  overflow: hidden;
  .el-menu-item {
    display: flex;
    justify-content: left;
    align-items: center;
  }
}
</style>
<style lang="scss">
#aside-scroll-wrapper {
  position: absolute;
  // height: 873px;
  top: 0;
  bottom: 0;
  left: 1px;
  right: 0;
  z-index: 0;
  .el-submenu .el-menu-item {
    min-width: inherit;
    // height: 68px;
    // line-height: 68px;
    padding: 0 !important;
    justify-content: center;
    margin: 0 0 0 -13px;
  }
  .el-submenu__icon-arrow {
    font-size: 14px;
    margin-left: 14px;
    position: relative;
    top: 0;
    right: 0;
    margin-top: 0;
  }
}
</style>
