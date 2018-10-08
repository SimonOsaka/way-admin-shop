<template>
    <div>
      <el-upload
          ref="commodityImgUpload"
          action="https://upload.qiniup.com"
          list-type="picture-card"
          :data="uploadLogoData"
          :file-list="imageUrls"
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
    </div>
</template>

<script>
import { getImagesKey, getQiniuToken, getImageFullUrl } from '@/utils/qiniu'

export default {
  props: {
    imageUrls: {
      type: Array
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadLogoData: {},
      deleteWithConfirm: true,
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created() {
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      console.log('执行删除', file, fileList)
      const imageUrlArray = []
      fileList.forEach(element => {
        imageUrlArray.push({
          name: element.name,
          url: element.url
        })
      })
      this.$emit('onRemove', { files: imageUrlArray })
    },
    handleSuccess(res, file) {
      const imgFile = {
        name: file.name,
        url: getImageFullUrl(res.key)
      }

      console.log('handleSuccess', imgFile)
      this.$emit('onSuccess', { file: imgFile })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleUploadOnChange(file) {
      console.log(file)
      // 文件名自定义问题解决方式
      // https://segmentfault.com/a/1190000012234747
      if (file.status === 'ready') {
        this.uploadLogoData = {
          token: getQiniuToken(),
          key: getImagesKey(this.basePath)
        }
        this.$nextTick(() => {
          this.$refs.commodityImgUpload.submit()
        })
      }
    },
    beforeRemove(file, fileList) {
      console.log('删除之前', file, fileList)
      if (this.deleteWithConfirm === true) {
        return this.$confirm(`确定移除？`)
      }

      this.deleteWithConfirm = true
      return true
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
</style>


