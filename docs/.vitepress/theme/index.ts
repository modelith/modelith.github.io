import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { h } from "vue";
import HomePage from "./HomePage.vue";
import NavCta from "./NavCta.vue";
import SponsorCard from "./SponsorCard.vue";
import ThemeImage from "./ThemeImage.vue";
import VersionBanner from "./VersionBanner.vue";
import VersionSwitch from "./VersionSwitch.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  // プレビュー版（/next/）のページの本文の上に、版を示す帯を出す。サイドバーの一番上に、マニュアルの版の切り替えを出す
  Layout: () => h(DefaultTheme.Layout, null, { "doc-before": () => h(VersionBanner), "sidebar-nav-before": () => h(VersionSwitch) }),
  enhanceApp({ app }) {
    app.component("ThemeImage", ThemeImage);
    app.component("SponsorCard", SponsorCard);
    app.component("HomePage", HomePage);
    app.component("NavCta", NavCta);
  },
} satisfies Theme;
