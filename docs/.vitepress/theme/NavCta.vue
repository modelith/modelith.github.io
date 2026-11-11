<script setup lang="ts">
// ナビゲーションの右の「ブラウザで試す」ボタン。プレビュー版（/next/）のページではプレビュー版のアプリを開く。
import { computed } from "vue";
import { useRoute } from "vitepress";

defineProps<{ screenMenu?: boolean }>();

const route = useRoute();
/** プレビュー版のページか。 */
const isNext = computed(() => route.path.startsWith("/next/"));
/** 開くアプリの URL。 */
const href = computed(() => (isNext.value ? "https://modelith.github.io/modelith/preview/" : "https://modelith.github.io/modelith/"));
/** ボタンの文字。 */
const label = computed(() => (isNext.value ? "プレビュー版を試す" : "ブラウザで試す"));
</script>

<template>
  <a class="nav-cta" :class="{ screen: screenMenu }" :href="href" target="_blank" rel="noreferrer">{{ label }}</a>
</template>

<style scoped>
.nav-cta {
  display: inline-flex;
  align-self: center;
  align-items: center;
  margin-left: 12px;
  padding: 0 14px;
  height: 32px;
  border-radius: 8px;
  background: var(--vp-c-brand-3);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.2s;
}
.nav-cta:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.dark .nav-cta {
  background: var(--vp-c-brand-1);
  color: #0e1a26;
}
.dark .nav-cta:hover {
  background: var(--vp-c-brand-2);
}
.nav-cta.screen {
  margin: 16px 0 0;
  height: 40px;
  width: 100%;
  justify-content: center;
  font-size: 15px;
}
</style>
