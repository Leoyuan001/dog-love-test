/* ============================================================
 * data/questions.js —— 36 道题
 *   Part 1（1–32）：8 个功能 × 4 题，每功能 2 正向 + 2 反向
 *                   reverse: true 表示「同意 = 该功能弱」，计分翻转
 *   Part 2（33–36）：压力退化题，不计入八维得分
 * ============================================================ */

window.TEST_QUESTIONS = [
  /* ---------- Part 1：功能题 ---------- */
  { id: 1,  part: 1, function: 'Ne', reverse: false, scene: '日常相处',
    text: '我常会提议我们去做点从来没做过的事。' },

  { id: 2,  part: 1, function: 'Si', reverse: false, scene: '纪念日与仪式感',
    text: '我会记得对方随口说过的每一件小事。' },

  { id: 3,  part: 1, function: 'Fe', reverse: false, scene: '对方情绪低落',
    text: '对方情绪不好的时候，我会先调整自己的状态去接住他。' },

  { id: 4,  part: 1, function: 'Ti', reverse: false, scene: '对方情绪低落',
    text: '我会反复分析自己为什么会对一件事有那样的感受。' },

  { id: 5,  part: 1, function: 'Se', reverse: false, scene: '确定关系',
    text: '比起聊未来，我更享受和对方待在一起时真实的触感和氛围。' },

  { id: 6,  part: 1, function: 'Fi', reverse: false, scene: '朋友家人边界',
    text: '如果一段关系要求我假装成另一个人，我宁可不要。' },

  { id: 7,  part: 1, function: 'Te', reverse: false, scene: '冲突与冷战',
    text: '关系里出了问题，我更想先找到解决办法，而不是先处理情绪。' },

  { id: 8,  part: 1, function: 'Ni', reverse: false, scene: '吃醋与安全感',
    text: '即使对方什么都没说，我也大概知道这段关系正在往哪个方向走。' },

  { id: 9,  part: 1, function: 'Ne', reverse: false, scene: '未来规划',
    text: '我会忍不住想象，我们这段关系还有多少种可能的样子。' },

  { id: 10, part: 1, function: 'Si', reverse: false, scene: '纪念日与仪式感',
    text: '固定的约会方式和纪念日，会让我觉得这段关系是稳的。' },

  { id: 11, part: 1, function: 'Fe', reverse: false, scene: '日常相处',
    text: '我很在意我们之间的气氛是不是舒服。' },

  { id: 12, part: 1, function: 'Ti', reverse: false, scene: '朋友家人边界',
    text: '如果一件事在道理上说不通，我很难说服自己去接受。' },

  { id: 13, part: 1, function: 'Se', reverse: false, scene: '冲突与冷战',
    text: '有不愉快的时候，我倾向于当场说开，不想拖到第二天。' },

  { id: 14, part: 1, function: 'Fi', reverse: false, scene: '未来规划',
    text: '我做决定的依据，是心里是不是真的认同，而不是别人怎么说。' },

  { id: 15, part: 1, function: 'Te', reverse: false, scene: '日常相处',
    text: '我喜欢把两个人的分工和责任说清楚。' },

  { id: 16, part: 1, function: 'Ni', reverse: false, scene: '异地与忙碌期',
    text: '就算隔着距离、各自忙到很晚，我也大概知道我们正在往哪里走。' },

  { id: 17, part: 1, function: 'Ne', reverse: true, scene: '日常相处',
    text: '约会时我更愿意去熟悉的老地方，而不是尝试没去过的店。' },

  { id: 18, part: 1, function: 'Si', reverse: true, scene: '纪念日与仪式感',
    text: '过去的事我很少回头看，纪念日这类日子我经常记不住。' },

  { id: 19, part: 1, function: 'Fe', reverse: true, scene: '对方情绪低落',
    text: '我常常察觉不到对方的情绪变化，需要他直接说出来。' },

  { id: 20, part: 1, function: 'Ti', reverse: true, scene: '日常相处',
    text: '我很少去琢磨「我这么想合不合逻辑」。' },

  { id: 21, part: 1, function: 'Se', reverse: true, scene: '独处需求',
    text: '再热闹的场合，我也很难真正沉浸在当下的气氛里。' },

  { id: 22, part: 1, function: 'Fi', reverse: true, scene: '独处需求',
    text: '我很少去问自己「这段关系里我到底想要什么」。' },

  { id: 23, part: 1, function: 'Te', reverse: true, scene: '日常相处',
    text: '我不太在意关系里的事有没有被安排得井井有条。' },

  { id: 24, part: 1, function: 'Ni', reverse: true, scene: '日常相处',
    text: '关系的走向对我来说很难预判，我基本是走一步看一步。' },

  { id: 25, part: 1, function: 'Ne', reverse: true, scene: '暧昧与心动',
    text: '我很少去想「我们以后还可以变成什么样」这类问题。' },

  { id: 26, part: 1, function: 'Si', reverse: true, scene: '日常相处',
    text: '一直重复同样的相处方式，会让我很快就觉得无聊。' },

  { id: 27, part: 1, function: 'Fe', reverse: true, scene: '朋友家人边界',
    text: '只要我自己没问题，别人开不开心不太会影响我。' },

  { id: 28, part: 1, function: 'Ti', reverse: true, scene: '朋友家人边界',
    text: '大家都这么做，那我也照做，不太会去追问为什么。' },

  { id: 29, part: 1, function: 'Se', reverse: true, scene: '日常相处',
    text: '我很少注意到对方今天换了发型，或者穿了不一样的衣服。' },

  { id: 30, part: 1, function: 'Fi', reverse: true, scene: '确定关系',
    text: '别人说好的东西，我通常也觉得好，很少去分辨自己内心是不是真的认同。' },

  { id: 31, part: 1, function: 'Te', reverse: true, scene: '未来规划',
    text: '做决定的时候，我很少考虑「这样做效率高不高」。' },

  { id: 32, part: 1, function: 'Ni', reverse: true, scene: '冲突与冷战',
    text: '我不太会去想一件事背后真正的含义，更愿意就事论事。' },

  /* ---------- Part 2：压力退化题（不计入八维得分） ---------- */
  { id: 33, part: 2, functionPair: ['Te', 'Fi'], reverse: false, scene: '冲突与冷战',
    text: '吵到最凶的时候，我会突然冷静下来，开始讲道理、分对错。' },

  { id: 34, part: 2, functionPair: ['Fe', 'Ti'], reverse: false, scene: '冲突与冷战',
    text: '吵到最凶的时候，我最怕的是我们之间的气氛彻底坏掉，会先低头。' },

  { id: 35, part: 2, functionPair: ['Se', 'Ni'], reverse: false, scene: '异地与忙碌期',
    text: '关系一进入冷淡期，我就坐不住，想立刻做点什么把局面拉回来。' },

  { id: 36, part: 2, functionPair: ['Si', 'Ne'], reverse: false, scene: '异地与忙碌期',
    text: '关系一进入冷淡期，我会反复回想以前那些好的片段，想知道是从哪一天开始变的。' }
];
