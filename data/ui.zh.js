/* ============================================================
 * data/ui.zh.js —— 中文界面文案表
 *
 * 所有出现在界面上的固定文案都集中在这里，不再散落在 app.js 与 index.html 里。
 * 英文对应表是 data/en/meta.js 里的 TEST_EN_UI，**两边键名必须完全一致**，
 * 缺键会在 verify-site.js 的 i18n 校验里被揪出来。
 * ============================================================ */

window.TEST_UI_ZH = {
  /* --- 标题（含 HTML，单独处理） --- */
  titleHtml: '你的恋爱底色<br>是<em>哪只狗</em>？',

  /* --- 基础 --- */
  start: '点击开始',
  retake: '重新测一次',
  restart: '重新开始',
  continueQuiz: '继续答题',
  viewResult: '查看完整结果',
  questionOf: '第 {n} / {total} 题',
  back: '← 上一题',
  landingMeta: '36 道题 · 约 7 分钟 · 结果仅供自我探索',
  close: '关闭',
  copied: '已复制 ✓',

  /* --- 记忆功能 --- */
  welcomeBack: '欢迎回来',
  yourResultWas: '你上次测出的是',
  testedOn: '测于 {date}',
  resumeTitle: '上次还没做完',
  resumeAt: '你做到第 {n} / {total} 题',
  resumeHint: '接着做，之前的答案都还在',
  clearRecord: '清除记录',
  clearConfirm: '清除后这台设备就不再记得你的结果了，确定吗？',
  confirmClear: '确定清除',
  cancel: '取消',

  /* --- 结果链接 --- */
  myLink: '复制我的结果链接',
  linkCopied: '链接已复制 ✓',
  myLinkTitle: '这条链接就是你自己的结果',
  myLinkHint: '收藏它。换手机、清缓存、换浏览器，打开都还是这份结果。',

  /* --- 分享 --- */
  shareTitle: '分享给朋友',
  shareWeChat: '发给微信好友',
  shareNative: '分享',
  shareCopiedHint: '链接已复制。打开微信，粘贴给好友就能看到你的结果。',
  wechatGuideTitle: '点右上角「···」',
  wechatGuideBody: '然后选「发送给朋友」，就能把结果发出去。',

  /* --- 适配度 --- */
  compatTitle: '我们俩有多搭？',
  compatPick: '选一个好友的类型',
  compatPickHint: '不确定对方是什么型？让他也来测一次，把结果告诉你。',
  compatAgain: '换个人再算',
  compatScore: '适配度',
  compatDimResonance: '共鸣',
  compatDimComplement: '互补',
  compatDimTension: '需要磨合',
  compatShared: '共同功能',
  compatSharedUnit: '个',
  compatNote: '这只是功能栈上的相处体感，不是命运判决书。',
  compatBand: '你们的关系形态',

  /* --- 说明与免责 --- */
  aboutTitle: '关于这个测试',
  aboutBody: [
    '这个测试的题目、结果文案、狗狗插画，全部由 AI 生成。',
    '理论依据是荣格八维（8 个认知功能），但它本身并不是经过严格科学验证的心理学工具。',
    '结果仅供娱乐与自我探索，不构成任何心理评估或诊断。',
    '请不要用它给人贴标签，也不要据此做重要决定。',
    '你的作答全部在浏览器本地运算，不会上传到任何服务器。'
  ],
  helpTitle: '怎么用',
  helpBody: [
    '一共 36 道题，大多数人 7 分钟左右做完。',
    '凭第一反应选，不要想太久。没有正确答案，也没有「更好」的人格。',
    '选项从「完全不像我」到「完全就是我」，中间那档是「说不好」。',
    '用键盘可以按 1–5 快速作答，按退格键回上一题。',
    '做完会自动存在这台设备上，下次打开直接能看到结果，不用重做。',
    '建议在结果页复制「我的结果链接」并收藏——换手机或清了缓存也能找回。',
    '想重新测：在主页点「重新测一次」，旧结果会被覆盖。'
  ],

  /* --- 结果页区块标题 --- */
  dogIntroTitle: '你在关系里的样子',
  stackTitle: '你的八维功能序列',
  barsTitle: '八个功能的能量分布',
  dominantIs: '你的主导功能是 {fn}（{name}），得分 {score}，是这套结果里最确定的一笔。',
  traitsTitle: '在恋爱里的你',
  giftsTitle: '你的天赋',
  pitfallsTitle: '容易踩的坑',
  stressTitle: '压力下的你',
  compatSectionTitle: '和谁合拍 / 和谁容易累',
  compatGood: '相处起来最省力',
  compatTiring: '容易互相消耗',
  growthTitle: '一句成长提示',
  shareFoot: '我的恋爱底色 · {dog} · {code}',
  lineupTitle: '十六种恋爱底色，你站在这里',
  flowNote: '你的 {axes} 处于流动区间，说明这几条轴你还在摇摆，会随关系状态变化——这很正常。',
  copyShare: '复制分享文案',
  shareTextTpl: '我的恋爱底色是「{dog}」（{code}）——{line}',

  /* --- 语言 --- */
  langLabel: 'English',
  langName: '中文'
};
