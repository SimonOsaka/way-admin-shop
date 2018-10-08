<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商家logo" required>
        <upload-one :basePath="baseImagePath" :imageUrl="form.shopLogoUrl" @success="handleUploadSuccess"></upload-one>
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

      <el-row>
        <el-col :span="8">
          <el-form-item label="身份证正面">
            <upload-one :basePath="defaultQualify.idcard" :imageUrl.sync="form.idcardFrontImgUrl" @success="handleIdcardFrontUploadSuccess"></upload-one>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证背面">
            <upload-one :basePath="defaultQualify.idcard" :imageUrl="form.idcardBackImgUrl" @success="handleIdcardBackUploadSuccess"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手持身份证">
            <upload-one :basePath="defaultQualify.idcard" :imageUrl="form.idcardHandImgUrl" @success="handleIdcardHandUploadSuccess"/>
          </el-form-item>
        </el-col>
      </el-row>

    <el-row>
      <el-col :span="8">
        <el-form-item label="商家门面照片">
          <upload-one :basePath="defaultQualify.images" :imageUrl="form.shopOutsideImgUrl" @success="handleShopOutsideUploadSuccess"/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商家内部照片">
          <upload-one :basePath="defaultQualify.images" :imageUrl="form.shopInsideImgUrl" @success="handleShopInsideUploadSuccess"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-form-item label="营业执照">
          <upload-one :basePath="defaultQualify.license" :imageUrl="form.businessLicenseImgUrl" @success="handleBusinessLicenseUploadSuccess"/>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="其它资料">
          <upload-multiple :basePath="defaultQualify.license" :imageUrls="otherQualifyImageUrlList" @onSuccess="handleOtherLicenseUploadSuccess" @onRemove="handleOtherLicenseUploadRemove"/>
        </el-form-item>
      </el-col>
    </el-row>

      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button v-if="form.id" type="primary" @click="onSave" :loading="saveBtn.loading" :disabled="saveBtn.disabled">保存</el-button>
        <el-button type="primary" @click="onSubmit" :loading="saveBtn.loading" :disabled="saveBtn.disabled">提交</el-button>
        <el-alert :closable="false" v-if="saveBtn.disabled"
          title="商家信息无法编辑，只有在【草稿】和【待上线】状态允许编辑。"
          type="error">
        </el-alert>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import { getShop, createShop, updateShop, getShopCateAll } from '@/api/shop'
import { searchMap } from '@/api/amap'
import uploadOne from '@/components/UploadImage/uploadOne'
import uploadMultiple from '@/components/UploadImage/uploadMultiple'

export default {
  components: { uploadOne, uploadMultiple },
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
        shopCateLeafId: undefined,
        cityCode: undefined,
        userLoginId: undefined,
        businessLicenseImgUrl: '',
        idcardBackImgUrl: '',
        idcardFrontImgUrl: '',
        idcardHandImgUrl: '',
        other1ImgUrl: '',
        other2ImgUrl: '',
        other3ImgUrl: '',
        other4ImgUrl: '',
        other5ImgUrl: '',
        shopInsideImgUrl: '',
        shopOutsideImgUrl: '',
        updateType: ''
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
      saveBtn: {
        disabled: false,
        loading: false
      },
      baseImagePath: 'shop/logo/',
      defaultQualify: {
        idcard: 'shop/idcard/',
        license: 'shop/license/',
        images: 'shop/images/'
      },
      otherQualifyImageUrlList: []
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
    getCateAll() {
      getShopCateAll().then(response => {
        this.cateRootOptions = response.data.cateRootBoList
      })
    },
    getShopDetail() {
      console.log(this.$route.query)
      const shopId = this.$route.query.id || this.$store.getters.shop.id
      if (shopId) {
        getShop({ id: shopId }).then(response => {
          console.log(response)
          const shopData = response.data.shopBo
          this.form = shopData
          if (this.form.wayShopCateRoot && this.form.wayShopCateRoot.id) {
            this.cateValue.push(this.form.wayShopCateRoot.id)
          }
          if (this.form.wayShopCateLeaf && this.form.wayShopCateLeaf.id) {
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
          if (this.form.isDeleted !== 3 && this.form.isDeleted !== 5) {
            this.saveBtn.disabled = true
          }
          this.addressMarker.position = [this.form.shopLng, this.form.shopLat]
          this.$refs.map.$$getInstance().setZoomAndCenter(this.zoom, this.addressMarker.position)
          this.form.idcardFrontImgUrl = shopData.wayShopQualification.idcardFrontImgUrl
          this.form.idcardBackImgUrl = shopData.wayShopQualification.idcardBackImgUrl
          this.form.idcardHandImgUrl = shopData.wayShopQualification.idcardHandImgUrl
          this.form.businessLicenseImgUrl = shopData.wayShopQualification.businessLicenseImgUrl
          this.form.shopInsideImgUrl = shopData.wayShopQualification.shopInsideImgUrl
          this.form.shopOutsideImgUrl = shopData.wayShopQualification.shopOutsideImgUrl
          if (shopData.wayShopQualification['other1ImgUrl']) {
            this.otherQualifyImageUrlList.push({ url: shopData.wayShopQualification['other1ImgUrl'], name: 'other1' })
          }
          if (shopData.wayShopQualification['other2ImgUrl']) {
            this.otherQualifyImageUrlList.push({ url: shopData.wayShopQualification['other2ImgUrl'], name: 'other2' })
          }
          if (shopData.wayShopQualification['other3ImgUrl']) {
            this.otherQualifyImageUrlList.push({ url: shopData.wayShopQualification['other3ImgUrl'], name: 'other3' })
          }
          if (shopData.wayShopQualification['other4ImgUrl']) {
            this.otherQualifyImageUrlList.push({ url: shopData.wayShopQualification['other4ImgUrl'], name: 'other4' })
          }
          if (shopData.wayShopQualification['other5ImgUrl']) {
            this.otherQualifyImageUrlList.push({ url: shopData.wayShopQualification['other5ImgUrl'], name: 'other5' })
          }
          this.getCateAll()
        })
      } else {
        this.getCateAll()
      }
    },
    onSave() {
      this.form.updateType = 'save'
      this.onRequest()
    },
    onSubmit() {
      this.form.updateType = 'submit'
      this.onRequest()
    },
    onRequest() {
      console.log(this.shopBt1, this.shopBt2, this.t1, this.t2, this.cateValue)
      this.form.shopBusinessTime1 = this.t1
      this.form.shopBusinessTime2 = this.t2
      this.form.other1ImgUrl = ''
      this.form.other2ImgUrl = ''
      this.form.other3ImgUrl = ''
      this.form.other4ImgUrl = ''
      this.form.other5ImgUrl = ''
      if (this.otherQualifyImageUrlList.length !== 0) {
        if (this.otherQualifyImageUrlList[0]) {
          this.form.other1ImgUrl = this.otherQualifyImageUrlList[0].url
        }
        if (this.otherQualifyImageUrlList[1]) {
          this.form.other2ImgUrl = this.otherQualifyImageUrlList[1].url
        }
        if (this.otherQualifyImageUrlList[2]) {
          this.form.other3ImgUrl = this.otherQualifyImageUrlList[2].url
        }
        if (this.otherQualifyImageUrlList[3]) {
          this.form.other4ImgUrl = this.otherQualifyImageUrlList[3].url
        }
        if (this.otherQualifyImageUrlList[4]) {
          this.form.other5ImgUrl = this.otherQualifyImageUrlList[4].url
        }
      }
      this.saveBtn.loading = true
      if (!this.form.id) {
        this.form.userLoginId = this.$store.getters.userLoginId
        createShop(this.form, this.$store.getters.token).then(response => {
          this.$message('创建成功')
          window.location.href = '/'
          this.saveBtn.loading = false
        }).catch(() => {
          this.saveBtn.loading = false
        })
      } else {
        updateShop(this.form).then(response => {
          this.$message('更新成功')
          // if (!this.$route.query.from) {
          this.$store
            .dispatch('GetUserInfo')
            .then(res => {
              if (this.form.updateType === 'submit') {
                this.$router.push('/')
              }
              this.saveBtn.loading = false
            })
          // }
        }).catch(() => {
          this.saveBtn.loading = false
        })
      }
    },
    onCancel() {
      this.$router.go(-1)
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
      this.form.adCode = currentRow.adCode
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
    },
    handleUploadSuccess(res) {
      this.form.shopLogoUrl = res.url
    },
    handleIdcardFrontUploadSuccess(res) {
      console.log('handleIdcardFrontUploadSuccess', res)
      this.form.idcardFrontImgUrl = res.url
    },
    handleIdcardBackUploadSuccess(res) {
      this.form.idcardBackImgUrl = res.url
    },
    handleIdcardHandUploadSuccess(res) {
      this.form.idcardHandImgUrl = res.url
    },
    handleShopOutsideUploadSuccess(res) {
      this.form.shopOutsideImgUrl = res.url
    },
    handleShopInsideUploadSuccess(res) {
      this.form.shopInsideImgUrl = res.url
    },
    handleBusinessLicenseUploadSuccess(res) {
      this.form.businessLicenseImgUrl = res.url
    },
    handleOtherLicenseUploadSuccess(res) {
      this.otherQualifyImageUrlList.push(res.file)
    },
    handleOtherLicenseUploadRemove(res) {
      this.otherQualifyImageUrlList = res.files
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