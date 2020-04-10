<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" label-position="top" class="form-container">

      <sticky v-if="enableStick" :z-index="10" :class-name="'sub-navbar '+status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          提交
        </el-button>
        <el-button v-if="isEdit" v-loading="loading" type="warning" @click="draftForm">
          草稿
        </el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-form-item label="主题">
          <el-input v-model="postForm.subject" placeholder="主题名称" :maxlength="100" name="name" required />
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="postForm.commodityId" :remote-method="getRemoteCommodityList" filterable default-first-option remote placeholder="查询商品">
            <el-option v-for="(item,index) in commodityListOptions" :key="item+index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="内容">
          <Tinymce ref="editor" v-model="postForm.postContent" :toolbar="['bold italic underline preview fullscreen']" :height="400" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle, fetchPostToken, createArticle, updateArticle, queryCommodity } from '@/api/article'

const defaultForm = {
  subject: '', // 文章题目
  postContent: '', // 文章内容
  commodityId: undefined, // 商品id
  postId: undefined
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    enableStick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      status: 'draft',
      commodityListOptions: []
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      fetchPostToken().then(response => {
        this.postForm.postToken = response.data.token
      })
    }
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        const data = response.data

        this.postForm.postId = id
        this.postForm.subject = data.subject
        this.postForm.postContent = data.postContent
        this.commodityListOptions.push({ label: data.commodityName, value: data.commodityId })
        this.postForm.commodityId = data.commodityId

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.postId}`
    },
    submitForm() {
      console.log(this.postForm)
      if (this.postForm.postContent.length === 0 || this.postForm.subject.length === 0 || this.postForm.commodityId === undefined) {
        this.$message({
          message: '请填写必要的标题、内容和商品',
          type: 'warning'
        })
        return
      }

      this.loading = true
      if (this.isEdit) {
        this.postForm.enableSubmit = 1
        updateArticle(this.postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '修改并提交文章成功',
            type: 'success',
            duration: 2000
          })
          this.status = 'published'
          this.loading = false
          history.back()
        }).catch(err => {
          this.loading = false
          console.error(err)
        })
      } else {
        createArticle(this.postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '提交文章成功',
            type: 'success',
            duration: 2000
          })
          this.status = 'published'
          this.loading = false
          this.$router.push({ path: '/article/list' })
        }).catch(err => {
          this.loading = false
          console.error(err)
        })
      }
    },
    draftForm() {
      if (this.postForm.postContent.length === 0 || this.postForm.subject.length === 0 || this.postForm.commodityId === undefined) {
        this.$message({
          message: '请填写必要的标题、内容和商品',
          type: 'warning'
        })
        return
      }
      this.postForm.enableSubmit = 0
      updateArticle(this.postForm).then(response => {
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.status = 'draft'
      }).catch(err => {
        console.error(err)
      })
    },
    getRemoteCommodityList(query) {
      const listQuery = {
        shopId: this.$store.getters.shop.id,
        name: query
      }
      queryCommodity(listQuery).then(response => {
        if (!response.data['commodityBoList']) return
        this.commodityListOptions = response.data.commodityBoList.map(v => {
          return { label: v.name, value: v.id }
        })
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 20px 45px 20px 50px;
  }

}

</style>
