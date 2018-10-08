<template>
  <div class="dashboard-container">
    <el-row v-if="shop.isDeleted === 0 || shop.isDeleted === 5">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-button v-if="shop.isDeleted === 0" size="mini" type="danger" @click="offline">点击下线</el-button>
          <el-button v-else-if="shop.isDeleted === 5" size="mini" type="success" @click="online">点击上线</el-button>
        </div>
      </el-col>
    </el-row>  
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <span>商家名称：{{shop.shopName}}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <span>商家状态：<el-tag :type="statusType(shop.isDeleted)">{{shop.shopStatusName}}</el-tag>
          <el-button v-if="shop.isDeleted === 3" type="text" size="mini" @click="handleReason(shop.id)">查看原因</el-button></span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <span>商家 ID：<strong>{{shop.id}}</strong></span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <span>商家地址：{{shop.shopAddress}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <label>商家电话：</label>{{shop.shopTel}}
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <label>商家营业时间：</label>{{shop.shopBusinessTime1 + ' ' + shop.shopBusinessTime2}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <label>商家简介：</label>{{shop.shopInfo}}
        </div>
      </el-col>
    </el-row>

    <el-dialog title="原因" :visible.sync="reject.dialogVisible">
      <span style="color: red; font-weight: bold;">{{ reject.content }}</span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { onlineShop, offlineShop, getShopRejectLog } from '@/api/shop'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'shop'
    ])
  },
  data() {
    return {
      reject: {
        dialogVisible: false,
        content: ''
      }
    }
  },
  created() {
    this.refreshUserInfo()
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
    },
    handleReason(shopId) {
      getShopRejectLog({ type: 3, shopId: shopId }).then(response => {
        const shopLogBo = response.data['shopLogBo']
        if (shopLogBo) {
          this.reject.content = shopLogBo.content
        }
        this.reject.dialogVisible = true
      })
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
