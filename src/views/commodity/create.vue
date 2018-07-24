<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商品图片" required>
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :file-list="form.imgUrlList"
          :limit="5"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :before-remove="beforeRemove">
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
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">{{$t('commodity.save')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCommodity, createCommodity, updateCommodity } from '@/api/commodity'

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
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      getCommodity({ id: this.$route.query.id }).then(response => {
        console.log(response)
        this.form = response.data
      })
    }
  },
  methods: {
    onSubmit() {
      console.log(this.fileList3)
      this.form.shopId = this.$store.getters.shop.id
      if (!this.form.id) {
        createCommodity(this.form).then(response => {
          this.$router.push('/commodity')
          this.$message('创建成功')
        })
      } else {
        updateCommodity(this.form).then(response => {
          this.$router.push('/commodity')
          this.$message('更新成功')
        })
      }
    },
    onCancel() {
      this.$router.push('/commodity')
    },
    handleRemove(file, fileList) {
      const i = fileList.indexOf(file)
      console.log(file.i, file, fileList)
      this.form.imgUrlList.splice(i, 1)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除？`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(res, file) {
      const uploadImgUrl = URL.createObjectURL(file.raw)
      this.form.imgUrlList.push({
        i: this.form.imgUrlList.length + 1,
        url: uploadImgUrl
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

