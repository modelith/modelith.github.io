<!-- GitHub Sponsors のスポンサーカード（GitHub が用意する埋め込み）。幅の狭い画面でははみ出さないよう、幅を親に合わせる。 -->

<template>
  <div class="sponsor-card">
    <iframe
      src="https://github.com/sponsors/modelith/card"
      title="Modelith を GitHub Sponsors で支援する"
      height="225"
      width="600"
      loading="lazy"
    ></iframe>
  </div>
</template>

<style scoped>
.sponsor-card {
  margin: 24px 0;
}

.sponsor-card iframe {
  display: block;
  max-width: 100%;
  border: 0;
}
</style>
