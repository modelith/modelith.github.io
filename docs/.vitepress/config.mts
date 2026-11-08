import { defineConfig } from "vitepress";
import { sysmlGrammar } from "./sysml-grammar";

const APP = "https://modelith.github.io/modelith/";
const PREVIEW = "https://modelith.github.io/modelith/preview/";
const REPO = "https://github.com/modelith/modelith";
const SPONSORS = "https://github.com/sponsors/modelith";
/** GitHub Sponsors のハートの印（VitePress の標準の印に無いため、SVG で持つ）。 */
const SPONSORS_ICON =
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.625 1.499c-2.32 0-4.354 1.203-5.625 3.03-1.271-1.827-3.305-3.03-5.625-3.03C3.129 1.499 0 4.253 0 8.249c0 4.275 3.068 7.847 5.828 10.227a33.14 33.14 0 0 0 5.616 3.876l.028.017.008.003-.001.003c.163.085.342.126.521.125.179.001.358-.041.521-.125l-.001-.003.008-.003.028-.017a33.14 33.14 0 0 0 5.616-3.876C20.932 16.096 24 12.524 24 8.249c0-3.996-3.129-6.75-6.375-6.75zm-.919 15.275a30.766 30.766 0 0 1-4.703 3.316l-.004-.002-.004.002a30.955 30.955 0 0 1-4.703-3.316c-2.677-2.307-5.047-5.298-5.047-8.523 0-2.754 2.121-4.5 4.125-4.5 2.06 0 3.914 1.479 4.544 3.684.143.495.596.797 1.086.796.49.001.943-.302 1.085-.796.63-2.205 2.484-3.684 4.544-3.684 2.004 0 4.125 1.746 4.125 4.5 0 3.225-2.37 6.216-5.048 8.523z"/></svg>';
/** 安定版（/）のマニュアルが説明している版。 */
const STABLE = "0.1";
/** プレビュー版（/next/）のマニュアルが説明している版。 */
const NEXT = "0.2";

/**
 * 見出しのアンカー（id）を作る。VitePress の既定と同じ規則で作り、最後に NFC に戻す。
 * 既定のままだと、濁点・半濁点を含む見出し（「ブラウザ」など）の id が分解された文字（NFD）のまま残り、
 * Markdown のリンク（NFC）と一致しないため。
 *
 * @param s 見出しの文字列
 * @returns アンカー（例：「3. 図で関係を足す」→「_3-図で関係を足す」）
 */
function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[\u0000-\u001f]/g, "")
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(\d)/, "_$1")
    .toLowerCase()
    .normalize("NFC");
}

// リリースノートは新しい順に並べる
const RELEASES = ["0.2.0-beta.3", "0.2.0-beta.2", "0.2.0-beta.1", "0.2.0-alpha.4", "0.2.0-alpha.3", "0.2.0-alpha.2", "0.1.0-rc.2", "0.1.0-rc.1", "0.1.0-beta.6", "0.1.0-beta.5", "0.1.0-beta.4", "0.1.0-beta.3", "0.1.0-beta.2", "0.1.0-beta.1", "0.1.0-alpha.10", "0.1.0-alpha.9", "0.1.0-alpha.8", "0.1.0-alpha.7", "0.1.0-alpha.6", "0.1.0-alpha.5", "0.1.0-alpha.4", "0.1.0-alpha.2"];

/**
 * 版ごとに持つページ（ガイド・図・SysML v2）のサイドバー。安定版は /、プレビュー版は /next/ の下に同じ並びで置く。
 *
 * @param p 版のパスの前置き（安定版は ""、プレビュー版は "/next"）
 * @returns サイドバーの節
 * @example
 * versionedSidebar("/next")[0].items[0].link // → "/next/guide/what-is-modelith"
 */
function versionedSidebar(p: string) {
  return [
    {
      text: "ガイド",
      items: [
        { text: "Modelith とは", link: `${p}/guide/what-is-modelith` },
        { text: "はじめての図（図だけで作る）", link: `${p}/guide/getting-started` },
        { text: "テキストで書く・行き来する", link: `${p}/guide/text-and-diagram` },
        { text: "画面の見方", link: `${p}/guide/screen` },
        { text: "ファイルとフォルダ", link: `${p}/guide/files` },
        { text: "チェックルールとプラグイン", link: `${p}/guide/plugins` },
        { text: "よくある質問・困ったとき", link: `${p}/guide/faq` },
      ],
    },
    {
      text: "図",
      items: [
        { text: "図の種類と開き方", link: `${p}/diagrams/` },
        { text: "トレーサビリティとフェーズ", link: `${p}/diagrams/traceability` },
        { text: "ブロック定義図", link: `${p}/diagrams/block-definition` },
        { text: "制御ループ", link: `${p}/diagrams/control-loop` },
        { text: "内部ブロック図", link: `${p}/diagrams/internal-block` },
        { text: "振る舞い", link: `${p}/diagrams/behavior` },
        { text: "シーケンス図", link: `${p}/diagrams/sequence` },
        { text: "アクティビティ図", link: `${p}/diagrams/activity` },
        { text: "状態遷移図", link: `${p}/diagrams/state-machine` },
        { text: "すべて", link: `${p}/diagrams/all` },
        { text: "新しい図を作成する", link: `${p}/diagrams/create-diagram` },
        { text: "図の操作とエクスポート", link: `${p}/diagrams/editing` },
      ],
    },
    {
      text: "SysML v2",
      items: [
        { text: "書き方入門", link: `${p}/sysml/basics` },
        { text: "対応している書き方", link: `${p}/sysml/support` },
      ],
    },
  ];
}

/** 版に関係なく 1 つだけ持つページ（リリースノート・ロードマップ・ライセンス）のサイドバーの節。 */
const aboutSidebar = {
  text: "このプロジェクトについて",
  items: [
    { text: "リリースノート", link: "/releases/", collapsed: true, items: RELEASES.map((v) => ({ text: v, link: `/releases/v${v}` })) },
    { text: "ロードマップ", link: "/roadmap" },
    { text: "ライセンスと商標", link: "/license" },
    { text: "支援する", link: "/sponsor" },
  ],
};

export default defineConfig({
  lang: "ja",
  title: "Modelith",
  titleTemplate: ":title | Modelith",
  description: "テキストと図を同期して編集できる、オープンソースの SysML v2 モデリングエディタ Modelith の使い方",
  base: "/",
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    // ```sysml のコードブロックに色を付ける
    languages: [sysmlGrammar as never],
    anchor: { slugify },
  },
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { name: "theme-color", content: "#16293F" }],
  ],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "ガイド", link: "/guide/what-is-modelith", activeMatch: "^/(next/)?guide/" },
      { text: "図", link: "/diagrams/", activeMatch: "^/(next/)?diagrams/" },
      { text: "SysML v2", link: "/sysml/basics", activeMatch: "^/(next/)?sysml/" },
      { text: "リリースノート", link: "/releases/", activeMatch: "^/releases/" },
      { text: "ロードマップ", link: "/roadmap" },
      {
        // マニュアルの版：安定版は /、プレビュー版は /next/（よくあるドキュメントサイトと同じく、パスで切り替える）
        text: "マニュアルの版",
        items: [
          { text: `${STABLE}（安定版）`, link: "/guide/what-is-modelith", activeMatch: "^/(guide|diagrams|sysml)/" },
          { text: `${NEXT}（プレビュー版）`, link: "/next/guide/what-is-modelith", activeMatch: "^/next/" },
        ],
      },
      {
        text: "ブラウザで試す",
        items: [
          { text: "安定版", link: APP },
          { text: "プレビュー版（開発中の新しい機能）", link: PREVIEW },
        ],
      },
      { text: "支援する", link: "/sponsor", activeMatch: "^/sponsor" },
    ],
    sidebar: {
      "/next/": [...versionedSidebar("/next"), aboutSidebar],
      "/": [...versionedSidebar(""), aboutSidebar],
    },
    socialLinks: [
      { icon: "github", link: REPO, ariaLabel: "Modelith の GitHub リポジトリ" },
      { icon: { svg: SPONSORS_ICON }, link: SPONSORS, ariaLabel: "Modelith を GitHub Sponsors で支援する" },
    ],
    editLink: {
      pattern: "https://github.com/modelith/modelith.github.io/edit/main/docs/:path",
      text: "このページの修正を提案する",
    },
    footer: {
      message: `このサイトの文章は <a href="https://github.com/modelith/modelith.github.io/blob/main/LICENSE">MIT ライセンス</a>です。Modelith 本体は <a href="${REPO}#license">AGPL-3.0（プラグイン例外付き）</a>です。`,
      copyright: "Copyright © 2026 The Modelith Authors",
    },
    search: {
      provider: "local",
      options: {
        // プレビュー版のページは、検索の結果で安定版のページと見分けられるように、見出しに「（プレビュー版）」を付ける
        _render(src, env, md) {
          const html = md.render(src, env);
          return env.relativePath.startsWith("next/") ? html.replace(/(<h1[^>]*>)/, "$1（プレビュー版）") : html;
        },
        translations: {
          button: { buttonText: "検索", buttonAriaLabel: "検索" },
          modal: {
            displayDetails: "詳しく表示",
            resetButtonTitle: "検索語を消す",
            backButtonTitle: "検索を閉じる",
            noResultsText: "見つかりませんでした",
            footer: { selectText: "選ぶ", selectKeyAriaLabel: "Enter", navigateText: "移動", navigateUpKeyAriaLabel: "上矢印", navigateDownKeyAriaLabel: "下矢印", closeText: "閉じる", closeKeyAriaLabel: "Esc" },
          },
        },
      },
    },
    outline: { level: [2, 3], label: "このページの内容" },
    docFooter: { prev: "前のページ", next: "次のページ" },
    lastUpdated: { text: "最終更新" },
    darkModeSwitchLabel: "配色",
    lightModeSwitchTitle: "明るい配色にする",
    darkModeSwitchTitle: "暗い配色にする",
    sidebarMenuLabel: "メニュー",
    returnToTopLabel: "ページの先頭へ",
    langMenuLabel: "言語",
    externalLinkIcon: true,
    notFound: {
      title: "ページが見つかりません",
      quote: "URL が変わったか、ページが削除された可能性があります。",
      linkLabel: "ホームへ戻る",
      linkText: "ホームへ戻る",
    },
  },
});
