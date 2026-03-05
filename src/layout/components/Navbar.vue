<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 全局搜索 -->
      <div class="search-container">
        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
          v-model="searchVisible"
          popper-class="custom-search-popover"
        >
          <template slot="reference">
            <el-button
              class="search-button"
              icon="el-icon-search"
              circle
            />
          </template>
          <div class="search-content">
            <el-input
              v-model="searchQuery"
              placeholder="搜索路由..."
              prefix-icon="el-icon-search"
              @input="handleSearch"
              @keyup.enter="handleSearch"
              class="custom-search-input"
            >
              <template slot="append">
                <el-button class="clear-button" @click="searchQuery = ''; handleSearch()"><i class="el-icon-close"></i></el-button>
              </template>
            </el-input>
            <div class="custom-search-results" v-if="searchResults.length > 0">
              <div
                v-for="result in searchResults"
                :key="result.path"
                class="custom-search-result-item"
                @click="navigateTo(result.path)"
              >
                <div class="result-icon">
                  <i class="el-icon-right"></i>
                </div>
                <div class="result-title">{{ result.title }}</div>
              </div>
            </div>
            <div class="custom-search-empty" v-else-if="searchQuery && searchResults.length === 0">
              <div class="empty-icon">
                <i class="el-icon-search"></i>
              </div>
              <div class="empty-text">没有找到匹配的路由</div>
            </div>
          </div>
        </el-popover>
      </div>

      <!-- 全屏按钮 -->
      <div class="fullscreen-container">
        <el-button
          class="fullscreen-button"
          :icon="isFullscreen ? 'el-icon-full-screen' : 'el-icon-full-screen'"
          circle
          @click="toggleFullscreen"
          title="全屏"
        />
      </div>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              回到首页
            </el-dropdown-item>
          </router-link>
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a> -->
          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">注 销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      searchVisible: false,
      searchQuery: '',
      searchResults: [],
      isFullscreen: false,
      localRoutes: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'routes'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 搜索方法
    handleSearch() {
      console.log('Navbar - 搜索查询:', this.searchQuery)
      console.log('Navbar - 本地路由数据:', this.localRoutes)
      
      if (!this.searchQuery) {
        this.searchResults = []
        console.log('Navbar - 搜索结果:', this.searchResults)
        return
      }
      
      const query = this.searchQuery.toLowerCase()
      this.searchResults = this.localRoutes.filter(route => {
        if (!route || !route.path) return false
        
        const title = route.title ? route.title.toLowerCase() : ''
        const name = route.name ? route.name.toLowerCase() : ''
        const path = route.path.toLowerCase()
        
        const match = title.includes(query) || name.includes(query) || path.includes(query)
        console.log('Navbar - 路由匹配:', route, match)
        return match
      })
      
      console.log('Navbar - 搜索结果:', this.searchResults)
    },
    // 导航到路由
    navigateTo(path) {
      if (!path) return
      this.$router.push(path)
      this.searchVisible = false
      this.searchQuery = ''
      this.searchResults = []
    },
    // 切换全屏
    toggleFullscreen() {
      if (!this.isFullscreen) {
        // 进入全屏
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen()
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen()
        }
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      }
      this.isFullscreen = !this.isFullscreen
    },
    // 初始化路由数据
    initRoutes() {
      this.localRoutes = []
      // 直接从 store 获取路由数据，与首页保持一致
      const routes = this.$store.state.permission.routes || []
      console.log('Navbar - 路由数据:', routes)
      this.extractRoutes(routes)
      console.log('Navbar - 提取后的路由数据:', this.localRoutes)
    },
    // 提取路由数据
    extractRoutes(routes) {
      for (const route of routes) {
        // 只添加有路径和标题的路由
        if (route.path && (route.meta && route.meta.title) || route.name) {
          this.localRoutes.push({
            path: route.path,
            title: route.meta && route.meta.title ? route.meta.title : route.name,
            name: route.name
          })
        }
        // 递归处理子路由
        if (route.children && route.children.length > 0) {
          this.extractRoutes(route.children)
        }
      }
    }
  },
  mounted() {
    // 初始化路由数据
    this.initRoutes()
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement
    })
    document.addEventListener('mozfullscreenchange', () => {
      this.isFullscreen = !!document.mozFullScreenElement
    })
    document.addEventListener('webkitfullscreenchange', () => {
      this.isFullscreen = !!document.webkitFullscreenElement
    })
    document.addEventListener('msfullscreenchange', () => {
      this.isFullscreen = !!document.msFullscreenElement
    })
  },
  watch: {
    // 监听路由变化，更新路由数据
    '$store.state.permission.routes': {
      handler() {
        this.initRoutes()
      },
      deep: true
    }
  },
  beforeDestroy() {
    // 移除事件监听
    document.removeEventListener('fullscreenchange', () => {})
    document.removeEventListener('mozfullscreenchange', () => {})
    document.removeEventListener('webkitfullscreenchange', () => {})
    document.removeEventListener('msfullscreenchange', () => {})
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: inline-block;
    vertical-align: middle;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    // 搜索容器
    .search-container {
      margin-right: 15px;
      display: inline-block;
      vertical-align: middle;

      .search-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        vertical-align: middle;

        &:hover {
          background: rgba(0, 0, 0, .025);
        }
      }

      .search-popover {
        padding: 10px;

        .search-input {
          width: 100%;
          transition: all 0.3s ease;
          border: 1px solid #409eff !important;
          border-radius: 4px !important;
          background: #ffffff !important;
          
          &:focus {
            border-color: #409eff !important;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
          }
          
          .el-button {
            padding: 0 10px !important;
            color: #909399 !important;
          }
        }

        .search-results {
          position: relative;
          background: white;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          margin-top: 0 !important;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
        }

        .search-result-item {
          padding: 8px 16px !important;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.2s ease;
          border-bottom: none !important;
        }

        .search-result-item:hover {
          background-color: #f5f7fa;
        }

        .search-result-item i {
          color: #409eff !important;
          margin-right: 8px !important;
          font-size: 14px !important;
        }

        .search-result-item span {
          font-size: 14px !important;
          color: #303133 !important;
        }

    


        .search-empty {
          margin-top: 8px;
          text-align: center;
          color: #909399;
          font-size: 14px;
          padding: 20px 0;
        }
      }
    }

    // 全屏容器
    .fullscreen-container {
      margin-right: 15px;
      display: inline-block;
      vertical-align: middle;

      .fullscreen-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        vertical-align: middle;

        &:hover {
          background: rgba(0, 0, 0, .025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      display: inline-block;
      vertical-align: middle;

      .avatar-wrapper {
        position: relative;
        display: inline-block;
        vertical-align: middle;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
        }
      }
    }
  }
}

/* 全局搜索样式 */
.custom-search-popover {
  padding: 16px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  background: #ffffff !important;
  border: 1px solid #e4e7ed !important;
}

.search-content {
  width: 100% !important;
}

.custom-search-input {
  width: 100% !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  font-size: 14px !important;
  
  &:focus {
    border-color: #409eff !important;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
  }
  
  .el-input__prefix {
    color: #c0c4cc !important;
  }
  
  .el-input__suffix {
    color: #c0c4cc !important;
  }
}

.clear-button {
  padding: 0 10px !important;
  color: #909399 !important;
  font-size: 14px !important;
  
  &:hover {
    color: #606266 !important;
  }
}

.custom-search-results {
  margin-top: 12px !important;
  max-height: 300px !important;
  overflow-y: auto !important;
  border-radius: 6px !important;
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
}

.custom-search-result-item {
  display: flex !important;
  align-items: center !important;
  padding: 12px 16px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  border-bottom: 1px solid #f0f0f0 !important;
  
  &:last-child {
    border-bottom: none !important;
  }
  
  &:hover {
    background: #f0f7ff !important;
    transform: translateX(4px) !important;
  }
  
  .result-icon {
    width: 28px !important;
    height: 28px !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, #b3c5ff 0%, #d6e0ff 100%) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-right: 12px !important;
    flex-shrink: 0 !important;
    
    i {
      color: #409eff !important;
      font-size: 14px !important;
      margin-right: 0 !important;
    }
  }
  
  .result-title {
    flex: 1 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    color: #303133 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  }
}

.custom-search-empty {
  margin-top: 24px !important;
  text-align: center !important;
  padding: 40px 20px !important;
  background: #fafafa !important;
  border-radius: 6px !important;
  border: 1px solid #f0f0f0 !important;
  
  .empty-icon {
    width: 64px !important;
    height: 64px !important;
    border-radius: 50% !important;
    background: #f0f7ff !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 auto 16px !important;
    
    i {
      font-size: 24px !important;
      color: #83b9ff !important;
    }
  }
  
  .empty-text {
    font-size: 14px !important;
    color: #909399 !important;
  }
}
</style>
