<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('commodity.create')}}</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column label="商品图片" width="80">
        <template slot-scope="scope">
          <img class="shop_logo" :src="scope.row['imgUrl']"></img>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格" width="100"></el-table-column>
      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { queryCommodity, deleteCommodity } from '@/api/commodity'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'shopList',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 20
      },
      tableData: []
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      queryCommodity(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

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
    handleUpdate(row) {
      this.$router.push({ path: '/commodity/update', query: {
        id: row['id']
      }})
    },
    handleDelete(row) {
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