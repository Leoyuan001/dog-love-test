/* ============================================================
 * scripts/scoring.js —— 八维计分 / 四轴折叠 / 功能栈校验
 * 纯函数，无 DOM 依赖，可在 Node 下单独测试
 * ============================================================ */
(function (root) {
  'use strict';

  var META = root.TEST_META;
  var FUNCS = root.TEST_FUNCTIONS;
  var AXES = root.TEST_AXES;
  var STACKS = root.TEST_STACKS;
  var QUESTIONS = root.TEST_QUESTIONS;
  var CFG = root.TEST_SCORING;

  var FN_ORDER = FUNCS.map(function (f) { return f.id; });

  /* 阴影功能：把功能栈的每个功能翻转态度（Ni→Ne、Te→Ti…） */
  function flipAttitude(fn) {
    var last = fn.charAt(fn.length - 1);
    return fn.slice(0, -1) + (last === 'e' ? 'i' : 'e');
  }

  /* 功能栈契合度权重：主导 > 辅助 > 第三 > 劣势
   * 注意：这里用「加权得分」而不是「排名距离」。
   * 因为实测中阴影功能常常并列同分，用排名就必须强行拆成 5/6/7/8，
   * 那是在编造不存在的信息，而且会让结果系统性偏向内倾型。 */
  var FIT_WEIGHTS = [3, 2, 1, 0.8];
  var SHADOW_PENALTY = 1.0;

  /* ---------- 1. 八个功能得分 ---------- */
  function scoreFunctions(answers) {
    var raw = {};
    FN_ORDER.forEach(function (fn) { raw[fn] = 0; });

    QUESTIONS.forEach(function (q) {
      if (q.part !== 1) return;
      var v = answers[q.id];
      if (typeof v !== 'number') return;
      // 反向题：同意 = 该功能弱，计分翻转
      var scored = q.reverse ? (CFG.pointsMax + CFG.pointsMin - v) : v;
      raw[q.function] += scored;
    });

    // 每功能 4 题，原始分区间 4–20 → 归一化到 0–100
    var perFunctionMax = 4 * CFG.pointsMax;   // 20
    var perFunctionMin = 4 * CFG.pointsMin;   // 4
    var span = perFunctionMax - perFunctionMin;

    var scores = {};
    FN_ORDER.forEach(function (fn) {
      scores[fn] = Math.round(((raw[fn] - perFunctionMin) / span) * CFG.normalizeTo);
    });
    return { raw: raw, scores: scores };
  }

  /* ---------- 2. 四轴折叠 ---------- */
  function foldAxes(scores) {
    return AXES.map(function (axis) {
      var posFns = axis.formula[axis.positive];
      var negFns = axis.formula[axis.negative];
      var pos = avg(posFns.map(function (f) { return scores[f]; }));
      var neg = avg(negFns.map(function (f) { return scores[f]; }));
      // 位置 0–100，50 为中线
      var position = round1(50 + (pos - neg) / 2);
      var band = CFG.flowBand;
      return {
        id: axis.id,
        name: axis.name,
        positive: axis.positive,
        negative: axis.negative,
        positiveLabel: axis.positiveLabel,
        negativeLabel: axis.negativeLabel,
        positiveScore: round1(pos),
        negativeScore: round1(neg),
        position: position,
        letter: position >= 50 ? axis.positive : axis.negative,
        flowing: position >= band[0] && position <= band[1]
      };
    });
  }

  /* ---------- 3. 功能排名（并列时按 FN_ORDER 稳定排序） ---------- */
  function rankFunctions(scores) {
    var sorted = FN_ORDER.slice().sort(function (a, b) {
      if (scores[b] !== scores[a]) return scores[b] - scores[a];
      return FN_ORDER.indexOf(a) - FN_ORDER.indexOf(b);
    });
    var ranks = {};
    sorted.forEach(function (fn, i) { ranks[fn] = i + 1; });
    return { order: sorted, ranks: ranks };
  }

  /* ---------- 4. 与 16 型标准功能栈做契合度比对 ----------
   * fit = Σ 权重[i] × 该型第 i 位功能的实测分 − 阴影功能平均分
   * 主导功能权重最高，因为它最具区分度；阴影功能得分高则扣分 */
  function bestFitType(scores) {
    var ranking = Object.keys(STACKS).map(function (code) {
      var stack = STACKS[code];
      var stackScore = 0;
      stack.forEach(function (fn, i) { stackScore += FIT_WEIGHTS[i] * scores[fn]; });
      var shadow = stack.map(flipAttitude);
      var shadowAvg = avg(shadow.map(function (fn) { return scores[fn]; }));
      return {
        code: code,
        fit: round1(stackScore - SHADOW_PENALTY * shadowAvg)
      };
    });
    ranking.sort(function (a, b) {
      if (b.fit !== a.fit) return b.fit - a.fit;
      return Object.keys(STACKS).indexOf(a.code) - Object.keys(STACKS).indexOf(b.code);
    });
    return {
      code: ranking[0].code,
      fit: ranking[0].fit,
      margin: round1(ranking[0].fit - ranking[1].fit),
      runnerUp: ranking[1].code,
      ranking: ranking
    };
  }

  /* ---------- 5. 压力反应（Part 2，不计入八维得分） ---------- */
  function stressProfile(answers) {
    var hits = [];
    QUESTIONS.forEach(function (q) {
      if (q.part !== 2) return;
      var v = answers[q.id];
      if (typeof v !== 'number') return;
      var pole = null;
      if (v >= 4) pole = q.functionPair[0];
      else if (v <= 2) pole = q.functionPair[1];
      if (pole) hits.push({ questionId: q.id, pole: pole, intensity: Math.abs(v - 3) });
    });
    if (!hits.length) return null;
    hits.sort(function (a, b) { return b.intensity - a.intensity; });
    var top = hits[0];
    return {
      pole: top.pole,
      questionId: top.questionId,
      label: root.TEST_STRESS[top.pole].label,
      text: root.TEST_STRESS[top.pole].text,
      all: hits
    };
  }

  /* ---------- 6. 主入口 ---------- */
  function compute(answers) {
    var fnResult = scoreFunctions(answers);
    var scores = fnResult.scores;

    var axes = foldAxes(scores);
    var candidateCode = axes.map(function (a) { return a.letter; }).join('');

    var rankInfo = rankFunctions(scores);
    var fit = bestFitType(scores);

    var finalCode = candidateCode;
    var stackCheckNote = null;
    if (CFG.stackCheck && fit.code !== candidateCode) {
      finalCode = fit.code;
      stackCheckNote = '你的八维序列更接近 ' + fit.code + ' 型的排布，因此结果以功能栈契合度为准。';
    }

    var flowAxes = axes.filter(function (a) { return a.flowing; });

    var dominantFn = rankInfo.order[0];
    var dominantConfirmed = scores[dominantFn] >= CFG.dominantThreshold;

    var stack = STACKS[finalCode];
    var stackDetail = stack.map(function (fn, i) {
      var f = FUNCS.filter(function (x) { return x.id === fn; })[0];
      return {
        id: fn,
        role: root.TEST_STACK_ROLES[i],
        name: f.name,
        plain: f.plain,
        love: f.love,
        score: scores[fn]
      };
    });

    return {
      type: finalCode,
      typeByAxes: candidateCode,
      stackCheckNote: stackCheckNote,
      functionScores: scores,
      functionRankOrder: rankInfo.order,
      axes: axes,
      flowAxes: flowAxes,
      dominantFunction: dominantFn,
      dominantConfirmed: dominantConfirmed,
      stack: stackDetail,
      fitScore: fit.fit,
      fitMargin: fit.margin,
      fitRunnerUp: fit.runnerUp,
      stress: stressProfile(answers),
      result: root.TEST_RESULTS[finalCode]
    };
  }

  /* ---------- 工具 ---------- */
  function avg(arr) {
    if (!arr.length) return 0;
    var s = 0;
    for (var i = 0; i < arr.length; i++) s += arr[i];
    return s / arr.length;
  }
  function round1(n) { return Math.round(n * 10) / 10; }

  root.DOG_TEST_SCORING = {
    compute: compute,
    scoreFunctions: scoreFunctions,
    foldAxes: foldAxes,
    rankFunctions: rankFunctions,
    bestFitType: bestFitType,
    stressProfile: stressProfile
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.DOG_TEST_SCORING;
  }
})(typeof window !== 'undefined' ? window : globalThis);
