<template>
  <div class="account-container">
    <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px">
      <!-- 头像上传 -->
      <el-form-item label="头像">
        <div class="avatar-uploader">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            :before-upload="beforeAvatarUpload"
            accept="image/*"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="avatar-hint">点击上传头像，支持 JPG、PNG 格式</div>
        </div>
      </el-form-item>

      <!-- 基本信息 -->
      <el-form-item label="姓名" prop="userName">
        <el-input v-model.trim="userForm.userName" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="userForm.email" placeholder="请输入邮箱" type="email" />
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input v-model.trim="userForm.phone" placeholder="请输入电话号码" />
      </el-form-item>

      <el-form-item label="职位" prop="position">
        <el-input v-model.trim="userForm.position" placeholder="请输入职位" />
      </el-form-item>

      <el-form-item label="个人简介" prop="profile">
        <el-input
          v-model="userForm.profile"
          placeholder="请输入个人简介"
          type="textarea"
          rows="4"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading">保存修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>



<script>
import { modifyUser } from '@/api/admin/person/user'
import { upload } from '@/api/file/minio'

import { mapGetters } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          userName: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          profile: '',
          avatar: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ]),
  },
  data() {
    return {
      userForm: {
        userAccount: null,
        userName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        profile: '',
        avatar: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        position: [
          { max: 50, message: '职位长度不超过 50 个字符', trigger: 'blur' }
        ],
        department: [
          { max: 50, message: '部门长度不超过 50 个字符', trigger: 'blur' }
        ],
        bio: [
          { max: 200, message: '个人简介长度不超过 200 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted() {
    // 初始化表单数据
    this.userForm = { ...this.user }
  },
  watch: {
    user: {
      handler(newUser) {
        this.userForm = { ...newUser }
      },
      deep: true
    }
  },
  methods: {
    // 头像上传前验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('只支持 JPG/PNG 格式的图片')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB')
        return false
      }
      return true
    },
    // 处理头像上传
    handleAvatarChange(file) {
      debugger
      // 直接上传到后端
      const formData = new FormData()
      formData.append('file', file.raw)
      
      // 显示上传中状态
      this.loading = true
      
      // 使用axios上传文件
      upload(formData).then(response => {
          // 假设后端返回的格式为 { data: { url: '头像URL' } }
          if (response.data) {
            this.userForm.avatar = response.data
            this.$message({
              message: '头像上传成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message({
              message: '头像上传失败，请重试',
              type: 'error',
              duration: 3000
            })
          }
        }).catch(error => {
          console.error('头像上传失败:', error)
          this.$message({
            message: '头像上传失败，请检查网络连接',
            type: 'error',
            duration: 3000
          })
        }).finally(() => {
          this.loading = false
        })
    },
    // 提交表单
    submitForm() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          // 将mapGetters里面的name放进this.userForm
          this.userForm.userAccount = this.name
        
          modifyUser(this.userForm).then(res => {
            console.log("修改数据：" + res)
            this.$message({
              message: '个人信息修改成功',
              type: 'success',
              duration: 3000
            })
            this.loading = false
          })
          this.loading = true
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.userForm.resetFields()
      this.userForm = { ...this.user }
    }
  }
}
</script>

<style scoped lang="scss">
.account-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-uploader {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-uploader-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 50%;
    font-size: 28px;
    color: #909399;
    background: #f0f0f0;
  }

  .avatar-hint {
    margin-left: 20px;
    font-size: 12px;
    color: #909399;
  }
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
}

.el-button {
  margin-right: 10px;
}
</style>
