/* ============================================================
 * scripts/app.js —— 交互层
 *   状态机 landing → quiz → result
 *   本机记忆、个人结果链接、分享、好友适配度、说明弹窗、语言切换
 * 依赖（按加载顺序）：data/* → i18n.js → store.js → scoring.js → compat.js
 * ============================================================ */
(function () {
  'use strict';

  var T = window.I18N.t;
  var STORE = window.DOG_TEST_STORE;
  var S = window.DOG_TEST_SCORING;
  var COMPAT = window.DOG_TEST_COMPAT;

  var META = window.TEST_META;
  var QUESTIONS = window.TEST_QUESTIONS;
  var RESULTS = window.TEST_RESULTS;
  var FUNCS = window.TEST_FUNCTIONS;
  var OPTIONS = window.TEST_OPTIONS;

  var CODES = Object.keys(RESULTS);
  var TOTAL = QUESTIONS.length;

  /* ---------------- 小工具 ---------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function dogImg(code, thumb) {
    return 'assets/dogs/' + (thumb ? 'thumb/' : '') + code + '.webp';
  }
  function isWeChat() { return /MicroMessenger/i.test(navigator.userAgent || ''); }

  function copyText(text) {
    return new Promise(function (resolve) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(resolve, function () { resolve(fallbackCopy(text)); });
      } else {
        resolve(fallbackCopy(text));
      }
    });
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (e) { return false; }
  }

  /* ---------------- 轻提示 ---------------- */
  var toastTimer = null;
  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-show'); }, 2800);
  }

  /* ---------------- 通用弹窗 ---------------- */
  var lastFocus = null;
  function openModal(opt) {
    lastFocus = document.activeElement;
    $('modalTitle').textContent = opt.title || '';
    $('modalBody').innerHTML = opt.body || '';
    var foot = $('modalFoot');
    foot.innerHTML = '';
    (opt.buttons || []).forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn' + (b.ghost ? ' btn--ghost' : '');
      btn.textContent = b.label;
      btn.addEventListener('click', function () {
        if (b.onClick) b.onClick();
        if (!b.keepOpen) closeModal();
      });
      foot.appendChild(btn);
    });
    foot.style.display = foot.children.length ? '' : 'none';
    $('modal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
    $('modalClose').focus();
  }
  function closeModal() {
    $('modal').classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('modalClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', function (e) {
    if (e.target.getAttribute && e.target.getAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('modal').classList.contains('is-open')) closeModal();
  });

  /* ---------------- 个人结果链接 ----------------
   * 把 36 题的作答压成 36 个 1–5 的字符塞进 hash。
   * 这样换设备、清缓存、换浏览器都能还原完整结果（不只是类型）。 */
  function encodeAnswers(answers) {
    var s = '';
    for (var i = 0; i < QUESTIONS.length; i++) {
      var v = answers[QUESTIONS[i].id];
      s += (typeof v === 'number' && v >= 1 && v <= 5) ? String(v) : '3';
    }
    return s;
  }
  function decodeAnswers(code) {
    if (!/^[1-5]{36}$/.test(code || '')) return null;
    var out = {};
    for (var i = 0; i < QUESTIONS.length; i++) out[QUESTIONS[i].id] = Number(code.charAt(i));
    return out;
  }
  function personalLink(answers) {
    return location.origin + location.pathname + location.search +
      '#/r/' + encodeAnswers(answers);
  }

  /* ---------------- 视图切换 ---------------- */
  var VIEWS = { landing: $('view-landing'), quiz: $('view-quiz'), result: $('view-result') };
  function show(name) {
    Object.keys(VIEWS).forEach(function (k) {
      VIEWS[k].classList.toggle('is-active', k === name);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ---------------- 状态 ---------------- */
  var state = { answers: {}, index: 0, deck: [], locked: false, result: null };

  function persist(finished) {
    STORE.save({
      answers: state.answers,
      index: state.index,
      finished: !!finished
    });
  }

  /* ============================================================
   * 场景花瓣
   * ============================================================ */
  (function buildPetals() {
    var host = document.querySelector('.scene__petals');
    if (!host) return;
    var n = window.matchMedia('(max-width: 768px)').matches ? 6 : 12;
    var html = '';
    for (var i = 0; i < n; i++) {
      html += '<img class="scene__petal" src="assets/scene/petal.svg" alt="" ' +
        'style="left:' + Math.round(Math.random() * 100) + '%;' +
        '--size:' + (14 + Math.round(Math.random() * 16)) + 'px;' +
        '--fall:' + (13 + Math.random() * 12).toFixed(1) + 's;' +
        '--delay:' + (-Math.random() * 20).toFixed(1) + 's;' +
        '--drift:' + Math.round((Math.random() - .5) * 160) + 'px">';
    }
    host.innerHTML = html;
  })();

  /* ============================================================
   * 主页面：16 只狗环绕中央按钮
   * hover 只显示犬种名，绝不显示人格类型名，避免诱导自我归类
   * ============================================================ */
  var arcNarrow = null;

  function buildArc() {
    var host = $('dogArc');
    if (!host) return;
    var narrow = window.matchMedia('(max-width: 640px)').matches;
    arcNarrow = narrow;
    var INNER_N = 6, OUTER_N = 10;
    var rInner = 26, rOuter = narrow ? 37 : 41;
    var html = '';
    var all = CODES.slice();

    for (var i = 0; i < OUTER_N; i++) {
      var a = (i * 360 / OUTER_N - 90) * Math.PI / 180;
      html += arcDog(all[i], 50 + rOuter * Math.cos(a), 50 + rOuter * Math.sin(a), a, i);
    }
    for (var j = 0; j < INNER_N; j++) {
      var b = (j * 360 / INNER_N - 60) * Math.PI / 180;
      html += arcDog(all[OUTER_N + j], 50 + rInner * Math.cos(b), 50 + rInner * Math.sin(b), b, OUTER_N + j);
    }
    host.innerHTML = html;

    function arcDog(code, x, y, ang, idx) {
      var r = RESULTS[code];
      var z = 10 + Math.round(10 * Math.sin(ang));
      return '<button class="arc-dog" type="button" tabindex="0" ' +
        'style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;z-index:' + z +
        ';--dog-delay:' + (idx * 0.11).toFixed(2) + 's" aria-label="' + esc(r.dog) + '">' +
        '<img src="' + dogImg(code, true) + '" alt="" width="90" height="90">' +
        '<span class="arc-dog__bubble">' + esc(r.dog) + '</span></button>';
    }
  }

  /* 断点切换时才重建，避免缩放窗口反复重启动画 */
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.matchMedia('(max-width: 640px)').matches !== arcNarrow) buildArc();
    }, 220);
  });

  /* ============================================================
   * 主页面的「欢迎回来」/「继续上次」卡片
   * ============================================================ */
  function fmtDate(ts) {
    try {
      return new Date(ts).toLocaleDateString(
        window.I18N.lang === 'en' ? 'en-US' : 'zh-CN',
        { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return ''; }
  }

  function renderWelcome() {
    var slot = $('welcomeSlot');
    var saved = STORE.load();
    slot.innerHTML = '';
    if (!saved) return;

    var n = STORE.answeredCount(saved);
    var finished = saved.finished && n === TOTAL;

    if (!finished && n === 0) return;

    var res = finished ? S.compute(saved.answers) : null;
    var r = res ? res.result : null;

    var html = '<div class="welcome">';
    html += '<img class="welcome__dog" src="' +
      dogImg(finished ? res.type : 'ISFJ', true) + '" alt="" width="78" height="78">';
    html += '<div class="welcome__main">';

    if (finished) {
      html += '<p class="welcome__label">' + esc(T('welcomeBack')) + ' · ' + esc(T('yourResultWas')) + '</p>';
      html += '<p class="welcome__name">' + esc(r.dog) + ' <b>' + res.type + '</b></p>';
      html += '<p class="welcome__date">' + esc(T('testedOn', { date: fmtDate(saved.savedAt) })) + '</p>';
      html += '<div class="welcome__actions">' +
        '<button class="btn" type="button" id="wView">' + esc(T('viewResult')) + '</button>' +
        '<button class="btn btn--ghost" type="button" id="wRetake">' + esc(T('retake')) + '</button>' +
        '</div>';
    } else {
      html += '<p class="welcome__label">' + esc(T('resumeTitle')) + '</p>';
      html += '<p class="welcome__name">' + esc(T('resumeAt', { n: n, total: TOTAL })) + '</p>';
      html += '<p class="welcome__date">' + esc(T('resumeHint')) + '</p>';
      html += '<div class="welcome__actions">' +
        '<button class="btn" type="button" id="wContinue">' + esc(T('continueQuiz')) + '</button>' +
        '<button class="btn btn--ghost" type="button" id="wRestart">' + esc(T('restart')) + '</button>' +
        '</div>';
    }
    html += '<button class="welcome__clear" type="button" id="wClear">' + esc(T('clearRecord')) + '</button>';
    html += '</div></div>';
    slot.innerHTML = html;

    if (finished) {
      $('wView').addEventListener('click', function () { renderResult(res); show('result'); });
      $('wRetake').addEventListener('click', function () { clearAndStart(); });
    } else {
      $('wContinue').addEventListener('click', function () { resumeQuiz(saved); });
      $('wRestart').addEventListener('click', function () { clearAndStart(); });
    }
    $('wClear').addEventListener('click', confirmClear);
  }

  function confirmClear() {
    openModal({
      title: T('clearRecord'),
      body: '<p>' + esc(T('clearConfirm')) + '</p>',
      buttons: [
        { label: T('cancel'), ghost: true },
        {
          label: T('confirmClear'),
          onClick: function () { STORE.clear(); state.answers = {}; state.index = 0; renderWelcome(); }
        }
      ]
    });
  }

  function clearAndStart() {
    STORE.clear();
    state.answers = {};
    state.index = 0;
    renderWelcome();
    startQuiz(false);
  }

  /* ============================================================
   * 答题
   * ============================================================ */
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function startQuiz(resume) {
    state.result = null;
    state.locked = false;
    state.deck = state.deck.length ? state.deck : shuffled(CODES);

    if (!resume) {
      state.answers = {};
      state.index = 0;
    }
    show('quiz');
    renderQuestion(true);
  }

  function resumeQuiz(saved) {
    state.answers = saved.answers || {};
    var n = STORE.answeredCount(saved);
    // 定位到第一道还没作答的题
    var idx = 0;
    for (var i = 0; i < QUESTIONS.length; i++) {
      if (state.answers[QUESTIONS[i].id] === undefined) { idx = i; break; }
      idx = i + 1;
    }
    state.index = Math.min(idx, TOTAL - 1);
    startQuiz(true);
  }

  function renderQuestion(isFirst) {
    var q = QUESTIONS[state.index];
    var card = $('quizCard');
    var stage = $('quizStage');

    var paint = function () {
      $('qScene').textContent = q.scene;
      $('qText').textContent = q.text;

      var picked = state.answers[q.id];
      $('options').innerHTML = OPTIONS.map(function (o) {
        return '<button class="opt' + (picked === o.value ? ' is-picked' : '') + '" type="button" ' +
          'data-value="' + o.value + '" aria-pressed="' + (picked === o.value) + '">' +
          esc(o.label) + '</button>';
      }).join('');

      var slots = document.querySelectorAll('.peek');
      for (var k = 0; k < slots.length; k++) {
        slots[k].querySelector('img').src = dogImg(state.deck[(state.index * 4 + k) % 16], true);
        slots[k].style.setProperty('--peek-delay', (k * 0.35).toFixed(2) + 's');
      }

      var pct = ((state.index + 1) / TOTAL) * 100;
      $('pawsFill').style.width = pct + '%';
      $('pawsPaw').style.left = pct + '%';
      $('quizCount').textContent = T('questionOf', { n: state.index + 1, total: TOTAL });
      $('btnBack').disabled = state.index === 0;

      document.body.classList.toggle('mood-tense',
        q.scene === '冲突与冷战' || q.scene === 'Conflict and silence' ||
        q.scene === '异地与忙碌期' || q.scene === 'Long distance and busy schedules');

      card.classList.remove('is-out', 'is-in');
      void card.offsetWidth;
      card.classList.add('is-in');
      stage.classList.remove('is-switching');
      void stage.offsetWidth;
      stage.classList.add('is-switching');
    };

    if (isFirst) paint();
    else { card.classList.add('is-out'); setTimeout(paint, 200); }
  }

  function pick(value) {
    if (state.locked) return;
    var q = QUESTIONS[state.index];
    state.answers[q.id] = value;

    var opts = $('options').querySelectorAll('.opt');
    for (var i = 0; i < opts.length; i++) {
      var on = Number(opts[i].dataset.value) === value;
      opts[i].classList.toggle('is-picked', on);
      opts[i].setAttribute('aria-pressed', String(on));
    }

    state.locked = true;
    setTimeout(function () {
      state.locked = false;
      if (state.index < TOTAL - 1) {
        state.index++;
        persist(false);          // 每题都存一次，中途退出不丢进度
        renderQuestion(false);
      } else {
        persist(true);
        finish();
      }
    }, 300);
  }

  function goBack() {
    if (state.index === 0 || state.locked) return;
    state.index--;
    renderQuestion(false);
  }

  function finish() {
    document.body.classList.remove('mood-tense');
    state.result = S.compute(state.answers);
    persist(true);
    // hash 用个人结果链接，刷新后仍是本人这份完整结果
    location.hash = '#/r/' + encodeAnswers(state.answers);
    renderResult(state.result);
    show('result');
  }

  /* ============================================================
   * 结果页
   * ============================================================ */
  function renderResult(res) {
    var r = res.result;
    var root = $('resultRoot');
    var h = [];

    h.push('<div class="hero">');
    h.push('<img class="hero__dog" src="assets/dogs/' + res.type + '@2x.webp" alt="' +
      esc(r.dogAlt) + '" width="250" height="250">');
    h.push('<div class="hero__badge">' + res.type + ' · ' + esc(r.dogCategory) + '</div>');
    h.push('<h2 class="hero__name">' + esc(r.dog) + '</h2>');
    h.push('<p class="hero__tagline">' + esc(r.tagline) + '</p>');
    h.push('</div>');

    /* 存下来提示条 */
    h.push('<div class="savebar">');
    h.push('<span class="savebar__icon">🔖</span>');
    h.push('<p class="savebar__text"><b>' + esc(T('myLinkTitle')) + '</b><br>' + esc(T('myLinkHint')) + '</p>');
    h.push('<button class="btn" type="button" id="btnSaveLink">' + esc(T('myLink')) + '</button>');
    h.push('</div>');

    /* 操作栏 */
    h.push('<div class="action-bar">');
    h.push('<button class="btn" type="button" id="btnShare">' + esc(T('shareWeChat')) + '</button>');
    h.push('<button class="btn" type="button" id="btnCompat">' + esc(T('compatTitle')) + '</button>');
    h.push('<button class="btn btn--ghost" type="button" id="btnRetake2">' + esc(T('retake')) + '</button>');
    h.push('</div>');

    h.push('<div class="card-sec"><h3 class="card-sec__title">' + esc(T('dogIntroTitle')) + '</h3>' +
      '<p class="prose">' + esc(r.dogToLove) + '</p></div>');

    h.push('<div class="card-sec"><h3 class="card-sec__title">' + esc(T('stackTitle')) + '</h3><div class="stack">');
    res.stack.forEach(function (f, i) {
      h.push('<div class="stack__row' + (i === 0 ? ' stack__row--dom' : '') + '">' +
        '<span class="stack__role">' + esc(f.role) + '</span>' +
        '<span class="stack__fn">' + f.id + ' <span>' + esc(f.name) + ' · ' + esc(f.plain) + '</span></span>' +
        '<p class="stack__love">' + esc(f.love) + '</p></div>');
    });
    h.push('</div></div>');

    h.push('<div class="card-sec"><h3 class="card-sec__title">' + esc(T('barsTitle')) + '</h3><div class="bars">');
    res.functionRankOrder.forEach(function (fn, i) {
      var f = FUNCS.filter(function (x) { return x.id === fn; })[0];
      h.push('<div class="bar' + (i === 0 ? ' bar--dom' : '') + '" title="' + esc(f.love) + '">' +
        '<span class="bar__id">' + fn + '</span>' +
        '<span class="bar__track"><span class="bar__fill" style="--w:' + res.functionScores[fn] + '%"></span></span>' +
        '<span class="bar__val">' + res.functionScores[fn] + '</span></div>');
    });
    h.push('</div>');
    if (res.dominantConfirmed) {
      var df = FUNCS.filter(function (x) { return x.id === res.dominantFunction; })[0];
      h.push('<p class="prose" style="margin-top:12px">' +
        esc(T('dominantIs', { fn: res.dominantFunction, name: df.name, score: res.functionScores[res.dominantFunction] })) +
        '</p>');
    }
    h.push('</div>');

    h.push(listCard(T('traitsTitle'), r.traits, false));
    h.push(listCard(T('giftsTitle'), r.gifts, false));
    h.push(listCard(T('pitfallsTitle'), r.pitfalls, true));

    h.push('<div class="card-sec"><h3 class="card-sec__title">' + esc(T('stressTitle')) + '</h3>');
    if (res.stress) {
      h.push('<span class="stress__label">' + esc(res.stress.label) + '</span>');
      h.push('<p class="prose">' + esc(res.stress.text) + '</p>');
      h.push('<p class="prose" style="margin-top:10px">' + esc(r.inferiorText) + '</p>');
    } else {
      h.push('<p class="prose">' + esc(r.inferiorText) + '</p>');
    }
    h.push('</div>');

    h.push('<div class="card-sec"><h3 class="card-sec__title">' + esc(T('compatSectionTitle')) + '</h3><div class="match">');
    h.push(matchLine(T('compatGood'), r.compatibility.good));
    h.push(matchLine(T('compatTiring'), r.compatibility.tiring, true));
    h.push('<p class="prose" style="margin-top:4px">' + esc(T('compatNote')) + '</p>');
    h.push('</div></div>');

    h.push('<div class="card-sec"><div class="tip"><span class="tip__icon">🌱</span><div>' +
      '<h3 class="card-sec__title" style="margin-bottom:6px">' + esc(T('growthTitle')) + '</h3>' +
      '<p class="prose">' + esc(r.growthTip) + '</p></div></div></div>');

    h.push('<div class="share">');
    h.push('<img class="share__dog" src="assets/dogs/' + res.type + '.webp" alt="" width="130" height="130">');
    h.push('<p class="share__text">' + esc(r.shareText) + '</p>');
    h.push('<p class="share__foot">' + esc(T('shareFoot', { dog: r.dog, code: res.type })) + '</p>');
    h.push('</div>');

    h.push('<div class="lineup"><p class="lineup__title">' + esc(T('lineupTitle')) + '</p><div class="lineup__row">');
    var ordered = CODES.filter(function (c) { return c !== res.type; });
    ordered.splice(Math.floor(ordered.length / 2), 0, res.type);
    ordered.forEach(function (c) {
      var me = c === res.type;
      h.push('<img class="lineup__dog' + (me ? ' lineup__dog--me' : '') + '" src="' + dogImg(c, true) +
        '" alt="' + esc(RESULTS[c].dog) + '" title="' + esc(RESULTS[c].dog) + '" width="62" height="62">');
    });
    h.push('</div></div>');

    h.push('<div class="notes">');
    if (res.stackCheckNote) h.push('<p>' + esc(res.stackCheckNote) + '</p>');
    if (res.flowAxes && res.flowAxes.length) {
      h.push('<p>' + esc(T('flowNote', {
        axes: res.flowAxes.map(function (a) { return a.name + '（' + a.position.toFixed(0) + '）'; }).join('、')
      })) + '</p>');
    }
    h.push('<p>' + esc(META.disclaimer) + '</p>');
    h.push('<p><button class="linkbtn" type="button" id="btnAbout2">' + esc(T('aboutTitle')) + '</button> ' +
      '<button class="linkbtn" type="button" id="btnHelp2">' + esc(T('helpTitle')) + '</button></p>');
    h.push('</div>');

    h.push('<div class="result__foot">' +
      '<button class="btn btn--ghost" type="button" id="btnRestart">' + esc(T('restart')) + '</button>' +
      '<button class="btn btn--ghost" type="button" id="btnCopyText">' + esc(T('copyShare')) + '</button>' +
      '</div>');

    root.innerHTML = h.join('');

    function listCard(title, items, pitfall) {
      return '<div class="card-sec"><h3 class="card-sec__title">' + esc(title) + '</h3>' +
        '<ul class="list' + (pitfall ? ' list--pitfall' : '') + '">' +
        items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }
    function matchLine(label, codes) {
      var chips = codes.map(function (c) {
        return '<span class="chip"><img src="' + dogImg(c, true) + '" alt="" width="26" height="26">' +
          esc(RESULTS[c].dog) + ' · ' + c + '</span>';
      }).join('');
      return '<div class="match__line"><span class="match__k">' + esc(label) + '</span>' + chips + '</div>';
    }

    /* --- 事件 --- */
    $('btnSaveLink').addEventListener('click', function () {
      copyText(personalLink(state.answers)).then(function () { toast(T('linkCopied')); });
    });
    $('btnShare').addEventListener('click', function () { shareResult(res, r); });
    $('btnCompat').addEventListener('click', function () { openCompat(res.type); });
    $('btnRetake2').addEventListener('click', clearAndStart);
    $('btnRestart').addEventListener('click', function () {
      location.hash = '';
      renderWelcome();
      show('landing');
    });
    $('btnCopyText').addEventListener('click', function () {
      copyText(T('shareTextTpl', { dog: r.dog, code: res.type, line: r.shareText }) + ' ' + personalLink(state.answers))
        .then(function () { toast(T('copied')); });
    });
    $('btnAbout2').addEventListener('click', showAbout);
    $('btnHelp2').addEventListener('click', showHelp);
  }

  /* ============================================================
   * 分享
   * ============================================================ */
  function shareResult(res, r) {
    var url = personalLink(state.answers);
    var text = T('shareTextTpl', { dog: r.dog, code: res.type, line: r.shareText });

    if (isWeChat()) {
      openModal({
        title: T('wechatGuideTitle'),
        body: '<p>' + esc(T('wechatGuideBody')) + '</p>'
      });
      return;
    }
    if (navigator.share) {
      navigator.share({ title: META.title, text: text, url: url })
        .catch(function () { /* 用户取消，忽略 */ });
      return;
    }
    copyText(text + ' ' + url).then(function () { toast(T('shareCopiedHint')); });
  }

  /* ============================================================
   * 好友适配度
   * ============================================================ */
  function openCompat(myType) {
    var grid = '<div class="pick-grid">' + CODES.map(function (c) {
      return '<button type="button" data-code="' + c + '">' +
        '<img src="' + dogImg(c, true) + '" alt="" width="52" height="52">' +
        '<span>' + esc(RESULTS[c].dog) + '</span></button>';
    }).join('') + '</div>';

    openModal({
      title: T('compatTitle'),
      body: '<p>' + esc(T('compatPick')) + '</p><p style="margin-top:6px;font-size:12.5px">' +
        esc(T('compatPickHint')) + '</p>' + grid
    });

    $('modalBody').addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-code]') : null;
      if (!btn) return;
      showCompatResult(myType, btn.getAttribute('data-code'));
    });
  }

  function showCompatResult(a, b) {
    var r = COMPAT.compute(a, b);
    if (!r) return;
    var ra = RESULTS[a], rb = RESULTS[b];

    var body = '<div class="compat-head">';
    body += '<p class="compat-score">' + r.score + '<small>%</small></p>';
    body += '<span class="compat-band" style="background:' + r.band.color + '">' + esc(r.band.name) + '</span>';
    body += '<p class="compat-sub">' + esc(ra.dog) + ' ' + a + ' &nbsp;×&nbsp; ' + esc(rb.dog) + ' ' + b + '</p>';
    body += '<p class="compat-line">' + esc(r.subtitle) + '</p>';
    body += '<p class="compat-line" style="color:var(--cocoa-70)">' + esc(r.band.line) + '</p>';
    body += '</div>';

    body += '<div class="compat-dims">' +
      dim(T('compatDimResonance'), r.dims.resonance, 'res') +
      dim(T('compatDimComplement'), r.dims.complement, 'com') +
      dim(T('compatDimTension'), r.dims.tension, 'ten') +
      '</div>';
    body += '<p class="compat-line" style="font-size:12.5px;color:var(--cocoa-70)">' +
      esc(T('compatShared')) + '：' + r.sharedFunctions + esc(T('compatSharedUnit')) + '</p>';
    body += '<p class="compat-line" style="font-size:12.5px;color:var(--cocoa-70)">' + esc(T('compatNote')) + '</p>';

    openModal({
      title: T('compatBand'),
      body: body,
      buttons: [{ label: T('compatAgain'), ghost: true, keepOpen: true, onClick: function () { openCompat(a); } }]
    });

    function dim(label, val, cls) {
      return '<div class="compat-dim"><span>' + esc(label) + '</span>' +
        '<span class="compat-dim__track"><span class="compat-dim__fill compat-dim__fill--' + cls +
        '" style="--w:' + val + '%"></span></span>' +
        '<span class="compat-dim__val">' + val + '</span></div>';
    }
  }

  /* ============================================================
   * 说明弹窗
   * ============================================================ */
  function showAbout() {
    var body = (T('aboutBody') || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    openModal({ title: T('aboutTitle'), body: '<ul>' + body + '</ul>' });
  }
  function showHelp() {
    var body = (T('helpBody') || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    openModal({ title: T('helpTitle'), body: '<ol>' + body + '</ol>' });
  }

  /* ============================================================
   * 路由
   * ============================================================ */
  function idealAnswers(code) {
    var stack = window.TEST_STACKS[code];
    if (!stack) return null;
    var shadow = stack.map(function (fn) {
      return fn.slice(0, -1) + (fn.charAt(fn.length - 1) === 'e' ? 'i' : 'e');
    });
    var target = {};
    target[stack[0]] = 5; target[stack[1]] = 5; target[stack[2]] = 4; target[stack[3]] = 3;
    shadow.forEach(function (f) { target[f] = 2; });
    var ans = {};
    QUESTIONS.forEach(function (q) {
      if (q.part === 1) ans[q.id] = q.reverse ? (6 - target[q.function]) : target[q.function];
      else ans[q.id] = 3;
    });
    return ans;
  }

  function boot() {
    window.I18N.applyToDom();
    $('landingTitle').innerHTML = T('titleHtml');
    $('landingSub').textContent = META.subtitle;
    buildArc();
    renderWelcome();

    var hash = location.hash || '';

    // 个人结果链接：#/r/<36 位作答>
    var m = /^#\/r\/([1-5]{36})$/.exec(hash);
    if (m) {
      var ans = decodeAnswers(m[1]);
      if (ans) {
        state.answers = ans;
        state.result = S.compute(ans);
        renderResult(state.result);
        show('result');
        return;
      }
    }
    // 类型直达：#/result/CODE（分享「某个型」用，不是某个人的真实作答）
    var m2 = /^#\/result\/([A-Z]{4})$/.exec(hash);
    if (m2 && RESULTS[m2[1]]) {
      var ia = idealAnswers(m2[1]);
      if (ia) {
        state.answers = ia;
        state.result = S.compute(ia);
        renderResult(state.result);
        show('result');
        return;
      }
    }
    if (hash === '#/quiz') {
      var saved = STORE.load();
      if (saved && !saved.finished && STORE.answeredCount(saved) > 0) resumeQuiz(saved);
      else startQuiz(false);
      return;
    }
    show('landing');
  }

  /* ---------------- 事件绑定 ---------------- */
  $('btnStart').addEventListener('click', function () {
    var saved = STORE.load();
    if (saved && saved.finished && STORE.answeredCount(saved) === TOTAL) {
      // 已经有完整结果时，主按钮的语义是「重测」
      clearAndStart();
    } else if (saved && STORE.answeredCount(saved) > 0) {
      resumeQuiz(saved);
    } else {
      startQuiz(false);
    }
  });
  $('btnBack').addEventListener('click', goBack);
  $('options').addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.opt') : null;
    if (btn) pick(Number(btn.dataset.value));
  });
  $('btnAbout').addEventListener('click', showAbout);
  $('btnHelp').addEventListener('click', showHelp);
  $('btnLang').addEventListener('click', function () { window.I18N.toggle(); });

  document.addEventListener('keydown', function (e) {
    if (!VIEWS.quiz.classList.contains('is-active')) return;
    if ($('modal').classList.contains('is-open')) return;
    if (e.key >= '1' && e.key <= '5') pick(Number(e.key));
    if (e.key === 'Backspace') { e.preventDefault(); goBack(); }
  });

  window.addEventListener('hashchange', function () {
    if (!location.hash) { renderWelcome(); show('landing'); }
  });

  boot();
})();
