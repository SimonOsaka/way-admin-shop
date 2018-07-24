<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商家logo" required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :headers="{'Access-Control-Allow-Origin': '*'}"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.shopLogoUrl" :src="form.shopLogoUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商家名称" required>
        <el-input v-model="form.shopName"></el-input>
      </el-form-item>
      <el-form-item label="商家分类" required>
        <el-cascader
          :options="cateRootOptions"
          :show-all-levels="false"
          @active-item-change="handleItemChange"
          @change="handleChange"
          :props="cateRootProps"
          :value="cateValue"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="商家地址" required>
        <el-input v-model="form.shopAddress" class="amap-address"></el-input><el-button type="primary" @click="handleSearchAddress">查询</el-button>
        <div class="amap-section">
          <div class="amap-map">
            <el-amap ref="map" vid="amap-container" :zoom="amap.zoom" class="amap-container">
              <el-amap-marker v-if="addressMarker.position.length !== 0" vid="component-marker" :position="addressMarker.position"></el-amap-marker>
            </el-amap>
          </div>
          <div class="amap-address">
            <el-table :data="addressSearchResult" :show-header="false" highlight-current-row @current-change="handleCurrentChange" style="width: 100%; height: 300px;overflow-y: scroll;">
              <el-table-column label="POI点信息">
                <template slot-scope="scope">
                  <span>{{scope.row['date']}}</span>
                  <span>{{scope.row['name']}}</span>
                  <span>{{scope.row['address']}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商家电话" required>
        <el-input v-model="form.shopTel"></el-input>
      </el-form-item>
      <el-form-item label="商家营业时间1" required>
        <el-time-select
          v-model="shopBt1.start"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '23:59'
          }"
          placeholder="开始时间">
        </el-time-select>
        <el-time-select
          v-model="shopBt1.end"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '23:59',
            minTime: shopBt1.start
          }"
          placeholder="结束时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="商家营业时间2">
        <el-time-select
          v-model="shopBt2.start"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '23:59'
          }"
          placeholder="开始时间">
        </el-time-select>
        <el-time-select
          v-model="shopBt2.end"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '23:59',
            minTime: shopBt2.start
          }"
          placeholder="结束时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="商家简介">
        <el-input type="textarea" v-model="form.shopInfo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getShop, createShop, updateShop, getShopCateRoot, getShopCateLeaf } from '@/api/shop'
import { searchMap } from '@/api/amap'

export default {
  data() {
    return {
      addressMarker: {
        position: []
      },
      addressSearchResult: [],
      form: {
        id: undefined,
        shopName: '',
        shopAddress: '',
        shopLng: '',
        shopLat: '',
        shopTel: '',
        shopBusinessTime1: '',
        shopBusinessTime2: '',
        shopLocation: '',
        shopInfo: '',
        shopLogoUrl: '',
        shopCateRootId: undefined,
        shopCateLeafId: undefined
      },
      shopBt1: {
        start: '',
        end: ''
      },
      shopBt2: {
        start: '',
        end: ''
      },
      cateRootOptions: [],
      cateRootProps: {
        label: 'label',
        value: 'id',
        children: 'leaf'
      },
      cateValue: [],
      amap: {
        zoom: 14
      }
    }
  },
  computed: {
    t1() {
      if (this.shopBt1.start && this.shopBt1.end) {
        return this.shopBt1.start + '-' + this.shopBt1.end
      }
      return ''
    },
    t2() {
      if (this.shopBt2.start && this.shopBt2.end) {
        return this.shopBt2.start + '-' + this.shopBt2.end
      }
      return ''
    }
  },
  created() {
    this.getShopDetail()
  },
  methods: {
    getCateRootLeaf() {
      const rootId = this.form.shopCateRootId
      getShopCateRoot().then(response => {
        const data = response.data
        this.cateRootOptions = data
        getShopCateLeaf({ rootId: rootId }).then(response => {
          const leaf = response.data
          this.cateRootOptions.forEach(element => {
            if (element.id === rootId) {
              element.leaf = leaf
            }
          })

          console.log('商家分类初始化数据', this.cateRootOptions)
        })
      })
    },
    getShopCateRoot() {
      getShopCateRoot().then(response => {
        const data = response.data
        this.cateRootOptions = data
      })
    },
    getShopCateLeaf(rootId) {
      getShopCateLeaf({ rootId: rootId }).then(response => {
        const leaf = response.data
        this.cateRootOptions.forEach(element => {
          if (element.id === rootId) {
            element.leaf = leaf
          }
        })
      })
    },
    getShopDetail() {
      console.log(this.$route.query)
      if (this.$route.query.id) {
        getShop({ id: this.$route.query.id }).then(response => {
          console.log(response)
          this.form = response.data
          if (this.form.shopCateRootId) {
            this.cateValue.push(this.form.shopCateRootId)
          }
          if (this.form.shopCateLeafId) {
            this.cateValue.push(this.form.shopCateLeafId)
          }
          if (this.form.shopBusinessTime1 && this.form.shopBusinessTime1.split('-').length === 2) {
            this.shopBt1.start = this.form.shopBusinessTime1.split('-')[0]
            this.shopBt1.end = this.form.shopBusinessTime1.split('-')[1]
          }
          if (this.form.shopBusinessTime2 && this.form.shopBusinessTime2.split('-').length === 2) {
            this.shopBt2.start = this.form.shopBusinessTime2.split('-')[0]
            this.shopBt2.end = this.form.shopBusinessTime2.split('-')[1]
          }
          this.addressMarker.position = [this.form.shopLng, this.form.shopLat]
          this.$refs.map.$$getInstance().setZoomAndCenter(this.zoom, this.addressMarker.position)
          this.getCateRootLeaf()
        })
      } else {
        this.getShopCateRoot()
      }
    },
    onSubmit() {
      console.log(this.shopBt1, this.shopBt2, this.t1, this.t2, this.cateValue)
      this.form.shopBusinessTime1 = this.t1
      this.form.shopBusinessTime2 = this.t2
      if (!this.form.id) {
        createShop(this.form).then(response => {
          this.$message('创建成功')
          this.$router.push('/')
        })
      } else {
        updateShop(this.form).then(response => {
          this.$message('更新成功')
          if (!this.$route.query.from) {
            this.$router.push('/')
          }
        })
      }
    },
    onCancel() {
      this.$router.go(-1)
    },
    handleAvatarSuccess(res, file) {
      this.form.shopLogoUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleItemChange(val) {
      console.log('active item:', val, 'item length:', val.length)
      const rootId = val[val.length - 1]
      this.getShopCateLeaf(rootId)
    },
    handleChange(value) {
      console.log(value)
      if (value.length === 2) {
        this.form.shopCateLeafId = value[1]
        console.log('商品分类，二级选择', this.form.shopCateLeafId)
      }
    },
    handleCurrentChange(val) {
      const currentRow = val
      console.log(currentRow)
      this.form.shopAddress = currentRow.address
      this.form.shopLng = currentRow.lng
      this.form.shopLat = currentRow.lat
      this.addressMarker.position = [currentRow.lng, currentRow.lat]
      this.$refs.map.$$getInstance().setZoomAndCenter(this.zoom, this.addressMarker.position)
    },
    handleSearchAddress() {
      searchMap(this.form.shopAddress).then(response => {
        const data = response.data
        this.addressSearchResult = data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.line {
  text-align: center;
}

.amap-container {
  height: 300px;
}

.amap-section {
  margin-top: 5px;
  height: 300px;
}

.amap-section .amap-map {
  display: inline-block;
  width: 78%;
}

.amap-section .amap-address {
  display: inline-block;
  width: 20%;
  height: 300px;
}

.amap-address {
  width: 80%;
}
</style>

