/* ============================================================
 * data/en/questions.js — English version of the 36 items.
 *   Part 1 (1-32): 8 functions x 4 items, 2 forward + 2 reverse each
 *                  reverse: true means agreeing indicates a weaker
 *                  function, and scoring is flipped.
 *   Part 2 (33-36): stress items, not counted toward function scores.
 * id / part / function / functionPair / reverse mirror data/questions.js.
 * ============================================================ */

window.TEST_EN_QUESTIONS = [
  /* ---------- Part 1: function items ---------- */
  { id: 1,  part: 1, function: 'Ne', reverse: false, scene: 'Everyday life',
    text: 'I often suggest that we go do something we have never done before.' },

  { id: 2,  part: 1, function: 'Si', reverse: false, scene: 'Anniversaries and rituals',
    text: 'I remember every small thing my partner has mentioned in passing.' },

  { id: 3,  part: 1, function: 'Fe', reverse: false, scene: "When they're struggling",
    text: 'When my partner is upset, I adjust my own state first so I can hold them.' },

  { id: 4,  part: 1, function: 'Ti', reverse: false, scene: "When they're struggling",
    text: 'I go over and over why a certain thing made me feel the way I did.' },

  { id: 5,  part: 1, function: 'Se', reverse: false, scene: 'Defining the relationship',
    text: 'More than talking about the future, I enjoy the physical presence and the atmosphere of being with my partner.' },

  { id: 6,  part: 1, function: 'Fi', reverse: false, scene: 'Friends, family, boundaries',
    text: 'If a relationship requires me to pretend to be someone else, I would rather not have it.' },

  { id: 7,  part: 1, function: 'Te', reverse: false, scene: 'Conflict and silence',
    text: 'When something goes wrong between us, I want to find a solution before I deal with the feelings.' },

  { id: 8,  part: 1, function: 'Ni', reverse: false, scene: 'Jealousy and security',
    text: 'Even when my partner says nothing, I have a rough sense of which way this relationship is going.' },

  { id: 9,  part: 1, function: 'Ne', reverse: false, scene: 'Planning ahead',
    text: 'I cannot help imagining how many other shapes this relationship could take.' },

  { id: 10, part: 1, function: 'Si', reverse: false, scene: 'Anniversaries and rituals',
    text: 'Regular date nights and anniversaries make me feel that this relationship is steady.' },

  { id: 11, part: 1, function: 'Fe', reverse: false, scene: 'Everyday life',
    text: 'I care a lot about whether the atmosphere between us feels comfortable.' },

  { id: 12, part: 1, function: 'Ti', reverse: false, scene: 'Friends, family, boundaries',
    text: 'If something does not make sense to me, I can hardly talk myself into accepting it.' },

  { id: 13, part: 1, function: 'Se', reverse: false, scene: 'Conflict and silence',
    text: 'When something is wrong, I would rather talk it through on the spot than let it run into the next day.' },

  { id: 14, part: 1, function: 'Fi', reverse: false, scene: 'Planning ahead',
    text: 'I make decisions based on whether I genuinely agree with them, not on what other people say.' },

  { id: 15, part: 1, function: 'Te', reverse: false, scene: 'Everyday life',
    text: 'I like to have the division of tasks and responsibilities between us spelled out.' },

  { id: 16, part: 1, function: 'Ni', reverse: false, scene: 'Long distance and busy schedules',
    text: 'Even from a distance, when we are both working late, I still have a rough sense of where we are heading.' },

  { id: 17, part: 1, function: 'Ne', reverse: true, scene: 'Everyday life',
    text: 'On a date I would rather go back to a familiar place than try somewhere new.' },

  { id: 18, part: 1, function: 'Si', reverse: true, scene: 'Anniversaries and rituals',
    text: 'I rarely look back at the past, and I often forget dates like anniversaries.' },

  { id: 19, part: 1, function: 'Fe', reverse: true, scene: "When they're struggling",
    text: 'I often fail to notice a shift in my partner\'s mood, and need them to say it out loud.' },

  { id: 20, part: 1, function: 'Ti', reverse: true, scene: 'Everyday life',
    text: 'I seldom examine whether the way I think about something is logically consistent.' },

  { id: 21, part: 1, function: 'Se', reverse: true, scene: 'Needing space',
    text: 'However lively the room is, I find it hard to really sink into the atmosphere of the moment.' },

  { id: 22, part: 1, function: 'Fi', reverse: true, scene: 'Needing space',
    text: 'I rarely ask myself what I actually want out of this relationship.' },

  { id: 23, part: 1, function: 'Te', reverse: true, scene: 'Everyday life',
    text: 'I do not much care whether the practical side of the relationship is kept in order.' },

  { id: 24, part: 1, function: 'Ni', reverse: true, scene: 'Everyday life',
    text: 'Where a relationship is heading is hard for me to predict. I mostly take it one step at a time.' },

  { id: 25, part: 1, function: 'Ne', reverse: true, scene: 'Early attraction',
    text: 'I rarely wonder what else the two of us could become.' },

  { id: 26, part: 1, function: 'Si', reverse: true, scene: 'Everyday life',
    text: 'Doing things the same way every time bores me quickly.' },

  { id: 27, part: 1, function: 'Fe', reverse: true, scene: 'Friends, family, boundaries',
    text: 'As long as I am fine myself, whether other people are happy does not affect me much.' },

  { id: 28, part: 1, function: 'Ti', reverse: true, scene: 'Friends, family, boundaries',
    text: 'If everyone does it this way, I do it this way too, without asking why.' },

  { id: 29, part: 1, function: 'Se', reverse: true, scene: 'Everyday life',
    text: 'I rarely notice that my partner changed their hair or is wearing something different today.' },

  { id: 30, part: 1, function: 'Fi', reverse: true, scene: 'Defining the relationship',
    text: 'If other people say something is good, I usually agree, and seldom check whether I actually do.' },

  { id: 31, part: 1, function: 'Te', reverse: true, scene: 'Planning ahead',
    text: 'When I make a decision, I rarely consider whether it is an efficient way to do things.' },

  { id: 32, part: 1, function: 'Ni', reverse: true, scene: 'Conflict and silence',
    text: 'I do not spend much time on what something really means underneath. I would rather deal with the matter in front of me.' },

  /* ---------- Part 2: stress items (not counted toward function scores) ---------- */
  { id: 33, part: 2, functionPair: ['Te', 'Fi'], reverse: false, scene: 'Conflict and silence',
    text: 'In our worst arguments I suddenly go calm and start reasoning, sorting out who was right.' },

  { id: 34, part: 2, functionPair: ['Fe', 'Ti'], reverse: false, scene: 'Conflict and silence',
    text: 'In our worst arguments what I fear most is the atmosphere between us breaking for good, so I give ground first.' },

  { id: 35, part: 2, functionPair: ['Se', 'Ni'], reverse: false, scene: 'Long distance and busy schedules',
    text: 'The moment the relationship goes cold I cannot sit still. I want to do something at once to pull it back.' },

  { id: 36, part: 2, functionPair: ['Si', 'Ne'], reverse: false, scene: 'Long distance and busy schedules',
    text: 'The moment the relationship goes cold I replay the good parts from before, trying to work out which day it started to change.' }
];
