<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商品图片" required>
        <upload-multiple :basePath="baseImagePath" :imageUrls="imgUrlArray" @onRemove="handleOnRemove" @onSuccess="handleOnSuccess"></upload-multiple>
      </el-form-item>
      <el-form-item label="商品名称" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="商品价格" required>
        <el-input v-model="form.price" placeholder="最低价格0.1元"></el-input>
      </el-form-item>
      -->
      <el-form-item label="抽象词" required>
        <el-checkbox-group v-model="form.abstractWordIdList" :min="1" :max="5">
          <el-checkbox :label="w.id" v-for="(w, i) in wordRadioList" :key="'word'+ i" border>{{w.name}}</el-checkbox>
        </el-checkbox-group>
        <el-alert :closable="false" title="提示：抽象词最多选5个。每个抽象词只能对应一个商品。" type="info" show-icon/>
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
import { getCommodity, createCommodity, updateCommodity, queryCommodityAbstractWord } from '@/api/commodity'
import uploadMultiple from '@/components/UploadImage/uploadMultiple'

export default {
  components: { uploadMultiple },
  data() {
    return {
      form: {
        id: undefined,
        name: '',
        // price: '',
        imgUrlList: [],
        shopId: undefined,
        abstractWordIdList: []
      },
      baseImagePath: 'commodity/images/',
      imgUrlArray: [],
      saveBtn: {
        disabled: false,
        loading: false
      },
      wordRadioList: []
    }
  },
  created() {
    console.log(this.$route.query.id)
    queryCommodityAbstractWord({ shopCateLeafId: this.$store.getters.shop.shopCateLeafId, leaf: 1 }).then(response => {
      const abstractWord = response.data.commodityAbstractWordBo
      const wordList = abstractWord.commodityAbstractWordBoList
      wordList.forEach(item => {
        this.wordRadioList.push({
          id: item.id,
          name: item.abstractWordPathName
        })
      })
    })
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

