<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商品图片" required>
        <upload-multiple :basePath="baseImagePath" :imageUrls="imgUrlArray" @onRemove="handleOnRemove" @onSuccess="handleOnSuccess"></upload-multiple>
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
          title="商家上线后，商品信息无法修改。如需修改信息，请先执行商家下线操作"
          type="error">
        </el-alert>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCommodity, createCommodity, updateCommodity } from '@/api/commodity'
import uploadMultiple from '@/components/UploadImage/uploadMultiple'

export default {
  components: { uploadMultiple },
  data() {
    return {
      form: {
        id: undefined,
        name: '',
        price: '',
        imgUrlList: [],
        shopId: undefined
      },
      baseImagePath: 'commodity/images/',
      imgUrlArray: [],
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
    handleOnRemove(res) {
      console.log('删除成功', res.files)
      this.imgUrlArray = res.files
    },
    handleOnSuccess(res) {
      console.log('上传成功', res.file)
      this.imgUrlArray.push(res.file)
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

