<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="24">
        <img :src="imgUrl + '?imageView2/0/w/178/h178'" v-for="imgUrl in form.imgUrlList" class="image">
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <span>商品名称：</span><span>{{form.name}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <span>商品价格：</span><span>{{form.price}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-button @click="onCancel">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCommodity } from '@/api/commodity'

export default {
  data() {
    return {
      form: {
        id: undefined,
        name: '',
        price: '',
        imgUrlList: [],
        shopId: undefined
      }
    }
  },
  created() {
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      getCommodity({ id: this.$route.query.id }).then(response => {
        console.log(response)
        this.form = response.data.commodityBo
      })
    }
  },
  methods: {
    onCancel() {
      this.$router.push('/commodity')
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.image {
  padding: 5px;
  margin-right: 10px;
  border: 1px dotted lightskyblue;
}
</style>

