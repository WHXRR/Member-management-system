<template>
  <div>
    <app-header></app-header>    
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader/index"
import AppNavbar from "./AppNavbar/index"
import AppMain from "./AppMain/index"
export default {
  data() {
    return {

    }
  },
  components: {
      AppHeader,
      AppNavbar,
      AppMain
  }
}
</script>

<style scoped>
    /* 头部区域 */
    .header {
        position: absolute;
        line-height: 50px;
        top: 0;
        left: 0;
        right: 0;
        background-color: #34495e;
    }
    /* 左侧导航 */
    .navbar {
        position: absolute;
        width: 230px;
        top: 49px;
        left: 0;
        bottom: 0;
        overflow-y: auto;
        background-color: #545c64;
    }
    .main {
        position: absolute;
        top: 49px;
        bottom: 0;
        left: 230px;
        right: 0;
        padding: 10px;
        overflow-y: auto;
        /* background-color: blue; */
    }
</style>