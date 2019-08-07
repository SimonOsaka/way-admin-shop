<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <img :src="imgUrl + '?imageView2/0/w/178/h178'" v-for="imgUrl in form.imgUrlList" class="image">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">商品名称：</el-col>
      <el-col :span="4">{{form.name}}</el-col>
    </el-row>
    <!--
    <el-row >
      <el-col :span="2">商品价格：</el-col>
      <el-col :span="4">{{form.price}}</el-col>
    </el-row>
    -->
    <el-row>
      <el-col :span="2">关联词：</el-col>
      <el-col :span="4">{{form.abstractWordNames}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
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
        // price: '',
        abstractWordNames: '',
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

