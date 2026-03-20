<script setup lang="ts">
import { kebabCase } from 'scule'
import type { ContentNavigationItem, Collections, DocsCollectionItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { locale, isEnabled } = useDocusI18n()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { shouldPushContent: shouldHideToc } = useAssistant()

const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')

const [{ data: page }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () => queryCollection(collectionName.value as keyof Collections).path(route.path).first() as Promise<DocsCollectionItem>),
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
const breadcrumbs = computed(() => findPageBreadcrumbs(navigation?.value, page.value?.path || ''))

useSeo({
  title,
  description,
  type: 'article',
  modifiedAt: (page.value as unknown as Record<string, unknown>).modifiedAt as string | undefined,
  breadcrumbs,
})
watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
})

defineOgImageComponent('Docs', {
  headline: headline.value,
})

// Add the page path to the prerender list
addPrerenderPath(`/raw${route.path}.md`)
</script>

<template>
  <UPage
    v-if="page"
    :key="`page-${shouldHideToc}`"
  >
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        wrapper: 'flex-row items-center flex-wrap justify-between',
      }"
    />

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

    </UPageBody>

    <template #right>
      <DocsAsideRight
        :page="page"
      />
    </template>
  </UPage>
</template>
