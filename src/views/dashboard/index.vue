<template>
  <div class="dashboard-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商铺名称：{{shop.shopName}}</span>
        <span style="float: right;">商铺状态：<el-tag :type="statusType(shop.isDeleted)">{{shop.shopStatusName}}</el-tag></span>
      </div>
      <div class="text item">
        商铺地址：{{shop.shopAddress}}<br>
        商铺电话：{{shop.shopTel}}<br>
        商铺营业时间：{{shop.shopBusinessTime1 + ' ' + shop.shopBusinessTime2}}<br>
        商铺简介：{{shop.shopInfo}}<br>
        <div style="float: right;">
          <el-button v-if="shop.isDeleted === 0" size="mini" type="danger" @click="offline">点击下线</el-button>
          <el-button v-else-if="shop.isDeleted === 5" size="mini" type="success" @click="online">点击上线</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { onlineShop, offlineShop } from '@/api/shop'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'shop'
    ])
  },
  methods: {
    offline() {
      this.$confirm('确认要执行下线操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        offlineShop({ id: this.$store.getters.shop.id }).then(response => {
          this.$message({
            type: 'success',
            message: '下线成功!'
          })
          this.refreshUserInfo()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '放弃下线'
        })
      })
    },
    online() {
      this.$confirm('确认要执行上线操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlineShop({ id: this.$store.getters.shop.id }).then(response => {
          this.$message({
            type: 'success',
            message: '上线成功!'
          })
          this.refreshUserInfo()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '放弃上线'
        })
      })
    },
    refreshUserInfo() {
      this.$store
        .dispatch('GetUserInfo')
        .then(res => {

        })
    },
    statusType(type) {
      if (type === 0) {
        return 'success'
      } else if (type === 5) {
        return 'danger'
      }
      return ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  line-height: 20px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
