/* ============================================================
 * 《你的恋爱底色是哪只狗？》
 * data/meta.js —— 元信息 / 八维功能表 / 四轴 / 计分配置 / 压力反应
 * 供 file:// 直接打开使用（不依赖 fetch，避免本地 CORS 限制）
 * ============================================================ */

window.TEST_META = {
  title: '你的恋爱底色是哪只狗？',
  subtitle: '用荣格八维，看看你在关系里最本能的那个自己',
  estimatedMinutes: 7,
  totalQuestions: 36,
  visual: {
    preset: 'warm-afternoon-yard',
    tokens: {
      cream: '#FFF6E9',
      sun: '#FFC857',
      honey: '#F2A65A',
      terracotta: '#E2725B',
      cocoa: '#8C5A3C',
      grass: '#A8C686',
      sky: '#BFD8E8',
      paper: '#FFFDF8'
    },
    landingDogFormation: 'double-arc',
    quizDogsPerQuestion: 4,
    quizDogRotation: 'all-16-min-2-appearances',
    resultDogHero: true,
    reducedMotion: true
  },
  disclaimer:
    '本测试为自我探索工具，非心理诊断。结果中的犬种仅为气质隐喻，与真实犬种优劣、体型、饲养难度无关。如有持续的情绪困扰，请寻求专业帮助。'
};

/* ------------------------------------------------------------
 * 八个认知功能：中文名 + 恋爱化的白话解释
 * plain = 认知内核；love = 恋爱里的样子（结果页直接展示这一句）
 * ---------------------------------------------------------- */
window.TEST_FUNCTIONS = [
  {
    id: 'Ne', name: '外倾直觉', kind: 'N', attitude: 'e',
    plain: '发散可能性',
    love: '「我们还能变成什么样」——爱聊假设、爱尝试新玩法，对关系的多种可能兴奋，也容易分心'
  },
  {
    id: 'Ni', name: '内倾直觉', kind: 'N', attitude: 'i',
    plain: '收敛洞察',
    love: '「我隐约知道我们会走向哪」——重视关系的本质与长期趋势，一旦形成判断很难被表面行为推翻'
  },
  {
    id: 'Se', name: '外倾实感', kind: 'S', attitude: 'e',
    plain: '当下感官',
    love: '「现在这一刻的感觉」——重视肢体接触和约会体验，即兴行动，吵架时反应最快最直接'
  },
  {
    id: 'Si', name: '内倾实感', kind: 'S', attitude: 'i',
    plain: '经验细节',
    love: '「以前的我们是什么样的」——记得纪念日和细节，重视稳定的仪式，用过去的经验判断当下'
  },
  {
    id: 'Te', name: '外倾思考', kind: 'T', attitude: 'e',
    plain: '外部效率',
    love: '「这个问题怎么解决」——谈分工、谈方案、谈效率，喜欢把边界和标准说清楚'
  },
  {
    id: 'Ti', name: '内倾思考', kind: 'T', attitude: 'i',
    plain: '内在逻辑',
    love: '「这讲不讲得通」——会分析自己为什么有这种感受，不接受「大家都这样」，要逻辑自洽'
  },
  {
    id: 'Fe', name: '外倾情感', kind: 'F', attitude: 'e',
    plain: '关系氛围',
    love: '「我们之间的气氛」——照顾对方情绪、维护和谐，容易被对方的状态牵动'
  },
  {
    id: 'Fi', name: '内倾情感', kind: 'F', attitude: 'i',
    plain: '个人价值',
    love: '「这是不是我真正想要的」——忠于自己的真实感受，不愿假装，宁可不合也不违心'
  }
];

/* ------------------------------------------------------------
 * 四轴：由 8 个功能折叠而来
 * ---------------------------------------------------------- */
window.TEST_AXES = [
  { id: 'A', name: '能量朝向', positive: 'E', negative: 'I', positiveLabel: '外倾', negativeLabel: '内倾',
    formula: { E: ['Fe', 'Te', 'Ne', 'Se'], I: ['Fi', 'Ti', 'Ni', 'Si'] } },
  { id: 'B', name: '信息获取', positive: 'N', negative: 'S', positiveLabel: '直觉', negativeLabel: '实感',
    formula: { N: ['Ne', 'Ni'], S: ['Se', 'Si'] } },
  { id: 'C', name: '决策依据', positive: 'T', negative: 'F', positiveLabel: '思考', negativeLabel: '情感',
    formula: { T: ['Te', 'Ti'], F: ['Fe', 'Fi'] } },
  { id: 'D', name: '对外节奏', positive: 'J', negative: 'P', positiveLabel: '判断', negativeLabel: '感知',
    formula: { J: ['Te', 'Fe'], P: ['Ne', 'Se'] } }
];

/* ------------------------------------------------------------
 * 16 型标准功能栈（主导 → 辅助 → 第三 → 劣势）
 * 用于计分后的双重校验
 * ---------------------------------------------------------- */
window.TEST_STACKS = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni']
};

window.TEST_STACK_ROLES = ['主导功能', '辅助功能', '第三功能', '劣势功能'];

/* ------------------------------------------------------------
 * 计分配置
 * ---------------------------------------------------------- */
window.TEST_SCORING = {
  pointsMin: 1,
  pointsMax: 5,
  normalizeTo: 100,
  flowBand: [45, 55],
  stackCheck: true,
  /* 功能得分 ≥ 此值且排名前二 → 标记为「主功能确认」 */
  dominantThreshold: 75
};

/* ------------------------------------------------------------
 * 5 级选项
 * ---------------------------------------------------------- */
window.TEST_OPTIONS = [
  { value: 1, label: '完全不像我' },
  { value: 2, label: '不太像' },
  { value: 3, label: '说不好' },
  { value: 4, label: '比较像' },
  { value: 5, label: '完全就是我' }
];

/* ------------------------------------------------------------
 * 压力反应库（由 Part 2 的 4 道压力题选出）
 * 得分 ≥ 4 取 pair[0]，≤ 2 取 pair[1]
 * ---------------------------------------------------------- */
window.TEST_STRESS = {
  Te: { label: '冷静下来讲道理', text: '吵到最凶的时候，你会突然「切换频道」——情绪收起来，开始分对错、列事实、找方案。对方常常觉得你忽然变冷，其实你只是想赶紧把问题解决掉。' },
  Fi: { label: '先护住自己的感受', text: '吵到最凶的时候，你会先退回心里，确认「这件事有没有踩到我最在意的那条线」。如果踩到了，你很难为了息事宁人而假装没事。' },
  Fe: { label: '先接住气氛', text: '吵到最凶的时候，你最难受的不是谁对谁错，而是「我们之间的气氛坏掉了」。你往往会先低头、先软化，只要关系能回到舒服的状态。' },
  Ti: { label: '先想清楚逻辑', text: '吵到最凶的时候，你会在心里反复推演「这件事到底是怎么变成这样的」，需要先把它想明白，才可能真正翻篇。' },
  Se: { label: '坐不住，要立刻做点什么', text: '关系一进入冷淡期，你最受不了的是「悬着」。你会立刻找件事做——约见面、发消息、制造一个见面的理由，先把局面拉回来再说。' },
  Ni: { label: '退到远处看走向', text: '关系一进入冷淡期，你会退后一步，安静地观察整件事的走向。别人以为你不在意，其实你在心里推演这段关系会走到哪里。' },
  Si: { label: '反复回想那些好的片段', text: '关系一进入冷淡期，你会不自觉地翻回过去——以前一起去过的地方、说过的话，然后一遍遍找「是从哪一天开始变的」。' },
  Ne: { label: '开始设想各种可能', text: '关系一进入冷淡期，你的脑子会同时开出好几条路——是不是他最近压力大？是不是我们都变了？是不是还有别的解释？你会先把可能性铺满，再挑一条走。' }
};

/* ------------------------------------------------------------
 * 16 型 → 狗狗素材路径（与 §9.7 文件组织一致）
 * ---------------------------------------------------------- */
window.TEST_DOG_ASSET = function (code) {
  return {
    main: 'assets/dogs/' + code + '.webp',
    hi: 'assets/dogs/' + code + '@2x.webp',
    thumb: 'assets/dogs/thumb/' + code + '.webp'
  };
};
