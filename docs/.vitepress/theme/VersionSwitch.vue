<script setup lang="ts">
// サイドバーの一番上に置く、マニュアルの版（安定版・プレビュー版）の切り替え。版ごとに持つページ（ガイド・図・SysML v2）でだけ出す。
// 押すと、もう一方の版の同じページへ移る。
import { computed } from "vue";
import { useData, useRoute, withBase } from "vitepress";

const route = useRoute();
const { theme } = useData();
/** マニュアルの版（config.mts の STABLE・NEXT）。 */
const versions = computed(() => (theme.value.manualVersions ?? { stable: "", next: "" }) as { stable: string; next: string });
/** プレビュー版のページか。 */
const isNext = computed(() => route.path.startsWith("/next/"));
/** 安定版のパス（/next/ を外したもの）。 */
const stablePath = computed(() => route.path.replace(/^\/next\//, "/"));
/** 版ごとに持つページか（ガイド・図・SysML v2）。 */
const versioned = computed(() => /^\/(guide|diagrams|sysml)\//.test(stablePath.value));
</script>

<template>
  <div v-if="versioned" class="version-switch" role="group" aria-label="マニュアルの版">
    <a :href="withBase(stablePath)" :class="{ on: !isNext }" :aria-current="!isNext ? 'page' : undefined">
      <span class="name">安定版</span><span class="ver">{{ versions.stable }}</span>
    </a>
    <a :href="withBase('/next' + stablePath)" :class="{ on: isNext }" :aria-current="isNext ? 'page' : undefined">
      <span class="name">プレビュー版</span><span class="ver">{{ versions.next }}</span>
    </a>
  </div>
</template>

<style scoped>
.version-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin: 16px 0 8px;
  padding: 4px;
  border-radius: 10px;
  background: var(--vp-c-default-soft);
}
.version-switch a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  white-space: nowrap;
  padding: 6px 4px;
  border-radius: 7px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s, background-color 0.2s;
}
.version-switch a:hover {
  color: var(--vp-c-text-1);
}
.version-switch a.on {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
.version-switch .ver {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.version-switch a.on .ver {
  color: var(--vp-c-brand-1);
}
</style>
