<script setup lang="ts">
// トップページで、スクロールに合わせて動く Modelith の画面の模型（ツリー・図・テキスト）。
// step で場面を選ぶ：0 はじめ、1 図で「満たす」を引く、2 テキストで部品を書く、3 抜けを知らせて直す、4 内部ブロック図に切り替える。
// 動きは CSS の transition と animation だけで付け、step が変わったときに始まる。視差効果を減らす設定では、終わった状態だけを見せる。
defineProps<{ step: number }>();
</script>

<template>
  <div class="stage" :data-step="step" aria-hidden="true">
    <div class="titlebar"><i></i><i></i><i></i><span>bicycle-light.sysml</span></div>
    <div class="panes">
      <!-- モデルのツリー -->
      <div class="tree">
        <p class="pane-h">モデル</p>
        <ul>
          <li class="pkg">▾ BicycleLight</li>
          <li><b class="k r">R</b>BrightEnough</li>
          <li class="s3"><b class="k r">R</b>LongRun<em class="gap">△</em></li>
          <li><b class="k p">P</b>Light</li>
          <li class="s2"><b class="k p">P</b>Battery</li>
        </ul>
      </div>

      <!-- 図 -->
      <div class="canvas">
        <div class="tabs">
          <span class="tab all">すべて</span>
          <span class="tab ibd">内部ブロック図</span>
        </div>
        <svg class="diagram general" viewBox="20 6 480 316">
          <defs>
            <marker id="st-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path class="m-open" d="M1 1 L9 5 L1 9" />
            </marker>
            <marker id="st-dia" viewBox="0 0 12 8" refX="1" refY="4" markerWidth="12" markerHeight="8" orient="auto">
              <path class="m-dia" d="M1 4 L6 1 L11 4 L6 7 Z" />
            </marker>
          </defs>
          <!-- 要求 BrightEnough -->
          <g class="box req">
            <rect x="40" y="18" width="190" height="72" rx="3" />
            <rect class="bar" x="40" y="18" width="4" height="72" />
            <text class="st" x="135" y="36">«requirement def»</text>
            <text class="nm" x="135" y="54">BrightEnough</text>
            <line class="sep" x1="44" y1="62" x2="230" y2="62" />
            <text class="doc" x="54" y="80">夜道を 10 m 先まで照らす</text>
          </g>
          <!-- 要求 LongRun（3 から） -->
          <g class="box req s3" :class="{ ring: step === 3 }">
            <rect x="290" y="18" width="190" height="72" rx="3" />
            <rect class="bar" x="290" y="18" width="4" height="72" />
            <text class="st" x="385" y="36">«requirement def»</text>
            <text class="nm" x="385" y="54">LongRun</text>
            <line class="sep" x1="294" y1="62" x2="480" y2="62" />
            <text class="doc" x="304" y="80">3 時間つづけて点く</text>
            <text class="warn" x="466" y="34">△</text>
          </g>
          <!-- 部品 Light -->
          <g class="box part">
            <rect x="40" y="170" width="190" height="50" rx="3" />
            <rect class="bar" x="40" y="170" width="4" height="50" />
            <text class="st" x="135" y="190">«part def»</text>
            <text class="nm" x="135" y="208">Light</text>
          </g>
          <!-- 部品 Battery（2 から） -->
          <g class="box part s2">
            <rect x="290" y="258" width="190" height="50" rx="3" />
            <rect class="bar" x="290" y="258" width="4" height="50" />
            <text class="st" x="385" y="278">«part def»</text>
            <text class="nm" x="385" y="296">Battery</text>
          </g>
          <!-- Light が BrightEnough を満たす（1 から） -->
          <g class="edge sat s1">
            <path d="M135 170 V92" marker-end="url(#st-open)" />
            <text x="141" y="136">«satisfy»</text>
          </g>
          <!-- Light が battery を持つ（2 から） -->
          <g class="edge comp s2">
            <path d="M230 195 H385 V258" marker-start="url(#st-dia)" />
            <text x="300" y="188">battery</text>
          </g>
          <!-- Battery が LongRun を満たす（3 の終わりに引く） -->
          <g class="edge sat fix">
            <path d="M385 258 V92" marker-end="url(#st-open)" />
            <text x="391" y="176">«satisfy»</text>
          </g>
        </svg>

        <!-- 内部ブロック図（4） -->
        <svg class="diagram ibd" viewBox="20 6 480 316">
          <g class="frame">
            <rect x="40" y="24" width="440" height="282" rx="4" />
            <text class="st" x="58" y="46">«part def» Light</text>
          </g>
          <g class="box part">
            <rect x="150" y="130" width="220" height="56" rx="3" />
            <rect class="bar" x="150" y="130" width="4" height="56" />
            <text class="nm" x="260" y="163">battery : Battery</text>
          </g>
        </svg>

        <!-- トレースの抜けの案内（3） -->
        <div class="guide">
          <p class="g-h"><span>△</span> トレースの抜け <small>1 / 1 件目</small></p>
          <p>この要求を満たす部品がありません</p>
          <span class="g-btn">関係を追加</span>
        </div>
      </div>

      <!-- テキスト -->
      <div class="text">
        <p class="pane-h">bicycle-light.sysml</p>
        <pre><code><span class="ln">package <i class="t">BicycleLight</i> {</span>
<span class="ln">    <i class="kw">requirement def</i> BrightEnough {</span>
<span class="ln">        <i class="kw">doc</i> <i class="c">/* 夜道を 10 m 先まで照らす */</i></span>
<span class="ln">    }</span>
<span class="ln s3 hl3">    <i class="kw">requirement def</i> LongRun {</span>
<span class="ln s3 hl3">        <i class="kw">doc</i> <i class="c">/* 3 時間つづけて点く */</i></span>
<span class="ln s3 hl3">    }</span>
<span class="ln">    <i class="kw">part def</i> Light {</span>
<span class="ln s2 type" style="--n: 30">        <i class="kw">part</i> battery : Battery;</span>
<span class="ln">    }</span>
<span class="ln s2 type d2" style="--n: 22">    <i class="kw">part def</i> Battery;</span>
<span class="ln s1 hl1">    <i class="kw">satisfy</i> BrightEnough <i class="kw">by</i> Light;</span>
<span class="ln fix hlf">    <i class="kw">satisfy</i> LongRun <i class="kw">by</i> Battery;</span>
<span class="ln">}</span></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage {
  --st-bg: #ffffff;
  --st-pane: #f7f8fa;
  --st-canvas: #f1f3f6;
  --st-dot: #d6dbe3;
  --st-line: #e3e6eb;
  --st-fg: #1d2733;
  --st-fg2: #5b6675;
  --st-req: #fdf0dc;
  --st-req-bar: #b5651d;
  --st-part: #e6eef7;
  --st-part-bar: #2b5b8a;
  --st-edge: #4a5a6e;
  --st-hl: rgba(255, 214, 0, 0.45);
  --st-sel: #2f7bf5;
  --st-warn: #b5651d;
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--st-bg);
  color: var(--st-fg);
  box-shadow: 0 24px 64px -16px rgba(22, 41, 63, 0.35);
  font-size: 12px;
}
.dark .stage {
  --st-bg: #1b2027;
  --st-pane: #20262e;
  --st-canvas: #171b21;
  --st-dot: #2c333d;
  --st-line: #2c333d;
  --st-fg: #dfe5ec;
  --st-fg2: #93a0b0;
  --st-req: #3a2f20;
  --st-req-bar: #d9954a;
  --st-part: #1f2c3b;
  --st-part-bar: #5b8fc4;
  --st-edge: #9fb0c3;
  --st-hl: rgba(255, 214, 0, 0.22);
  --st-warn: #e0a15a;
}

.titlebar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--st-line);
  color: var(--st-fg2);
  font-size: 11px;
}
.titlebar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--st-line);
}
.titlebar span {
  margin-left: 8px;
}
.panes {
  display: grid;
  grid-template-columns: 18% 1fr 34%;
  height: 440px;
}
.pane-h {
  margin: 0;
  padding: 8px 10px;
  border-bottom: 1px solid var(--st-line);
  color: var(--st-fg2);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
}

/* ツリー */
.tree {
  border-right: 1px solid var(--st-line);
  background: var(--st-pane);
  min-width: 0;
}
.tree ul {
  list-style: none;
  margin: 0;
  padding: 6px 0;
}
.tree li {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 18px;
  white-space: nowrap;
  overflow: hidden;
}
.tree li.pkg {
  padding-left: 8px;
}
.k {
  display: inline-grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  font-size: 9px;
  font-style: normal;
  font-weight: 700;
}
.k.r {
  background: var(--st-req);
  color: var(--st-req-bar);
}
.k.p {
  background: var(--st-part);
  color: var(--st-part-bar);
}
.gap {
  font-style: normal;
  color: var(--st-warn);
  margin-left: auto;
}

/* 図 */
.canvas {
  position: relative;
  min-width: 0;
  background-color: var(--st-canvas);
  background-image: radial-gradient(var(--st-dot) 1px, transparent 1px);
  background-size: 14px 14px;
  overflow: hidden;
}
.tabs {
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--st-line);
  background: var(--st-bg);
}
.tab {
  padding: 2px 10px;
  border: 1px solid var(--st-line);
  border-radius: 4px;
  color: var(--st-fg2);
  font-size: 11px;
  transition: opacity 0.4s, color 0.3s, border-color 0.3s;
}
.tab.all {
  color: var(--st-fg);
  border-color: var(--st-fg2);
}
.tab.ibd {
  opacity: 0;
}
.diagram {
  position: absolute;
  inset: 36px 0 0;
  width: 100%;
  height: calc(100% - 36px);
  transition: opacity 0.5s;
}
.diagram.ibd {
  opacity: 0;
}
.diagram text {
  fill: var(--st-fg);
  font-size: 11px;
  text-anchor: middle;
  font-family: inherit;
}
.diagram .st {
  font-size: 9px;
  fill: var(--st-fg2);
}
.diagram .nm {
  font-weight: 700;
  font-size: 12px;
}
.diagram .doc {
  text-anchor: start;
  font-size: 10px;
}
.diagram .warn {
  fill: var(--st-warn);
  font-size: 12px;
}
.box rect {
  stroke-width: 1.2;
}
.req rect:first-child {
  fill: var(--st-req);
  stroke: var(--st-req-bar);
}
.req .bar {
  fill: var(--st-req-bar);
  stroke: none;
}
.part rect:first-child {
  fill: var(--st-part);
  stroke: var(--st-part-bar);
}
.part .bar {
  fill: var(--st-part-bar);
  stroke: none;
}
.sep {
  stroke: var(--st-req-bar);
  stroke-opacity: 0.4;
}
.box.ring rect:first-child {
  stroke: var(--st-sel);
  stroke-width: 2.4;
}
.edge {
  color: var(--st-edge);
}
.m-open {
  fill: none;
  stroke: var(--st-edge);
  stroke-width: 1.4;
}
.m-dia {
  fill: var(--st-edge);
}
.edge path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.3;
}
.edge.sat path {
  stroke-dasharray: 5 4;
}
.edge text {
  font-size: 10px;
  fill: var(--st-fg2);
  text-anchor: start;
}
.frame rect {
  fill: none;
  stroke: var(--st-part-bar);
  stroke-width: 1.4;
}
.frame text {
  text-anchor: start;
}

/* 案内 */
.guide {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  padding: 10px 12px;
  border: 1px solid var(--st-line);
  border-radius: 8px;
  background: var(--st-bg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
}
.guide p {
  margin: 0;
  line-height: 1.6;
}
.g-h {
  color: var(--st-warn);
  font-weight: 700;
}
.g-h small {
  color: var(--st-fg2);
  font-weight: 400;
  margin-left: 6px;
}
.g-btn {
  display: inline-block;
  margin-top: 6px;
  padding: 3px 10px;
  border-radius: 5px;
  background: var(--st-fg);
  color: var(--st-bg);
  font-size: 11px;
}

/* テキスト */
.text {
  border-left: 1px solid var(--st-line);
  min-width: 0;
  overflow: hidden;
}
.text pre {
  margin: 0;
  padding: 8px 0;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 1.75;
  color: var(--st-fg);
  white-space: normal;
  overflow: hidden;
}
.text code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  padding: 0;
  color: inherit;
}
.ln {
  display: block;
  padding: 0 10px;
  white-space: pre;
}
.text i {
  font-style: normal;
}
.kw {
  color: #2f6db5;
}
.dark .kw {
  color: #7fb0ee;
}
.t {
  color: inherit;
}
.c {
  color: #7a8796;
}

/* ---- 場面ごとの出し方 ---- */
.s1,
.s2,
.s3,
.fix {
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s;
}
.ln.s1,
.ln.s2,
.ln.s3,
.ln.fix {
  display: none;
}

/* 1：「満たす」を引く。線が下から伸び、テキストに行が足される */
.stage[data-step="1"] .s1,
.stage[data-step="2"] .s1,
.stage[data-step="3"] .s1,
.stage[data-step="4"] .s1 {
  opacity: 1;
}
.stage[data-step="1"] .ln.s1,
.stage[data-step="2"] .ln.s1,
.stage[data-step="3"] .ln.s1,
.stage[data-step="4"] .ln.s1 {
  display: block;
}
.stage[data-step="1"] .edge.s1 path {
  transform-box: fill-box;
  transform-origin: bottom;
  animation: st-draw 0.8s ease-out both;
}
.stage[data-step="1"] .hl1 {
  animation: st-flash 2.4s ease-out 0.6s both;
}

/* 2：テキストで部品を書く。行が打たれ、図に箱と線が現れる */
.stage[data-step="2"] .s2,
.stage[data-step="3"] .s2,
.stage[data-step="4"] .s2 {
  opacity: 1;
}
.stage[data-step="2"] .ln.s2,
.stage[data-step="3"] .ln.s2,
.stage[data-step="4"] .ln.s2 {
  display: block;
}
.stage[data-step="2"] .type {
  width: calc(var(--n) * 1ch + 20px);
  overflow: hidden;
  animation: st-type 1.1s steps(var(--n)) both;
}
.stage[data-step="2"] .type.d2 {
  animation-delay: 1.2s;
}
.stage[data-step="2"] .box.s2,
.stage[data-step="2"] .edge.s2,
.stage[data-step="2"] li.s2 {
  animation: st-pop 0.5s ease-out 2.4s both;
}

/* 3：抜けを知らせ、「関係を追加」で直す */
.stage[data-step="3"] .s3,
.stage[data-step="4"] .s3 {
  opacity: 1;
}
.stage[data-step="3"] .ln.s3,
.stage[data-step="4"] .ln.s3 {
  display: block;
}
.stage[data-step="3"] .hl3 {
  animation: st-flash 2s ease-out both;
}
.stage[data-step="3"] .guide {
  animation: st-guide 4.4s ease-out 0.6s both;
}
.stage[data-step="3"] .g-btn {
  animation: st-press 0.3s ease-in-out 2.6s both;
}
.stage[data-step="3"] .fix,
.stage[data-step="4"] .fix {
  opacity: 1;
}
.stage[data-step="3"] .ln.fix,
.stage[data-step="4"] .ln.fix {
  display: block;
}
.stage[data-step="3"] .edge.fix {
  animation: st-pop 0.6s ease-out 3s both;
}
.stage[data-step="3"] .ln.fix {
  animation: st-pop 0.4s ease-out 3s both, st-flash 2.4s ease-out 3.2s;
}
.stage[data-step="3"] .warn,
.stage[data-step="3"] .gap {
  animation: st-out 0.4s ease-in 3.4s both;
}
.stage[data-step="4"] .warn,
.stage[data-step="4"] .gap {
  opacity: 0;
}
.stage[data-step="3"] .box.ring rect:first-child {
  animation: st-unring 0.4s ease-in 3.4s both;
}

/* 4：内部ブロック図に切り替える */
.stage[data-step="4"] .tab.ibd {
  opacity: 1;
  color: var(--st-fg);
  border-color: var(--st-fg2);
}
.stage[data-step="4"] .tab.all {
  color: var(--st-fg2);
  border-color: var(--st-line);
}
.stage[data-step="4"] .diagram.general {
  opacity: 0;
  transition-delay: 0.4s;
}
.stage[data-step="4"] .diagram.ibd {
  opacity: 1;
  transition-delay: 0.6s;
}

@keyframes st-draw {
  from {
    transform: scaleY(0);
  }
}
@keyframes st-flash {
  0%,
  40% {
    background: var(--st-hl);
  }
  100% {
    background: transparent;
  }
}
@keyframes st-type {
  from {
    width: 10px;
  }
}
@keyframes st-pop {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes st-guide {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  12%,
  70% {
    opacity: 1;
    transform: none;
  }
  100% {
    opacity: 0;
    transform: translateY(12px);
  }
}
@keyframes st-press {
  50% {
    transform: scale(0.92);
    opacity: 0.8;
  }
}
@keyframes st-out {
  to {
    opacity: 0;
  }
}
@keyframes st-unring {
  to {
    stroke: var(--st-req-bar);
    stroke-width: 1.2;
  }
}

@media (max-width: 640px) {
  .panes {
    grid-template-columns: 0 1fr 42%;
    height: 300px;
  }
  .tree {
    display: none;
  }
}

/* 視差効果を減らす設定では、動かさずに終わった状態を見せる */
@media (prefers-reduced-motion: reduce) {
  .stage *,
  .stage *::before {
    animation-duration: 0.01ms !important;
    animation-delay: 0s !important;
    transition: none !important;
  }
}
</style>
