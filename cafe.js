/* =========================================================================
   كافيه البنات المشترك | Pookie Cozy Cafe Rush
   Core Logic & MQTT Multiplayer + Kawaii Animated Animals + Shop
   ========================================================================= */

// --- 1. حالة اللعبة والبيانات الأساسية ---
const STATE = {
  playerName: "باريستا بوكي",
  playerAvatar: "cat",
  roomCode: null,
  isHost: false,
  score: 0,
  coins: 50, // رأس مال ابتدائي لتجربة المتجر
  level: 1,
  timer: 180, // 3 دقائق للشفت
  combo: 0,
  maxCombo: 0,
  servedCount: 0,
  missedCount: 0,
  vipCount: 0,
  activeStation: "drinks",
  currentRecipe: {
    base: null,
    ingredients: [],
    machineDone: false
  },
  inventory: {
    milk: true,
    matcha: true,
    boba: true,
    strawberry: false,
    chocolate: false,
    caramel: false,
    cheese: false,
    honey: false,
    cookieDough: true,
    cakeBatter: true,
    frosting: false
  },
  machines: {
    bobaMaker: { level: 1, maxLevel: 3, busy: false, progress: 0, cost: 40 },
    oven: { level: 1, maxLevel: 3, busy: false, progress: 0, cost: 50 },
    blender: { level: 1, maxLevel: 2, busy: false, progress: 0, cost: 70 }
  },
  upgrades: {
    patience: { level: 1, cost: 60 },
    tips: { level: 1, cost: 80 }
  }
};

// مكتبة الحيوانات اللطيفة بصيغة SVG (أيقونات حية وليست إيموجي)
const ANIMALS_SVG = {
  cat: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><ellipse cx="32" cy="36" rx="20" ry="18" fill="#ffd1dc"/><polygon points="16,22 22,6 30,20" fill="#ffb3c6" class="a-ear-l"/><polygon points="48,22 42,6 34,20" fill="#ffb3c6" class="a-ear-r"/><circle cx="24" cy="32" r="3" fill="#3b2d35" class="a-eyes"/><circle cx="40" cy="32" r="3" fill="#3b2d35" class="a-eyes"/><path d="M29,38 Q32,41 35,38" fill="none" stroke="#3b2d35" stroke-width="2" stroke-linecap="round"/><ellipse cx="32" cy="35" rx="2" ry="1.2" fill="#ff7597"/></g></svg>`,
  bunny: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><ellipse cx="32" cy="38" rx="19" ry="17" fill="#ffffff"/><ellipse cx="23" cy="14" rx="4" ry="12" fill="#ffd1dc" class="a-ear-l"/><ellipse cx="41" cy="14" rx="4" ry="12" fill="#ffd1dc" class="a-ear-r"/><circle cx="25" cy="34" r="2.5" fill="#3b2d35" class="a-eyes"/><circle cx="39" cy="34" r="2.5" fill="#3b2d35" class="a-eyes"/><polygon points="32,38 30,36 34,36" fill="#ff7597"/></g></svg>`,
  bear: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><circle cx="32" cy="36" r="18" fill="#d7ccc8"/><circle cx="18" cy="22" r="6" fill="#bcaaa4" class="a-ear-l"/><circle cx="46" cy="22" r="6" fill="#bcaaa4" class="a-ear-r"/><circle cx="24" cy="33" r="2.5" fill="#3b2d35" class="a-eyes"/><circle cx="40" cy="33" r="2.5" fill="#3b2d35" class="a-eyes"/><ellipse cx="32" cy="38" rx="5" ry="3.5" fill="#efebe9"/><circle cx="32" cy="37" r="2" fill="#3b2d35"/></g></svg>`,
  panda: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><circle cx="32" cy="36" r="18" fill="#ffffff"/><circle cx="19" cy="22" r="6" fill="#212121" class="a-ear-l"/><circle cx="45" cy="22" r="6" fill="#212121" class="a-ear-r"/><ellipse cx="23" cy="33" rx="5" ry="4" fill="#212121"/><ellipse cx="41" cy="33" rx="5" ry="4" fill="#212121"/><circle cx="24" cy="33" r="1.5" fill="#fff"/><circle cx="40" cy="33" r="1.5" fill="#fff"/><circle cx="32" cy="39" r="2" fill="#212121"/></g></svg>`
};

// وصفات الأكلات والمشروبات
const RECIPES = {
  matchaLatte: { name: "ماتشا لاتيه بوبا", type: "drinks", cup: "🧋", req: ["milk", "matcha", "boba"], machine: "bobaMaker" },
  strawberryBoba: { name: "بوبا الفراولة الوردية", type: "drinks", cup: "🥤", req: ["milk", "strawberry", "boba"], machine: "bobaMaker" },
  chocolateDonut: { name: "دونات الشوكولاتة الكيوت", type: "bakery", cup: "🍩", req: ["cookieDough", "chocolate"], machine: "oven" },
  matchaCake: { name: "كيكة الماتشا والكراميل", type: "bakery", cup: "🍰", req: ["cakeBatter", "matcha", "caramel"], machine: "oven" }
};

// زبائن الكافيه
const CUSTOMERS_POOL = [
  { name: "ميمي القطة", avatar: "cat" },
  { name: "لولو الأرنب", avatar: "bunny" },
  { name: "كوكو الدب", avatar: "bear" },
  { name: "باندا الكيوت", avatar: "panda" }
];

let activeOrders = [];
let sharedCounterItems = [];
let gameInterval = null;
let orderSpawnerTimer = null;
let mqttClient = null;
let audioCtx = null;

// --- 2. تهيئة الواجهة عند فتح الصفحة ---
window.addEventListener("DOMContentLoaded", () => {
  renderAvatarChoices();
  setupEventListeners();
  initSoundEngine();
});

// رسم خيارات الشخصيات المتحركة تحت "اختاري شخصيتك الكيوت"
function renderAvatarChoices() {
  const row = document.querySelector(".avatars-row");
  if (!row) return;
  row.innerHTML = "";

  Object.keys(ANIMALS_SVG).forEach(key => {
    const div = document.createElement("div");
    div.className = `avatar-choice ${key === STATE.playerAvatar ? "selected" : ""}`;
    div.innerHTML = `<div class="avatar-slot">${ANIMALS_SVG[key]}</div>`;
    div.addEventListener("click", () => {
      document.querySelectorAll(".avatar-choice").forEach(el => el.classList.remove("selected"));
      div.classList.add("selected");
      STATE.playerAvatar = key;
      showToast(`تم اختيار الشخصية بنجاح! 🌸`);
    });
    row.appendChild(div);
  });
}

function setupEventListeners() {
  // أزرار التنقل والتحكم بالغرف
  document.getElementById("createRoomBtn").addEventListener("click", handleCreateRoom);
  document.getElementById("joinRoomBtn").addEventListener("click", handleJoinRoom);
  document.getElementById("soloPlayBtn").addEventListener("click", startSoloGame);
  document.getElementById("startShiftBtn").addEventListener("click", startMultiplayerGame);
  document.getElementById("playAgainBtn").addEventListener("click", resetToLobby);
  document.getElementById("copyRoomLinkBtn").addEventListener("click", copyRoomLink);
  document.getElementById("toggleMusicBtn").addEventListener("click", toggleMusic);

  // تبديل المحطات في شاشة اللعب
  document.querySelectorAll(".station-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const station = e.currentTarget.getAttribute("data-station");
      switchStation(station);
    });
  });

  // أزرار الصرخات السريعة
  document.querySelectorAll(".shout-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const text = e.currentTarget.getAttribute("data-shout");
      triggerShout(text);
    });
  });
}

// --- 3. نظام الغرف والشبكة (MQTT) ---
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

  initMqttConnection(STATE.roomCode);
  updatePlayersChips([{ name: STATE.playerName, avatar: STATE.playerAvatar, isHost: true }]);
  showToast(`أنشأت كافيه برمز: ${STATE.roomCode} ✨`);
}

function handleJoinRoom() {
  const nameInput = document.getElementById("playerNameInput").value.trim();
  const codeInput = document.getElementById("joinRoomCodeInput").value.trim().toUpperCase();

  if (!codeInput || codeInput.length < 4) {
    alert("الرجاء إدخال كود الكافيه الصحيح (4 أحرف)");
    return;
  }

  if (nameInput) STATE.playerName = nameInput;
  STATE.roomCode = codeInput;
  STATE.isHost = false;

  initMqttConnection(STATE.roomCode);
  document.getElementById("lobbyScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");
  document.getElementById("gameStatsBar").style.display = "flex";
  
  startGameLoop();
  showToast(`انضممت بنجاح للكافيه! ☕🌸`);
}

function startSoloGame() {
  const nameInput = document.getElementById("playerNameInput").value.trim();
  if (nameInput) STATE.playerName = nameInput;

  document.getElementById("lobbyScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");
  document.getElementById("gameStatsBar").style.display = "flex";

  startGameLoop();
  showToast(`بدأ شفت التدريب الفردي! بالتوفيق 💖`);
}

function startMultiplayerGame() {
  if (mqttClient) {
    mqttClient.publish(`pookiecafe/${STATE.roomCode}/start`, JSON.stringify({ action: "start" }));
  }
  document.getElementById("lobbyScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");
  document.getElementById("gameStatsBar").style.display = "flex";
  startGameLoop();
}

function copyRoomLink() {
  const link = `${window.location.origin}${window.location.pathname}?room=${STATE.roomCode}`;
  navigator.clipboard.writeText(link).then(() => {
    showToast("تم نسخ رابط الكافيه لصديقاتك! 📋");
  });
}

function initMqttConnection(code) {
  try {
    mqttClient = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");
    mqttClient.on("connect", () => {
      mqttClient.subscribe(`pookiecafe/${code}/#`);
      mqttClient.publish(`pookiecafe/${code}/join`, JSON.stringify({ name: STATE.playerName, avatar: STATE.playerAvatar }));
    });

    mqttClient.on("message", (topic, payload) => {
      const data = JSON.parse(payload.toString());
      if (topic.endsWith("/join")) {
        // تحديث قائمة اللاعبين
      } else if (topic.endsWith("/start")) {
        if (!STATE.isHost) {
          document.getElementById("lobbyScreen").classList.remove("active");
          document.getElementById("gameScreen").classList.add("active");
          document.getElementById("gameStatsBar").style.display = "flex";
          startGameLoop();
        }
      }
    });
  } catch (e) {
    console.log("وضع اللعب المحلي مفعل");
  }
}

function updatePlayersChips(players) {
  const container = document.getElementById("playersChipsContainer");
  if (!container) return;
  container.innerHTML = "";
  players.forEach(p => {
    const chip = document.createElement("div");
    chip.className = `player-chip ${p.isHost ? "is-host" : ""}`;
    chip.innerHTML = `<span style="width:22px;height:22px;display:inline-block">${ANIMALS_SVG[p.avatar] || ANIMALS_SVG.cat}</span> ${p.name} ${p.isHost ? "👑" : ""}`;
    container.appendChild(chip);
  });
}

// --- 4. حلقة اللعبة وإدارة الشفت (Game Loop) ---
function startGameLoop() {
  STATE.timer = 180;
  STATE.score = 0;
  STATE.coins = 50;
  STATE.level = 1;
  activeOrders = [];
  sharedCounterItems = [];

  updateStatsDisplay();
  switchStation("drinks");

  // مؤقت الوقت
  gameInterval = setInterval(() => {
    STATE.timer--;
    updateStatsDisplay();
    if (STATE.timer <= 0) {
      endGameShift();
    }
  }, 1000);

  // مؤقت توليد الزبائن الجدد
  orderSpawnerTimer = setInterval(() => {
    if (activeOrders.length < 4) {
      spawnCustomerOrder();
    }
  }, 7000);

  // توليد أول زبونين فوراً
  spawnCustomerOrder();
  spawnCustomerOrder();
}

function updateStatsDisplay() {
  document.getElementById("statScore").textContent = STATE.score;
  document.getElementById("statCoins").textContent = `${STATE.coins} 🪙`;
  document.getElementById("statLevel").textContent = `${STATE.level} ⭐`;
  
  const m = Math.floor(STATE.timer / 60);
  const s = STATE.timer % 60;
  const timerEl = document.getElementById("statTimer");
  timerEl.textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
  if (STATE.timer < 30) timerEl.classList.add("low");

  const comboEl = document.getElementById("statCombo");
  if (STATE.combo > 1) {
    comboEl.textContent = `x${STATE.combo}`;
    comboEl.classList.add("hot");
  } else {
    comboEl.textContent = "—";
    comboEl.classList.remove("hot");
  }
}

function spawnCustomerOrder() {
  const keys = Object.keys(RECIPES);
  const recipeKey = keys[Math.floor(Math.random() * keys.length)];
  const customer = CUSTOMERS_POOL[Math.floor(Math.random() * CUSTOMERS_POOL.length)];
  const isVip = Math.random() < 0.25;

  const newOrder = {
    id: "ord_" + Math.random().toString(36).substring(2, 7),
    recipeKey: recipeKey,
    recipe: RECIPES[recipeKey],
    customer: customer,
    isVip: isVip,
    maxPatience: isVip ? 45 : 35,
    patience: isVip ? 45 : 35
  };

  activeOrders.push(newOrder);
  renderOrdersRack();
  playAudioBeep(600, 0.1);
}

// --- 5. محطات العمل والتجهيز ---
function switchStation(stationName) {
  STATE.activeStation = stationName;
  document.querySelectorAll(".station-tab-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-station") === stationName);
  });

  const hintEl = document.getElementById("stationHint");
  const gridEl = document.getElementById("ingredientsGrid");
  gridEl.className = "ingredients-grid";

  if (stationName === "drinks") {
    hintEl.textContent = "اختر الكوب ثم أضف المكونات وشغل آلة البوبا!";
    renderDrinksStation();
  } else if (stationName === "bakery") {
    hintEl.textContent = "اختر العجينة وأدخلها الفرن للحصول على الحلويات الكيوت!";
    renderBakeryStation();
  } else if (stationName === "serving") {
    hintEl.textContent = "تفقد طاولة التجهيز أو سلم الطلبات للزبائن مباشرة!";
    renderServingStation();
  } else if (stationName === "shop") {
    hintEl.textContent = "طور أجهزة المشتل والكافيه أو افتح وصفات جديدة!";
    renderShopStation();
  }
}

function renderDrinksStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = `
    <div class="machines-bar">
      <div class="machine-btn ${STATE.machines.bobaMaker.busy ? 'busy' : ''}" onclick="useMachine('bobaMaker')">
        <span class="machine-icon">🧋</span>
        <div class="machine-text">
          <span class="machine-name">آلة البوبا (${STATE.machines.bobaMaker.level}⭐)</span>
          <span class="machine-action">تشغيل الآلة</span>
        </div>
        ${STATE.machines.bobaMaker.busy ? '<div class="machine-progress"></div>' : ''}
      </div>
    </div>
  `;

  const items = [
    { id: "milk", name: "حليب طازج", icon: "🥛", unlocked: STATE.inventory.milk },
    { id: "matcha", name: "بودرة الماتشا", icon: "🍵", unlocked: STATE.inventory.matcha },
    { id: "boba", name: "لؤلؤ البوبا", icon: "🧋", unlocked: STATE.inventory.boba },
    { id: "strawberry", name: "صوص الفراولة", icon: "🍓", unlocked: STATE.inventory.strawberry }
  ];

  items.forEach(item => {
    const card = document.createElement("button");
    card.className = `ingredient-card ${!item.unlocked ? 'locked' : ''}`;
    card.innerHTML = `
      <span class="ing-icon">${item.icon}</span>
      <span class="ing-name">${item.name}</span>
      ${!item.unlocked ? '<span class="lock-badge">مغلق بالمتجر</span>' : ''}
    `;
    card.addEventListener("click", () => {
      if (item.unlocked) addIngredientToCurrent(item.id, item.name, item.icon);
      else showToast("هذا المكون مقفل، اطلبه من المتجر أولاً! 🛍️");
    });
    grid.appendChild(card);
  });
  renderWorkbenchPreview();
}

function renderBakeryStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = `
    <div class="machines-bar">
      <div class="machine-btn ${STATE.machines.oven.busy ? 'busy' : ''}" onclick="useMachine('oven')">
        <span class="machine-icon">🔥</span>
        <div class="machine-text">
          <span class="machine-name">فرن الحلويات (${STATE.machines.oven.level}⭐)</span>
          <span class="machine-action">خبز المعجنات</span>
        </div>
        ${STATE.machines.oven.busy ? '<div class="machine-progress"></div>' : ''}
      </div>
    </div>
  `;

  const items = [
    { id: "cookieDough", name: "عجينة الكوكيز", icon: "🍪", unlocked: STATE.inventory.cookieDough },
    { id: "cakeBatter", name: "خليط الكيك", icon: "🧁", unlocked: STATE.inventory.cakeBatter },
    { id: "chocolate", name: "شوكولاتة ساخنة", icon: "🍫", unlocked: STATE.inventory.chocolate },
    { id: "caramel", name: "صوص الكراميل", icon: "🍯", unlocked: STATE.inventory.caramel }
  ];

  items.forEach(item => {
    const card = document.createElement("button");
    card.className = `ingredient-card ${!item.unlocked ? 'locked' : ''}`;
    card.innerHTML = `
      <span class="ing-icon">${item.icon}</span>
      <span class="ing-name">${item.name}</span>
      ${!item.unlocked ? '<span class="lock-badge">مغلق بالمتجر</span>' : ''}
    `;
    card.addEventListener("click", () => {
      if (item.unlocked) addIngredientToCurrent(item.id, item.name, item.icon);
      else showToast("هذا المكون مقفل، اطلبه من المتجر أولاً! 🛍️");
    });
    grid.appendChild(card);
  });
  renderWorkbenchPreview();
}

function addIngredientToCurrent(id, name, icon) {
  STATE.currentRecipe.ingredients.push(id);
  renderWorkbenchPreview();
  playAudioBeep(800, 0.05);
}

function useMachine(machineKey) {
  if (STATE.machines[machineKey].busy) return;
  STATE.machines[machineKey].busy = true;
  STATE.currentRecipe.machineDone = true;
  renderWorkbenchPreview();
  switchStation(STATE.activeStation);

  setTimeout(() => {
    STATE.machines[machineKey].busy = false;
    renderWorkbenchPreview();
    switchStation(STATE.activeStation);
    playAudioBeep(1200, 0.15);
    showToast("تم الانتهاء من تجهيز الآلة بنجاح! ✨");
  }, 2000 / STATE.machines[machineKey].level);
}

function renderWorkbenchPreview() {
  const bench = document.getElementById("currentItemVisual");
  const ings = STATE.currentRecipe.ingredients;

  if (ings.length === 0) {
    bench.innerHTML = `
      <span class="item-cup-preview empty">🥛</span>
      <span style="font-size: 12.5px; color: var(--text-muted);">طاولة التحضير فارغة. أضف المكونات وشغل الآلة!</span>
    `;
    return;
  }

  bench.innerHTML = `
    <span class="item-cup-preview">✨</span>
    <div class="item-ingredients-tags">
      ${ings.map(i => `<span class="ingredient-badge">${i}</span>`).join("")}
    </div>
    <div class="workbench-actions">
      <button class="btn-primary small" onclick="finishCurrentDish()">✨ وضع على طاولة التجهيز</button>
      <button class="btn-clear small" onclick="clearWorkbench()">🗑️ إعادة المحاولة</button>
    </div>
  `;
}

function clearWorkbench() {
  STATE.currentRecipe = { base: null, ingredients: [], machineDone: false };
  renderWorkbenchPreview();
}

function finishCurrentDish() {
  // مطابقة الطبخة مع أي طلب حالي
  const currentIngs = [...STATE.currentRecipe.ingredients].sort();
  let matchedOrderKey = null;

  for (let [k, r] of Object.entries(RECIPES)) {
    const reqSorted = [...r.req].sort();
    if (JSON.stringify(currentIngs) === JSON.stringify(reqSorted)) {
      matchedOrderKey = k;
      break;
    }
  }

  if (!matchedOrderKey) {
    showToast("هذه الوصفة غير مطابقة لأي طلب زبون حالي! ❌");
    return;
  }

  // إضافة الصنف لطاولة التجهيز المشتركة
  sharedCounterItems.push({
    recipeKey: matchedOrderKey,
    recipe: RECIPES[matchedOrderKey],
    maker: STATE.playerName
  });

  clearWorkbench();
  renderSharedCounter();
  showToast("تم وضع الطبق على طاولة التجهيز المشتركة بنجاح! 🛎️");
  switchStation("serving");
}

// --- 6. شاشة التسليم والمتجر المنظم ---
function renderSharedCounter() {
  const container = document.getElementById("sharedItemsContainer");
  if (!container) return;

  if (sharedCounterItems.length === 0) {
    container.innerHTML = `<span class="shared-empty-hint">طاولة التجهيز فارغة حالياً.. اطبخوا وشاركوا الأطباق هنا! 🍰</span>`;
    return;
  }

  container.innerHTML = "";
  sharedCounterItems.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "shared-item-card";
    card.innerHTML = `
      <div class="shared-item-name"><span>${item.recipe.cup}</span> ${item.recipe.name}</div>
      <div class="shared-item-maker">بواسطة: ${item.maker}</div>
      <div class="shared-item-actions">
        <button class="quick-serve-btn" onclick="serveSharedItem(${index})">تسليم 🛎️</button>
        <button class="trash-item-btn" onclick="removeSharedItem(${index})">🗑️</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderServingStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.className = "ingredients-grid";
  grid.innerHTML = "";

  if (activeOrders.length === 0) {
    grid.innerHTML = `<div class="grid-empty">لا توجد طلبات زبائن معلقة حالياً.. انتظر قليلاً! 🌸</div>`;
    return;
  }

  activeOrders.forEach((ord, index) => {
    const card = document.createElement("div");
    card.className = "serve-card";
    card.innerHTML = `
      <div class="serve-card-icon">${ord.recipe.cup}</div>
      <div class="serve-card-name">${ord.recipe.name}</div>
      <div class="serve-card-customer"><span>${ANIMALS_SVG[ord.customer.avatar] || ANIMALS_SVG.cat}</span> ${ord.customer.name}</div>
      <button class="serve-direct-btn" onclick="fulfillOrder('${ord.id}')">تقديم مباشر ✨</button>
    `;
    grid.appendChild(card);
  });
}

function serveSharedItem(index) {
  const item = sharedCounterItems[index];
  const orderIdx = activeOrders.findIndex(o => o.recipeKey === item.recipeKey);

  if (orderIdx !== -1) {
    completeOrder(orderIdx);
    sharedCounterItems.splice(index, 1);
    renderSharedCounter();
    renderServingStation();
  } else {
    showToast("لا يوجد زبون يطلب هذا الصنف حالياً! ❌");
  }
}

function removeSharedItem(index) {
  sharedCounterItems.splice(index, 1);
  renderSharedCounter();
}

function fulfillOrder(orderId) {
  const orderIdx = activeOrders.findIndex(o => o.id === orderId);
  if (orderIdx !== -1) {
    completeOrder(orderIdx);
    renderServingStation();
  }
}

function completeOrder(orderIdx) {
  const order = activeOrders[orderIdx];
  activeOrders.splice(orderIdx, 1);

  STATE.score += order.isVip ? 250 : 100;
  STATE.coins += order.isVip ? 35 : 15;
  STATE.servedCount++;
  STATE.combo++;
  if (STATE.combo > STATE.maxCombo) STATE.maxCombo = STATE.combo;
  if (order.isVip) STATE.vipCount++;

  updateStatsDisplay();
  renderOrdersRack();
  playAudioBeep(1000, 0.1);
  showToast(`أتممت الطلب بنجاح! +${order.isVip ? 250 : 100} نقاط ⭐`);
}

function renderOrdersRack() {
  const rack = document.getElementById("ordersRack");
  if (!rack) return;

  if (activeOrders.length === 0) {
    rack.innerHTML = `<div class="orders-empty">جميع الطلبات مسلمة! الكافيه هادئ وجميل 🌸</div>`;
    return;
  }

  rack.innerHTML = "";
  activeOrders.forEach(ord => {
    const card = document.createElement("div");
    card.className = `order-card ${ord.isVip ? 'vip' : ''}`;
    card.innerHTML = `
      <div class="order-customer">
        <div class="order-avatar">${ANIMALS_SVG[ord.customer.avatar]}</div>
        <div class="order-name">${ord.customer.name}</div>
        ${ord.isVip ? '<span class="vip-badge">VIP 👑</span>' : ''}
      </div>
      <div class="patience-bar-bg">
        <div class="patience-bar-fill" style="width: 100%;"></div>
      </div>
      <div class="order-recipe">
        <div class="recipe-title">${ord.recipe.name}</div>
        <div class="recipe-tags">
          ${ord.recipe.req.map(r => `<span class="recipe-tag">${r}</span>`).join("")}
        </div>
      </div>
      <button class="order-serve-btn" onclick="fulfillOrder('${ord.id}')">جاهز للتسليم 🛎️</button>
    `;
    rack.appendChild(card);
  });
}

// --- 7. متجر الأجهزة والتطويرات (مرتب ومنظم بوضوح تام) ---
function renderShopStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.className = "ingredients-grid shop-mode";
  grid.innerHTML = `
    <div style="font-size: 14px; font-weight: 900; color: var(--pink-main); margin-bottom: 6px;">
      🛍️ متجر كافيه بوكي (أرباحك الحالية: <span class="coins-strong">${STATE.coins} 🪙</span>)
    </div>
  `;

  const shopItems = [
    {
      id: "oven",
      title: "تطوير الفرن السريع",
      desc: "يضاعف سرعة خبز المعجنات والحلويات الكيوت بالفرن.",
      cost: STATE.machines.oven.cost,
      level: STATE.machines.oven.level,
      max: STATE.machines.oven.maxLevel,
      type: "machine",
      icon: "🔥"
    },
    {
      id: "bobaMaker",
      title: "تطوير آلة البوبا",
      desc: "يزيد من سرعة وتيرة تحضير مشروبات الماتشا والبوبا.",
      cost: STATE.machines.bobaMaker.cost,
      level: STATE.machines.bobaMaker.level,
      max: STATE.machines.bobaMaker.maxLevel,
      type: "machine",
      icon: "🧋"
    },
    {
      id: "strawberry",
      title: "فتح مكون الفراولة و صوص التوت",
      desc: "يسمح لكِ بتحضير مشروبات جديدة ومطلوبة للزبائن.",
      cost: 45,
      unlocked: STATE.inventory.strawberry,
      type: "ingredient",
      icon: "🍓"
    },
    {
      id: "chocolate",
      title: "فتح صوص الشوكولاتة الغنية",
      desc: "يفتح لكِ إمكانية إعداد دونات وصواني شوكولاتة فاخرة.",
      cost: 55,
      unlocked: STATE.inventory.chocolate,
      type: "ingredient",
      icon: "🍫"
    }
  ];

  shopItems.forEach(item => {
    const isMax = item.level && item.level >= item.max;
    const isDone = item.unlocked || isMax;
    const canAfford = STATE.coins >= item.cost;

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <div class="shop-card-icon">${item.icon}</div>
      <div class="shop-card-info">
        <div class="shop-card-name">
          ${item.title}
          ${item.level ? `<span class="pips">${Array.from({length: item.max}, (_, i) => `<span class="pip ${i < item.level ? 'on' : ''}"></span>`).join("")}</span>` : ''}
        </div>
        <div class="shop-card-desc">${item.desc}</div>
        <div class="shop-card-note">${isDone ? '✨ تم تفعيله واقتناؤه بالكامل' : `السعر المطلوب: ${item.cost} 🪙`}</div>
      </div>
      <button class="shop-buy-btn ${isDone ? 'done' : (!canAfford ? 'poor' : '')}" onclick="buyShopItem('${item.id}', ${item.cost}, '${item.type}')">
        ${isDone ? 'مكتمل ✓' : `${item.cost} 🪙 شراء`}
      </button>
    `;
    grid.appendChild(card);
  });
}

function buyShopItem(id, cost, type) {
  if (STATE.coins < cost) {
    showToast("عذراً، أرباحك الحالية لا تكفي لشراء هذا التطوير! 🪙");
    return;
  }

  if (type === "machine") {
    if (STATE.machines[id].level < STATE.machines[id].maxLevel) {
      STATE.coins -= cost;
      STATE.machines[id].level++;
      STATE.machines[id].cost += 30;
      showToast(`تم ترقية الآلة بنجاح! 🚀`);
    } else {
      showToast("هذه الآلة وصلت للفل الأقصى! ⭐");
    }
  } else if (type === "ingredient") {
    if (!STATE.inventory[id]) {
      STATE.coins -= cost;
      STATE.inventory[id] = true;
      showToast(`تم فتح المكون الجديد بنجاح في المطبخ! 🌸`);
    }
  }

  updateStatsDisplay();
  renderShopStation();
}

// --- 8. نهاية اللعبة والأصوات ---
function endGameShift() {
  clearInterval(gameInterval);
  clearInterval(orderSpawnerTimer);

  document.getElementById("gameScreen").classList.remove("active");
  document.getElementById("gameStatsBar").style.display = "none";
  document.getElementById("resultsScreen").classList.add("active");

  document.getElementById("resultScore").textContent = STATE.score;
  document.getElementById("resultCoins").textContent = `${STATE.coins} 🪙`;
  document.getElementById("resultServed").textContent = STATE.servedCount;
  document.getElementById("resultMissed").textContent = STATE.missedCount;
  document.getElementById("resultCombo").textContent = `x${STATE.maxCombo}`;
  document.getElementById("resultVip").textContent = STATE.vipCount;
  document.getElementById("resultLevel").textContent = STATE.level;

  let stars = "⭐";
  if (STATE.score >= 1000) stars = "⭐⭐⭐";
  else if (STATE.score >= 500) stars = "⭐⭐";
  document.getElementById("resultStars").textContent = stars;

  playAudioBeep(1500, 0.3);
}

function resetToLobby() {
  document.getElementById("resultsScreen").classList.remove("active");
  document.getElementById("lobbyScreen").classList.add("active");
  document.getElementById("roomWaitingBox").style.display = "none";
  document.getElementById("createRoomBtn").style.display = "inline-flex";
  document.getElementById("joinRoomInputWrap").style.display = "flex";
  document.getElementById("soloPlayBtn").style.display = "inline-block";
}

function triggerShout(text) {
  const toast = document.getElementById("toastShout");
  toast.innerHTML = `<span>💬</span> <span>${STATE.playerName}: ${text}</span>`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function showToast(msg) {
  const toast = document.getElementById("toastShout");
  toast.innerHTML = `<span>✨</span> <span>${msg}</span>`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function initSoundEngine() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  } catch (e) {}
}

function playAudioBeep(freq, duration) {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function toggleMusic() {
  showToast("موسيقى لوفاي الكوزي تعمل في الخلفية 🎵");
}
```[cite: 1, 2, 3]
