/* =========================================================================
   كافيه بوكي البنات | Pookie Cozy Cafe Rush
   ========================================================================= */

const STATE = {
  playerName: "باريستا بوكي",
  playerAvatar: "cat",
  score: 0,
  coins: 50,
  timer: 180,
  activeStation: "drinks",
  currentRecipe: { ingredients: [] }
};

const ANIMALS_SVG = {
  cat: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="36" r="18" fill="#ffd1dc"/><polygon points="16,22 22,6 30,20" fill="#ffb3c6"/><polygon points="48,22 42,6 34,20" fill="#ffb3c6"/></svg>`,
  bunny: `<svg class="animal" viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="18" ry="16" fill="#fff"/><ellipse cx="23" cy="14" r="4" fill="#ffd1dc"/><ellipse cx="41" cy="14" r="4" fill="#ffd1dc"/></svg>`,
  bear: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="36" r="18" fill="#d7ccc8"/><circle cx="18" cy="22" r="6" fill="#bcaaa4"/><circle cx="46" cy="22" r="6" fill="#bcaaa4"/></svg>`
};

// قائمة واسعة ومنوعة من المشروبات والحلويات العربية والعالمية
const RECIPES = {
  turkishCoffee: { name: "قهوة تركية", type: "drinks", cup: "☕", req: ["بن", "ماء"] },
  karakTea: { name: "كرك إماراتي", type: "drinks", cup: "🧋", req: ["شاي", "حليب", "هيل"] },
  bobaLatte: { name: "ماتشا بوبا لاتيه", type: "drinks", cup: "🧋", req: ["حليب", "ماتشا", "حبوب البوبا"] },
  cappuccino: { name: "كابتشينو رغوة", type: "drinks", cup: "☕", req: ["بن", "حليب", "رغوة"] },
  moroccanTea: { name: "شاي مغربي بالنعناع", type: "drinks", cup: "🍵", req: ["شاي", "ماء", "نعناع"] },
  
  kunafa: { name: "كنافة بالجبن", type: "bakery", cup: "🧀", req: ["عجين", "جبن", "قطر"] },
  trilce: { name: "كيكة التريليتشا", type: "bakery", cup: "🍰", req: ["قالب كيك", "حليب", "كراميل"] },
  chocolateDonut: { name: "دونات الشوكولاتة", type: "bakery", cup: "🍩", req: ["عجين", "شوكولاتة", "سكر"] },
  strawberryCheesecake: { name: "تشيز كيك بالفراولة", type: "bakery", cup: "🍰", req: ["جبن", "بسكويت", "فراولة"] },
  baklava: { name: "بقلاوة بالفستق", type: "bakery", cup: "🥮", req: ["عجين", "فستق", "قطر"] }
};

const CUSTOMERS_POOL = [
  { name: "ميمي", avatar: "cat" },
  { name: "لولو", avatar: "bunny" },
  { name: "كوكو", avatar: "bear" },
  { name: "سوسو", avatar: "cat" },
  { name: "توتي", avatar: "bunny" }
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
  document.getElementById("startShiftBtn").addEventListener("click", startShift);
  document.getElementById("playAgainBtn").addEventListener("click", () => location.reload());

  document.querySelectorAll(".station-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      switchStation(e.currentTarget.getAttribute("data-station"));
    });
  });
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
  gameInterval = setInterval(() => {
    STATE.timer--;
    updateStats();
    updateOrdersPatience();
    if (STATE.timer <= 0) endGame();
  }, 1000);

  orderSpawnerTimer = setInterval(() => {
    if (activeOrders.length < 4) spawnCustomer();
  }, 7000);

  spawnCustomer();
  spawnCustomer();
  switchStation("drinks");
}

function updateStats() {
  document.getElementById("statScore").textContent = STATE.score;
  document.getElementById("statCoins").textContent = `${STATE.coins} 🪙`;
  const m = Math.floor(STATE.timer / 60);
  const s = STATE.timer % 60;
  document.getElementById("statTimer").textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
}

function spawnCustomer() {
  const keys = Object.keys(RECIPES);
  const recipeKey = keys[Math.floor(Math.random() * keys.length)];
  const customer = CUSTOMERS_POOL[Math.floor(Math.random() * CUSTOMERS_POOL.length)];

  const newOrder = {
    id: "ord_" + Math.random().toString(36).substring(2, 7),
    recipeKey: recipeKey,
    recipe: RECIPES[recipeKey],
    customer: customer,
    patience: 60, // 60 ثانية صبر الزبون
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
    }
  });
  renderOrdersRack();
}

function switchStation(stationName) {
  STATE.activeStation = stationName;
  document.querySelectorAll(".station-tab-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-station") === stationName);
  });

  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = "";

  let items = [];
  if (stationName === "drinks") {
    items = [
      { id: "بن", name: "بن تركي", icon: "☕" },
      { id: "ماء", name: "ماء نقي", icon: "💧" },
      { id: "شاي", name: "شاي أحمر", icon: "🍃" },
      { id: "حليب", name: "حليب طازج", icon: "🥛" },
      { id: "هيل", name: "هيل مطحون", icon: "🌿" },
      { id: "ماتشا", name: "بودرة الماتشا", icon: "🍵" },
      { id: "حبوب البوبا", name: "حبوب البوبا", icon: "🧋" },
      { id: "رغوة", name: "رغوة حليب", icon: "☁️" },
      { id: "نعناع", name: "نعناع طازج", icon: "🌱" }
    ];
  } else if (stationName === "bakery") {
    items = [
      { id: "عجين", name: "عجين طازج", icon: "🍞" },
      { id: "جبن", name: "جبن عكاوي", icon: "🧀" },
      { id: "قطر", name: "قطر / شيرة", icon: "🍯" },
      { id: "قالب كيك", name: "قالب كيك", icon: "🧁" },
      { id: "كراميل", name: "صوص كراميل", icon: "🍮" },
      { id: "شوكولاتة", name: "شوكولاتة سائلة", icon: "🍫" },
      { id: "سكر", name: "سكر مطحون", icon: "✨" },
      { id: "بسكويت", name: "بسكويت مطحون", icon: "🍪" },
      { id: "فراولة", name: "فراولة طازجة", icon: "🍓" },
      { id: "فستق", name: "فستق حلبي", icon: "🥜" }
    ];
  } else if (stationName === "serving") {
    renderServingStation();
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "ingredient-card";
    card.innerHTML = `<div style="font-size:24px;">${item.icon}</div><div style="font-size:11px;font-weight:800;margin-top:4px;">${item.name}</div>`;
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
    workbench.innerHTML = `طاولة التحضير فارغة..`;
    return;
  }
  workbench.innerHTML = `
    <div>المكونات: ${ings.join(" + ")}</div>
    <div style="margin-top:8px; display:flex; gap:6px; justify-content:center;">
      <button class="btn-primary" style="padding:4px 10px; font-size:11px;" onclick="finishDish()">تحضير 🛎️</button>
      <button class="btn-primary" style="padding:4px 10px; font-size:11px; background:#ff4757;" onclick="clearWorkbench()">مسح 🗑️</button>
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
    showToast("الوصفة غير صحيحة! ❌");
    clearWorkbench();
    return;
  }

  const orderIdx = activeOrders.findIndex(o => o.recipeKey === matchedKey);
  if (orderIdx !== -1) {
    activeOrders.splice(orderIdx, 1);
    STATE.score += 100;
    STATE.coins += 20;
    updateStats();
    showToast("تم تسليم الطلب بنجاح! +100 نقطة ⭐");
  } else {
    showToast("لا يوجد زبون يطلب هذا الصنف حالياً!");
  }
  clearWorkbench();
  renderOrdersRack();
}

function renderServingStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; font-weight:800; color:var(--pink-main);">اختر الطلب من الأعلى لتسليمه للزبائن فوراً ✨</div>`;
}

function renderOrdersRack() {
  const rack = document.getElementById("ordersRack");
  if (!rack) return;
  if (activeOrders.length === 0) {
    rack.innerHTML = `<div style="font-size:12px; color:var(--text-muted);">لا توجد طلبات معلقة.. الكافيه هادئ 🌸</div>`;
    return;
  }

  rack.innerHTML = "";
  activeOrders.forEach(ord => {
    const pct = (ord.patience / ord.maxPatience) * 100;
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <div style="font-size:12px; font-weight:900;">${ord.customer.name} يطلب:</div>
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
}

function showToast(msg) {
  const t = document.getElementById("toastShout");
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
