/* ============================================================
 * scripts/compat.js —— 双人适配度计算
 *
 * 这是一套启发式规则，不是科学结论。设计目标有三个：
 *   1. 每一分加减都能对应一句人话解释（结果页要展示出来）
 *   2. 分布要有梯度，不能人人 85%
 *   3. 经典「最差配对」要真的低（一方主导 = 另一方劣势，正面撞在最弱处）
 * 已知的黄金搭档（INTJ×ENFP、ISTJ×ESTP、ENFJ×INFP…）应当落在高分区。
 * ============================================================ */
(function (root) {
  'use strict';

  function kindOf(fn) { return fn.charAt(0); }        // N / S / T / F

  /* 把 16 型两两打分。返回 raw 与三个可展示的维度分。 */
  function rawScore(a, b) {
    var STACKS = root.TEST_STACKS;
    var W = root.TEST_COMPAT_WEIGHTS;
    var A = STACKS[a];
    var B = STACKS[b];

    var res = { raw: W.base, resonance: 0, complement: 0, tension: 0, shared: 0 };

    /* --- 共鸣：说同一种语言 --- */
    if (a.charAt(1) === b.charAt(1)) { res.raw += W.sameNS; res.resonance += W.sameNS; }   // N/S
    if (a.charAt(2) === b.charAt(2)) { res.raw += W.sameTF; res.resonance += W.sameTF; }   // T/F
    if (a.charAt(3) === b.charAt(3)) { res.raw += W.sameJP; res.resonance += W.sameJP; }   // J/P

    /* --- 互补：互相补位 --- */
    if (a.charAt(0) !== b.charAt(0)) { res.raw += W.oppositeEI; res.complement += W.oppositeEI; }
    // 主导功能同类别、态度相反 —— 经典「黄金搭档」特征（Ni↔Ne、Te↔Ti）
    if (kindOf(A[0]) === kindOf(B[0]) && A[0] !== B[0]) {
      res.raw += W.goldenAux; res.complement += W.goldenAux;
    }
    if (kindOf(A[1]) === kindOf(B[1])) { res.raw += W.sameAuxKind; res.complement += W.sameAuxKind; }
    A.forEach(function (f) { if (B.indexOf(f) !== -1) res.shared++; });
    if (res.shared >= 2) { res.raw += W.shared2; res.complement += W.shared2; }

    /* --- 张力：正面撞在最弱处 --- */
    var fric = 0;
    if (A[0] === B[3]) fric += W.frictionEach;   // 我的主导 = 你的劣势
    if (B[0] === A[3]) fric += W.frictionEach;   // 你的主导 = 我的劣势
    if (fric < W.frictionCap) fric = W.frictionCap;
    if (a === b) fric += W.identical;            // 完全同型：看不到彼此的盲区
    res.raw += fric;
    res.tension = -fric;

    return res;
  }

  /* raw → 展示百分比。
   *
   * 为什么用查表而不是线性公式：加减分是离散的，实测 raw 只有 14 个取值
   * （30/50/60/70/72/82/84/90/92/100/102/110/114/120），线性映射会把大量配对准
   * 压到上下限（原先 64 对挤在 30、40 对挤在 97）。这里逐档标定，让每一档
   * 落在设计好的语义区间里。表外的值用线性插值兜底。 */
  var RAW_TO_PCT = [
    [30, 30], [50, 40], [60, 50], [70, 58], [72, 60], [82, 67], [84, 69],
    [90, 74], [92, 76], [100, 81], [102, 83], [110, 88], [114, 93], [120, 97]
  ];

  function toPercent(raw) {
    var W = root.TEST_COMPAT_WEIGHTS;
    var t = RAW_TO_PCT;
    var pct;
    if (raw <= t[0][0]) pct = t[0][1];
    else if (raw >= t[t.length - 1][0]) pct = t[t.length - 1][1];
    else {
      for (var i = 1; i < t.length; i++) {
        if (raw <= t[i][0]) {
          var lo = t[i - 1], hi = t[i];
          var f = (raw - lo[0]) / (hi[0] - lo[0]);
          pct = Math.round(lo[1] + f * (hi[1] - lo[1]));
          break;
        }
      }
    }
    if (pct < W.floor) pct = W.floor;
    if (pct > W.ceil) pct = W.ceil;
    return pct;
  }

  /* 主导轴差异 → 生成那句「关系名称」的副标题 */
  function buildName(a, b) {
    var R = root.TEST_COMPAT_ROLES;
    return '一个' + R[a].verb + '，一个' + R[b].verb;
  }

  function bandOf(pct) {
    var bands = root.TEST_COMPAT_BANDS;
    for (var i = 0; i < bands.length; i++) {
      if (pct >= bands[i].min) return bands[i];
    }
    return bands[bands.length - 1];
  }

  /* 三个维度归一化到 0–100，供结果页画能量条 */
  function normalizeDims(res) {
    var W = root.TEST_COMPAT_WEIGHTS;
    var resMax = W.sameNS + W.sameTF + W.sameJP;
    var comMax = W.oppositeEI + W.goldenAux + W.sameAuxKind + W.shared2;
    var tenMax = -(W.frictionEach * 2 + W.identical);
    return {
      resonance: Math.round((res.resonance / resMax) * 100),
      complement: Math.round((res.complement / comMax) * 100),
      tension: Math.round((res.tension / tenMax) * 100)
    };
  }

  /* 主入口：给定两个类型代码，返回完整适配度结果 */
  function compute(a, b) {
    var STACKS = root.TEST_STACKS;
    if (!STACKS[a] || !STACKS[b]) return null;
    var res = rawScore(a, b);
    var pct = toPercent(res.raw);
    var band = bandOf(pct);
    var dims = normalizeDims(res);
    var R = root.TEST_COMPAT_ROLES;

    return {
      a: a, b: b,
      score: pct,
      raw: res.raw,
      band: band,
      dims: dims,
      sharedFunctions: res.shared,
      roles: { a: R[a].role, b: R[b].role },
      name: '「' + band.name + '」',
      subtitle: buildName(a, b)
    };
  }

  /* 全套 16×16 矩阵，供测试与后续可能的「最佳搭配」功能使用 */
  function matrix() {
    var codes = Object.keys(root.TEST_STACKS);
    var m = {};
    codes.forEach(function (a) {
      m[a] = {};
      codes.forEach(function (b) { m[a][b] = compute(a, b).score; });
    });
    return m;
  }

  root.DOG_TEST_COMPAT = { compute: compute, matrix: matrix, rawScore: rawScore, toPercent: toPercent };

  if (typeof module !== 'undefined' && module.exports) module.exports = root.DOG_TEST_COMPAT;
})(typeof window !== 'undefined' ? window : globalThis);
