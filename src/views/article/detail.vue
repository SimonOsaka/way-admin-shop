<template>
  <article-detail :is-edit="true" :enableStick="false" />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'DetailArticle',
  components: { ArticleDetail }
}
</script>

