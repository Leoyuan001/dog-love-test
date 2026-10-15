/* ============================================================
 * data/en/compat.js — English copy for two-person compatibility:
 * the per-type relationship role labels and the score bands.
 * The algorithm itself lives in scripts/compat.js. Weights are
 * language-independent and stay in data/compat.js only.
 * ============================================================ */

/* The relationship "role" and one-line description for each type.
 * The 256 combination names are built from these two phrase sets,
 * so no 256 lines need to be written by hand.
 * verb reads as the second half of "<Role>: the one who ...". */
window.TEST_EN_COMPAT_ROLES = {
  INTJ: { role: 'Strategist',     verb: 'maps the route ahead' },
  INTP: { role: 'Problem-solver', verb: 'thinks it through before speaking' },
  ENTJ: { role: 'Helmsman',       verb: 'sets the direction first' },

  ENTP: { role: 'Game-changer',   verb: 'tries it and sees' },

  INFJ: { role: 'Mind-reader',    verb: 'senses your mood first' },
  INFP: { role: 'Idealist',       verb: 'checks their own heart first' },
  ENFJ: { role: 'Host',           verb: 'makes sure everyone is looked after' },
  ENFP: { role: 'Sunshine',       verb: 'smiles first' },

  ISTJ: { role: 'Anchor',         verb: 'gets it done properly' },
  ISFJ: { role: 'Carer',          verb: 'remembers every detail' },
  ESTJ: { role: 'Gatekeeper',     verb: 'sets the rules first' },
  ESFJ: { role: 'Harmonizer',     verb: 'warms the room first' },

  ISTP: { role: 'Lone traveller', verb: 'sizes up the situation first' },
  ISFP: { role: 'Detail-keeper',  verb: 'feels the moment first' },
  ESTP: { role: 'Doer',           verb: 'charges in first' },
  ESFP: { role: 'Live wire',      verb: 'starts the fun first' }
};

/* Compatibility band -> relationship shape and one-line summary */
window.TEST_EN_COMPAT_BANDS = [
  { min: 90, name: 'A rare match', color: '#E2725B',
    line: 'A pairing this well matched is uncommon. You barely have to explain yourselves to each other.' },
  { min: 80, name: 'Strong fit', color: '#F2A65A',
    line: 'You cover for each other without effort. When one of you pushes forward, the other already knows what to hold.' },
  { min: 70, name: 'Easy company', color: '#E9C46A',
    line: 'Low effort and well matched in pace. Not exciting, but it lasts.' },
  { min: 60, name: 'Complementary blend', color: '#A8C686',
    line: 'The differences are real, and they are usually the part the other one is missing. It takes talking, and it is worth it.' },
  { min: 45, name: 'Two different worlds', color: '#8DA9C4',
    line: 'You read the world differently. It can last, as long as both of you are willing to translate.' },
  { min: 0,  name: 'High difficulty', color: '#8C5A3C',
    line: 'The sticking points are clear, and the people who get through them say it was worth it. The key is not treating a difference as a fault.' }
];
