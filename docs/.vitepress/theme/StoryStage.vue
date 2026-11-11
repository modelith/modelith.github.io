<script setup lang="ts">
// トップページの、Modelith の画面の模型。自転車のライトのモデルを、白紙から育てていく。
// p はスクロールで進む位置（0〜4。1 進むごとに 1 つの場面）。動きは時間ではなく p で決まるので、
// スクロールを戻せば動きも戻る（VS Code のサイトと同じ作り）。p に整数を渡すと、その場面の終わった姿になる。
//   0→1 図で描く（パレットから要求と部品を置き、「満たす」を引く。テキストに書き足される）
//   1→2 テキストで書く（部品を打つと、図に描かれる）
//   2→3 抜けに気づいて直す（△ と案内、「関係を追加」）
//   3→4 同じモデルを、いくつもの図で（画面が引き、同じモデルの図の窓が 4 枚に広がる）
import { computed } from "vue";

const props = defineProps<{ p: number }>();

/**
 * p が a から b へ進む間を、0 から 1 に直す（範囲の外は 0 か 1）。
 *
 * @param a 始まりの位置
 * @param b 終わりの位置
 * @returns 0〜1
 * @example
 * seg(0.5, 1) // p が 0.75 なら 0.5
 */
const seg = (a: number, b: number): number => Math.min(1, Math.max(0, (props.p - a) / (b - a)));
/**
 * a〜b で現れ、c〜d で消える値（0〜1）。
 *
 * @param a 現れ始める位置
 * @param b 現れ終わる位置
 * @param c 消え始める位置
 * @param d 消え終わる位置
 * @returns 0〜1
 * @example
 * bell(0, 0.1, 0.8, 0.9) // p が 0.5 なら 1
 */
const bell = (a: number, b: number, c: number, d: number): number => seg(a, b) * (1 - seg(c, d));
/**
 * a〜b の間に、文字を 1 つずつ打っていく。
 *
 * @param text 打つ文字列
 * @param a 打ち始める位置
 * @param b 打ち終わる位置
 * @returns いま見えている部分
 * @example
 * typed("abcd", 1, 2) // p が 1.5 なら "ab"
 */
const typed = (text: string, a: number, b: number): string => text.slice(0, Math.round(seg(a, b) * text.length));
/**
 * 道すじ（[p, x, y] の並び）の上の、いまの位置。点と点の間はまっすぐ動く。
 *
 * @param path p の小さい順に並べた点
 * @returns [x, y]
 * @example
 * along([[0, 0, 0], [1, 10, 0]]) // p が 0.5 なら [5, 0]
 */
function along(path: [number, number, number][]): [number, number] {
  const p = props.p;
  const first = path[0]!;
  if (p <= first[0]) return [first[1], first[2]];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]!;
    const b = path[i]!;
    if (p <= b[0]) {
      const t = (p - a[0]) / (b[0] - a[0] || 1);
      const e = t * t * (3 - 2 * t);
      return [a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e];
    }
  }
  const last = path[path.length - 1]!;
  return [last[1], last[2]];
}
/**
 * 下から伸びる線のスタイル。
 *
 * @param v 0〜1（1 で引き終わり）
 * @returns style
 * @example
 * grow(0.5) // → { transform: "scaleY(0.5)", opacity: 1 }
 */
const grow = (v: number) => ({ transform: `scaleY(${v})`, opacity: v > 0 ? 1 : 0 });
/**
 * 浮かび上がる要素のスタイル。
 *
 * @param v 0〜1（1 で出終わり）
 * @returns style
 * @example
 * rise(1) // → { opacity: 1, transform: "translateY(0px)" }
 */
const rise = (v: number) => ({ opacity: v, transform: `translateY(${(1 - v) * 8}px)` });
/**
 * 新しく書き足された行を黄色く光らせるスタイル。
 *
 * @param v 0〜1（光の強さ）
 * @returns style
 * @example
 * flash(0) // → { background: "rgba(255, 214, 0, 0)" }
 */
const flash = (v: number) => ({ background: `rgba(255, 214, 0, ${0.4 * v})` });

const LINE_PART = "part battery : Battery;";
const LINE_DEF = "part def Battery;";

/** パレットのボタンを押してから箱を置き、線を引くまでのポインタの道すじ（図の座標）。 */
const POINTER: [number, number, number][] = [
  [0.05, 70, -17],
  [0.15, 70, -17],
  [0.28, 135, 54],
  [0.32, 135, 54],
  [0.4, 160, -17],
  [0.44, 160, -17],
  [0.52, 135, 195],
  [0.58, 135, 195],
  [0.62, 135, 170],
  [0.85, 135, 92],
];

/** いまの p での、各部分の進み具合。 */
const s = computed(() => {
  const p = props.p;
  const [px, py] = along(POINTER);
  return {
    // 1：図で描く
    pointer: bell(0.03, 0.08, 0.86, 0.93),
    px,
    py,
    pressReq: bell(0.12, 0.13, 0.15, 0.17),
    pressPart: bell(0.41, 0.42, 0.44, 0.46),
    brightBox: seg(0.27, 0.33),
    brightText: p >= 0.3,
    brightFlash: bell(0.3, 0.33, 0.5, 0.62),
    lightBox: seg(0.51, 0.57),
    lightText: p >= 0.54,
    lightFlash: bell(0.54, 0.57, 0.72, 0.84),
    sat: seg(0.62, 0.85),
    satLabel: seg(0.78, 0.88),
    satLine: p >= 0.86,
    satFlash: bell(0.86, 0.9, 1.0, 1.12),
    // 2：テキストで書く
    typePart: typed(LINE_PART, 1.1, 1.4),
    typeDef: typed(LINE_DEF, 1.45, 1.65),
    partLine: p >= 1.08,
    defLine: p >= 1.43,
    caretPart: p >= 1.08 && p < 1.43,
    caretDef: p >= 1.43 && p < 1.72,
    battery: seg(1.72, 1.85),
    comp: seg(1.78, 1.95),
    // 3：抜けに気づいて直す
    longText: p >= 2.05,
    longFlash: bell(2.05, 2.1, 2.25, 2.4),
    longBox: seg(2.1, 2.22),
    warn: bell(2.22, 2.3, 2.78, 2.86),
    ring: p >= 2.22 && p < 2.82,
    guide: bell(2.32, 2.42, 2.78, 2.88),
    press: bell(2.56, 2.6, 2.62, 2.66),
    fix: seg(2.64, 2.8),
    fixLabel: seg(2.74, 2.84),
    fixLine: p >= 2.68,
    fixFlash: bell(2.68, 2.72, 2.9, 3.05),
    // 4：同じモデルを、いくつもの図で
    wall: seg(3.05, 3.4),
    win1: seg(3.3, 3.48),
    win2: seg(3.38, 3.56),
    win3: seg(3.46, 3.64),
    same: bell(3.66, 3.74, 3.92, 4.2),
  };
});

/** 4 の場面で、元の画面を左上に縮める。 */
const mainStyle = computed(() => {
  const w = s.value.wall;
  return { transform: `scale(${1 - 0.505 * w})` };
});
</script>

<template>
  <div class="wall" aria-hidden="true">
    <!-- 元の画面（ツリー・図・テキスト） -->
    <div class="stage" :style="mainStyle">
      <div class="titlebar"><i></i><i></i><i></i><span>bicycle-light.sysml</span></div>
      <div class="panes">
        <!-- モデルのツリー -->
        <div class="tree">
          <p class="pane-h">モデル</p>
          <ul>
            <li class="pkg">▾ BicycleLight</li>
            <li v-if="s.brightBox > 0" :style="rise(s.brightBox)"><b class="k r">R</b>BrightEnough</li>
            <li v-if="s.longText" :style="rise(s.longBox)"><b class="k r">R</b>LongRun<em class="gap" :style="{ opacity: s.warn }">△</em></li>
            <li v-if="s.lightBox > 0" :style="rise(s.lightBox)"><b class="k p">P</b>Light</li>
            <li v-if="s.battery > 0" :style="rise(s.battery)" :class="{ same: s.same > 0.5 }"><b class="k p">P</b>Battery</li>
          </ul>
        </div>

        <!-- 図 -->
        <div class="canvas">
          <div class="tabs"><span class="tab on">すべて</span></div>
          <svg class="diagram" viewBox="20 -34 480 356">
            <defs>
              <marker id="st-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path class="m-open" d="M1 1 L9 5 L1 9" />
              </marker>
              <marker id="st-dia" viewBox="0 0 12 8" refX="1" refY="4" markerWidth="12" markerHeight="8" orient="auto">
                <path class="m-dia" d="M1 4 L6 1 L11 4 L6 7 Z" />
              </marker>
            </defs>
            <!-- パレット -->
            <g class="palette">
              <rect class="pbtn" :class="{ press: s.pressReq > 0 }" x="40" y="-28" width="60" height="20" rx="4" />
              <text x="70" y="-14">要求</text>
              <rect class="pbtn" :class="{ press: s.pressPart > 0 }" x="110" y="-28" width="100" height="20" rx="4" />
              <text x="160" y="-14">部品定義</text>
            </g>
            <!-- 要求 BrightEnough -->
            <g class="box req" :style="rise(s.brightBox)">
              <rect x="40" y="18" width="190" height="72" rx="3" />
              <rect class="bar" x="40" y="18" width="4" height="72" />
              <text class="st" x="135" y="36">«requirement def»</text>
              <text class="nm" x="135" y="54">BrightEnough</text>
              <line class="sep" x1="44" y1="62" x2="230" y2="62" />
              <text class="doc" x="54" y="80">夜道を 10 m 先まで照らす</text>
            </g>
            <!-- 要求 LongRun -->
            <g class="box req" :class="{ ring: s.ring }" :style="rise(s.longBox)">
              <rect x="290" y="18" width="190" height="72" rx="3" />
              <rect class="bar" x="290" y="18" width="4" height="72" />
              <text class="st" x="385" y="36">«requirement def»</text>
              <text class="nm" x="385" y="54">LongRun</text>
              <line class="sep" x1="294" y1="62" x2="480" y2="62" />
              <text class="doc" x="304" y="80">3 時間つづけて点く</text>
              <text class="warn" x="466" y="34" :style="{ opacity: s.warn }">△</text>
            </g>
            <!-- 部品 Light -->
            <g class="box part" :style="rise(s.lightBox)">
              <rect x="40" y="170" width="190" height="50" rx="3" />
              <rect class="bar" x="40" y="170" width="4" height="50" />
              <text class="st" x="135" y="190">«part def»</text>
              <text class="nm" x="135" y="208">Light</text>
            </g>
            <!-- 部品 Battery -->
            <g class="box part" :class="{ same: s.same > 0.5 }" :style="rise(s.battery)">
              <rect x="290" y="258" width="190" height="50" rx="3" />
              <rect class="bar" x="290" y="258" width="4" height="50" />
              <text class="st" x="385" y="278">«part def»</text>
              <text class="nm" x="385" y="296">Battery</text>
            </g>
            <!-- Light が BrightEnough を満たす -->
            <g class="edge sat">
              <path class="grow" d="M135 170 V92" marker-end="url(#st-open)" :style="grow(s.sat)" />
              <text x="141" y="136" :style="{ opacity: s.satLabel }">«satisfy»</text>
            </g>
            <!-- Light が battery を持つ -->
            <g class="edge comp" :style="{ opacity: s.comp }">
              <path d="M230 195 H385 V258" marker-start="url(#st-dia)" />
              <text x="300" y="188">battery</text>
            </g>
            <!-- Battery が LongRun を満たす（「関係を追加」で引く） -->
            <g class="edge sat">
              <path class="grow" d="M385 258 V92" marker-end="url(#st-open)" :style="grow(s.fix)" />
              <text x="391" y="176" :style="{ opacity: s.fixLabel }">«satisfy»</text>
            </g>
            <!-- ポインタ -->
            <g class="pointer" :style="{ opacity: s.pointer, transform: `translate(${s.px}px, ${s.py}px)` }">
              <circle r="6" />
              <path d="M0 0 L0 14 L4 10 L7 16 L9 15 L6 9 L11 9 Z" />
            </g>
          </svg>

          <!-- トレースの抜けの案内 -->
          <div class="guide" :style="rise(s.guide)">
            <p class="g-h"><span>△</span> トレースの抜け <small>1 / 1 件目</small></p>
            <p>この要求を満たす部品がありません</p>
            <span class="g-btn" :style="{ transform: `scale(${1 - 0.08 * s.press})` }">関係を追加</span>
          </div>
        </div>

        <!-- テキスト -->
        <div class="text">
          <p class="pane-h">bicycle-light.sysml</p>
          <pre><code>
<span class="ln">package BicycleLight {</span>
<template v-if="s.brightText"><span class="ln" :style="flash(s.brightFlash)">    <i class="kw">requirement def</i> BrightEnough {</span>
<span class="ln" :style="flash(s.brightFlash)">        <i class="kw">doc</i> <i class="c">/* 夜道を 10 m 先まで照らす */</i></span>
<span class="ln" :style="flash(s.brightFlash)">    }</span></template>
<template v-if="s.longText"><span class="ln" :style="flash(s.longFlash)">    <i class="kw">requirement def</i> LongRun {</span>
<span class="ln" :style="flash(s.longFlash)">        <i class="kw">doc</i> <i class="c">/* 3 時間つづけて点く */</i></span>
<span class="ln" :style="flash(s.longFlash)">    }</span></template>
<template v-if="s.lightText"><span class="ln" :style="flash(s.lightFlash)">    <i class="kw">part def</i> Light {</span>
<span v-if="s.partLine" class="ln">        {{ s.typePart }}<b v-if="s.caretPart" class="caret"></b></span>
<span class="ln" :style="flash(s.lightFlash)">    }</span></template>
<span v-if="s.defLine" class="ln" :class="{ same: s.same > 0.5 }">    {{ s.typeDef }}<b v-if="s.caretDef" class="caret"></b></span>
<span v-if="s.satLine" class="ln" :style="flash(s.satFlash)">    <i class="kw">satisfy</i> BrightEnough <i class="kw">by</i> Light;</span>
<span v-if="s.fixLine" class="ln" :style="flash(s.fixFlash)">    <i class="kw">satisfy</i> LongRun <i class="kw">by</i> Battery;</span>
<span class="ln">}</span></code></pre>
        </div>
      </div>
    </div>

    <!-- 4：同じモデルの、ほかの図の窓 -->
    <div class="win w1" :style="rise(s.win1)">
      <div class="titlebar"><i></i><i></i><i></i><span>ブロック定義図</span></div>
      <svg viewBox="0 0 300 180">
        <g class="box part"><rect x="40" y="24" width="110" height="40" rx="3" /><rect class="bar" x="40" y="24" width="3" height="40" /><text class="nm" x="95" y="49">Light</text></g>
        <g class="box part" :class="{ same: s.same > 0.5 }"><rect x="150" y="116" width="110" height="40" rx="3" /><rect class="bar" x="150" y="116" width="3" height="40" /><text class="nm" x="205" y="141">Battery</text></g>
        <g class="edge comp"><path d="M150 44 H205 V116" marker-start="url(#st-dia)" /><text x="160" y="60">battery</text></g>
      </svg>
    </div>
    <div class="win w2" :style="rise(s.win2)">
      <div class="titlebar"><i></i><i></i><i></i><span>トレーサビリティ</span></div>
      <svg viewBox="0 0 300 180">
        <g class="box req"><rect x="20" y="18" width="120" height="40" rx="3" /><rect class="bar" x="20" y="18" width="3" height="40" /><text class="nm" x="80" y="43">BrightEnough</text></g>
        <g class="box req"><rect x="160" y="18" width="120" height="40" rx="3" /><rect class="bar" x="160" y="18" width="3" height="40" /><text class="nm" x="220" y="43">LongRun</text></g>
        <g class="box part"><rect x="20" y="122" width="120" height="40" rx="3" /><rect class="bar" x="20" y="122" width="3" height="40" /><text class="nm" x="80" y="147">Light</text></g>
        <g class="box part" :class="{ same: s.same > 0.5 }"><rect x="160" y="122" width="120" height="40" rx="3" /><rect class="bar" x="160" y="122" width="3" height="40" /><text class="nm" x="220" y="147">Battery</text></g>
        <g class="edge sat"><path d="M80 122 V60" marker-end="url(#st-open)" /><path d="M220 122 V60" marker-end="url(#st-open)" /></g>
      </svg>
    </div>
    <div class="win w3" :style="rise(s.win3)">
      <div class="titlebar"><i></i><i></i><i></i><span>内部ブロック図</span></div>
      <svg viewBox="0 0 300 180">
        <g class="frame"><rect x="20" y="16" width="260" height="148" rx="4" /><text class="st" x="32" y="34">«part def» Light</text></g>
        <g class="box part" :class="{ same: s.same > 0.5 }"><rect x="85" y="72" width="130" height="40" rx="3" /><rect class="bar" x="85" y="72" width="3" height="40" /><text class="nm" x="150" y="97">battery : Battery</text></g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.wall {
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
  --st-sel: #2f7bf5;
  --st-warn: #b5651d;
  --st-kw: #2f6db5;
  --st-same: rgba(47, 123, 245, 0.18);
  position: relative;
  height: 478px;
  font-size: 12px;
  color: var(--st-fg);
}
.dark .wall {
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
  --st-warn: #e0a15a;
  --st-kw: #7fb0ee;
  --st-same: rgba(95, 160, 255, 0.22);
}

/* 窓（元の画面と、4 の場面で広がる窓） */
.stage,
.win {
  position: absolute;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--st-bg);
  box-shadow: 0 24px 64px -16px rgba(22, 41, 63, 0.35);
}
.stage {
  inset: 0;
  transform-origin: top left;
}
.win {
  width: 49.5%;
  height: 49.5%;
  display: flex;
  flex-direction: column;
}
.win svg {
  flex: 1;
  width: 100%;
  min-height: 0;
  background-color: var(--st-canvas);
  background-image: radial-gradient(var(--st-dot) 1px, transparent 1px);
  background-size: 12px 12px;
}
.w1 {
  left: 50.5%;
  top: 0;
}
.w2 {
  left: 0;
  top: 50.5%;
}
.w3 {
  left: 50.5%;
  top: 50.5%;
}

.titlebar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--st-line);
  color: var(--st-fg2);
  font-size: 11px;
  white-space: nowrap;
}
.titlebar i {
  flex: none;
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
.tree li.same,
.ln.same {
  background: var(--st-same);
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
}
.tab.on {
  color: var(--st-fg);
  border-color: var(--st-fg2);
}
.diagram {
  position: absolute;
  inset: 36px 0 0;
  width: 100%;
  height: calc(100% - 36px);
}
.wall svg text {
  fill: var(--st-fg);
  font-size: 11px;
  text-anchor: middle;
  font-family: inherit;
}
.wall svg .st {
  font-size: 9px;
  fill: var(--st-fg2);
}
.wall svg .nm {
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
.pbtn {
  fill: var(--st-bg);
  stroke: var(--st-line);
}
.pbtn.press {
  fill: var(--st-same);
  stroke: var(--st-sel);
}
.palette text {
  font-size: 10px;
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
.box.ring rect:first-child,
.box.same rect:first-child {
  stroke: var(--st-sel);
  stroke-width: 2.4;
}
.box rect:first-child {
  transition: stroke 0.25s, stroke-width 0.25s;
}
.edge path {
  fill: none;
  stroke: var(--st-edge);
  stroke-width: 1.3;
}
.edge.sat path {
  stroke-dasharray: 5 4;
}
.edge .grow {
  transform-box: fill-box;
  transform-origin: bottom;
}
.edge text {
  font-size: 10px;
  fill: var(--st-fg2);
  text-anchor: start;
}
.m-open {
  fill: none;
  stroke: var(--st-edge);
  stroke-width: 1.4;
}
.m-dia {
  fill: var(--st-edge);
}
.frame rect {
  fill: none;
  stroke: var(--st-part-bar);
  stroke-width: 1.4;
}
.wall svg .frame text {
  text-anchor: start;
}
.pointer circle {
  fill: var(--st-sel);
  fill-opacity: 0.25;
}
.pointer path {
  fill: var(--st-fg);
  stroke: var(--st-bg);
  stroke-width: 1;
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
  color: var(--st-kw);
}
.c {
  color: #7a8796;
}
.caret {
  display: inline-block;
  width: 1px;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--st-fg);
  animation: st-blink 1s steps(1) infinite;
}
@keyframes st-blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .wall {
    height: 358px;
  }
  .panes {
    grid-template-columns: 0 1fr 42%;
    height: 320px;
  }
  .tree {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }
}
</style>
