/* ============================================================
 * scripts/store.js —— 本机记忆（localStorage）
 *
 * 只存在访客自己的浏览器里，不上传任何服务器。
 * 三项设计约束：
 *   1. 隐私模式 / 禁用存储时必须静默降级，不能让页面崩掉
 *   2. 数据要有版本号，问卷或计分算法一改，旧存档必须自动失效
 *      （否则用户会拿着旧答案看到新算法算出来的结果，那是错的）
 *   3. index 只在「未完成」时有意义
 * ============================================================ */
(function (root) {
  'use strict';

  var KEY = 'dogtest.save.v1';
  var SCHEMA = 1;    // 存档结构版本
  var ALG = 1;       // 问卷与计分算法版本：改题、改计分规则时必须 +1

  var available = (function () {
    try {
      var k = '__dogtest_probe__';
      root.localStorage.setItem(k, '1');
      root.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;   // Safari 无痕模式、禁用 Cookie 等
    }
  })();

  function load() {
    if (!available) return null;
    try {
      var raw = root.localStorage.getItem(KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || d.schema !== SCHEMA || d.alg !== ALG) {
        // 版本对不上：直接丢弃，避免用旧答案算出新结果
        root.localStorage.removeItem(KEY);
        return null;
      }
      if (!d.answers || typeof d.answers !== 'object') return null;
      return d;
    } catch (e) {
      return null;
    }
  }

  function save(patch) {
    if (!available) return false;
    try {
      var cur = load() || { schema: SCHEMA, alg: ALG, answers: {}, index: 0, finished: false };
      Object.keys(patch).forEach(function (k) { cur[k] = patch[k]; });
      cur.schema = SCHEMA;
      cur.alg = ALG;
      cur.savedAt = Date.now();
      root.localStorage.setItem(KEY, JSON.stringify(cur));
      return true;
    } catch (e) {
      return false;   // 配额满等情况，静默失败
    }
  }

  function clear() {
    if (!available) return;
    try { root.localStorage.removeItem(KEY); } catch (e) { /* 忽略 */ }
  }

  /* 存档的作答数量 */
  function answeredCount(d) {
    if (!d || !d.answers) return 0;
    return Object.keys(d.answers).length;
  }

  root.DOG_TEST_STORE = {
    available: available,
    schema: SCHEMA,
    alg: ALG,
    load: load,
    save: save,
    clear: clear,
    answeredCount: answeredCount
  };
})(typeof window !== 'undefined' ? window : globalThis);
