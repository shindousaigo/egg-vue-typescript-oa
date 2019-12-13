<template>
  <el-container class="container">
    <el-header :height="`${header_height}px`">
      <router-view name="header" />
    </el-header>
    <el-container
      :style="{ margin: `${header_height}px 0 0 0`, height: `100%` }"
    >
      <el-aside :width="`${aside_width}px`">
        <router-view
          name="aside"
          :style="{ margin: `${aside_margin_top}px 0 0 0` }"
        />
      </el-aside>
      <el-main>
        <router-view style="height: inherit" />
      </el-main>
    </el-container>
  </el-container>
</template>
 
<script lang="ts">
import("font-awesome/css/font-awesome.min.css");
import { Component, Prop, Vue, Emit, Provide } from "vue-property-decorator";

@Component<Container>({})
export default class Container extends Vue {
  @Provide() get Container() {
    return this;
  }
  header_height = 54;
  aside_width = 190;
  aside_margin_top = 50;
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  overflow: hidden;
  .el-header {
    display: flex;
    align-items: center;
    color: #fff;
    background: rgb(84, 92, 100);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    padding: 0;
  }
  .el-aside {
    height: 100%;
    background: rgb(84, 92, 100);
    position: relative;
    overflow: hidden;
  }
  .el-main {
    padding: 0;
    height: inherit;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
