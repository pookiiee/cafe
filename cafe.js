/* =========================================================================
   كافيه بوكي البنات | Pookie Cozy Cafe Rush
   Complete Core Logic + Massive Menu + Shop + Levels + 60s Patience + Beep
   ========================================================================= */

const STATE = {
  playerName: "باريستا بوكي",
  playerAvatar: "cat",
  roomCode: null,
  isHost: false,
  score: 0,
  coins: 100,
  level: 1,
  timer: 240,
  servedCount: 0,
  missedCount: 0,
  activeStation: "drinks",
  currentRecipe: { ingredients: [] },
  inventory: {
    turkishCoffee: true,
    karakTea: true,
    bobaLatte: true,
    cappuccino: true,
    moroccanTea: true,
    kunafa: true,
    trilce: true,
    chocolateDonut: true,
    strawberryCheesecake: true,
    baklava: true,
    spanishLatte: false,
    matchaIceCream: false,
    pomegranateMojito: false,
    saffronCake: false,
    moltenCake: false,
    macaronBox: false
  }
};

const ANIMALS_SVG = {
  cat: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="36" r="18" fill="#ffd1dc"/><polygon points="16,22 22,6 30,20" fill="#ffb3c6"/><polygon points="48,22 42,6 34,20" fill="#ffb3c6"/></svg>`,
  bunny: `<svg class="animal" viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="18" ry="16" fill="#fff"/><ellipse cx="23" cy="14" r="4" fill="#ffd1dc"/><ellipse cx="41" cy="14" r="4" fill="#ffd1dc"/></svg>`,
  bear: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="36" r="18" fill="#d7ccc8"/><circle cx="18" cy="22" r="6" fill="#bcaaa4"/><circle cx="46" cy="22" r="6" fill="#bcaaa4"/></svg>`,
  panda: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="36" r="18" fill="#fff"/><circle cx="19" cy="22" r="6" fill="#212121"/><circle cx="45" cy="22" r="6" fill="#212121"/><circle cx="32" cy="39" r="2" fill="#212121"/></svg>`
};

const RECIPES = {
  turkishCoffee: { name: "قهوة تركية أصيلة", type: "drinks", cup: "☕", req: ["بن", "ماء"], levelReq: 1 },
  karakTea: { name: "كراميل كرك إماراتي", type: "drinks", cup: "🧋", req: ["شاي", "حليب", "هيل"], levelReq: 1 },
  bobaLatte: { name: "ماتشا حبوب البوبا", type: "drinks", cup: "🧋", req: ["حليب", "ماتشا", "حبوب البوبا"], levelReq: 1 },
  cappuccino: { name: "كابتشينو برغوة غنية", type: "drinks", cup: "☕", req: ["بن", "حليب", "رغوة"], levelReq: 1 },
  moroccanTea: { name: "شاي مغربي بالنعناع", type: "drinks", cup: "🍵", req: ["شاي", "ماء", "نعناع"], levelReq: 1 },
  
  kunafa: { name: "كنافة نابلسية بالجبن", type: "bakery", cup: "🧀", req: ["عجين", "جبن", "قطر"], levelReq: 1 },
  trilce: { name: "كيكة التريليتشا بالحليب", type: "bakery", cup: "🍰", req: ["قالب كيك", "حليب", "كراميل"], levelReq: 1 },
  chocolateDonut: { name: "دونات الشوكولاتة الكيوت", type: "bakery", cup: "🍩", req: ["عجين", "شوكولاتة", "سكر"], levelReq: 1 },
  strawberryCheesecake: { name: "تشيز كيك الفراولة", type: "bakery", cup: "🍰", req: ["جبن", "بسكويت", "فراولة"], levelReq: 1 },
  baklava: { name: "بقلاوة بالفستق الحلبي", type: "bakery", cup: "🥮", req: ["عجين", "فستق", "قطر"], levelReq: 1 },

  spanishLatte: { name: "سبانش لاتيه مثلج", type: "drinks", cup: "🥤", req: ["بن", "حليب مكثف", "ثلج"], levelReq: 2 },
  matchaIceCream: { name: "آيس كريم الماتشا الفاخر", type: "bakery", cup: "🍨", req: ["حليب", "ماتشا", "كريمة"], levelReq: 2 },
  pomegranateMojito: { name: "موهيتو الرمان المنعش", type: "drinks", cup: "🍹", req: ["صودا", "رمان", "نعناع"], levelReq: 2 },
  saffronCake: { name: "كيكة الزعفران الملكية", type: "bakery", cup: "🧁", req: ["قالب كيك", "زعفران", "حليب مكثف"], levelReq: 3 },
  moltenCake: { name: "مولتن كيك الشوكولاتة الساخنة", type: "bakery", cup: "🍫", req: ["شوكولاتة", "زببدة", "دقيق"], levelReq: 3 },
  macaronBox: { name: "علبة ماكارون فرنسي ملون", type: "bakery", cup: "🍬", req: ["لوز مطحون", "سكر", "توت"], levelReq: 3 }
};

const CUSTOMERS_POOL = [
  { name: "ميمي القطة", avatar: "cat" },
  { name: "لولو الأرنب", avatar: "bunny" },
  { name: "كوكو الدب", avatar: "bear" },
  { name: "باندا الكيوت", avatar: "panda" },
  { name: "سوسو الممشوقة", avatar: "cat" },
  { name: "توتي الشقية", avatar: "bunny" }
];

let activeOrders = [];
let gameInterval = null;
let orderSpawnerTimer = null;

window.addEventListener("DOMContentLoaded", () => {
  renderAvatarChoices();
  setupEventListeners();
});

function renderAvatarChoices() {
  const row = document.querySelector(".avatars-row");
  if (!row) return;
  row.innerHTML = "";
  Object.keys(ANIMALS_SVG).forEach(key => {
    const div = document.createElement("div");
    div.className = `avatar-choice ${key === STATE.playerAvatar ? "selected" : ""}`;
    div.innerHTML = ANIMALS_SVG[key];
    div.addEventListener("click", () => {
      document.querySelectorAll(".avatar-choice").forEach(el => el.classList.remove("selected"));
      div.classList.add("selected");
      STATE.playerAvatar = key;
    });
    row.appendChild(div);
  });
}

function setupEventListeners() {
  document.getElementById("createRoomBtn").addEventListener("click", handleCreateRoom);
  document.getElementById("joinRoomBtn").addEventListener("click", handleJoinRoom);
  document.getElementById("soloPlayBtn").addEventListener("click", startShift);
  document.getElementById("startShiftBtn").addEventListener("click", startShift);
  document.getElementById("playAgainBtn").addEventListener("click", () => location.reload());
  document.getElementById("copyRoomLinkBtn").addEventListener("click", copyRoomLink);

  document.querySelectorAll(".station-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      switchStation(e.currentTarget.getAttribute("data-station"));
    });
  });

  document.querySelectorAll(".shout-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      showToast(e.currentTarget.getAttribute("data-shout"));
    });
  });
}

function handleCreateRoom() {
  const nameInput = document.getElementById("playerNameInput").value.trim();
  if (nameInput) STATE.playerName = nameInput;
  STATE.roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  STATE.isHost = true;

  document.getElementById("displayRoomCode").textContent = STATE.roomCode;
  document.getElementById("roomWaitingBox").style.display = "block";
  document.getElementById("createRoomBtn").style.display = "none";
  document.getElementById("joinRoomInputWrap").style.display = "none";
  document.getElementById("soloPlayBtn").style.display = "none";
  showToast(`أنشأت كافيه برمز: ${STATE.roomCode} ✨`);
}

function handleJoinRoom() {
  const codeInput = document.getElementById("joinRoomCodeInput").value.trim().toUpperCase();
  if (!codeInput) {
    alert("الرجاء إدخال كود الكافيه");
    return;
  }
  STATE.roomCode = codeInput;
  startShift();
}

function copyRoomLink() {
  const link = `${window.location.origin}${window.location.pathname}?room=${STATE.roomCode}`;
  navigator.clipboard.writeText(link).then(() => showToast("تم نسخ رابط الكافيه! 📋"));
}

function startShift() {
  const nameInput = document.getElementById("playerNameInput").value.trim();
  if (nameInput) STATE.playerName = nameInput;

  document.getElementById("lobbyScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");
  document.getElementById("gameStatsBar").style.display = "flex";

  startGameLoop();
  showToast("بدأ الشفت بنجاح! 🌸");
}

function startGameLoop() {
  activeOrders = [];
  STATE.timer = 240;
  STATE.score = 0;
  STATE.coins = 100;

  gameInterval = setInterval(() => {
    STATE.timer--;
    updateStats();
    updateOrdersPatience();
    if (STATE.timer <= 0) endGame();
  }, 1000);

  orderSpawnerTimer = setInterval(() => {
    if (activeOrders.length < 5) spawnCustomer();
  }, 6000);

  spawnCustomer();
  spawnCustomer();
  switchStation("drinks");
}

function updateStats() {
  document.getElementById("statScore").textContent = STATE.score;
  document.getElementById("statCoins").textContent = `${STATE.coins} 🪙`;
  document.getElementById("statLevel").textContent = `${STATE.level} ⭐`;
  
  const m = Math.floor(STATE.timer / 60);
  const s = STATE.timer % 60;
  document.getElementById("statTimer").textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
}

function spawnCustomer() {
  const unlockedKeys = Object.keys(RECIPES).filter(k => STATE.inventory[k] || RECIPES[k].levelReq <= STATE.level);
  const recipeKey = unlockedKeys[Math.floor(Math.random() * unlockedKeys.length)];
  const customer = CUSTOMERS_POOL[Math.floor(Math.random() * CUSTOMERS_POOL.length)];

  const newOrder = {
    id: "ord_" + Math.random().toString(36).substring(2, 7),
    recipeKey: recipeKey,
    recipe: RECIPES[recipeKey],
    customer: customer,
    patience: 60, // 60 ثانية صبر الزبون الدقيقة
    maxPatience: 60
  };

  activeOrders.push(newOrder);
  renderOrdersRack();
  playBeep();
  showToast(`وصل زبون جديد: ${customer.name}! 🛎️`);
}

function updateOrdersPatience() {
  activeOrders.forEach((ord, index) => {
    ord.patience--;
    if (ord.patience <= 0) {
      showToast(`غادر الزبون ${ord.customer.name} لبطء الطلب! 💔`);
      activeOrders.splice(index, 1);
      STATE.missedCount++;
    }
  });
  renderOrdersRack();
}

function switchStation(stationName) {
  STATE.activeStation = stationName;
  document.querySelectorAll(".station-tab-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-station") === stationName);
  });

  const hintEl = document.getElementById("stationHint");
  const grid = document.getElementById("ingredientsGrid");
  grid.className = "ingredients-grid";
  grid.innerHTML = "";

  if (stationName === "drinks") {
    hintEl.textContent = "اختر المكونات لتحضير ألذ المشروبات والقهوة!";
    renderIngredients([
      { id: "بن", name: "بن تركي", icon: "☕" },
      { id: "ماء", name: "ماء نقي", icon: "💧" },
      { id: "شاي", name: "شاي أحمر", icon: "🍃" },
      { id: "حليب", name: "حليب طازج", icon: "🥛" },
      { id: "هيل", name: "هيل مطحون", icon: "🌿" },
      { id: "ماتشا", name: "بودرة الماتشا", icon: "🍵" },
      { id: "حبوب البوبا", name: "حبوب البوبا", icon: "🧋" },
      { id: "رغوة", name: "رغوة حليب", icon: "☁️" },
      { id: "نعناع", name: "نعناع طازج", icon: "🌱" },
      { id: "حليب مكثف", name: "حليب مكثف", icon: "🍼" },
      { id: "ثلج", name: "مكعبات ثلج", icon: "🧊" },
      { id: "صودا", name: "مياه غازية صودا", icon: "🥤" },
      { id: "رمان", name: "حبات رمان طازجة", icon: "🔴" }
    ]);
  } else if (stationName === "bakery") {
    hintEl.textContent = "اختر المعجنات والحلويات والصلصات للخبز!";
    renderIngredients([
      { id: "عجين", name: "عجين طازج", icon: "🍞" },
      { id: "جبن", name: "جبن عكاوي", icon: "🧀" },
      { id: "قطر", name: "قطر / شيرة", icon: "🍯" },
      { id: "قالب كيك", name: "قالب كيك", icon: "🧁" },
      { id: "كراميل", name: "صوص كراميل", icon: "🍮" },
      { id: "شوكولاتة", name: "شوكولاتة سائلة", icon: "🍫" },
      { id: "سكر", name: "سكر مطحون", icon: "✨" },
      { id: "بسكويت", name: "بسكويت مطحون", icon: "🍪" },
      { id: "فراولة", name: "فراولة طازجة", icon: "🍓" },
      { id: "فستق", name: "فستق حلبي", icon: "🥜" },
      { id: "كريمة", name: "كريمة خفق", icon: "🍦" },
      { id: "زعفران", name: "خيوط زعفران", icon: "🌾" },
      { id: "زببدة", name: "زببدة فاخرة", icon: "🧈" },
      { id: "دقيق", name: "دقيق فاخر", icon: "🌾" },
      { id: "لوز مطحون", name: "لوز مطحون", icon: "🌰" },
      { id: "توت", name: "توت بري", icon: "🫐" }
    ]);
  } else if (stationName === "serving") {
    hintEl.textContent = "سلّم الطلبات للزبائن المنتظرين فوراً!";
    renderServingStation();
  } else if (stationName === "shop") {
    hintEl.textContent = "طوّر معدات الكافيه وافتح منتجات جديدة حسب مستواك!";
    renderShopStation();
  }
}

function renderIngredients(items) {
  const grid = document.getElementById("ingredientsGrid");
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "ingredient-card";
    card.innerHTML = `<div style="font-size:26px;">${item.icon}</div><div style="font-size:11.5px;font-weight:800;margin-top:4px;">${item.name}</div>`;
    card.addEventListener("click", () => addIngredient(item.id));
    grid.appendChild(card);
  });
}

function addIngredient(id) {
  STATE.currentRecipe.ingredients.push(id);
  renderWorkbench();
}

function renderWorkbench() {
  const workbench = document.getElementById("currentItemVisual");
  const ings = STATE.currentRecipe.ingredients;
  if (ings.length === 0) {
    workbench.innerHTML = `<span style="font-size:13px; color:var(--text-muted);">طاولة التحضير فارغة.. أضف المكونات!</span>`;
    return;
  }
  workbench.innerHTML = `
    <div style="font-weight:900; color:var(--pink-main); margin-bottom:4px;">المكونات الحالية: ${ings.join(" + ")}</div>
    <div style="margin-top:8px; display:flex; gap:8px; justify-content:center;">
      <button class="btn-primary" style="padding:6px 14px; font-size:12px;" onclick="finishDish()">تحضير الطلب 🛎️</button>
      <button class="btn-primary" style="padding:6px 14px; font-size:12px; background:#ff4757;" onclick="clearWorkbench()">مسح 🗑️</button>
    </div>
  `;
}

function clearWorkbench() {
  STATE.currentRecipe.ingredients = [];
  renderWorkbench();
}

function finishDish() {
  const current = [...STATE.currentRecipe.ingredients].sort();
  let matchedKey = null;

  for (let [k, r] of Object.entries(RECIPES)) {
    if (JSON.stringify(current) === JSON.stringify([...r.req].sort())) {
      matchedKey = k;
      break;
    }
  }

  if (!matchedKey) {
    showToast("هذه الوصفة غير صحيحة! ❌");
    clearWorkbench();
    return;
  }

  const orderIdx = activeOrders.findIndex(o => o.recipeKey === matchedKey);
  if (orderIdx !== -1) {
    activeOrders.splice(orderIdx, 1);
    STATE.score += 120;
    STATE.coins += 25;
    STATE.servedCount++;

    if (STATE.servedCount % 4 === 0) {
      STATE.level++;
      showToast(`مبارك! لقد صعدت للمستوى ${STATE.level} ⭐`);
    }

    updateStats();
    showToast("تم تسليم الطلب بنجاح! +120 نقطة ⭐");
  } else {
    showToast("لا يوجد زبون يطلب هذا الصنف حالياً!");
  }
  clearWorkbench();
  renderOrdersRack();
}

function renderServingStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; font-weight:800; color:var(--pink-main); padding:20px;">انظر إلى تذاكر الزبائن بالأعلى وقم بتجهيز وتقديم طلباتهم من محطات المشروبات والحلويات! ✨</div>`;
}

function renderShopStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.className = "ingredients-grid shop-mode";
  grid.innerHTML = `
    <div style="grid-column:1/-1; font-size:14px; font-weight:900; color:var(--pink-main); margin-bottom:8px;">
      🛍️ متجر الكافيه (أرباحك: <span style="color:#d63031;">${STATE.coins} 🪙</span> | مستواك: ${STATE.level} ⭐)
    </div>
  `;

  const shopItems = [
    { id: "spanishLatte", name: "فتح وصفة سبانش لاتيه المثلج", cost: 60, reqLevel: 2, icon: "🥤" },
    { id: "matchaIceCream", name: "فتح وصفة آيس كريم الماتشا", cost: 75, reqLevel: 2, icon: "🍨" },
    { id: "pomegranateMojito", name: "فتح موهيتو الرمان المنعش", cost: 90, reqLevel: 2, icon: "🍹" },
    { id: "saffronCake", name: "فتح كيكة الزعفران الملكية", cost: 120, reqLevel: 3, icon: "🧁" },
    { id: "moltenCake", name: "فتح مولتن كيك الشوكولاتة", cost: 140, reqLevel: 3, icon: "🍫" },
    { id: "macaronBox", name: "فتح علبة ماكارون فرنسي", cost: 160, reqLevel: 3, icon: "🍬" }
  ];

  shopItems.forEach(item => {
    const isUnlocked = STATE.inventory[item.id];
    const canBuy = STATE.coins >= item.cost && STATE.level >= item.reqLevel;

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <div class="shop-card-icon">${item.icon}</div>
      <div class="shop-card-info">
        <div class="shop-card-name">${item.name}</div>
        <div class="shop-card-desc">يتطلب المستوى ${item.reqLevel} ⭐</div>
        <div class="shop-card-note">${isUnlocked ? '✓ تم اقتناؤه' : `السعر: ${item.cost} 🪙`}</div>
      </div>
      <button class="shop-buy-btn ${isUnlocked ? 'done' : (!canBuy ? 'poor' : '')}" onclick="buyShopItem('${item.id}', ${item.cost}, ${item.reqLevel})">
        ${isUnlocked ? 'مكتمل' : `${item.cost} 🪙 شراء`}
      </button>
    `;
    grid.appendChild(card);
  });
}

function buyShopItem(id, cost, reqLevel) {
  if (STATE.level < reqLevel) {
    showToast(`تحتاج للوصول إلى المستوى ${reqLevel} لفتح هذا العنصر! 🔒`);
    return;
  }
  if (STATE.coins < cost) {
    showToast("عذراً، أرباحك لا تكفي لشراء هذا المنتج! 🪙");
    return;
  }
  if (!STATE.inventory[id]) {
    STATE.coins -= cost;
    STATE.inventory[id] = true;
    updateStats();
    showToast("تم شراء وفتح المنتج الجديد بنجاح في المنيو! 🎉");
    renderShopStation();
  }
}

function renderOrdersRack() {
  const rack = document.getElementById("ordersRack");
  if (!rack) return;
  if (activeOrders.length === 0) {
    rack.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:10px;">لا توجد طلبات معلقة.. الكافيه هادئ ومرتب 🌸</div>`;
    return;
  }

  rack.innerHTML = "";
  activeOrders.forEach(ord => {
    const pct = (ord.patience / ord.maxPatience) * 100;
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <div style="font-size:12px; font-weight:900;">${ord.customer.name}</div>
      <div style="font-size:13px; color:var(--pink-main); font-weight:900;">${ord.recipe.cup} ${ord.recipe.name}</div>
      <div class="patience-bar-bg"><div class="patience-bar-fill" style="width: ${pct}%;"></div></div>
      <div style="font-size:10px; color:var(--text-muted);">${ord.patience} ثانية متبقية</div>
    `;
    rack.appendChild(card);
  });
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(orderSpawnerTimer);
  document.getElementById("gameScreen").classList.remove("active");
  document.getElementById("resultsScreen").classList.add("active");
  document.getElementById("resultScore").textContent = STATE.score;
  document.getElementById("resultCoins").textContent = `${STATE.coins} 🪙`;
  document.getElementById("resultServed").textContent = STATE.servedCount;
  document.getElementById("resultMissed").textContent = STATE.missedCount;
}

function showToast(msg) {
  const t = document.getElementById("toastShout");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 580;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}
