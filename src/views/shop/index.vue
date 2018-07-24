<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('shop.shopNamePlaceholder')" v-model="listQuery.shopName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('shop.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('shop.create')}}</el-button>

      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="shopAddress">商家地址</el-checkbox>
        <el-checkbox label="shopTel">商家电话</el-checkbox>
        <el-checkbox label="shopBusinessTime">商家营业时间</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :data="list" :key='key' v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column label="商家logo" width="80">
        <template slot-scope="scope">
          <img class="shop_logo" :src="scope.row['shopLogoUrl']"></img>
        </template>
      </el-table-column>
      <el-table-column prop="shopName" label="商家名称" width="180"></el-table-column>
      <el-table-column :key='shop.prop.concat(i)' v-for='(shop, i) in formThead' :label="shop.label">
        <template slot-scope="scope">
          {{scope.row[shop.prop]}}
        </template>
      </el-table-column>
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
import { queryShopList, deleteShop } from '@/api/shop'
import waves from '@/directive/waves' // 水波纹指令
const defaultFormThead = ['shopAddress', 'shopTel', 'shopBusinessTime']

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
        size: 20,
        shopName: undefined
      },
      tableData: [],
      key: 1, // table key
      formTheadOptions: [
        { label: '商家地址', prop: 'shopAddress' },
        { label: '商家电话', prop: 'shopTel' },
        { label: '商家营业时间', prop: 'shopBusinessTime' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: [
        { label: '商家地址', prop: 'shopAddress' },
        { label: '商家电话', prop: 'shopTel' },
        { label: '商家营业时间', prop: 'shopBusinessTime' }
      ] // 默认表头 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(
        i => valArr.indexOf(i.prop) >= 0
      )
      this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      queryShopList(this.listQuery).then(response => {
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
      this.$router.push({ path: '/shop/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/shop/update', query: {
        id: row['id']
      }})
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteShop({ id: row['id'] }).then(response => {
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