<template>
    <div>
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
          <img v-else-if="url" :src="url + '?imageView2/1/w/178/h/178'" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import { getQiniuToken, getImagesKey, getImageFullUrl } from '@/utils/qiniu'

export default {
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    progressStatus() {
      if (this.logoFile.uploadSuccess === true) {
        return 'success'
      } else if (this.logoFile.uploadSuccess === false) {
        return 'exception'
      } else {
        return ''
      }
    },
    url() {
      return this.pictureUrl
    }
  },
  watch: {
    imageUrl(val) {
      console.log('watch', val)
      this.pictureUrl = val
    }
  },
  data() {
    return {
      uploadLogoData: {},
      logoFile: {
        uid: null,
        name: null,
        progress: 0,
        uploadSuccess: null,
        progressShow: false
      },
      pictureUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log('上传shop logo成功返回', res)
      this.logoFile.uploadSuccess = true
      setTimeout(() => {
        this.logoFile.progressShow = false
        this.pictureUrl = getImageFullUrl(res.key)
        this.$emit('success', {
          url: this.pictureUrl
        })
      }, 1000)
    },
    handleUploadOnChange(file) {
      // 文件名自定义问题解决方式
      // https://segmentfault.com/a/1190000012234747
      if (file.status === 'ready') {
        this.uploadLogoData = {
          token: getQiniuToken(),
          key: getImagesKey(this.basePath)
        }
        this.logoFile.progress = 0
        this.logoFile.uploadSuccess = null
        this.logoFile.progressShow = true
        this.$nextTick(() => {
          this.$refs.logoUpload.submit()
        })
      }
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
    beforeAvatarUpload(file) {
      console.log('上传before', file)

      const isJPG = file.type === 'image/jpeg'
      const isLt100K = file.size / 1024 / 1024 < 0.1

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt100K) {
        this.$message.error('上传图片大小不能超过 100k!')
      }
      if (isJPG && isLt100K) {
        return true
      }

      this.logoFile.progress = 0
      this.logoFile.uploadSuccess = null
      this.logoFile.progressShow = false

      return false
    }
  }
}
</script>

<style scoped>
</style>


