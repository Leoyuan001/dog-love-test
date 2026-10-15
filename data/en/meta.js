/* ============================================================
 * data/en/meta.js — English UI copy: meta info, eight cognitive
 * functions, five-point scale, stress reactions, interface strings.
 * Mirrors data/meta.js key for key; ids and numbers are unchanged.
 * Loads as a global for file:// use (no fetch, no local CORS issues).
 * ============================================================ */

window.TEST_EN_META = {
  title: 'Which Dog Is Your Love Style?',
  subtitle: 'A Jungian eight-function look at who you are at your most instinctive in a relationship',
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
    'This test is a tool for self-exploration, not a psychological diagnosis. The dog breeds in your result are a metaphor for temperament only, and say nothing about the real merits, size, or care needs of any breed. If your distress persists, please seek professional help.'
};

/* ------------------------------------------------------------
 * Eight cognitive functions: English name plus a plain-language
 * reading. plain = the cognitive core; love = how it shows up in
 * a relationship (the result page shows this line).
 * ---------------------------------------------------------- */
window.TEST_EN_FUNCTIONS = [
  {
    id: 'Ne', name: 'Extraverted Intuition', kind: 'N', attitude: 'e',
    plain: 'Branching possibilities',
    love: '"What else could we become?" You like talking about hypotheticals and trying things you have never tried. Many possible versions of the relationship excite you, and they also make it easy to lose focus.'
  },
  {
    id: 'Ni', name: 'Introverted Intuition', kind: 'N', attitude: 'i',
    plain: 'Converging insight',
    love: '"I have a rough sense of where we are heading." You care about what the relationship essentially is and where it is trending. Once you have formed a read, surface behavior rarely overturns it.'
  },
  {
    id: 'Se', name: 'Extraverted Sensing', kind: 'S', attitude: 'e',
    plain: 'Sensation in the moment',
    love: '"How this moment actually feels." You care about physical contact and about what you do together. You act on impulse, and in an argument your reaction is the fastest and the most direct.'
  },
  {
    id: 'Si', name: 'Introverted Sensing', kind: 'S', attitude: 'i',
    plain: 'Remembered detail',
    love: '"What we were like before." You remember anniversaries and small details, you keep the rituals that recur, and you read the present through what has already happened.'
  },
  {
    id: 'Te', name: 'Extraverted Thinking', kind: 'T', attitude: 'e',
    plain: 'Efficiency in the outer world',
    love: '"How do we fix this?" You want to talk about who does what, about plans, and about what actually works. You like boundaries and standards stated out loud.'
  },
  {
    id: 'Ti', name: 'Introverted Thinking', kind: 'T', attitude: 'i',
    plain: 'Inner logic',
    love: '"Does this hold up?" You analyze why you feel the way you feel. "Everyone does it this way" is not an answer for you; the reasoning has to be consistent with itself.'
  },
  {
    id: 'Fe', name: 'Extraverted Feeling', kind: 'F', attitude: 'e',
    plain: 'The mood between people',
    love: '"The atmosphere between us." You look after your partner\'s feelings and protect the harmony, and you are easily moved by whatever state they are in.'
  },
  {
    id: 'Fi', name: 'Introverted Feeling', kind: 'F', attitude: 'i',
    plain: 'Personal values',
    love: '"Is this what I actually want?" You stay loyal to what you really feel and you will not pretend. You would rather disagree than go against yourself.'
  }
];

window.TEST_EN_STACK_ROLES = ['Dominant', 'Auxiliary', 'Tertiary', 'Inferior'];

/* ------------------------------------------------------------
 * Five-point scale
 * ---------------------------------------------------------- */
window.TEST_EN_OPTIONS = [
  { value: 1, label: 'Not like me at all' },
  { value: 2, label: 'Not really' },
  { value: 3, label: 'Unsure' },
  { value: 4, label: 'Somewhat like me' },
  { value: 5, label: 'Exactly like me' }
];

/* ------------------------------------------------------------
 * Stress reactions (selected by the four stress items in Part 2).
 * Score 4 or above takes pair[0]; 2 or below takes pair[1].
 * ---------------------------------------------------------- */
window.TEST_EN_STRESS = {
  Te: {
    label: 'Cool down and reason it out',
    text: 'In your worst argument you suddenly switch channels. The feeling goes away and you start sorting out who was right, listing facts, and looking for a fix. Your partner often reads that as going cold, when all you want is to get the problem solved.'
  },
  Fi: {
    label: 'Protect your own feeling first',
    text: 'In your worst argument you withdraw inward first and check whether this has crossed the line you care about most. If it has, you find it very hard to smooth things over just to keep the peace.'
  },
  Fe: {
    label: 'Steady the atmosphere first',
    text: 'In your worst argument what hurts most is not who is right but that the atmosphere between you has broken. You are usually the one who softens first and gives ground, as long as the two of you can get back to something comfortable.'
  },
  Ti: {
    label: 'Work out the logic first',
    text: 'In your worst argument you replay it in your head: how did this turn into that? You need to understand the mechanics of it before you can genuinely let it go.'
  },
  Se: {
    label: 'Cannot sit still, need to do something now',
    text: 'Once the relationship goes cold, what you cannot stand is the suspension. You find something to do immediately: arrange to meet, send a message, invent a reason to see each other, and get the situation moving again.'
  },
  Ni: {
    label: 'Step back and watch where it goes',
    text: 'Once the relationship goes cold, you step back and quietly watch the whole thing develop. Other people read it as not caring, when in fact you are working out where this relationship is heading.'
  },
  Si: {
    label: 'Replay the good parts',
    text: 'Once the relationship goes cold, you find yourself going back through the past: places you went together, things that were said, looking over and over for the day it started to change.'
  },
  Ne: {
    label: 'Start generating possibilities',
    text: 'Once the relationship goes cold, your mind opens several routes at once. Is work crushing them lately? Have we both changed? Is there some other explanation? You lay out every possibility first, then pick one to walk down.'
  }
};

/* ------------------------------------------------------------
 * Interface strings
 * ---------------------------------------------------------- */
window.TEST_EN_UI = {
  titleHtml: 'Which Dog Is<br>Your <em>Love Style</em>?',
  start: 'Start',
  retake: 'Retake',
  viewResult: 'View your result',
  continueQuiz: 'Continue',
  restart: 'Start over',
  questionOf: 'Question {n} / {total}',
  back: '← Back',
  landingMeta: '36 questions · about 7 minutes',
  aboutTitle: 'About this test',
  aboutBody: [
    'This test was written and assembled with the help of AI. The questions, the scoring, and the result text were all generated.',
    'It draws on Jungian cognitive functions and on popular personality typing. That framework has not been rigorously validated as science, and this test in particular has not been validated at all.',
    'It is meant for entertainment and for self-exploration. Treat it as a set of questions worth thinking about, not as a measurement of you.',
    'Do not use the result to label a partner, a friend, or yourself. A type is a rough shorthand, not a verdict on a person.',
    'Your answers are computed entirely in your browser. Nothing you enter is uploaded, and no account or email address is required.'
  ],
  helpTitle: 'How to take it',
  helpBody: [
    'There are 36 questions. Most people finish in about 7 minutes.',
    'Answer by first reaction. There are no right answers and no good or bad results, and dwelling on a statement usually makes the answer less accurate.',
    'Each question offers five choices: not like me at all, not really, unsure, somewhat like me, and exactly like me.',
    'On a keyboard, press 1 to 5 to answer and Backspace to go back to the previous question.',
    'Your result is saved automatically in this browser, so you can close the page and come back to it.',
    'To keep the result, bookmark it or copy the result link. The saved record lives in this browser only, and clearing site data will remove it.',
    'To take the test again, use Retake on the result page or Start over. Your new answers replace the saved record.'
  ],
  shareTitle: 'Share this result',
  copied: 'Copied ✓',
  compatTitle: 'How well do you two match?',
  compatPick: "Pick your partner's or friend's type to see the match",
  compatScore: 'Match score',
  welcomeBack: 'Welcome back',
  yourResultWas: 'Last time your result was',
  testedOn: 'Tested on {date}',
  clearRecord: 'Clear saved record',
  close: 'Close',
  langLabel: '中文',

  /* --- 以下为新增功能补充（与 data/ui.zh.js 的键一一对应） --- */
  resumeTitle: 'You did not finish last time',
  resumeAt: 'You stopped at question {n} / {total}',
  resumeHint: 'Your previous answers are still here.',
  clearConfirm: 'This device will forget your result. Continue?',
  confirmClear: 'Clear it',
  cancel: 'Cancel',

  myLink: 'Copy my result link',
  linkCopied: 'Link copied ✓',
  myLinkTitle: 'This link is your result',
  myLinkHint: 'Bookmark it. It still works on another phone, or after you clear your cache.',

  shareWeChat: 'Send to a WeChat friend',
  shareNative: 'Share',
  shareCopiedHint: 'Link copied. Open WeChat and paste it to a friend to show your result.',
  wechatGuideTitle: 'Tap "···" in the top right',
  wechatGuideBody: 'Then choose "Send to Chat" to pass your result on.',

  compatPickHint: 'Not sure what type they are? Ask them to take the test and tell you the result.',
  compatAgain: 'Compare with someone else',
  compatDimResonance: 'Resonance',
  compatDimComplement: 'Complement',
  compatDimTension: 'Friction',
  compatShared: 'Shared functions',
  compatSharedUnit: '',
  compatNote: 'This reflects how your function stacks interact. It is not a verdict on your relationship.',
  compatBand: 'Your relationship shape',

  langName: 'English',

  /* --- 结果页区块标题（与 data/ui.zh.js 对应） --- */
  dogIntroTitle: 'How you show up in a relationship',
  stackTitle: 'Your function stack',
  barsTitle: 'Function energy distribution',
  dominantIs: 'Your dominant function is {fn} ({name}) at {score} — the most settled part of this result.',
  traitsTitle: 'How you love',
  giftsTitle: 'Your strengths',
  pitfallsTitle: 'Where you get stuck',
  stressTitle: 'Under pressure',
  compatSectionTitle: 'Who fits, who drains',
  compatGood: 'Easiest with',
  compatTiring: 'Draining with',
  growthTitle: 'One thing to try',
  shareFoot: 'My love style · {dog} · {code}',
  lineupTitle: 'Sixteen love styles. You are here.',
  flowNote: 'Your {axes} sit in the middle band, which means these axes still shift with your relationship. That is normal.',
  copyShare: 'Copy share text',
  shareTextTpl: 'My love style is "{dog}" ({code}) — {line}'
};
