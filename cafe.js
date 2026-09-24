/**
 * كافيه البنات المشترك | Pookie Cozy Cafe Rush
 * Game Engine, Machines & Upgrades Shop, Animated SVG Animals & Levels
 */

// ==========================================
// 1. نظام المؤثرات الصوتية (Web Audio API)
// ==========================================
class CuteAudio {
  constructor() {
    this.ctx = null;
    this.musicPlaying = false;
    this.musicInterval = null;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch(e) {}
  }

  playPop() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch(e) {}
  }

  playPour() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(560, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch(e) {}
  }

  playDing() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [1046.5, 2093].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(idx === 0 ? 0.4 : 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      });
    } catch(e) {}
  }

  playCash() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.25, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.2);
      });
    } catch(e) {}
  }

  playFanfare() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const now = this.ctx.currentTime + i * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch(e) {}
  }

  playAlert() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch(e) {}
  }

  toggleMusic() {
    this.init();
    this.musicPlaying = !this.musicPlaying;
    if (this.musicPlaying) {
      this.startLofiLoop();
    } else {
      this.stopLofiLoop();
    }
    return this.musicPlaying;
  }

  startLofiLoop() {
    if (!this.ctx) return;
    const chords = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66, 349.23]
    ];
    let chordIdx = 0;
    const playChord = () => {
      if (!this.musicPlaying || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const current = chords[chordIdx % chords.length];
        chordIdx++;
        current.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 2.8);
        });
      } catch(e) {}
    };
    playChord();
    this.musicInterval = setInterval(playChord, 3000);
  }

  stopLofiLoop() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

const audio = new CuteAudio();

// صوت تشغيل الآلات (طنين خفيف طول مدة التحضير)
CuteAudio.prototype.playWhirr = function (durationMs) {
  this.init();
  if (!this.ctx) return;
  try {
    const now = this.ctx.currentTime;
    const dur = Math.max(0.3, durationMs / 1000);
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(150, now + dur);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.1);
    gain.gain.setValueAtTime(0.05, now + dur - 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  } catch (e) {}
};

// ==========================================
// 2. الحيوانات المرسومة والمتحركة (SVG)
// ==========================================
// كل حيوان: آذان يسار/يمين، رأس، مكان العيون، أنف. الفم والحواجب تتغير حسب المزاج.
const ANIMALS = {
  cat: {
    name: 'مشمش',
    earL: '<path d="M13 26 L18 7 L30 19 Z" fill="#f7c873"/><path d="M17 22 L19 12 L26 19 Z" fill="#ffb3c6"/>',
    earR: '<path d="M51 26 L46 7 L34 19 Z" fill="#f7c873"/><path d="M47 22 L45 12 L38 19 Z" fill="#ffb3c6"/>',
    head: '<circle cx="32" cy="36" r="21" fill="#ffe3a3"/><path d="M27 17 Q32 22 37 17" stroke="#f0b650" stroke-width="2" fill="none" stroke-linecap="round"/>',
    nose: '<path d="M30 39.5 L34 39.5 L32 42 Z" fill="#ff7597"/><path d="M13 38 L21 39 M13 42 L21 41 M51 38 L43 39 M51 42 L43 41" stroke="#c9a35a" stroke-width="1" stroke-linecap="round"/>',
    eyes: [[24, 33], [40, 33]],
    mouthY: 44
  },
  bunny: {
    name: 'لولو',
    earL: '<ellipse cx="23" cy="14" rx="6" ry="14" fill="#ffffff" stroke="#ffd6e0" stroke-width="1.5"/><ellipse cx="23" cy="15" rx="3" ry="10" fill="#ffc2d4"/>',
    earR: '<ellipse cx="41" cy="14" rx="6" ry="14" fill="#ffffff" stroke="#ffd6e0" stroke-width="1.5"/><ellipse cx="41" cy="15" rx="3" ry="10" fill="#ffc2d4"/>',
    head: '<circle cx="32" cy="38" r="20" fill="#ffffff" stroke="#ffe0ea" stroke-width="1.5"/>',
    nose: '<ellipse cx="32" cy="41" rx="2.2" ry="1.6" fill="#ff7597"/>',
    eyes: [[25, 36], [39, 36]],
    mouthY: 44
  },
  bear: {
    name: 'دبدوب',
    earL: '<circle cx="15" cy="18" r="8" fill="#c98c4a"/><circle cx="15" cy="18" r="4" fill="#f2c79a"/>',
    earR: '<circle cx="49" cy="18" r="8" fill="#c98c4a"/><circle cx="49" cy="18" r="4" fill="#f2c79a"/>',
    head: '<circle cx="32" cy="36" r="22" fill="#dea266"/><ellipse cx="32" cy="43" rx="10" ry="7.5" fill="#fbe3c6"/>',
    nose: '<ellipse cx="32" cy="40" rx="3.2" ry="2.2" fill="#3b2d35"/>',
    eyes: [[23, 32], [41, 32]],
    mouthY: 44
  },
  shiba: {
    name: 'بسكوت',
    earL: '<path d="M12 24 L19 8 L28 20 Z" fill="#e8913a"/><path d="M16 21 L19 13 L24 19 Z" fill="#fff1dc"/>',
    earR: '<path d="M52 24 L45 8 L36 20 Z" fill="#e8913a"/><path d="M48 21 L45 13 L40 19 Z" fill="#fff1dc"/>',
    head: '<circle cx="32" cy="36" r="21" fill="#f2a552"/><path d="M17 42 Q20 30 32 36 Q44 30 47 42 Q44 56 32 56 Q20 56 17 42 Z" fill="#fff6e8"/><circle cx="23" cy="26" r="1.8" fill="#fff6e8"/><circle cx="41" cy="26" r="1.8" fill="#fff6e8"/>',
    nose: '<ellipse cx="32" cy="40" rx="3" ry="2" fill="#3b2d35"/>',
    eyes: [[24, 32], [40, 32]],
    mouthY: 44
  },
  fox: {
    name: 'زنجبيل',
    earL: '<path d="M11 22 L16 5 L28 18 Z" fill="#ef7d3c"/><path d="M14 19 L16 10 L23 17 Z" fill="#4a3530"/>',
    earR: '<path d="M53 22 L48 5 L36 18 Z" fill="#ef7d3c"/><path d="M50 19 L48 10 L41 17 Z" fill="#4a3530"/>',
    head: '<circle cx="32" cy="36" r="21" fill="#f38b4a"/><path d="M12 38 Q22 36 32 50 Q42 36 52 38 Q48 56 32 57 Q16 56 12 38 Z" fill="#fffaf3"/>',
    nose: '<circle cx="32" cy="45" r="2.4" fill="#3b2d35"/>',
    eyes: [[24, 33], [40, 33]],
    mouthY: 48
  },
  panda: {
    name: 'باندو',
    earL: '<circle cx="16" cy="17" r="7.5" fill="#3b3b44"/>',
    earR: '<circle cx="48" cy="17" r="7.5" fill="#3b3b44"/>',
    head: '<circle cx="32" cy="36" r="21" fill="#ffffff" stroke="#ececf1" stroke-width="1.5"/><ellipse cx="23" cy="34" rx="5.5" ry="6.5" fill="#3b3b44" transform="rotate(-20 23 34)"/><ellipse cx="41" cy="34" rx="5.5" ry="6.5" fill="#3b3b44" transform="rotate(20 41 34)"/>',
    nose: '<ellipse cx="32" cy="41" rx="3" ry="2" fill="#3b3b44"/>',
    eyes: [[23, 34], [41, 34]],
    eyeColor: '#ffffff',
    eyeShine: '#3b3b44',
    eyeR: 2.4,
    mouthY: 44
  },
  frog: {
    name: 'فروغي',
    earL: '<circle cx="21" cy="20" r="9" fill="#8fd18a"/>',
    earR: '<circle cx="43" cy="20" r="9" fill="#8fd18a"/>',
    head: '<ellipse cx="32" cy="40" rx="25" ry="18" fill="#8fd18a"/><circle cx="21" cy="20" r="5.5" fill="#ffffff"/><circle cx="43" cy="20" r="5.5" fill="#ffffff"/>',
    nose: '<circle cx="29" cy="35" r="0.9" fill="#4d8a4a"/><circle cx="35" cy="35" r="0.9" fill="#4d8a4a"/>',
    eyes: [[21, 20], [43, 20]],
    cheeks: [[15, 42], [49, 42]],
    mouthY: 42
  },
  penguin: {
    name: 'بينقو',
    earL: '<path d="M30 15 Q32 6 36 13" stroke="#3d4a5c" stroke-width="3" fill="none" stroke-linecap="round"/>',
    earR: '',
    head: '<circle cx="32" cy="36" r="22" fill="#3d4a5c"/><path d="M32 24 C22 16 13 30 16 42 C19 54 45 54 48 42 C51 30 42 16 32 24 Z" fill="#ffffff"/>',
    nose: '<path d="M28.5 40 L35.5 40 L32 44.5 Z" fill="#ffb13d"/>',
    eyes: [[25, 35], [39, 35]],
    mouthY: 47
  }
};
const ANIMAL_KEYS = Object.keys(ANIMALS);

function animalSvg(kind, opts = {}) {
  const a = ANIMALS[kind] || ANIMALS.cat;
  const mood = opts.mood || 'happy';
  const [[lx, ly], [rx, ry]] = a.eyes;
  const eyeR = a.eyeR || 3.2;
  const eyeColor = a.eyeColor || '#2d3436';
  const shine = a.eyeShine || '#ffffff';
  const my = a.mouthY;
  const ink = '#3b2d35';

  const eye = (x, y) => `<circle cx="${x}" cy="${y}" r="${eyeR}" fill="${eyeColor}"/><circle cx="${x + 1}" cy="${y - 1}" r="${eyeR / 3}" fill="${shine}"/>`;

  let mouth;
  if (mood === 'happy') mouth = `<path d="M28 ${my} Q32 ${my + 4} 36 ${my}"/>`;
  else if (mood === 'neutral') mouth = `<path d="M29 ${my + 1.5} L35 ${my + 1.5}"/>`;
  else mouth = `<path d="M28 ${my + 3} Q32 ${my - 1} 36 ${my + 3}"/>`;

  const brows = mood === 'angry'
    ? `<path d="M${lx - 5} ${ly - 7} L${lx + 3} ${ly - 4.5} M${rx + 5} ${ry - 7} L${rx - 3} ${ry - 4.5}"/>`
    : '';

  const [[clx, cly], [crx, cry]] = a.cheeks || [[lx - 5, ly + 7], [rx + 5, ry + 7]];
  const cheekColor = mood === 'angry' ? '#ff4757' : '#ff7597';
  const cheeks = `<ellipse cx="${clx}" cy="${cly}" rx="3.5" ry="2" fill="${cheekColor}" opacity="${mood === 'angry' ? 0.7 : 0.45}"/><ellipse cx="${crx}" cy="${cry}" rx="3.5" ry="2" fill="${cheekColor}" opacity="${mood === 'angry' ? 0.7 : 0.45}"/>`;

  const crown = opts.vip
    ? '<path class="a-crown" d="M23 9 L26 2 L32 7 L38 2 L41 9 Z" fill="#ffc83d" stroke="#e0a100" stroke-width="1" stroke-linejoin="round"/>'
    : '';

  const delay = (-(Math.random() * 3)).toFixed(2);
  return `<svg class="animal mood-${mood}" viewBox="0 0 64 64" style="--d:${delay}s" aria-hidden="true">` +
    `<g class="a-body">` +
    `<g class="a-ear-l">${a.earL}</g><g class="a-ear-r">${a.earR}</g>` +
    a.head +
    `<g class="a-eyes">${eye(lx, ly)}${eye(rx, ry)}</g>` +
    a.nose + cheeks +
    `<g fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round">${brows}${mouth}</g>` +
    crown +
    `</g></svg>`;
}

// يعرض حيواناً إذا كان المفتاح معروفاً، وإلا يعرض النص (إيموجي) بأمان
function avatarHtml(value, opts) {
  return ANIMALS[value] ? animalSvg(value, opts) : escapeHtml(value || '✨');
}

// ==========================================
// 3. الأجهزة، التطويرات، الوصفات والمكونات
// ==========================================
// كل جهاز له "فعل" لا يمكن الحصول على ناتجه إلا بتشغيل الجهاز نفسه
const SHOP_MACHINES = {
  espresso_machine: {
    id: 'espresso_machine', name: 'آلة الإسبريسو', price: 100, icon: '☕', usefulFrom: 2,
    desc: 'الطريقة الوحيدة لاستخلاص القهوة: سبانش لاتيه وكورتادو',
    stations: ['drinks'],
    action: { label: 'استخلاص إسبريسو', adds: 'coffee', time: 2000, needsCup: true }
  },
  boba_brewer: {
    id: 'boba_brewer', name: 'آلة تخمير الشاي', price: 150, icon: '🫖', usefulFrom: 3,
    desc: 'تخمّر الشاي المثلج لشاي الخوخ بالبوبا',
    stations: ['drinks'],
    action: { label: 'تخمير شاي', adds: 'tea', time: 2200, needsCup: true }
  },
  blender: {
    id: 'blender', name: 'خلاط العصائر', price: 120, icon: '🌀', usefulFrom: 3,
    desc: 'يخلط سموذي المانجو والميلك شيك',
    stations: ['drinks'],
    action: { label: 'خلط بالخلاط', adds: 'blended', time: 1800, needsCup: true }
  },
  pastry_oven: {
    id: 'pastry_oven', name: 'الفرن الاحترافي', price: 200, icon: '🍪', usefulFrom: 4,
    desc: 'الوحيد اللي يخبز الكوكيز والوافل، وأسرع من الفرن العادي',
    stations: ['bakery'],
    action: { label: 'خبز احترافي', adds: 'baked', time: 1500, needsBase: true }
  },
  ice_cream_maker: {
    id: 'ice_cream_maker', name: 'آلة الآيس كريم', price: 250, icon: '🍦', usefulFrom: 5,
    desc: 'تصنع كرات الآيس كريم للوافل والماتشا والميلك شيك',
    stations: ['bakery', 'drinks'],
    action: { label: 'صنع آيس كريم', adds: 'icecream_scoop', time: 2500 }
  }
};

// الفرن العادي متوفر دائماً لكنه أبطأ ولا يخبز الكوكيز والوافل
const BASIC_OVEN = {
  id: 'basic_oven', name: 'الفرن العادي', icon: '🔥',
  stations: ['bakery'],
  action: { label: 'خبز', adds: 'baked', time: 2600, needsBase: true }
};
const PRO_ONLY_BASES = ['cookie_base', 'waffle_base'];
const BAKERY_BASES = ['donut_base', 'cake_base', 'pancake_base', 'cookie_base', 'waffle_base'];

const UPGRADES = {
  comfy: { id: 'comfy', name: 'كنب مريح', icon: '🛋️', desc: 'صبر الزبائن +15% لكل مستوى', prices: [80, 160, 260] },
  tips: { id: 'tips', name: 'حصالة البقشيش', icon: '🐷', desc: '+5 🪙 بقشيش إضافي مع كل طلب لكل مستوى', prices: [60, 130, 220] },
  speed: { id: 'speed', name: 'أدوات سريعة', icon: '⚡', desc: 'الآلات والأفران أسرع 20% لكل مستوى', prices: [70, 150, 250] },
  decor: { id: 'decor', name: 'ديكور كيوت', icon: '🌷', desc: '+15% نقاط على كل طلب لكل مستوى', prices: [90, 180, 300] }
};
const UPGRADE_MAX = 3;

const RECIPES = [
  // اللفل 1
  { id: 'matcha_boba', name: 'ماتشا مثلجة بالبوبا', type: 'drink', icon: '🧋', minLevel: 1, required: ['cup', 'ice', 'matcha', 'milk', 'boba'] },
  { id: 'strawberry_milk', name: 'حليب الفراولة بالكريمة', type: 'drink', icon: '🍓', minLevel: 1, required: ['cup', 'ice', 'strawberry', 'milk', 'cream'] },
  { id: 'pink_donut', name: 'دونات وردية بالسبرنكلز', type: 'bakery', icon: '🍩', minLevel: 1, required: ['donut_base', 'baked', 'pink_glaze', 'sprinkles'] },

  // اللفل 2
  { id: 'spanish_latte', name: 'سبانش كولد لاتيه', type: 'drink', icon: '☕', minLevel: 2, required: ['cup', 'ice', 'coffee', 'milk', 'caramel'] },
  { id: 'strawberry_cake', name: 'كيكة الفراولة السحابية', type: 'bakery', icon: '🍰', minLevel: 2, required: ['cake_base', 'baked', 'cream', 'strawberry'] },

  // اللفل 3
  { id: 'peach_tea', name: 'شاي خوخ منعش بالبوبا', type: 'drink', icon: '🍑', minLevel: 3, required: ['cup', 'ice', 'tea', 'peach', 'boba'] },
  { id: 'honey_pancake', name: 'بان كيك العسل والزبدة', type: 'bakery', icon: '🥞', minLevel: 3, required: ['pancake_base', 'baked', 'butter', 'honey'] },
  { id: 'mango_smoothie', name: 'سموذي المانجو', type: 'drink', icon: '🥭', minLevel: 3, required: ['cup', 'ice', 'mango', 'milk', 'blended'] },

  // اللفل 4
  { id: 'cortado', name: 'كورتادو دافئ', type: 'drink', icon: '☕', minLevel: 4, required: ['cup', 'coffee', 'milk'] },
  { id: 'iced_choco', name: 'آيس شوكولاتة مارشميلو', type: 'drink', icon: '🍫', minLevel: 4, required: ['cup', 'ice', 'choco', 'milk', 'marshmallow'] },
  { id: 'choc_cookie', name: 'كوكيز الشوكولاتة', type: 'bakery', icon: '🍪', minLevel: 4, required: ['cookie_base', 'baked', 'choco_chips'] },

  // اللفل 5
  { id: 'waffle_delight', name: 'وافل الكراميل والآيس كريم', type: 'bakery', icon: '🧇', minLevel: 5, required: ['waffle_base', 'baked', 'icecream_scoop', 'caramel'] },
  { id: 'matcha_icecream', name: 'آيس كريم الماتشا الملكي', type: 'bakery', icon: '🍨', minLevel: 5, required: ['matcha', 'icecream_scoop', 'sprinkles'] },
  { id: 'lemon_mojito', name: 'موهيتو الليمون والنعناع', type: 'drink', icon: '🍹', minLevel: 5, required: ['cup', 'ice', 'lemon', 'mint', 'soda'] },
  { id: 'strawberry_shake', name: 'ميلك شيك الفراولة', type: 'drink', icon: '🥤', minLevel: 5, required: ['cup', 'strawberry', 'milk', 'icecream_scoop', 'blended'] }
];

// machine: المكون لا يُصنع إلا بتشغيل هذا الجهاز (لا يظهر ككرت عادي)
const INGREDIENT_NAMES = {
  cup: { name: 'كوب', icon: '🥛', minLevel: 1 },
  ice: { name: 'ثلج', icon: '🧊', minLevel: 1 },
  matcha: { name: 'ماتشا', icon: '🍵', minLevel: 1 },
  strawberry: { name: 'فراولة', icon: '🍓', minLevel: 1 },
  milk: { name: 'حليب', icon: '🥛', minLevel: 1 },
  boba: { name: 'بوبا', icon: '⚫', minLevel: 1 },
  cream: { name: 'كريمة', icon: '🍦', minLevel: 1 },
  donut_base: { name: 'عجينة دونات', icon: '🍩', minLevel: 1 },
  pink_glaze: { name: 'تغطية وردية', icon: '🌸', minLevel: 1 },
  sprinkles: { name: 'سبرنكلز', icon: '✨', minLevel: 1 },
  baked: { name: 'مخبوز بالفرن', icon: '🔥', minLevel: 1, machineMade: true },

  coffee: { name: 'إسبريسو', icon: '☕', minLevel: 2, machine: 'espresso_machine' },
  caramel: { name: 'كراميل', icon: '🍯', minLevel: 2 },
  cake_base: { name: 'طبقات كيك', icon: '🍰', minLevel: 2 },

  tea: { name: 'شاي مخمّر', icon: '🫖', minLevel: 3, machine: 'boba_brewer' },
  peach: { name: 'خوخ', icon: '🍑', minLevel: 3 },
  mango: { name: 'مانجو', icon: '🥭', minLevel: 3 },
  blended: { name: 'مخلوط بالخلاط', icon: '🌀', minLevel: 3, machine: 'blender' },
  pancake_base: { name: 'خليط بانكيك', icon: '🥞', minLevel: 3 },
  butter: { name: 'زبدة', icon: '🧈', minLevel: 3 },
  honey: { name: 'عسل', icon: '🍯', minLevel: 3 },

  choco: { name: 'شوكولاتة', icon: '🍫', minLevel: 4 },
  marshmallow: { name: 'مارشميلو', icon: '☁️', minLevel: 4 },
  cookie_base: { name: 'عجينة كوكيز', icon: '🍪', minLevel: 4, machine: 'pastry_oven' },
  choco_chips: { name: 'قطع شوكولاتة', icon: '🍫', minLevel: 4 },

  waffle_base: { name: 'عجينة وافل', icon: '🧇', minLevel: 5, machine: 'pastry_oven' },
  icecream_scoop: { name: 'آيس كريم', icon: '🍨', minLevel: 5, machine: 'ice_cream_maker' },
  lemon: { name: 'ليمون', icon: '🍋', minLevel: 5 },
  mint: { name: 'نعناع', icon: '🌿', minLevel: 5 },
  soda: { name: 'صودا', icon: '🫧', minLevel: 5 }
};

// المكونات اليدوية في كل محطة (نواتج الآلات تأتي من أزرار الآلات فقط)
const DRINK_CARDS = ['cup', 'ice', 'matcha', 'strawberry', 'milk', 'boba', 'cream', 'caramel', 'peach', 'mango', 'choco', 'marshmallow', 'lemon', 'mint', 'soda'];
const BAKERY_CARDS = ['donut_base', 'pink_glaze', 'sprinkles', 'cake_base', 'cream', 'strawberry', 'pancake_base', 'butter', 'honey', 'cookie_base', 'choco_chips', 'waffle_base', 'matcha', 'caramel'];

const SHIFT_SECONDS = 180;
const LEVEL_UP_BONUS_SECONDS = 20;
const COMBO_WINDOW_MS = 15000;
const MAX_COMBO = 5;

// ==========================================
// 4. حالة اللعبة المحلية والشبكية
// ==========================================
function freshUpgrades() {
  return { comfy: 0, tips: 0, speed: 0, decor: 0 };
}

const state = {
  mode: 'solo',
  roomCode: '',
  isHost: false,

  player: {
    name: 'باريستا بوكي',
    avatar: 'cat'
  },
  players: [],

  level: 1,
  levelTargetScore: 200,
  shiftActive: false,
  shiftInterval: null,
  orderInterval: null,
  secondOrderTimeout: null,
  timeLeft: SHIFT_SECONDS,

  score: 0,
  coins: 0,
  servedCount: 0,
  missedCount: 0,
  vipServed: 0,
  combo: 0,
  bestCombo: 0,
  lastServeAt: 0,

  ownedMachines: [],
  upgrades: freshUpgrades(),

  orders: [],
  sharedItems: [],

  currentDrink: { ingredients: [] },
  currentBakery: { ingredients: [] },
  busyMachines: {}, // محلي لكل لاعبة: الآلة اللي شغالة الحين

  selectedStation: 'drinks',
  shopTab: 'machines',

  leaderboard: loadLeaderboard()
};

function loadLeaderboard() {
  try {
    const data = JSON.parse(localStorage.getItem('pookie_leaderboard') || '[]');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

// حماية من حقن HTML: كل نص قادم من الشبكة أو من المستخدم يمر من هنا قبل innerHTML
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeRoomCode(code) {
  return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

function sanitizeAvatar(key) {
  return ANIMALS[key] ? key : 'cat';
}

function isIngredientUnlocked(key) {
  const meta = INGREDIENT_NAMES[key];
  if (!meta) return false;
  if (state.level < (meta.minLevel || 1)) return false;
  if (meta.machine && !state.ownedMachines.includes(meta.machine)) return false;
  return true;
}

// مطابقة دقيقة: نفس المكونات بالضبط بدون زيادة أو نقصان
function findExactRecipe(type, ingredients) {
  return RECIPES.find(r =>
    r.type === type &&
    r.required.length === ingredients.length &&
    r.required.every(req => ingredients.includes(req))
  );
}

function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function moodFor(order) {
  const pct = order.patience / order.maxPatience;
  if (pct > 0.6) return 'happy';
  if (pct > 0.3) return 'neutral';
  return 'angry';
}

// ==========================================
// 5. عناصر واجهة المستخدم (DOM Elements)
// ==========================================
let screens, statsBar, playerNameInput, roomWaitingBox, displayRoomCode, copyRoomLinkBtn, playersChipsContainer, startShiftBtn, ordersRack, sharedItemsContainer, currentItemVisual, stationHint, ingredientsGrid, toastShout, toggleMusicBtn;

function initDOMReferences() {
  screens = {
    lobby: document.getElementById('lobbyScreen'),
    game: document.getElementById('gameScreen'),
    results: document.getElementById('resultsScreen')
  };
  statsBar = document.getElementById('gameStatsBar');
  playerNameInput = document.getElementById('playerNameInput');
  roomWaitingBox = document.getElementById('roomWaitingBox');
  displayRoomCode = document.getElementById('displayRoomCode');
  copyRoomLinkBtn = document.getElementById('copyRoomLinkBtn');
  playersChipsContainer = document.getElementById('playersChipsContainer');
  startShiftBtn = document.getElementById('startShiftBtn');
  ordersRack = document.getElementById('ordersRack');
  sharedItemsContainer = document.getElementById('sharedItemsContainer');
  currentItemVisual = document.getElementById('currentItemVisual');
  stationHint = document.getElementById('stationHint');
  ingredientsGrid = document.getElementById('ingredientsGrid');
  toastShout = document.getElementById('toastShout');
  toggleMusicBtn = document.getElementById('toggleMusicBtn');
}

// ==========================================
// 6. التهيئة والأحداث (Init & Setup)
// ==========================================
function initApp() {
  initDOMReferences();
  setupAvatarChoiceElements();
  setupHeroAnimals();

  playerNameInput.addEventListener('input', (e) => {
    state.player.name = e.target.value.trim() || 'باريستا بوكي';
  });

  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = sanitizeRoomCode(urlParams.get('room'));
  if (roomParam) {
    const inputField = document.getElementById('joinRoomCodeInput');
    if (inputField) inputField.value = roomParam;
    showToast(`تم تعبئة كود الغرفة تلقائياً: ${roomParam} 💖`);
  }

  toggleMusicBtn.addEventListener('click', () => {
    const isPlaying = audio.toggleMusic();
    toggleMusicBtn.textContent = isPlaying ? '🎵' : '🔇';
    showToast(isPlaying ? 'تم تشغيل الموسيقى 🎶' : 'تم كتم الموسيقى 🔇');
  });

  document.getElementById('createRoomBtn').addEventListener('click', handleCreateRoom);
  document.getElementById('joinRoomBtn').addEventListener('click', handleJoinRoom);
  document.getElementById('soloPlayBtn').addEventListener('click', handleSoloPlay);
  startShiftBtn.addEventListener('click', startShift);

  setupLeaderboardUI();
  setupStopShiftButton();

  const playAgain = document.getElementById('playAgainBtn');
  if (playAgain) {
    playAgain.addEventListener('click', () => {
      showScreen('lobby');
      if (statsBar) statsBar.style.display = 'none';
      renderLeaderboard();
    });
  }

  if (copyRoomLinkBtn) copyRoomLinkBtn.addEventListener('click', copyDirectLink);

  document.querySelectorAll('.station-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => selectStation(btn.dataset.station));
  });

  document.querySelectorAll('.shout-btn').forEach(btn => {
    btn.addEventListener('click', () => sendShout(btn.dataset.shout));
  });

  renderLeaderboard();
}

function selectStation(station) {
  audio.playPop();
  document.querySelectorAll('.station-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.station === station);
  });
  state.selectedStation = station;
  renderStationView();
}

function setupAvatarChoiceElements() {
  const container = document.querySelector('.avatars-row');
  if (!container) return;
  container.innerHTML = '';

  ANIMAL_KEYS.forEach(key => {
    const div = document.createElement('button');
    div.type = 'button';
    div.className = `avatar-choice ${key === state.player.avatar ? 'selected' : ''}`;
    div.title = ANIMALS[key].name;
    div.innerHTML = animalSvg(key);
    div.addEventListener('click', () => {
      audio.playPop();
      container.querySelectorAll('.avatar-choice').forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
      state.player.avatar = key;
    });
    container.appendChild(div);
  });
}

function setupHeroAnimals() {
  const hero = document.getElementById('lobbyHeroArt');
  if (!hero) return;
  hero.innerHTML = ['bunny', 'cat', 'bear'].map(k => `<span class="hero-animal">${animalSvg(k)}</span>`).join('');
}

function showScreen(name) {
  Object.keys(screens).forEach(key => {
    if (screens[key]) screens[key].classList.toggle('active', key === name);
  });
}

function showToast(text, avatar = '✨') {
  if (!toastShout) return;
  toastShout.innerHTML = `<span class="toast-avatar">${avatarHtml(avatar)}</span> <span>${escapeHtml(text)}</span>`;
  toastShout.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastShout.classList.remove('show');
  }, 2400);
}

// ==========================================
// 7. شبكة الاتصال
// ==========================================
class CuteNetwork {
  constructor() {
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    this.roomCode = '';
    this.channel = null;
    this.mqttClient = null;
    this.seenMsgIds = new Set();
    this.isMqttConnected = false;
    this.onMessageCallback = null;
  }

  connect(roomCode, onMessage) {
    this.roomCode = roomCode.toUpperCase();
    this.onMessageCallback = onMessage;

    if (typeof BroadcastChannel !== 'undefined') {
      if (this.channel) {
        try { this.channel.close(); } catch(e){}
      }
      this.channel = new BroadcastChannel('pookie_cafe_' + this.roomCode);
      this.channel.onmessage = (e) => {
        this.receivePacket(e.data);
      };
    }

    if (window.mqtt) {
      if (this.mqttClient) {
        try { this.mqttClient.end(true); } catch(e){}
      }
      try {
        const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';
        this.mqttClient = mqtt.connect(brokerUrl, {
          clientId: this.clientId + '_' + Math.floor(Math.random() * 1000),
          clean: true,
          connectTimeout: 8000,
          keepalive: 60
        });

        this.mqttClient.on('connect', () => {
          this.isMqttConnected = true;
          this.mqttClient.subscribe(`pookie/cafe/${this.roomCode}/#`);
        });

        this.mqttClient.on('message', (topic, payload) => {
          try {
            const data = JSON.parse(payload.toString());
            this.receivePacket(data);
          } catch(e) {}
        });
      } catch (e) {}
    }
  }

  disconnect() {
    if (this.channel) {
      try { this.channel.close(); } catch(e) {}
      this.channel = null;
    }
    if (this.mqttClient) {
      try { this.mqttClient.end(true); } catch(e) {}
      this.mqttClient = null;
    }
    this.isMqttConnected = false;
    this.roomCode = '';
  }

  receivePacket(packet) {
    if (!packet || typeof packet !== 'object') return;
    if (packet.senderClientId === this.clientId) return;

    if (packet.msgId) {
      if (this.seenMsgIds.has(packet.msgId)) return;
      this.seenMsgIds.add(packet.msgId);
      if (this.seenMsgIds.size > 200) {
        const first = this.seenMsgIds.values().next().value;
        this.seenMsgIds.delete(first);
      }
    }

    if (this.onMessageCallback) {
      try {
        this.onMessageCallback(packet);
      } catch (e) {
        console.warn('Ignoring malformed packet', e);
      }
    }
  }

  send(data) {
    const packet = {
      ...data,
      msgId: this.clientId + '_' + Date.now() + '_' + Math.floor(Math.random()*10000),
      senderClientId: this.clientId
    };
    this.seenMsgIds.add(packet.msgId);

    if (this.channel) {
      try { this.channel.postMessage(packet); } catch(e) {}
    }

    if (this.mqttClient && this.isMqttConnected) {
      try {
        this.mqttClient.publish(`pookie/cafe/${this.roomCode}/events`, JSON.stringify(packet));
      } catch(e) {}
    }
  }
}

const net = new CuteNetwork();

function generateRoomCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
}

function handleCreateRoom() {
  audio.playPop();
  const room = generateRoomCode();
  state.roomCode = room;
  state.isHost = true;
  state.mode = 'host';
  state.players = [{ id: net.clientId, name: state.player.name, avatar: state.player.avatar, isHost: true }];

  net.connect(room, handleIncomingData);

  displayRoomCode.textContent = room;
  roomWaitingBox.style.display = 'block';
  startShiftBtn.style.display = 'inline-flex';

  const joinWrap = document.getElementById('joinRoomInputWrap');
  if (joinWrap) joinWrap.style.display = 'none';
  document.getElementById('createRoomBtn').style.display = 'none';

  renderPlayersChips(true);
  showToast('تم فتح الغرفة بنجاح! شاركي الكود مع صديقاتك 🎀');
}

function handleJoinRoom() {
  audio.playPop();
  const codeInput = document.getElementById('joinRoomCodeInput');
  const code = sanitizeRoomCode(codeInput ? codeInput.value.trim() : '');
  if (!code) {
    showToast('الرجاء إدخال كود الغرفة أولاً 🌸');
    return;
  }

  state.roomCode = code;
  state.isHost = false;
  state.mode = 'client';
  state.players = [{ id: net.clientId, name: state.player.name, avatar: state.player.avatar, isHost: false }];

  net.connect(code, handleIncomingData);

  displayRoomCode.textContent = code;
  roomWaitingBox.style.display = 'block';
  startShiftBtn.style.display = 'none';

  const joinWrap = document.getElementById('joinRoomInputWrap');
  if (joinWrap) joinWrap.style.display = 'none';
  document.getElementById('createRoomBtn').style.display = 'none';

  renderPlayersChips(true);
  showToast('جاري الاتصال بالكافيه... ☕✨');

  const sendJoin = () => {
    net.send({
      type: 'JOIN_REQUEST',
      player: {
        id: net.clientId,
        name: state.player.name,
        avatar: state.player.avatar,
        isHost: false
      }
    });
  };

  setTimeout(sendJoin, 200);
  setTimeout(sendJoin, 1000);
}

function handleSoloPlay() {
  audio.playPop();
  net.disconnect(); // اللعب الفردي لا يرسل أي شيء لغرفة سابقة
  state.mode = 'solo';
  state.roomCode = '';
  state.isHost = true;
  state.players = [{ id: 'solo', name: state.player.name, avatar: state.player.avatar, isHost: true }];
  startShift();
}

function broadcastState() {
  if (!state.isHost) return;
  net.send({
    type: 'SYNC_STATE',
    players: state.players,
    orders: state.orders,
    sharedItems: state.sharedItems,
    score: state.score,
    coins: state.coins,
    level: state.level,
    levelTargetScore: state.levelTargetScore,
    servedCount: state.servedCount,
    missedCount: state.missedCount,
    vipServed: state.vipServed,
    combo: state.combo,
    bestCombo: state.bestCombo,
    timeLeft: state.timeLeft,
    ownedMachines: state.ownedMachines,
    upgrades: state.upgrades,
    shiftActive: state.shiftActive
  });
}

function sanitizeUpgrades(data) {
  const out = freshUpgrades();
  if (data && typeof data === 'object') {
    Object.keys(out).forEach(k => {
      out[k] = Math.min(UPGRADE_MAX, Math.max(0, Number(data[k]) || 0));
    });
  }
  return out;
}

function handleIncomingData(data) {
  if (data.type === 'JOIN_REQUEST') {
    if (state.isHost && data.player && data.player.id) {
      const exists = state.players.some(p => p.id === data.player.id);
      if (!exists) {
        const player = {
          id: String(data.player.id),
          name: String(data.player.name || 'باريستا').slice(0, 15),
          avatar: sanitizeAvatar(data.player.avatar),
          isHost: false
        };
        state.players.push(player);
        audio.playDing();
        showToast(`انضمت ${player.name} إلى الكافيه! 💖`, player.avatar);
        renderPlayersChips();
      }
      broadcastState();
    }
  } else if (data.type === 'SYNC_STATE') {
    // المضيف هو مصدر الحقيقة؛ لا يقبل مزامنة من غيره
    if (state.isHost) return;

    const prevLevel = state.level;
    const startingShift = data.shiftActive && !state.shiftActive;

    state.players = Array.isArray(data.players) ? data.players : state.players;
    state.orders = Array.isArray(data.orders) ? data.orders : [];
    state.sharedItems = Array.isArray(data.sharedItems) ? data.sharedItems : [];
    state.score = Number(data.score) || 0;
    state.coins = Number(data.coins) || 0;
    state.servedCount = Number(data.servedCount) || 0;
    state.missedCount = Number(data.missedCount) || 0;
    state.vipServed = Number(data.vipServed) || 0;
    state.combo = Number(data.combo) || 0;
    state.bestCombo = Number(data.bestCombo) || 0;
    state.timeLeft = Number(data.timeLeft) || 0;
    state.levelTargetScore = Number(data.levelTargetScore) || state.levelTargetScore;
    state.ownedMachines = Array.isArray(data.ownedMachines) ? data.ownedMachines.filter(id => SHOP_MACHINES[id]) : [];
    state.upgrades = sanitizeUpgrades(data.upgrades);
    state.level = Number(data.level) || 1;

    if (!startingShift && state.level > prevLevel) {
      showToast(`🎉 انتقل الجميع إلى اللفل ${state.level}!`, '🌟');
      audio.playFanfare();
    }

    if (startingShift) {
      state.currentDrink = { ingredients: [] };
      state.currentBakery = { ingredients: [] };
      state.busyMachines = {};
      state.shiftActive = true;
      launchGameView();
    } else if (!data.shiftActive && state.shiftActive) {
      endShiftLocally();
      return;
    }

    renderOrders();
    renderSharedItems();
    updateStatsDisplay();
    renderPlayersChips();
    renderStationIfChanged();
  } else if (data.type === 'SHOUT') {
    audio.playAlert();
    showToast(data.message, sanitizeAvatar(data.avatar));
  } else if (data.type === 'ADD_SHARED_ITEM') {
    const item = data.item;
    if (item && item.id && !state.sharedItems.some(i => i.id === item.id)) {
      state.sharedItems.push(item);
      audio.playDing();
      showToast(`وضعت ${data.senderName} ${item.name} على طاولة التجهيز!`, '✨');
      renderSharedItems();
      renderOrders();
      if (state.isHost) broadcastState();
    }
  } else if (data.type === 'SERVE_ORDER') {
    handleServeOrder(data.orderId, data.itemId, data.senderName);
  } else if (data.type === 'DISCARD_SHARED_ITEM') {
    const idx = state.sharedItems.findIndex(i => i.id === data.itemId);
    if (idx !== -1) {
      state.sharedItems.splice(idx, 1);
      renderSharedItems();
      renderOrders();
      if (state.isHost) broadcastState();
    }
  } else if (data.type === 'BUY') {
    handleRemotePurchase(data);
  } else if (data.type === 'END_SHIFT') {
    if (state.shiftActive) endShiftLocally();
  }
}

function sendShout(msg) {
  audio.playPop();
  const text = `${state.player.name}: ${msg}`;
  showToast(text, state.player.avatar);
  net.send({
    type: 'SHOUT',
    message: text,
    avatar: state.player.avatar
  });
}

function copyDirectLink() {
  audio.playPop();
  const directUrl = `${window.location.origin}${window.location.pathname}?room=${state.roomCode}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(directUrl).then(() => {
      showToast('تم نسخ الرابط المباشر! 📋✨');
    }).catch(() => {
      prompt('انسخي هذا الرابط وصلي لصديقاتك:', directUrl);
    });
  } else {
    prompt('انسخي هذا الرابط وصلي لصديقاتك:', directUrl);
  }
}

// لا نعيد رسم الشرائح إلا إذا تغيّرت القائمة، حتى لا تتكرر حركة الظهور كل ثانية
function renderPlayersChips(force) {
  if (!playersChipsContainer) return;
  const sig = JSON.stringify(state.players.map(p => [p.id, p.name, p.avatar, p.isHost]));
  if (!force && sig === renderPlayersChips.lastSig) return;
  renderPlayersChips.lastSig = sig;

  playersChipsContainer.innerHTML = '';
  state.players.forEach(p => {
    const chip = document.createElement('div');
    chip.className = `player-chip ${p.isHost ? 'is-host' : ''}`;
    chip.innerHTML = `<span class="avatar-slot chip-avatar">${avatarHtml(sanitizeAvatar(p.avatar))}</span> <span>${escapeHtml(p.name)}</span> ${p.isHost ? '👑' : ''}`;
    playersChipsContainer.appendChild(chip);
  });
}

// ==========================================
// 8. الشفت، المستويات وقائمة المتصدرين
// ==========================================
function setupStopShiftButton() {
  const headerControls = document.querySelector('.header-controls');
  if (headerControls && !document.getElementById('stopShiftBtn')) {
    const stopBtn = document.createElement('button');
    stopBtn.id = 'stopShiftBtn';
    stopBtn.className = 'stop-shift-btn';
    stopBtn.textContent = '⏹️ إنهاء الشيفت';
    stopBtn.addEventListener('click', stopShift);
    headerControls.prepend(stopBtn);
  }
}

function setupLeaderboardUI() {
  const lobbyCard = document.querySelector('.lobby-card');
  if (lobbyCard && !document.getElementById('leaderboardSection')) {
    const lbBox = document.createElement('div');
    lbBox.id = 'leaderboardSection';
    lbBox.className = 'leaderboard-box';
    lbBox.innerHTML = `
      <div class="leaderboard-title"><span>🏆</span> <span>لوحة المتصدرين (أفضل الباريستات)</span></div>
      <div id="leaderboardList" class="leaderboard-list"></div>
    `;
    lobbyCard.appendChild(lbBox);
  }
}

function renderLeaderboard() {
  const lbList = document.getElementById('leaderboardList');
  if (!lbList) return;

  lbList.innerHTML = '';
  if (state.leaderboard.length === 0) {
    lbList.innerHTML = '<div class="leaderboard-empty">لا توجد نتائج مسجلة بعد.. ابدأي أول شيفت لتتصَدّري! 🌸</div>';
    return;
  }

  const sorted = [...state.leaderboard].sort((a, b) => b.score - a.score).slice(0, 5);

  sorted.forEach((entry, idx) => {
    const row = document.createElement('div');
    row.className = 'leaderboard-row';
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

    row.innerHTML = `
      <div class="leaderboard-who">
        <span>${medal}</span>
        <span class="avatar-slot lb-avatar">${avatarHtml(sanitizeAvatar(entry.avatar))}</span>
        <span>${escapeHtml(entry.name)}</span>
      </div>
      <div class="leaderboard-score">
        ${Number(entry.score) || 0} نقطة <span>(لفل ${Number(entry.level) || 1})</span>
      </div>
    `;
    lbList.appendChild(row);
  });
}

function saveToLeaderboard() {
  if (state.score <= 0) return;

  state.players.forEach(p => {
    state.leaderboard.push({
      name: p.name,
      avatar: sanitizeAvatar(p.avatar),
      score: state.score,
      level: state.level,
      date: new Date().toLocaleDateString('ar-SA')
    });
  });

  state.leaderboard.sort((a, b) => b.score - a.score);
  state.leaderboard = state.leaderboard.slice(0, 20);
  try {
    localStorage.setItem('pookie_leaderboard', JSON.stringify(state.leaderboard));
  } catch (e) {}
}

// ينشئ مؤقت وصول الزبائن؛ يعاد استدعاؤه عند ارتفاع اللفل ليزداد الإيقاع
function scheduleOrderSpawner() {
  if (state.orderInterval) clearInterval(state.orderInterval);
  const spawnSpeed = Math.max(4500, 11000 - (state.level * 1300));
  state.orderInterval = setInterval(() => {
    if (state.orders.length < 5) {
      spawnCustomerOrder();
    }
  }, spawnSpeed);
}

function startShift() {
  audio.playDing();
  state.shiftActive = true;
  state.level = 1;
  state.levelTargetScore = 200;
  state.timeLeft = SHIFT_SECONDS;
  state.score = 0;
  state.coins = 50; // رصيد بداية ترحيبي للشراء
  state.servedCount = 0;
  state.missedCount = 0;
  state.vipServed = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.lastServeAt = 0;
  state.ownedMachines = [];
  state.upgrades = freshUpgrades();
  state.orders = [];
  state.sharedItems = [];
  state.currentDrink = { ingredients: [] };
  state.currentBakery = { ingredients: [] };
  state.busyMachines = {};

  launchGameView();

  const stopBtn = document.getElementById('stopShiftBtn');
  if (stopBtn) stopBtn.style.display = 'inline-flex';

  if (state.isHost) {
    if (state.orderInterval) clearInterval(state.orderInterval);
    if (state.shiftInterval) clearInterval(state.shiftInterval);
    if (state.secondOrderTimeout) clearTimeout(state.secondOrderTimeout);

    spawnCustomerOrder();
    state.secondOrderTimeout = setTimeout(() => {
      if (state.shiftActive) spawnCustomerOrder();
    }, 2500);

    scheduleOrderSpawner();

    state.shiftInterval = setInterval(() => {
      state.timeLeft--;
      updateCustomerPatience();
      checkLevelUpProgress();
      updateStatsDisplay();
      if (state.timeLeft <= 0) {
        finishShiftAsHost();
        return;
      }
      broadcastState();
    }, 1000);
  }
}

function finishShiftAsHost() {
  net.send({ type: 'END_SHIFT' });
  endShiftLocally();
  broadcastState();
}

function stopShift() {
  if (!confirm('هل أنتِ متأكدة من إنهاء الشيفت الآن وعرض النتائج؟ 🛑')) return;
  finishShiftAsHost();
}

function endShiftLocally() {
  const wasActive = state.shiftActive;
  state.shiftActive = false;
  if (state.orderInterval) clearInterval(state.orderInterval);
  if (state.shiftInterval) clearInterval(state.shiftInterval);
  if (state.secondOrderTimeout) clearTimeout(state.secondOrderTimeout);
  state.orderInterval = null;
  state.shiftInterval = null;
  state.secondOrderTimeout = null;
  state.busyMachines = {};

  if (wasActive) saveToLeaderboard();

  const stopBtn = document.getElementById('stopShiftBtn');
  if (stopBtn) stopBtn.style.display = 'none';

  audio.playFanfare();
  showScreen('results');

  document.getElementById('resultScore').textContent = state.score;
  document.getElementById('resultCoins').textContent = `${state.coins} 🪙`;
  document.getElementById('resultServed').textContent = state.servedCount;
  document.getElementById('resultMissed').textContent = state.missedCount;
  const comboElem = document.getElementById('resultCombo');
  if (comboElem) comboElem.textContent = `x${state.bestCombo}`;
  const vipElem = document.getElementById('resultVip');
  if (vipElem) vipElem.textContent = state.vipServed;
  const levelElem = document.getElementById('resultLevel');
  if (levelElem) levelElem.textContent = state.level;

  const starsElem = document.getElementById('resultStars');
  if (starsElem) {
    let stars = 1;
    if (state.servedCount > 0 && state.missedCount === 0) stars = 3;
    else if (state.servedCount > state.missedCount) stars = 2;
    starsElem.textContent = '⭐'.repeat(stars);
  }

  renderLeaderboard();
}

function checkLevelUpProgress() {
  // المضيف وحده يرفع اللفل، والبقية يستلمونه عبر المزامنة
  if (!state.isHost) return;
  if (state.score >= state.levelTargetScore) {
    state.level++;
    state.levelTargetScore += 250 + (state.level * 100);
    state.timeLeft += LEVEL_UP_BONUS_SECONDS;
    audio.playFanfare();

    const useful = Object.values(SHOP_MACHINES).filter(m => m.usefulFrom === state.level && !state.ownedMachines.includes(m.id));
    const hint = useful.length ? ` صار وقت ${useful.map(m => m.name).join(' و ')} بالشوب 🛍️` : '';
    showToast(`👑 اللفل ${state.level}! +${LEVEL_UP_BONUS_SECONDS} ثانية ووصفات جديدة!${hint}`, '🎉');
    if (state.shiftActive) scheduleOrderSpawner();
    renderStationView();
    broadcastState();
  }
}

function launchGameView() {
  showScreen('game');
  if (statsBar) statsBar.style.display = 'flex';
  renderStationView();
  renderOrders();
  renderSharedItems(true);
  updateStatsDisplay();
}

function spawnCustomerOrder() {
  // الوصفة تطلع فقط إذا كل مكوناتها مفتوحة (مثلاً الوافل يحتاج الفرن الاحترافي وآلة الآيس كريم)
  const availableRecipes = RECIPES.filter(r => r.minLevel <= state.level && r.required.every(isIngredientUnlocked));
  if (availableRecipes.length === 0) return;

  const recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  const kind = ANIMAL_KEYS[Math.floor(Math.random() * ANIMAL_KEYS.length)];
  const vip = state.level >= 2 && Math.random() < 0.15;

  let patience = Math.max(40, 85 - (state.level * 7));
  patience = Math.round(patience * (1 + 0.15 * state.upgrades.comfy) * (vip ? 0.75 : 1));

  const newOrder = {
    id: 'ord_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    customerName: ANIMALS[kind].name,
    customerKind: kind,
    vip,
    recipeId: recipe.id,
    maxPatience: patience,
    patience
  };
  state.orders.push(newOrder);
  audio.playDing();
  showToast(vip ? `زبون VIP وصل: ${newOrder.customerName}! مكافأته مضاعفة 👑` : `وصل زبون جديد: ${newOrder.customerName}!`, kind);
  renderOrders();
  broadcastState();
}

function updateCustomerPatience() {
  for (let i = state.orders.length - 1; i >= 0; i--) {
    state.orders[i].patience--;
    if (state.orders[i].patience <= 0) {
      const missed = state.orders.splice(i, 1)[0];
      state.missedCount++;
      state.combo = 0;
      state.score = Math.max(0, state.score - 20);
      showToast(`${missed.customerName} زعل وغادر! 💔`, missed.customerKind);
      audio.playAlert();
    }
  }
  renderOrders();
  renderStationIfChanged();
}

function updateStatsDisplay() {
  const scElem = document.getElementById('statScore');
  const cnElem = document.getElementById('statCoins');
  const lvElem = document.getElementById('statLevel');
  const tmElem = document.getElementById('statTimer');
  const cbElem = document.getElementById('statCombo');
  if (scElem) scElem.textContent = `${state.score} / ${state.levelTargetScore}`;
  if (cnElem) cnElem.textContent = `${state.coins} 🪙`;
  if (lvElem) lvElem.textContent = `${state.level} ⭐`;
  if (tmElem) {
    tmElem.textContent = formatTime(state.timeLeft);
    tmElem.classList.toggle('low', state.timeLeft <= 30);
  }
  if (cbElem) {
    cbElem.textContent = state.combo > 1 ? `x${state.combo} 🔥` : '—';
    cbElem.classList.toggle('hot', state.combo > 1);
  }
}

// ==========================================
// 9. تذاكر الزبائن وطاولة التجهيز
// ==========================================
function recipeById(id) {
  return RECIPES.find(r => r.id === id);
}

function recipeTagsHtml(recipe) {
  return recipe.required.map(k => {
    const info = INGREDIENT_NAMES[k] || { name: k, icon: '✨' };
    const machineMade = info.machine || info.machineMade;
    return `<span class="recipe-tag ${machineMade ? 'machine' : ''}">${info.icon} ${escapeHtml(info.name)}</span>`;
  }).join('');
}

function matchingItemFor(order) {
  return state.sharedItems.find(i => i.recipeId === order.recipeId);
}

// التذاكر تُنشأ مرة وحدة وتتحدث في مكانها، بدل مسحها وإعادة رسمها كل ثانية
function renderOrders() {
  if (!ordersRack) return;
  const ids = new Set(state.orders.map(o => o.id));
  [...ordersRack.children].forEach(el => {
    if (!el.dataset.orderId || !ids.has(el.dataset.orderId)) el.remove();
  });

  if (state.orders.length === 0) {
    ordersRack.innerHTML = '<div class="orders-empty">لا يوجد زبائن حالياً.. استراحة باريستا 🌸</div>';
    return;
  }

  state.orders.forEach(order => {
    const recipe = recipeById(order.recipeId);
    if (!recipe) return;
    let card = ordersRack.querySelector(`[data-order-id="${CSS.escape(order.id)}"]`);
    if (!card) {
      card = createOrderCard(order, recipe);
      ordersRack.appendChild(card);
    }
    updateOrderCard(card, order);
  });
}

function createOrderCard(order, recipe) {
  const card = document.createElement('div');
  card.className = `order-card ${order.vip ? 'vip' : ''}`;
  card.dataset.orderId = order.id;
  card.innerHTML = `
    <div class="order-customer">
      <span class="order-avatar avatar-slot"></span>
      <span class="order-name">${escapeHtml(order.customerName)}</span>
      ${order.vip ? '<span class="vip-badge">VIP ×2</span>' : ''}
    </div>
    <div class="patience-bar-bg"><div class="patience-bar-fill"></div></div>
    <div class="order-recipe">
      <div class="recipe-title">${recipe.icon} ${escapeHtml(recipe.name)}</div>
      <div class="recipe-tags">${recipeTagsHtml(recipe)}</div>
    </div>
    <button type="button" class="order-serve-btn">⏳ ننتظر التجهيز</button>
  `;
  card.querySelector('.order-serve-btn').addEventListener('click', () => {
    const current = state.orders.find(o => o.id === order.id);
    const item = current && matchingItemFor(current);
    if (item) directServeSharedItem(item, current);
  });
  return card;
}

function updateOrderCard(card, order) {
  const pct = Math.max(0, Math.min(100, (order.patience / order.maxPatience) * 100));
  const mood = moodFor(order);

  const fill = card.querySelector('.patience-bar-fill');
  fill.style.width = `${pct}%`;
  fill.dataset.level = mood;

  const avatarSlot = card.querySelector('.order-avatar');
  if (avatarSlot.dataset.mood !== mood) {
    avatarSlot.dataset.mood = mood;
    avatarSlot.innerHTML = avatarHtml(sanitizeAvatar(order.customerKind), { mood, vip: order.vip });
  }

  card.classList.toggle('urgent', mood === 'angry');

  const ready = !!matchingItemFor(order);
  card.classList.toggle('is-ready', ready);
  const btn = card.querySelector('.order-serve-btn');
  const label = ready ? '🛎️ تسليم الآن!' : '⏳ ننتظر التجهيز';
  if (btn.textContent !== label) btn.textContent = label;
  btn.disabled = !ready;
}

function renderSharedItems(force) {
  if (!sharedItemsContainer) return;
  const sig = state.sharedItems.map(i => i.id).join(',');
  if (!force && sig === renderSharedItems.lastSig) return;
  renderSharedItems.lastSig = sig;

  sharedItemsContainer.innerHTML = '';
  if (state.sharedItems.length === 0) {
    sharedItemsContainer.innerHTML = '<span class="shared-empty-hint">طاولة التجهيز فارغة. جهزي صنفاً وضعيه هنا! 🍰</span>';
    return;
  }

  state.sharedItems.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'shared-item-card';
    card.innerHTML = `
      <div class="shared-item-name"><span>${escapeHtml(item.icon)}</span> <span>${escapeHtml(item.name)}</span></div>
      <div class="shared-item-maker">(${escapeHtml(item.makerName)})</div>
      <div class="shared-item-actions">
        <button type="button" class="quick-serve-btn">🛎️ تقديم</button>
        <button type="button" class="trash-item-btn" title="رمي في السلة">🗑️</button>
      </div>
    `;
    card.querySelector('.quick-serve-btn').addEventListener('click', () => directServeSharedItem(item));
    card.querySelector('.trash-item-btn').addEventListener('click', () => discardSharedItem(item.id));
    sharedItemsContainer.appendChild(card);
  });
}

function discardSharedItem(itemId) {
  audio.playPop();
  const idx = state.sharedItems.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    const removed = state.sharedItems.splice(idx, 1)[0];
    showToast(`تم رمي (${removed.name}) في السلة! 🗑️`);
    renderSharedItems();
    renderOrders();
    net.send({ type: 'DISCARD_SHARED_ITEM', itemId });
    if (state.isHost) broadcastState();
  }
}

function directServeSharedItem(item, preferredOrder) {
  // نخدم الزبون الأقل صبراً أولاً إذا فيه أكثر من طلب لنفس الصنف
  const matchedOrder = preferredOrder || state.orders
    .filter(o => o.recipeId === item.recipeId)
    .sort((a, b) => (a.patience / a.maxPatience) - (b.patience / b.maxPatience))[0];
  if (!matchedOrder) {
    showToast(`هذا الصنف (${item.name}) لا يطابق أي طلب مفتوح حالياً!`);
    audio.playAlert();
    return;
  }

  handleServeOrder(matchedOrder.id, item.id, state.player.name);
  net.send({
    type: 'SERVE_ORDER',
    orderId: matchedOrder.id,
    itemId: item.id,
    senderName: state.player.name
  });
}

function handleServeOrder(orderId, itemId, senderName) {
  const orderIdx = state.orders.findIndex(o => o.id === orderId);
  const itemIdx = state.sharedItems.findIndex(i => i.id === itemId);
  if (orderIdx === -1 || itemIdx === -1) return;
  if (state.sharedItems[itemIdx].recipeId !== state.orders[orderIdx].recipeId) return;

  const order = state.orders.splice(orderIdx, 1)[0];
  state.sharedItems.splice(itemIdx, 1);

  const pct = Math.max(0, order.patience / order.maxPatience);
  const now = Date.now();
  state.combo = (now - state.lastServeAt <= COMBO_WINDOW_MS) ? Math.min(MAX_COMBO, state.combo + 1) : 1;
  state.lastServeAt = now;
  state.bestCombo = Math.max(state.bestCombo, state.combo);

  const vipMult = order.vip ? 2 : 1;
  const mult = (1 + 0.15 * state.upgrades.decor) * (1 + 0.1 * (state.combo - 1)) * vipMult;
  const points = Math.round((60 + 40 * pct) * mult);
  const tip = Math.round(10 * pct) + 5 * state.upgrades.tips;
  const earned = (25 + tip) * vipMult;

  state.score += points;
  state.coins += earned;
  state.servedCount++;
  if (order.vip) state.vipServed++;

  audio.playCash();
  const comboText = state.combo > 1 ? ` كومبو x${state.combo}!` : '';
  showToast(`سلّمت ${senderName} الطلب لـ ${order.customerName}! +${points} ⭐ +${earned} 🪙${comboText}`, order.customerKind);

  renderOrders();
  renderSharedItems();
  checkLevelUpProgress();
  updateStatsDisplay();
  renderStationIfChanged();
  broadcastState();
}

// ==========================================
// 10. محطات العمل والآلات
// ==========================================
function stationSignature() {
  const base = [state.selectedStation, state.level, state.ownedMachines.join(','), Object.values(state.upgrades).join(',')];
  if (state.selectedStation === 'serving') {
    base.push(state.orders.map(o => o.id).join(','), state.sharedItems.map(i => i.id).join(','));
  } else if (state.selectedStation === 'shop') {
    base.push(state.coins);
  }
  return base.join('|');
}

// يعيد رسم المحطة فقط إذا تغيّر ما تعرضه (حتى لا تضيع النقرات مع المزامنة كل ثانية)
function renderStationIfChanged() {
  if (stationSignature() !== renderStationView.lastSig) renderStationView();
}

function renderStationView() {
  if (!ingredientsGrid) return;
  renderStationView.lastSig = stationSignature();
  ingredientsGrid.innerHTML = '';
  ingredientsGrid.classList.toggle('shop-mode', state.selectedStation === 'shop');

  if (state.selectedStation === 'drinks') {
    renderCraftStation('drinks');
  } else if (state.selectedStation === 'bakery') {
    renderCraftStation('bakery');
  } else if (state.selectedStation === 'serving') {
    renderServingStation();
  } else if (state.selectedStation === 'shop') {
    renderShopStation();
  }
}

function craftTarget(station) {
  return station === 'drinks' ? state.currentDrink : state.currentBakery;
}

function renderCraftStation(station) {
  if (stationHint) {
    stationHint.textContent = station === 'drinks'
      ? `اللفل ${state.level} 🌟 القهوة والشاي والخلط تنصنع بالآلات فقط 🛍️`
      : 'اختاري القاعدة، أضيفي الإضافات، واخبزي بالفرن 🔥';
  }

  updateCraftVisual(station);
  renderMachinesBar(station);

  const cards = station === 'drinks' ? DRINK_CARDS : BAKERY_CARDS;
  cards.forEach(key => {
    const meta = INGREDIENT_NAMES[key];
    const minLvl = meta.minLevel || 1;
    const levelLocked = state.level < minLvl;
    const machineLocked = meta.machine && !state.ownedMachines.includes(meta.machine);

    let lockText = '';
    if (levelLocked) lockText = `🔒 لفل ${minLvl}`;
    else if (machineLocked) lockText = `🛒 ${SHOP_MACHINES[meta.machine].name}`;

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `ingredient-card ${lockText ? 'locked' : ''}`;
    card.innerHTML = `
      <span class="ing-icon">${meta.icon}</span>
      <span class="ing-name">${escapeHtml(meta.name)}</span>
      ${lockText ? `<span class="lock-badge">${escapeHtml(lockText)}</span>` : ''}
    `;

    card.addEventListener('click', () => {
      if (levelLocked) {
        showToast(`هذا المكون ينفتح في اللفل ${minLvl}! ⭐`);
        audio.playAlert();
        return;
      }
      if (machineLocked) {
        showToast(`تحتاجين (${SHOP_MACHINES[meta.machine].name}) من متجر الأجهزة! 🛍️`);
        audio.playAlert();
        return;
      }
      if (station === 'drinks') addDrinkIngredient(key);
      else addBakeryIngredient(key);
    });

    ingredientsGrid.appendChild(card);
  });
}

function machinesForStation(station) {
  const list = Object.values(SHOP_MACHINES).filter(m => m.stations.includes(station));
  return station === 'bakery' ? [BASIC_OVEN, ...list] : list;
}

function isMachineOwned(machine) {
  return machine.id === BASIC_OVEN.id || state.ownedMachines.includes(machine.id);
}

function machineDuration(machine) {
  return Math.round(machine.action.time * (1 - 0.2 * state.upgrades.speed));
}

function renderMachinesBar(station) {
  const bar = document.createElement('div');
  bar.className = 'machines-bar';

  machinesForStation(station).forEach(machine => {
    const owned = isMachineOwned(machine);
    const busy = state.busyMachines[machine.id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `machine-btn ${owned ? '' : 'locked'} ${busy ? 'busy' : ''}`;

    let progress = '';
    if (busy) {
      const elapsed = Date.now() - busy.start;
      progress = `<span class="machine-progress" style="animation-duration:${busy.duration}ms; animation-delay:-${elapsed}ms;"></span>`;
    }

    btn.innerHTML = `
      <span class="machine-icon">${machine.icon}</span>
      <span class="machine-text">
        <span class="machine-name">${escapeHtml(machine.name)}</span>
        <span class="machine-action">${owned ? (busy ? 'يشتغل...' : `${escapeHtml(machine.action.label)} • ${(machineDuration(machine) / 1000).toFixed(1)}ث`) : `🛒 ${machine.price} 🪙 من الشوب`}</span>
      </span>
      ${progress}
    `;

    btn.addEventListener('click', () => {
      if (!owned) {
        showToast(`(${machine.name}) موجودة في متجر الأجهزة 🛍️`);
        selectStation('shop');
        return;
      }
      runMachine(machine, station);
    });
    bar.appendChild(btn);
  });

  ingredientsGrid.appendChild(bar);
}

function machineCanRun(machine, target) {
  const ing = target.ingredients;
  const action = machine.action;
  if (ing.includes(action.adds)) return 'هذي الخطوة موجودة بالفعل!';
  if (action.needsCup && !ing.includes('cup')) return 'ضعي الكوب أولاً 🥛';
  if (action.needsBase) {
    const base = ing.find(b => BAKERY_BASES.includes(b));
    if (!base) return 'ضعي قاعدة الحلى أولاً 🧁';
    if (machine.id === BASIC_OVEN.id && PRO_ONLY_BASES.includes(base)) {
      return 'هذي العجينة ما تنخبز إلا بالفرن الاحترافي من الشوب 🍪';
    }
  }
  return null;
}

function runMachine(machine, station) {
  if (!state.shiftActive) return;
  if (state.busyMachines[machine.id]) {
    showToast(`${machine.name} مشغولة، انتظري شوي ⏳`);
    return;
  }

  const problem = machineCanRun(machine, craftTarget(station));
  if (problem) {
    showToast(problem);
    audio.playAlert();
    return;
  }

  const duration = machineDuration(machine);
  state.busyMachines[machine.id] = { start: Date.now(), duration, station };
  audio.playWhirr(duration);
  renderStationView();

  setTimeout(() => {
    delete state.busyMachines[machine.id];
    if (!state.shiftActive) return;

    const target = craftTarget(station);
    const late = machineCanRun(machine, target);
    if (late) {
      showToast(late);
    } else {
      target.ingredients.push(machine.action.adds);
      audio.playDing();
      const info = INGREDIENT_NAMES[machine.action.adds];
      showToast(`${machine.name}: ${info.name} جاهز! ${info.icon}`);
    }
    if (state.selectedStation === station) renderStationView();
  }, duration);
}

function addDrinkIngredient(key) {
  if (['ice', 'boba', 'marshmallow', 'lemon', 'mint'].includes(key)) audio.playPop();
  else audio.playPour();

  const ing = state.currentDrink.ingredients;
  if (key === 'cup' && ing.includes('cup')) {
    showToast('الكوب موجود بالفعل!');
    return;
  }
  if (key !== 'cup' && !ing.includes('cup')) {
    showToast('ضعي الكوب الفارغ أولاً 🥛');
    return;
  }
  if (!ing.includes(key)) {
    ing.push(key);
    updateCraftVisual('drinks');
  }
}

function addBakeryIngredient(key) {
  audio.playPop();
  const ing = state.currentBakery.ingredients;

  if (BAKERY_BASES.includes(key)) {
    if (ing.some(b => BAKERY_BASES.includes(b))) {
      showToast('القاعدة موجودة بالفعل على صينية التحضير!');
      return;
    }
  } else if (key !== 'matcha') {
    // الإضافات تحتاج قاعدة حلى أو كرة آيس كريم (لآيس كريم الماتشا)
    const hasBase = ing.some(b => BAKERY_BASES.includes(b) || b === 'icecream_scoop');
    if (!hasBase) {
      showToast('اختاري قاعدة الحلى أولاً (أو آيس كريم من الآلة) 🧁');
      return;
    }
  }

  if (!ing.includes(key)) {
    ing.push(key);
    updateCraftVisual('bakery');
  }
}

function previewIconFor(station, current) {
  if (station === 'drinks') {
    if (current.includes('blended')) return '🥤';
    if (current.includes('boba')) return '🧋';
    if (current.includes('coffee')) return '☕';
    if (current.includes('tea')) return '🫖';
    if (current.includes('matcha')) return '🍵';
    if (current.includes('strawberry')) return '🍓';
    if (current.includes('lemon')) return '🍹';
    if (current.includes('choco')) return '🍫';
    return '🥛';
  }
  if (current.includes('donut_base')) return '🍩';
  if (current.includes('cake_base')) return '🍰';
  if (current.includes('pancake_base')) return '🥞';
  if (current.includes('cookie_base')) return '🍪';
  if (current.includes('waffle_base')) return '🧇';
  if (current.includes('icecream_scoop')) return '🍨';
  return '🧁';
}

function updateCraftVisual(station) {
  if (!currentItemVisual) return;
  const target = craftTarget(station);
  const current = target.ingredients;

  if (current.length === 0) {
    currentItemVisual.innerHTML = station === 'drinks'
      ? `<span class="item-cup-preview empty">🥛</span><span class="workbench-hint">طاولة المشروبات فارغة. اضغطي على الكوب للبدء!</span>`
      : `<span class="item-cup-preview empty">🧁</span><span class="workbench-hint">طاولة الحلويات فارغة. اختاري قاعدة للبدء!</span>`;
    return;
  }

  const match = findExactRecipe(station === 'drinks' ? 'drink' : 'bakery', current);
  const badges = current.map(k => {
    const info = INGREDIENT_NAMES[k] || { name: k, icon: '✨' };
    return `<span class="ingredient-badge">${info.icon} ${escapeHtml(info.name)}</span>`;
  }).join('');

  currentItemVisual.innerHTML = `
    <span class="item-cup-preview">${previewIconFor(station, current)}</span>
    <div class="item-ingredients-tags">${badges}</div>
    <div class="match-hint ${match ? 'ok' : ''}">${match ? `✅ جاهز: ${escapeHtml(match.name)}` : 'الخلطة ما تطابق وصفة بعد..'}</div>
    <div class="workbench-actions">
      <button type="button" class="btn-primary small" id="placeItemBtn">✨ وضع على طاولة التجهيز</button>
      <button type="button" class="btn-clear small" id="clearItemBtn">🗑️ تفريغ</button>
    </div>
  `;

  document.getElementById('placeItemBtn').addEventListener('click', () => finishCraft(station));
  document.getElementById('clearItemBtn').addEventListener('click', () => {
    audio.playPop();
    target.ingredients = [];
    updateCraftVisual(station);
  });
}

function finishCraft(station) {
  const target = craftTarget(station);
  const matchedRecipe = findExactRecipe(station === 'drinks' ? 'drink' : 'bakery', target.ingredients);

  if (!matchedRecipe) {
    showToast(station === 'drinks' ? 'هذه الخلطة لا تطابق أي مشروب في القائمة! 🍵' : 'الوصفة ناقصة أو ما انخبزت بالفرن! 🍰');
    audio.playAlert();
    return;
  }

  const newItem = {
    id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    recipeId: matchedRecipe.id,
    name: matchedRecipe.name,
    icon: matchedRecipe.icon,
    makerName: state.player.name
  };

  state.sharedItems.push(newItem);
  audio.playDing();
  showToast(`تم تجهيز ${matchedRecipe.name}! ✨`);

  net.send({ type: 'ADD_SHARED_ITEM', item: newItem, senderName: state.player.name });

  target.ingredients = [];
  updateCraftVisual(station);
  renderSharedItems();
  renderOrders();
  if (state.isHost) broadcastState();
}

function renderServingStation() {
  if (stationHint) stationHint.textContent = 'شاشة التقديم: تسليم مباشر للزبائن بمجرد التجهيز!';

  if (currentItemVisual) {
    currentItemVisual.innerHTML = `
      <span class="workbench-big-icon">🛎️</span>
      <span class="workbench-title">تسليم الزبائن الفوري</span>
      <span class="workbench-hint">اضغطي زر التسليم تحت الطلب المطابق مباشرة!</span>
    `;
  }

  if (state.orders.length === 0) {
    ingredientsGrid.innerHTML = '<div class="grid-empty">لا توجد طلبات جارية الآن 🎉</div>';
    return;
  }

  state.orders.forEach(ord => {
    const recipe = recipeById(ord.recipeId);
    if (!recipe) return;
    const matchedItem = matchingItemFor(ord);

    const card = document.createElement('div');
    card.className = 'serve-card';
    card.innerHTML = `
      <div class="serve-card-icon">${recipe.icon}</div>
      <div class="serve-card-name">${escapeHtml(recipe.name)}</div>
      <div class="serve-card-customer">
        <span class="avatar-slot serve-avatar">${avatarHtml(sanitizeAvatar(ord.customerKind), { mood: moodFor(ord), vip: ord.vip })}</span>
        <span>${escapeHtml(ord.customerName)}</span>
      </div>
      <button type="button" class="serve-direct-btn" ${matchedItem ? '' : 'disabled'}>
        ${matchedItem ? '🛎️ تسليم الآن!' : '⏳ غير جاهز'}
      </button>
    `;

    if (matchedItem) {
      card.querySelector('.serve-direct-btn').addEventListener('click', () => directServeSharedItem(matchedItem, ord));
    }
    ingredientsGrid.appendChild(card);
  });
}

// ==========================================
// 11. متجر الأجهزة والتطويرات 🛍️
// ==========================================
function priceFor(kind, id) {
  if (kind === 'machine') {
    const m = SHOP_MACHINES[id];
    return m && !state.ownedMachines.includes(id) ? m.price : null;
  }
  const u = UPGRADES[id];
  if (!u) return null;
  const lvl = state.upgrades[id] || 0;
  return lvl < UPGRADE_MAX ? u.prices[lvl] : null;
}

function applyPurchase(kind, id) {
  if (kind === 'machine') state.ownedMachines.push(id);
  else state.upgrades[id] = (state.upgrades[id] || 0) + 1;
}

function purchaseName(kind, id) {
  return kind === 'machine' ? SHOP_MACHINES[id].name : `${UPGRADES[id].name} (مستوى ${state.upgrades[id]})`;
}

function buyItem(kind, id) {
  if (!state.shiftActive) return;
  const price = priceFor(kind, id);
  if (price === null) return;
  if (state.coins < price) {
    showToast(`النقود لا تكفي! تحتاجين ${price} 🪙 (رصيدكم: ${state.coins})`);
    audio.playAlert();
    return;
  }

  state.coins -= price;
  applyPurchase(kind, id);
  audio.playCash();
  showToast(`🎉 تم شراء ${purchaseName(kind, id)}!`, '🛍️');

  net.send({ type: 'BUY', kind, id, level: kind === 'upgrade' ? state.upgrades[id] : 1 });

  updateStatsDisplay();
  renderStationView();
  if (state.isHost) broadcastState();
}

function handleRemotePurchase(data) {
  const kind = data.kind === 'upgrade' ? 'upgrade' : 'machine';
  const id = data.id;
  if (kind === 'machine' ? !SHOP_MACHINES[id] : !UPGRADES[id]) return;

  if (!state.isHost) {
    // الضيوف يستلمون النتيجة الرسمية مع المزامنة، هنا فقط تنبيه
    audio.playCash();
    showToast(`اشترت الكافيه: ${kind === 'machine' ? SHOP_MACHINES[id].name : UPGRADES[id].name}! 🎉`, '🛍️');
    return;
  }

  // المضيف يتحقق ويخصم من رصيد الفريق المشترك
  const price = priceFor(kind, id);
  const expectedLevel = kind === 'upgrade' ? (state.upgrades[id] || 0) + 1 : 1;
  if (price === null || state.coins < price || Number(data.level) !== expectedLevel) {
    broadcastState();
    return;
  }
  state.coins -= price;
  applyPurchase(kind, id);
  audio.playCash();
  showToast(`اشترت الكافيه: ${purchaseName(kind, id)}! 🎉`, '🛍️');
  updateStatsDisplay();
  renderStationView();
  broadcastState();
}

function renderShopStation() {
  if (stationHint) stationHint.textContent = 'استثمري النقود 🪙 بأجهزة تفتح وصفات جديدة وتطويرات تقوّي الكافيه!';

  if (currentItemVisual) {
    currentItemVisual.innerHTML = `
      <span class="workbench-big-icon">🛍️</span>
      <span class="workbench-title">متجر الكافيه</span>
      <span class="workbench-hint">رصيدكم الحالي: <strong class="coins-strong">${state.coins} 🪙</strong></span>
    `;
  }

  const tabs = document.createElement('div');
  tabs.className = 'shop-tabs';
  [['machines', '🛠️ الأجهزة'], ['upgrades', '✨ التطويرات']].forEach(([key, label]) => {
    const t = document.createElement('button');
    t.type = 'button';
    t.className = `shop-tab ${state.shopTab === key ? 'active' : ''}`;
    t.textContent = label;
    t.addEventListener('click', () => {
      audio.playPop();
      state.shopTab = key;
      renderStationView();
    });
    tabs.appendChild(t);
  });
  ingredientsGrid.appendChild(tabs);

  if (state.shopTab === 'machines') {
    Object.values(SHOP_MACHINES).forEach(item => {
      const owned = state.ownedMachines.includes(item.id);
      const early = !owned && state.level < item.usefulFrom;
      const affordable = state.coins >= item.price;
      ingredientsGrid.appendChild(shopCard({
        icon: item.icon,
        name: item.name,
        desc: item.desc,
        note: owned ? '' : (early ? `وصفاتها تبدأ من اللفل ${item.usefulFrom}` : '✨ وصفاتها متاحة الحين'),
        noteClass: early ? '' : 'good',
        button: owned ? '✅ عندكم' : `${item.price} 🪙`,
        done: owned,
        affordable,
        onBuy: () => buyItem('machine', item.id)
      }));
    });
  } else {
    Object.values(UPGRADES).forEach(item => {
      const lvl = state.upgrades[item.id] || 0;
      const maxed = lvl >= UPGRADE_MAX;
      const price = maxed ? 0 : item.prices[lvl];
      const pips = Array.from({ length: UPGRADE_MAX }, (_, i) => `<span class="pip ${i < lvl ? 'on' : ''}"></span>`).join('');
      ingredientsGrid.appendChild(shopCard({
        icon: item.icon,
        name: item.name,
        desc: item.desc,
        pips,
        button: maxed ? '👑 أعلى مستوى' : `${price} 🪙`,
        done: maxed,
        affordable: state.coins >= price,
        onBuy: () => buyItem('upgrade', item.id)
      }));
    });
  }
}

function shopCard({ icon, name, desc, note, noteClass, pips, button, done, affordable, onBuy }) {
  const card = document.createElement('div');
  card.className = 'shop-card';
  card.innerHTML = `
    <span class="shop-card-icon">${icon}</span>
    <div class="shop-card-info">
      <div class="shop-card-name">${escapeHtml(name)} ${pips ? `<span class="pips">${pips}</span>` : ''}</div>
      <div class="shop-card-desc">${escapeHtml(desc)}</div>
      ${note ? `<div class="shop-card-note ${noteClass || ''}">${escapeHtml(note)}</div>` : ''}
    </div>
    <button type="button" class="shop-buy-btn ${done ? 'done' : ''} ${!done && !affordable ? 'poor' : ''}">${button}</button>
  `;
  if (!done) card.querySelector('.shop-buy-btn').addEventListener('click', onBuy);
  return card;
}

// ==========================================
// 12. التشغيل التلقائي المضمون
// ==========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
