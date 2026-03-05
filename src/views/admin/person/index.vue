<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :label-position="labelPosition" label-width="80px" :model="listQuery">
        <el-form-item label="用户代码">
          <el-input v-model="listQuery.code" placeholder="Title" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="listQuery.userName" placeholder="Title" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="listQuery.phone" placeholder="Title" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
          @click="handleCreate">
          新增
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
          @click="handleDownload">
          导出
        </el-button>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" v-if="false">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" align="center" width="95">
        <template slot-scope="{row}">
          <img v-if="row.avatar" :src="row.avatar" class="user-avatar" />
          <el-avatar v-else size="small">{{ row.userName && row.userName.charAt(0) || 'U' }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户账号" min-width="100" max-width="180" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.userAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="100" max-width="180" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150" max-width="200" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="100" max-width="150" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司" min-width="100" max-width="200" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="150" max-width="250" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in (Number(row.importance) || 0)" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.deleted | statusFilter">
            {{ row.deleted | statusText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status != 'published'" size="mini" type="success"
            @click="handleModifyStatus(row, 'published')">
            Publish
          </el-button>
          <el-button v-if="row.status != 'draft'" size="mini" @click="handleModifyStatus(row, 'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户昵称" prop="type">
          <el-input v-model="temp.userName" placeholder="请输入用户昵称"/>
        </el-form-item>
         <el-form-item label="phone">
          <el-input v-model="temp.phone" placeholder="电话号码" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="title">
          <el-input v-model="temp.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="公司">
            <el-input v-model="temp.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="个人简介">
            <el-input v-model="temp.profile" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入个人简介" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import rSelect from '@/components/Select/Select';
import { getUserList } from '@/api/admin/person/user'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination, rSelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'published',
        1: 'danger'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusTextMap = {
        0: 'published',
        1: 'danger'
      }
      return statusTextMap[status] || status
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        code: null,
        userName: null,
        phone: null
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getUserList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = response.data.current
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      //   this.listLoading = true
      //   fetchList(this.listQuery).then(response => {
      //     this.list = response.data.items
      //     this.total = response.data.total

      //     // Just to simulate the time of the request
      //     setTimeout(() => {
      //       this.listLoading = false
      //     }, 1.5 * 1000)
      //   })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      //   this.$refs['dataForm'].validate((valid) => {
      //     if (valid) {
      //       const tempData = Object.assign({}, this.temp)
      //       tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      //       updateArticle(tempData).then(() => {
      //         const index = this.list.findIndex(v => v.id === this.temp.id)
      //         this.list.splice(index, 1, this.temp)
      //         this.dialogFormVisible = false
      //         this.$notify({
      //           title: 'Success',
      //           message: 'Update Successfully',
      //           type: 'success',
      //           duration: 2000
      //         })
      //       })
      //     }
      //   })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      //   fetchPv(pv).then(response => {
      //     this.pvData = response.data.pvData
      //     this.dialogPvVisible = true
      //   })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.el-form-item {
  margin-right: 20px;
  margin-bottom: 0;
}

.fixed-width {
  width: 120px;
}

.small-padding {
  padding: 0 5px;
}

.status-col {
  width: 100px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
