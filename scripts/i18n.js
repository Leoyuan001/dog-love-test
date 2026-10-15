/* ============================================================
 * scripts/i18n.js —— 语言选择与数据切换
 *
 * 两种语言的数据文件**同时加载**（合计约 40KB，gzip 后更小），
 * 在这里根据用户选择把 window.TEST_* 覆盖成对应语言的一份。
 * 这样 scoring.js / app.js 完全不用改，读到的就是当前语言。
 *
 * 切换语言 = 写 localStorage + 整页重载。简单可靠，
 * 避免在半途热替换数据导致计分状态不一致。
 *
 * 必须在 scoring.js 与 app.js **之前**加载。
 * ============================================================ */
(function (root) {
  'use strict';

  var KEY = 'dogtest.lang';
  var SUPPORTED = ['zh', 'en'];

  function readSaved() {
    try {
      var v = root.localStorage.getItem(KEY);
      return SUPPORTED.indexOf(v) !== -1 ? v : null;
    } catch (e) { return null; }
  }

  /* 允许用 ?lang=en 强制语言。
   * 这样可以把英文版链接直接发给外国朋友，对方不用先找切换按钮。 */
  function fromQuery() {
    var m = /[?&]lang=(zh|en)(?:&|$)/.exec(root.location.search || '');
    return m ? m[1] : null;
  }

  /* 默认语言优先级：URL 参数 > 上次选择 > 浏览器语言
   * 中文浏览器 → 中文；英文浏览器 → 英文；其他语言一律给中文
   * （本站只有中英两版，而主要读者是中文用户）。 */
  function detect() {
    var q = fromQuery();
    if (q) {
      try { root.localStorage.setItem(KEY, q); } catch (e) { /* 忽略 */ }
      return q;
    }
    var saved = readSaved();
    if (saved) return saved;
    var nav = String((root.navigator && root.navigator.language) || 'zh').toLowerCase();
    if (nav.indexOf('zh') === 0) return 'zh';
    if (nav.indexOf('en') === 0) return 'en';
    return 'zh';
  }

  var lang = detect();

  /* 缺键时回落到中文，保证界面不会出现 undefined */
  function t(key, vars) {
    var table = root.UI || {};
    var v = table[key];
    if (v === undefined) v = (root.TEST_UI_ZH || {})[key];
    if (v === undefined) return '';
    if (typeof v === 'string' && vars) {
      v = v.replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] !== undefined ? vars[k] : m;
      });
    }
    return v;
  }

  function applyData() {
    if (lang !== 'en') { root.UI = root.TEST_UI_ZH; return; }
    if (!root.TEST_EN_META) return;   // 英文包缺失时安全退回中文

    root.TEST_META = root.TEST_EN_META;
    root.TEST_FUNCTIONS = root.TEST_EN_FUNCTIONS || root.TEST_FUNCTIONS;
    root.TEST_AXES = root.TEST_EN_AXES || root.TEST_AXES;
    root.TEST_STACK_ROLES = root.TEST_EN_STACK_ROLES || root.TEST_STACK_ROLES;
    root.TEST_OPTIONS = root.TEST_EN_OPTIONS || root.TEST_OPTIONS;
    root.TEST_STRESS = root.TEST_EN_STRESS || root.TEST_STRESS;
    root.TEST_QUESTIONS = root.TEST_EN_QUESTIONS || root.TEST_QUESTIONS;

    var en = {};
    if (root.TEST_EN_RESULTS_NTNF) Object.keys(root.TEST_EN_RESULTS_NTNF).forEach(function (k) { en[k] = root.TEST_EN_RESULTS_NTNF[k]; });
    if (root.TEST_EN_RESULTS_SJSP) Object.keys(root.TEST_EN_RESULTS_SJSP).forEach(function (k) { en[k] = root.TEST_EN_RESULTS_SJSP[k]; });
    if (Object.keys(en).length) root.TEST_RESULTS = en;

    /* 角色/分段文案做**逐字段合并**而不是整体替换：
     * 英文 compat.js 只带 role/verb/name/line，color 与 min 沿用中文版，
     * 整体替换会把颜色和阈值弄丢。 */
    if (root.TEST_EN_COMPAT_ROLES) {
      Object.keys(root.TEST_EN_COMPAT_ROLES).forEach(function (k) {
        if (!root.TEST_COMPAT_ROLES[k]) root.TEST_COMPAT_ROLES[k] = {};
        Object.keys(root.TEST_EN_COMPAT_ROLES[k]).forEach(function (f) {
          root.TEST_COMPAT_ROLES[k][f] = root.TEST_EN_COMPAT_ROLES[k][f];
        });
      });
    }
    if (root.TEST_EN_COMPAT_BANDS) {
      root.TEST_EN_COMPAT_BANDS.forEach(function (b, i) {
        var target = root.TEST_COMPAT_BANDS[i];
        if (!target) return;
        if (b.name) target.name = b.name;
        if (b.line) target.line = b.line;
        // color 与 min 保持中文版的值（语言无关）
      });
    }

    root.UI = root.TEST_EN_UI;
  }

  function set(next) {
    if (SUPPORTED.indexOf(next) === -1 || next === lang) return;
    try { root.localStorage.setItem(KEY, next); } catch (e) { /* 忽略 */ }
    root.location.reload();
  }

  /* 把 <html lang> 与所有 [data-i18n] 节点填好 */
  function applyToDom() {
    var html = root.document.documentElement;
    html.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');

    var nodes = root.document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (val === '') continue;
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    }

    if (root.TEST_META && root.TEST_META.title) {
      root.document.title = root.TEST_META.title + (lang === 'en'
        ? ' | A Jungian love-personality test'
        : ' | 荣格八维恋爱测试');
    }
  }

  applyData();

  root.I18N = {
    lang: lang,
    t: t,
    set: set,
    toggle: function () { set(lang === 'zh' ? 'en' : 'zh'); },
    applyToDom: applyToDom,
    other: function () { return lang === 'zh' ? 'en' : 'zh'; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
