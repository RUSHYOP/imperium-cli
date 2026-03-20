<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('docs').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: navigation } = await useAsyncData('docs-navigation', () =>
  queryCollectionNavigation('docs')
)

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('docs', route.path)
)

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})

defineOgImageComponent('NuxtSeo')
</script>

<template>
  <UPage v-if="page">
    <template #left>
      <UPageAside>
        <UContentNavigation :navigation="navigation" />
      </UPageAside>
    </template>

    <UPageHeader :title="page.title" :description="page.description" />

    <UPageBody prose>
      <ContentRenderer :value="page" />

      <USeparator v-if="surround?.length" class="mt-12" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template #right>
      <UContentToc :links="page.body?.toc?.links || []" />
    </template>
  </UPage>
</template>
