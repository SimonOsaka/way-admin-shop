<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商家logo" required>
        <el-upload
          ref="logoUpload"
          class="avatar-uploader"
          action="https://upload.qiniup.com"
          :data="uploadLogoData"
          :show-file-list="false"
          :auto-upload="false"
          :on-success="handleAvatarSuccess"
          :on-change="handleUploadOnChange"
          :on-error="handleUploadOnError"
          :on-progress="handleUploadOnProgress"
          :before-upload="beforeAvatarUpload">
          <el-progress v-if="logoFile.progressShow" :width="178" type="circle" :percentage="logoFile.progress" :status="progressStatus"></el-progress>
          <img v-else-if="form.shopLogoUrl" :src="form.shopLogoUrl + '?imageView2/1/w/178/h/178'" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商家名称" required>
        <el-input v-model="form.shopName"></el-input>
      </el-form-item>
      <el-form-item label="商家分类" required>
        <el-cascader
          :options="cateRootOptions"
          @active-item-change="handleItemChange"
          @change="handleChange"
          @blur="handleCascaderBlur"
          @focus="handleCascaderBlur"
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
            <el-table :data="addressSearchResult" highlight-current-row :border="true" @row-click="handleCurrentChange" height="300" style="width: 100%;" :header-row-class-name="handleHeaderRowStyle">
              <el-table-column label="选择地址">
                <template slot-scope="scope">
                  <span class="font-weight-bold">{{scope.row['name']}}</span>
                  <br>
                  <span>{{scope.row['fullAddress']}}</span>
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
import { getShop, createShop, updateShop, getShopCateAll } from '@/api/shop'
import { searchMap } from '@/api/amap'
import { getQiniuToken, getShopLogoKey } from '@/utils/qiniu'

export default {
  data() {
    return {
      addressMarker: {
        position: []
      },
      uploadLogoData: {},
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
        shopCateLeafId: undefined,
        cityCode: undefined,
        userLoginId: undefined
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
        label: 'cateName',
        value: 'id',
        children: 'leafList'
      },
      cateValue: [],
      amap: {
        zoom: 14
      },
      logoFile: {
        uid: null,
        name: null,
        progress: 0,
        uploadSuccess: null,
        progressShow: false
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
    },
    progressStatus() {
      if (this.logoFile.uploadSuccess === true) {
        return 'success'
      } else if (this.logoFile.uploadSuccess === false) {
        return 'exception'
      } else {
        return ''
      }
    }
  },
  created() {
    this.getShopDetail()
  },
  methods: {
    getCateAll() {
      getShopCateAll().then(response => {
        this.cateRootOptions = response.data.cateRootBoList
      })
    },
    getShopDetail() {
      console.log(this.$route.query)
      if (this.$route.query.id) {
        getShop({ id: this.$route.query.id }).then(response => {
          console.log(response)
          this.form = response.data.shopBo
          if (this.form.wayShopCateRoot.id) {
            this.cateValue.push(this.form.wayShopCateRoot.id)
          }
          if (this.form.wayShopCateLeaf.id) {
            this.cateValue.push(this.form.wayShopCateLeaf.id)
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
          this.getCateAll()
        })
      } else {
        this.getCateAll()
      }
    },
    onSubmit() {
      console.log(this.shopBt1, this.shopBt2, this.t1, this.t2, this.cateValue)
      this.form.shopBusinessTime1 = this.t1
      this.form.shopBusinessTime2 = this.t2
      if (!this.form.id) {
        this.form.userLoginId = this.$store.getters.userLoginId
        createShop(this.form, this.$store.getters.token).then(response => {
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
      console.log('上传shop logo成功返回', res)
      this.logoFile.uploadSuccess = true
      setTimeout(() => {
        this.logoFile.progressShow = false
      }, 1000)

      this.form.shopLogoUrl = 'http://7xl2ey.com1.z0.glb.clouddn.com/' + res.key
    },
    handleUploadOnChange(file) {
      // 文件名自定义问题解决方式
      // https://segmentfault.com/a/1190000012234747
      if (file.status === 'ready') {
        this.uploadLogoData = {
          token: getQiniuToken(),
          key: getShopLogoKey()
        }
        this.logoFile.progress = 0
        this.logoFile.uploadSuccess = null
        this.logoFile.progressShow = true
        this.$nextTick(() => {
          this.$refs.logoUpload.submit()
        })
      }
    },
    beforeAvatarUpload(file) {
      console.log('上传before', file)

      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (isJPG && isLt2M) {
        return true
      }

      this.logoFile.progress = 0
      this.logoFile.uploadSuccess = null
      this.logoFile.progressShow = false

      return false
    },
    handleUploadOnError() {
      this.logoFile.uploadSuccess = false
      setTimeout(() => {
        this.logoFile.progressShow = false
      }, 1000)
    },
    handleUploadOnProgress(e, file) {
      this.logoFile.progress = Math.floor(e.percent)
    },
    handleItemChange(value) {
      console.log('handleItemChange', value, 'item length:', value.length)
    },
    handleChange(value) {
      console.log('handleChange', value)
      // if (value.length === 1) {
      //   const rootId = value[0]
      //   this.getShopCateLeaf(rootId)
      // } else
      if (value.length === 2) {
        this.form.shopCateLeafId = value[1]
        console.log('商品分类，二级选择', this.form.shopCateLeafId)
      }
    },
    handleCurrentChange(val) {
      const currentRow = val
      console.log(currentRow)
      this.form.shopAddress = currentRow.fullAddress
      this.form.cityCode = currentRow.cityCode
      this.form.shopLng = currentRow.location.split(',')[0]
      this.form.shopLat = currentRow.location.split(',')[1]
      this.addressMarker.position = [this.form.shopLng, this.form.shopLat]
      this.$refs.map.$$getInstance().setZoomAndCenter(this.zoom, this.addressMarker.position)
    },
    handleSearchAddress() {
      searchMap(this.form.shopAddress).then(response => {
        const data = response.data
        this.addressSearchResult = data
      })
    },
    handleCascaderBlur() {

    },
    handleHeaderRowStyle(row, rowIndex) {
      return 'amap-address-header'
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