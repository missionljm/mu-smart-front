<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: 这里是personDay</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '@/router';
import store from '@/store';



export default {
  name: 'fund',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
   mounted() {
    console.log(this.$route); // 输出当前路由对象
    const staticRoutes = router.options.routes;
    console.log(staticRoutes);
    const routes = store.state.permission.routes; // 静态+动态路由
   const addRoutes = store.state.permission.addRoutes; // 动态路由
   console.log(routes, addRoutes)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
