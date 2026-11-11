<script setup lang="ts">
// トップページ。製品のサイトのように、見出し・画面・特長・図の種類・始め方を縦に並べる。
// 書いてある版は index.md の frontmatter（version）から読む（版を出すたびに index.md だけを直す）。
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import ThemeImage from "./ThemeImage.vue";
import SponsorCard from "./SponsorCard.vue";

const { frontmatter } = useData();
/** このマニュアルが合わせている安定版の版（例：0.1.0-rc.3）。 */
const version = computed(() => String(frontmatter.value.version ?? ""));

const APP = "https://modelith.github.io/modelith/";
const PREVIEW = "https://modelith.github.io/modelith/preview/";
const REPO = "https://github.com/modelith/modelith";

/** 大きな画像と並べて見せる、主な特長。 */
const pillars = [
  {
    kicker: "図だけで描く",
    title: "線を引くだけで、モデルになる",
    text: "パレットで要求や部品を置き、線を引くだけでモデルを作れます。SysML v2 の書き方を知らなくても始められます。",
    link: "/guide/getting-started",
    linkText: "はじめての図",
    image: "/images/tutorial-5-satisfy.jpg",
    alt: "部品を要求につなぐと、テキストに satisfy の行が書き足される画面",
  },
  {
    kicker: "テキストで書く・行き来する",
    title: "書けば描かれ、描けば書かれる",
    text: "書き方を知っていれば、テキストを打つだけで図が描かれます。図で足せばテキストが書き換わり、どの方法で作っても同じモデル・同じファイルになります。モデルはただのテキストなので、Git で差分を追えます。",
    link: "/guide/text-and-diagram",
    linkText: "テキストで書く・行き来する",
    image: "/images/text-1-written.jpg",
    alt: "テキストに書いた要求と部品が、図として描かれた画面",
  },
  {
    kicker: "要求の抜けに気づける",
    title: "抜けを見つけて、その場で直す",
    text: "利用者要求から方式設計・検証までのつながりをたどり、導出・充足・検証の抜けを知らせます。何が足りないかと直し方を示し、図のまま関係を追加できます。",
    link: "/diagrams/traceability",
    linkText: "トレーサビリティ",
    image: "/images/trace-gap-guide.jpg",
    alt: "トレースの抜けがある要求を選び、直し方の案内が出ている画面",
  },
];

/** 図の種類の一覧。 */
const diagrams = [
  { name: "トレーサビリティ", text: "要求から設計・検証までのつながり", link: "/diagrams/traceability", image: "/images/diagram-traceability.jpg" },
  { name: "ブロック定義図", text: "部品の定義と、その間の関係", link: "/diagrams/block-definition", image: "/images/diagram-block-definition.jpg" },
  { name: "内部ブロック図", text: "部品の中のつながりと流れ", link: "/diagrams/internal-block", image: "/images/diagram-internal-block.jpg" },
  { name: "シーケンス図", text: "やり取りの順序", link: "/diagrams/sequence", image: "/images/diagram-sequence.jpg" },
  { name: "アクティビティ図", text: "動作の流れ", link: "/diagrams/activity", image: "/images/diagram-activity.jpg" },
  { name: "状態遷移図", text: "状態と、その移り変わり", link: "/diagrams/state-machine", image: "/images/diagram-state-machine.jpg" },
];

/** 小さく並べる、そのほかの特長（icon は SVG の path）。 */
const extras = [
  {
    title: "モデルは手元から出ない",
    text: "インストールもアカウントも不要です。モデルを外部に送信せず、アクセス解析も使いません。",
    link: "/guide/what-is-modelith",
    icon: "M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z M9 12l2 2 4-4",
  },
  {
    title: "チームの決まりを確かめる",
    text: "チェックルールのプラグインで、チームの決まりに合わない要素を問題一覧に示します。",
    link: "/guide/plugins",
    icon: "M9 5h10 M9 12h10 M9 19h10 M4 5l1 1 2-2 M4 12l1 1 2-2 M4 19l1 1 2-2",
  },
  {
    title: "他のツールに持ち出す",
    text: "表示中の図を、SVG 画像や draw.io のファイルとしてエクスポートできます。",
    link: "/diagrams/editing#エクスポートする",
    icon: "M12 4v11 M7 10l5 5 5-5 M5 20h14",
  },
  {
    title: "オープンソース",
    text: "ソースコードを GitHub で公開しています。不具合のご報告やご要望も GitHub で受け付けています。",
    link: REPO,
    icon: "M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16",
  },
];

/**
 * サイトの中のパスなら base を付け、外のリンクはそのまま返す。
 *
 * @param link リンク先
 * @returns 使える href
 * @example
 * href("/diagrams/") // → "/diagrams/"
 * href("https://github.com/") // → "https://github.com/"
 */
const href = (link: string): string => (link.startsWith("http") ? link : withBase(link));
</script>

<template>
  <div class="home">
    <section class="hero">
      <p class="eyebrow">
        <span class="dot" aria-hidden="true"></span>
        オープンソースの SysML v2 モデリングエディタ<span v-if="version" class="sep">·</span><span v-if="version" class="ver">{{ version }}</span>
      </p>
      <h1>書いても、描いても、<br /><span class="grad">同じモデル</span></h1>
      <p class="lead">図だけでも、テキストだけでも、両方を行き来しても、同じ SysML v2 のモデルを作れます。ブラウザを開くだけで使えます。</p>
      <div class="actions">
        <a class="btn primary" :href="APP" target="_blank" rel="noreferrer">ブラウザで試す</a>
        <a class="btn" :href="href('/guide/getting-started')">はじめる</a>
      </div>
      <p class="note">インストール不要・アカウント不要・無料</p>
    </section>

    <div class="shot window">
      <div class="bar" aria-hidden="true"><i></i><i></i><i></i></div>
      <ThemeImage light="/images/overview.jpg" dark="/images/overview-dark.jpg" alt="Modelith の画面。左にモデルのツリー、中央にロボット掃除機のブロック定義図、右に SysML v2 のテキスト" />
    </div>

    <section class="pillars">
      <div v-for="(p, i) in pillars" :key="p.title" class="pillar" :class="{ flip: i % 2 === 1 }">
        <div class="copy">
          <p class="kicker">{{ p.kicker }}</p>
          <h2>{{ p.title }}</h2>
          <p>{{ p.text }}</p>
          <a class="more" :href="href(p.link)">{{ p.linkText }} <span aria-hidden="true">→</span></a>
        </div>
        <div class="media window">
          <img :src="withBase(p.image)" :alt="p.alt" loading="lazy" />
        </div>
      </div>
    </section>

    <section class="diagrams">
      <div class="head">
        <h2>目的に合わせた図</h2>
        <p>同じモデルを、見たい切り口で表示できます。</p>
      </div>
      <div class="grid">
        <a v-for="d in diagrams" :key="d.name" class="card" :href="href(d.link)">
          <div class="thumb"><img :src="withBase(d.image)" :alt="d.name + 'の画面'" loading="lazy" /></div>
          <div class="body">
            <h3>{{ d.name }}</h3>
            <p>{{ d.text }}</p>
          </div>
        </a>
      </div>
      <p class="all"><a :href="href('/diagrams/')">図の種類と開き方 <span aria-hidden="true">→</span></a></p>
    </section>

    <section class="extras">
      <a v-for="e in extras" :key="e.title" class="extra" :href="href(e.link)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="e.icon" /></svg>
        <h3>{{ e.title }}</h3>
        <p>{{ e.text }}</p>
      </a>
    </section>

    <section class="cta">
      <h2>ブラウザを開くだけで、始められます</h2>
      <p>いまは <strong>0.1.0 の正式版の候補（rc）</strong>です。0.1.0 までは不具合の修正だけを行います。操作方法や保存形式は予告なく変わることがあるので、大切なモデルはこまめに手元のファイルとして保存してください。</p>
      <div class="actions">
        <a class="btn primary" :href="APP" target="_blank" rel="noreferrer">ブラウザで試す</a>
        <a class="btn" :href="PREVIEW" target="_blank" rel="noreferrer">プレビュー版を試す</a>
      </div>
      <p class="small">
        プレビュー版では、開発中の次の版（0.2）の新しい機能を試せます。不具合のご報告やご要望は
        <a href="https://github.com/modelith/modelith/issues/new/choose" target="_blank" rel="noreferrer">GitHub Issues</a> にお寄せください。
      </p>
    </section>

    <section class="sponsor">
      <h2>Modelith を支援する</h2>
      <p>Modelith は、オープンソースで開発しています。開発を続けるための支援を、GitHub Sponsors で受け付けています（<a :href="href('/sponsor')">くわしく</a>）。</p>
      <SponsorCard />
    </section>
  </div>
</template>

<style scoped>
.home {
  --home-w: 1152px;
  padding: 0 24px 96px;
}
.home section,
.home .shot {
  max-width: var(--home-w);
  margin-left: auto;
  margin-right: auto;
}

/* 見出し */
.hero {
  padding: 72px 0 40px;
  text-align: center;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 24px;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.eyebrow .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2ed3b7;
  box-shadow: 0 0 0 4px rgba(46, 211, 183, 0.2);
}
.eyebrow .sep {
  color: var(--vp-c-text-3);
}
.hero h1 {
  margin: 0;
  font-size: clamp(36px, 6vw, 64px);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}
.grad {
  background: linear-gradient(100deg, #1f6f8b, #2ed3b7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.dark .grad {
  background-image: linear-gradient(100deg, #5fe0c9, #2ed3b7 60%, #9be7da);
}
.lead {
  max-width: 640px;
  margin: 24px auto 0;
  font-size: 18px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}
.btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 22px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 15px;
  transition: border-color 0.2s, background-color 0.2s;
}
.btn:hover {
  border-color: var(--vp-c-brand-1);
}
.btn.primary {
  border-color: transparent;
  background: var(--vp-c-brand-3);
  color: #fff;
}
.btn.primary:hover {
  background: var(--vp-c-brand-1);
}
.dark .btn.primary {
  background: var(--vp-c-brand-1);
  color: #0e1a26;
}
.dark .btn.primary:hover {
  background: var(--vp-c-brand-2);
}
.note {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

/* 画面の画像（ウィンドウの枠） */
.window {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 24px 64px -16px rgba(22, 41, 63, 0.35);
}
.window :deep(img),
.window img {
  vertical-align: bottom;
  width: 100%;
  height: auto;
  border: 0;
  border-radius: 0;
}
.shot {
  position: relative;
}
.shot::before {
  content: "";
  position: absolute;
  inset: -10% 10% auto;
  height: 70%;
  background: radial-gradient(closest-side, rgba(46, 211, 183, 0.28), transparent);
  filter: blur(40px);
  z-index: -1;
}
.bar {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.bar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}

/* 主な特長 */
.pillars {
  padding-top: 120px;
  display: grid;
  gap: 112px;
}
.pillar {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 56px;
  align-items: center;
}
.pillar.flip .copy {
  order: 2;
}
.kicker {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--vp-c-brand-1);
}
.home h2 {
  margin: 0;
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.35;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  border: 0;
  padding: 0;
}
.copy p {
  margin: 16px 0 0;
  line-height: 1.9;
  color: var(--vp-c-text-2);
}
.more {
  display: inline-block;
  margin-top: 20px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.more span {
  transition: margin-left 0.2s;
}
.more:hover span {
  margin-left: 4px;
}

/* 図の種類 */
.diagrams {
  padding-top: 144px;
}
.diagrams .head {
  text-align: center;
}
.diagrams .head p {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}
.card {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  color: inherit;
  transition: border-color 0.2s, transform 0.2s;
}
.card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
/* 画面の画像（1360×820）のうち、図の部分（横 255〜915・縦 195〜735）だけを見せる */
.thumb {
  position: relative;
  aspect-ratio: 660 / 540;
  overflow: hidden;
  border-bottom: 1px solid var(--vp-c-divider);
  background: #fff;
}
.thumb img {
  position: absolute;
  left: -38.6%;
  top: -36.1%;
  width: 206%;
  max-width: none;
  height: auto;
  border: 0;
  border-radius: 0;
}
.card .body {
  padding: 14px 16px 16px;
}
.card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.card p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.all {
  margin: 24px 0 0;
  text-align: center;
}
.all a {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

/* そのほかの特長 */
.extras {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding-top: 128px;
}
.extra {
  display: block;
  color: inherit;
}
.extra svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.extra h3 {
  margin: 14px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.extra p {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
.extra:hover h3 {
  color: var(--vp-c-brand-1);
}

/* 始め方 */
.cta {
  margin-top: 128px !important;
  padding: 56px 40px;
  border-radius: 20px;
  text-align: center;
  background:
    radial-gradient(600px 240px at 50% 0%, rgba(46, 211, 183, 0.22), transparent),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.cta > p {
  max-width: 680px;
  margin: 16px auto 0;
  line-height: 1.9;
  color: var(--vp-c-text-2);
}
.cta .small {
  font-size: 13px;
  margin-top: 20px;
  color: var(--vp-c-text-3);
}
.cta a:not(.btn),
.sponsor a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* 支援 */
.sponsor {
  padding-top: 96px;
  max-width: 688px !important;
}
.sponsor h2 {
  font-size: 22px;
}
.sponsor p {
  margin: 12px 0 0;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

@media (max-width: 960px) {
  .pillar {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .pillar.flip .copy {
    order: 0;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .extras {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .home {
    padding: 0 16px 64px;
  }
  .hero {
    padding-top: 48px;
  }
  .eyebrow {
    font-size: 12px;
  }
  .eyebrow .sep,
  .eyebrow .ver {
    display: none;
  }
  .lead {
    font-size: 16px;
  }
  .pillars {
    padding-top: 80px;
    gap: 72px;
  }
  .diagrams,
  .extras {
    padding-top: 96px;
  }
  .grid,
  .extras {
    grid-template-columns: 1fr;
  }
  .cta {
    margin-top: 96px !important;
    padding: 40px 20px;
  }
}
</style>
