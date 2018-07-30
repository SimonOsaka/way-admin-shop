<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商品图片" required>
        <el-upload
          ref="commodityImgUpload"
          action="https://upload.qiniup.com"
          list-type="picture-card"
          :data="uploadLogoData"
          :file-list="imgUrlArray"
          :limit="5"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :on-change="handleUploadOnChange"
          :before-remove="beforeRemove"
          :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品名称" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" required>
        <el-input v-model="form.price" placeholder="最低价格0.1元"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="saveBtn.loading" :disabled="saveBtn.disabled">{{$t('commodity.save')}}</el-button>
        <el-alert :closable="false" v-if="saveBtn.disabled"
          title="商铺上线后，商品信息无法修改。如需修改信息，请先执行商铺下线操作"
          type="error">
        </el-alert>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCommodity, createCommodity, updateCommodity } from '@/api/commodity'
import { getCommodityImagesKey, getQiniuToken, getImageFullUrl } from '@/utils/qiniu'

export default {
  data() {
    return {
      form: {
        id: undefined,
        name: '',
        price: '',
        imgUrlList: [],
        shopId: undefined
      },
      imgUrlArray: [],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadLogoData: {},
      deleteWithConfirm: true,
      saveBtn: {
        disabled: false,
        loading: false
      }
    }
  },
  created() {
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      getCommodity({ id: this.$route.query.id }).then(response => {
        console.log(response)
        this.form = response.data.commodityBo
        this.form.imgUrlList.forEach(imgUrl => {
          this.imgUrlArray.push({ url: imgUrl, name: imgUrl })
        })

        this.form.id = this.$route.query.id
      })

      if (this.$store.getters.shop.isDeleted === 0) {
        this.saveBtn.disabled = true
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.fileList3)
      this.saveBtn.loading = true
      this.form.shopId = this.$store.getters.shop.id
      this.form.imgUrlList = []
      this.imgUrlArray.forEach(element => {
        this.form.imgUrlList.push(element.url)
      })
      if (!this.form.id) {
        createCommodity(this.form).then(response => {
          this.$message('创建成功')
          this.$router.push('/commodity')
          this.saveBtn.loading = false
        }).catch(() => {
          this.saveBtn.loading = false
        })
      } else {
        updateCommodity(this.form).then(response => {
          this.$message('更新成功')
          this.$router.push('/commodity')
          this.saveBtn.loading = false
        }).catch(() => {
          this.saveBtn.loading = false
        })
      }
    },
    onCancel() {
      this.$router.push('/commodity')
    },
    handleRemove(file, fileList) {
      console.log('执行删除', file, fileList)
      this.imgUrlArray = []
      fileList.forEach(element => {
        this.imgUrlArray.push({
          name: element.name,
          url: element.url
        })
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeRemove(file, fileList) {
      console.log('删除之前', file, fileList)
      if (this.deleteWithConfirm === true) {
        return this.$confirm(`确定移除？`)
      }

      this.deleteWithConfirm = true
      return true
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(res, file) {
      this.imgUrlArray.push({
        name: file.name,
        url: getImageFullUrl(res.key)
      })
    },
    handleUploadOnChange(file) {
      console.log(file)
      // 文件名自定义问题解决方式
      // https://segmentfault.com/a/1190000012234747
      if (file.status === 'ready') {
        this.uploadLogoData = {
          token: getQiniuToken(),
          key: getCommodityImagesKey()
        }
        this.$nextTick(() => {
          this.$refs.commodityImgUpload.submit()
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

      this.deleteWithConfirm = isJPG && isLt2M
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

