<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div :model="search">
       <r-select
                v-model="search.auditStatus"
                type="1001"
                class="search-input"
              ></r-select>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '@/router';
import store from '@/store';
import rSelect from '@/components/Select/Select';




export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    rSelect
  },
  data() {
    return {
      search: {
        auditStatus: null
      }
    }
  },
   mounted() {
    console.log(this.$route); // 输出当前路由对象
    const staticRoutes = router.options.routes;
    console.log(staticRoutes);
    const routes = store.state.permission.routes; // 静态+动态路由
    const dictMap = store.state.user.dictMap; // 数据字典
    console.log(dictMap);
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
