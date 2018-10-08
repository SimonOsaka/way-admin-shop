<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button v-if="list.length === 0" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('commodity.create')}}</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column label="商品图片" width="80">
        <template slot-scope="scope">
          <img class="shop_logo" :src="scope.row['imgUrl']"></img>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="商品 ID"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格" width="100"></el-table-column>
      <el-table-column align="center" label="商品状态">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.statusName }}</el-tag>
          <div v-if="scope.row.isDeleted === 3">
            <el-button type="text" size="mini" @click="handleReason(scope.row)">查看原因</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="270" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="handleDetail(scope.row)">查看</el-button>
            <el-button v-if="scope.row.isDeleted === 3 || scope.row.isDeleted === 5" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.isDeleted === 5" size="mini" type="success" @click="handleOnline(scope.row)">上架</el-button>
            <el-button v-if="scope.row.isDeleted === 0" size="mini" type="success" @click="handleOffline(scope.row)">下架</el-button>
            <el-button v-if="scope.row.isDeleted === 3 || scope.row.isDeleted === 4 || scope.row.isDeleted === 5" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="原因" :visible.sync="reject.dialogVisible">
      <span style="color: red; font-weight: bold;">{{ reject.content }}</span>
    </el-dialog>
  </div>
</template>

<script>
import { queryCommodity, deleteCommodity, onlineCommodity, offlineCommodity, getCommodityRejectLog } from '@/api/commodity'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'shopList',
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        shopId: '',
        page: 1,
        size: 20
      },
      tableData: [],
      reject: {
        dialogVisible: false,
        content: ''
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.shopId = this.$store.getters.shop.id
      queryCommodity(this.listQuery).then(response => {
        this.list = response.data.commodityBoList
        this.listLoading = false
      }, error => {
        console.error(error)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/commodity/create' })
    },
    handleDetail(row) {
      this.$router.push({ path: '/commodity/detail', query: {
        id: row['id']
      }})
    },
    handleUpdate(row) {
      if (this.$store.getters.shop.isDeleted === 0) {
        this.$message({ type: 'info', message: '商铺是上线状态，无法进行编辑' })
        return
      }

      this.$router.push({ path: '/commodity/update', query: {
        id: row['id']
      }})
    },
    handleDelete(row) {
      if (this.$store.getters.shop.isDeleted === 0) {
        this.$message({ type: 'info', message: '商铺是上线状态，无法进行删除' })
        return
      }

      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCommodity({ id: row['id'] }).then(response => {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleOnline(row) {
      this.$confirm('确定要执行上架？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlineCommodity({ id: row['id'] }).then(response => {
          const index = this.list.indexOf(row)
          this.list[index].isDeleted = 0
          this.list[index].statusName = response.data.commodityBo.statusName
          this.$message({
            type: 'success',
            message: '上架成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        })
      })
    },
    handleOffline(row) {
      this.$confirm('确定要执行下架？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        offlineCommodity({ id: row['id'] }).then(response => {
          const index = this.list.indexOf(row)
          this.list[index].isDeleted = 5
          this.list[index].statusName = response.data.commodityBo.statusName
          this.$message({
            type: 'success',
            message: '下架成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })
      })
    },
    handleReason(row) {
      getCommodityRejectLog({ type: 3, commodityId: row.id }).then(response => {
        const commodityLogBo = response.data['commodityLogBo']
        if (commodityLogBo) {
          this.reject.content = commodityLogBo.content
        }
        this.reject.dialogVisible = true
      })
    }
  },
  created() {
    this.getList()
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.shop_logo {
  width: 64px;
  height: 64px;
}
</style>