<template>
  <el-select
    :value="value"
    :placeholder="placeholder"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :collapse-tags="collapsetags"
    @input="handleInput"
    @blur="handleBlur"
    @change="handleChange($event, filterMap)"
    @focus="handleFocus"
    @click.native="fleshUrl"
    class="r-select"
    @keyup.enter.native="enterHandle"
    v-cloak
  >
    <el-option
      v-for="(role, index) in filterMap"
      :key="index"
      :label="role.name"
      :value="role.id"
      @click.native="handelIndex(index)"
    ></el-option>
  </el-select>
</template>

<script>
import selectComponents from './selectComponents'
import { mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  name: 'r-select',
  mixins: [selectComponents],
  props: {
    value: {
      default: null
    },
    // 过滤 不想出现在选择里面的值
    excludeCode: {
      type: Array
    },
    includeCode: {
      type: Array
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    collapsetags: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean
    },
    responseHandle:{
      type: Function,
      default: (el,selectid,selectname) => {
        (el.id = el[selectid]),
        (el.name = el[selectname])
      }
    },
    enterHandle: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      filterMap: [],
      requesturl: ''
    }
  },
  computed: {
    ...mapGetters(['dictMap'])
  },
  watch: {
    url: {
      handler(curVal, oldVal) {
        this.querybyurl()
      },
      immediate: true
    },
    type: {
      handler(curVal, oldVal) {
        this.querybytype()
      },
      immediate: true
    },
    excludeCode: {
      handler(value) {
        if (this.type) {
          this.querybytype()
        }
        if (this.url) {
          this.querybyurl()
        }
        // this.querybyurl()
      },
      deep: true
    },
    includeCode: {
      handler(value) {
        if (this.type) {
          this.querybytype()
        }
        if (this.url) {
          this.querybyurl()
        }
        // this.querybyurl()
      },
      deep: true
    },
    value: {
      handler(curVal) {
        // 适配多选时默认参数传入非数组
        if (this.multiple) {
          if (!Array.isArray(curVal)) {
            if (curVal === null || curVal === undefined || curVal === '') {
              this.$emit('input', [])
              return
            }
            this.$emit('input', [curVal])
          }
        }
      },
      immediate: true
    }
    // value(curVal, val) {
    //   if (curVal !== undefined && curVal !== '' && this.filterMap.length > 0) {
    //     for (var i = 0; i < this.filterMap.length; i++) {
    //       if (val === this.filterMap[i].id) {
    //         this.$emit('update:labelvalue', this.filterMap[i].name)
    //         return
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    querybyurl() {
      if (this.url != undefined && this.url != '') {
        if (this.father != undefined && this.father == '') {
          return
        }
        this.requesturl = `${SERVER[this.model]}` + this.url
        request
          .get(this.requesturl)
          .then(response => {
            response.forEach(
              // el => (
              //   (el.id = el[this.selectid]),
              //   (el.name = el[this.selectname])
              // )
              el => this.responseHandle(el,this.selectid,this.selectname)
            )
            if (response != undefined && response.length > 0 && this.excludeCode) {
              response = response.filter(item => !~this.excludeCode.indexOf(item.id))
              // this.checkValueInMap()
            }
            this.filterMap = response
            this.$emit('get-FilterMap', true)
            this.$emit('FilterMap',this.filterMap)
            this.checkValueInMap()
          })
          .catch(err => {})
      } else {
        this.filterMap = []
        this.checkValueInMap()
      }
    },
    querybytype() {
      if (this.type != undefined) {
        if (this.excludeCode != undefined && this.excludeCode != '') {
          this.filterMap=[]
          let typeArr = this.dictMap[this.type]
          if (typeArr != undefined && typeArr.length > 0) {
            for (var i = 0; i < typeArr.length; i++) {
              if (this.excludeCode.indexOf(typeArr[i].id) == -1) {
                typeArr.forEach(item => {
                  if (this.selectid ) {
                    item.id = item[this.selectid]
                  }
                  if (this.selectname) {
                    item.name = item[this.selectname]
                  }
                })
                //不在排除范围内，添加
                this.filterMap.push(typeArr[i])
              }
            }
            this.checkValueInMap()
          }
        }else if (this.includeCode != undefined && this.includeCode != '') {
          this.filterMap=[]
          let typeArr = this.dictMap[this.type]
          if (typeArr != undefined && typeArr.length > 0) {
            for (var i = 0; i < typeArr.length; i++) {
              if (this.selectid ) {
                typeArr[i].id = typeArr[i][this.selectid]
              }
              if (this.selectname) {
                typeArr[i].name = typeArr[i][this.selectname]
              }
              if (this.includeCode.indexOf(typeArr[i].id) >=0) {
                //在包含的范围内，添加
                console.log(typeArr[i])
                this.filterMap.push(typeArr[i])
              }
            }
            console.log(this.filterMap)
            this.checkValueInMap()
          }
        } else {
          let filterMap = this.dictMap[this.type]
          console.log('before', filterMap);
          if (this.selectid) {
            filterMap = filterMap.map(item => {
              item.id = item[this.selectid]
              return item
            })
          }
          if (this.selectname) {
            filterMap = filterMap.map(item => {
              item.name = item[this.selectname]
              return item;
            })
          }
          this.filterMap = filterMap
          console.log('after', this.filterMap);
          // this.filterMap = this.dictMap[this.type]
          this.checkValueInMap()
        }
      }
      // console.log(this.type, this.filterMap)
    },
    checkValueInMap() {
      let flag = false
      if (Array.isArray(this.filterMap) && this.filterMap.length) {
        for (let i = 0; i < this.filterMap.length; i++) {
          if (this.filterMap[i].id === this.value) {
            flag = true
            break
          }
        }
      }
      if (!flag) {
        // this.$emit('input', null)
      }
    },
    handelIndex(index) {
      this.$emit('update:labelvalue', this.filterMap[index].name)

      // this.$emit('change', index, this.filterMap)
    },
    fleshUrl() {
      if (this.url) {
        this.querybyurl()
      }
      // if (this.type) {
      //   this.querybytype()
      // }
    }
  },
  created() {
    if (this.multiple) {
      const tmpArr = JSON.parse(JSON.stringify(this.filterMap))
      this.filterMap = []
      this.$nextTick(() => {
        this.filterMap = tmpArr
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .r-select {
    ::v-deep .el-input {
      .el-input__inner {
        padding: 0 15px;
      }
    }
  }
</style>
