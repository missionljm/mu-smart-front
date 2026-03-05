<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>欢迎回来，{{ name }}！</h1>
        <p>今天是 {{ today }}，祝您工作顺利！</p>
      </div>
      <div class="welcome-actions">
        <!-- 路由搜索 -->
        <div class="route-search">
          <el-input
            v-if="showSearch"
            v-model="searchQuery"
            placeholder="搜索路由..."
            prefix-icon="el-icon-search"
            @input="handleSearch"
            @blur="handleSearchBlur"
            class="search-input"
          >
            <template slot="append">
              <el-button @click="showSearch = false"><i class="el-icon-close"></i></el-button>
            </template>
          </el-input>
          <el-button v-else @click="showSearch = true" class="search-button">
            <i class="el-icon-search"></i>
          </el-button>
          <!-- 搜索结果 -->
          <div v-if="showSearch && filteredRoutes.length > 0" class="search-results">
            <div
              v-for="route in filteredRoutes"
              :key="route.path"
              class="search-result-item"
              @click="navigateToRoute(route.path)"
            >
              <i class="el-icon-right"></i>
              <span>{{ route.meta.title || route.name }}</span>
              <span class="route-path">{{ route.path }}</span>
            </div>
          </div>
        </div>
        <!-- 用户头像 -->
        <div class="welcome-avatar">
          <el-avatar size="large">{{ name && name.charAt(0) || 'U' }}</el-avatar>
        </div>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-section">
      <div class="stats-card">
        <div class="stats-icon blue">
          <i class="el-icon-user"></i>
        </div>
        <div class="stats-content">
          <div class="stats-number">{{ userCount }}</div>
          <div class="stats-label">用户总数</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon green">
          <i class="el-icon-s-order"></i>
        </div>
        <div class="stats-content">
          <div class="stats-number">{{ orderCount }}</div>
          <div class="stats-label">订单数量</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon orange">
          <i class="el-icon-data-analysis"></i>
        </div>
        <div class="stats-content">
          <div class="stats-number">{{ revenue }}</div>
          <div class="stats-label">总收入</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon purple">
          <i class="el-icon-message"></i>
        </div>
        <div class="stats-content">
          <div class="stats-number">{{ messageCount }}</div>
          <div class="stats-label">未读消息</div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <div class="section-header">
        <h2>最近活动</h2>
        <el-button type="primary" size="small">查看全部</el-button>
      </div>
      <el-table :data="recentActivities" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="180"></el-table-column>
        <el-table-column prop="type" label="类型" width="120"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
      </el-table>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <div class="section-header">
        <h2>快速操作</h2>
      </div>
      <div class="action-buttons">
        <el-button type="primary" icon="el-icon-plus" @click="handleCreateUser">
          新增用户
        </el-button>
        <el-button type="success" icon="el-icon-download" @click="handleExport">
          导出数据
        </el-button>
        <el-button type="warning" icon="el-icon-s-operation" @click="handleSettings">
          系统设置
        </el-button>
        <el-button type="info" icon="el-icon-question" @click="handleHelp">
          帮助中心
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '@/router';
import store from '@/store';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ]),
    today() {
      const date = new Date();
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    }
  },
  data() {
    return {
      userCount: 1280,
      orderCount: 356,
      revenue: '¥128,500',
      messageCount: 12,
      recentActivities: [
        {
          time: '2026-03-05 10:30',
          type: '用户操作',
          description: '用户张三登录系统'
        },
        {
          time: '2026-03-05 09:15',
          type: '系统通知',
          description: '系统更新完成'
        },
        {
          time: '2026-03-04 16:45',
          type: '数据导入',
          description: '导入用户数据 100 条'
        },
        {
          time: '2026-03-04 14:20',
          type: '权限变更',
          description: '用户李四权限提升为管理员'
        }
      ],
      // 路由搜索相关
      showSearch: false,
      searchQuery: '',
      allRoutes: [],
      filteredRoutes: []
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
    
    // 获取所有路由
    this.getAllRoutes(routes);
  },
  methods: {
    // 获取所有路由（包括子路由）
    getAllRoutes(routes) {
      routes.forEach(route => {
        // 只添加有路径和标题的路由
        if (route.path && (route.meta && route.meta.title) || route.name) {
          this.allRoutes.push(route);
        }
        // 递归处理子路由
        if (route.children && route.children.length > 0) {
          this.getAllRoutes(route.children);
        }
      });
    },
    // 处理搜索
    handleSearch() {
      if (!this.searchQuery) {
        this.filteredRoutes = [];
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredRoutes = this.allRoutes.filter(route => {
        const title = (route.meta && route.meta.title) ? route.meta.title.toLowerCase() : '';
        const name = route.name ? route.name.toLowerCase() : '';
        const path = route.path.toLowerCase();
        
        return title.includes(query) || name.includes(query) || path.includes(query);
      });
    },
    // 处理搜索框失去焦点
    handleSearchBlur() {
      // 延迟隐藏搜索结果，以便点击结果时能够触发跳转
      setTimeout(() => {
        this.filteredRoutes = [];
      }, 200);
    },
    // 跳转到路由
    navigateToRoute(path) {
      router.push(path);
      this.showSearch = false;
      this.searchQuery = '';
      this.filteredRoutes = [];
    },
    handleCreateUser() {
      router.push('/admin/person');
    },
    handleExport() {
      // 导出数据逻辑
      this.$message.success('数据导出成功');
    },
    handleSettings() {
      // 系统设置逻辑
      this.$message.info('跳转到系统设置');
    },
    handleHelp() {
      // 帮助中心逻辑
      this.$message.info('跳转到帮助中心');
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
  }
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .welcome-content h1 {
    font-size: 24px;
    color: #303133;
    margin: 0 0 8px 0;
  }

  .welcome-content p {
    font-size: 14px;
    color: #606266;
    margin: 0;
  }

  .welcome-actions {
    display: flex;
    align-items: center;
  }

  .route-search {
    position: relative;
    margin-right: 20px;

    .search-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        background: #f0f0f0;
      }
    }

    .search-input {
      width: 300px;
      transition: all 0.3s ease;

      .el-button {
        padding: 0 10px;
      }
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin-top: 8px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;

      .search-result-item {
        padding: 12px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f5f7fa;
        }

        i {
          color: #2afd89;
          margin-right: 8px;
        }

        .route-path {
          margin-left: auto;
          font-size: 12px;
          color: #11203e;
        }
      }
    }
  }

  .welcome-avatar {
    margin-left: 0;
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  .stats-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;

    .stats-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      color: white;
      font-size: 24px;

      &.blue {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.green {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.orange {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.purple {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }
    }

    .stats-content {
      flex: 1;

      .stats-number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 4px;
      }

      .stats-label {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

.activity-section,
.quick-actions {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      font-size: 18px;
      color: #303133;
      margin: 0;
    }
  }
}

.quick-actions {
  .action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .el-button {
      flex: 1;
      min-width: 120px;
    }
  }
}

@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}
</style>
