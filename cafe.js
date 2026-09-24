/* =========================================================================
   كافيه البنات المشترك | Pookie Cozy Cafe Rush
   Core Logic & MQTT Multiplayer + Kawaii Animated Animals + Shop
   ========================================================================= */

const STATE = {
  playerName: "باريستا بوكي",
  playerAvatar: "cat",
  roomCode: null,
  isHost: false,
  score: 0,
  coins: 50,
  level: 1,
  timer: 180,
  combo: 0,
  maxCombo: 0,
  servedCount: 0,
  missedCount: 0,
  vipCount: 0,
  activeStation: "drinks",
  currentRecipe: { base: null, ingredients: [], machineDone: false },
  inventory: {
    milk: true,
    matcha: true,
    boba: true,
    strawberry: false,
    chocolate: false,
    caramel: false,
    cookieDough: true,
    cakeBatter: true
  },
  machines: {
    bobaMaker: { level: 1, maxLevel: 3, busy: false, progress: 0, cost: 40 },
    oven: { level: 1, maxLevel: 3, busy: false, progress: 0, cost: 50 }
  }
};

// أيقونات الحيوانات الكيوت بصيغة SVG الحية
const ANIMALS_SVG = {
  cat: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><ellipse cx="32" cy="36" rx="20" ry="18" fill="#ffd1dc"/><polygon points="16,22 22,6 30,20" fill="#ffb3c6" class="a-ear-l"/><polygon points="48,22 42,6 34,20" fill="#ffb3c6" class="a-ear-r"/><circle cx="24" cy="32" r="3" fill="#3b2d35" class="a-eyes"/><circle cx="40" cy="32" r="3" fill="#3b2d35" class="a-eyes"/><path d="M29,38 Q32,41 35,38" fill="none" stroke="#3b2d35" stroke-width="2" stroke-linecap="round"/><ellipse cx="32" cy="35" rx="2" ry="1.2" fill="#ff7597"/></g></svg>`,
  bunny: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><ellipse cx="32" cy="38" rx="19" ry="17" fill="#ffffff"/><ellipse cx="23" cy="14" rx="4" ry="12" fill="#ffd1dc" class="a-ear-l"/><ellipse cx="41" cy="14" rx="4" ry="12" fill="#ffd1dc" class="a-ear-r"/><circle cx="25" cy="34" r="2.5" fill="#3b2d35" class="a-eyes"/><circle cx="39" cy="34" r="2.5" fill="#3b2d35" class="a-eyes"/><polygon points="32,38 30,36 34,36" fill="#ff7597"/></g></svg>`,
  bear: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><circle cx="32" cy="36" r="18" fill="#d7ccc8"/><circle cx="18" cy="22" r="6" fill="#bcaaa4" class="a-ear-l"/><circle cx="46" cy="22" r="6" fill="#bcaaa4" class="a-ear-r"/><circle cx="24" cy="33" r="2.5" fill="#3b2d35" class="a-eyes"/><circle cx="40" cy="33" r="2.5" fill="#3b2d35" class="a-eyes"/><ellipse cx="32" cy="38" rx="5" ry="3.5" fill="#efebe9"/><circle cx="32" cy="37" r="2" fill="#3b2d35"/></g></svg>`,
  panda: `<svg class="animal" viewBox="0 0 64 64"><g class="a-body"><circle cx="32" cy="36" r="18" fill="#ffffff"/><circle cx="19" cy="22" r="6" fill="#212121" class="a-ear-l"/><circle cx="45" cy="22" r="6" fill="#212121" class="a-ear-r"/><ellipse cx="23" cy="33" rx="5" ry="4" fill="#212121"/><ellipse cx="41" cy="33" rx="5" ry="4" fill="#212121"/><circle cx="24" cy="33" r="1.5" fill="#fff"/><circle cx="40" cy="33" r="1.5" fill="#fff"/><circle cx="32" cy="39" r="2" fill="#212121"/></g></svg>`
};

const RECIPES = {
  matchaLatte: { name: "ماتشا لاتيه بوبا", type: "drinks", cup: "🧋", req: ["milk", "matcha", "boba"] },
  strawberryBoba: { name: "بوبا الفراولة الوردية", type: "drinks", cup: "🥤", req: ["milk", "strawberry", "boba"] },
  chocolateDonut: { name: "دونات الشوكولاتة الكيوت", type: "bakery", cup: "🍩", req: ["cookieDough", "chocolate"] },
  matchaCake: { name: "كيكة الماتشا والكراميل", type: "bakery", cup: "🍰", req: ["cakeBatter", "matcha", "caramel"] }
};

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

window.addEventListener("DOMContentLoaded", () => {
  renderAvatarChoices();
  setupEventListeners();
});

// رسم خيارات الشخصيات تحت جملة "اختاري شخصيتك الكيوت"
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
      showToast(`تم اختيار الشخصية بنجاح! 🌸`);
    });
    row.appendChild(div);
  });
}

function setupEventListeners() {
  document.getElementById("createRoomBtn").addEventListener("click", handleCreateRoom);
  document.getElementById("joinRoomBtn").addEventListener("click", handleJoinRoom);
  document.getElementById("soloPlayBtn").addEventListener("click", startSoloGame);
  document.getElementById("startShiftBtn").addEventListener("click", startMultiplayerGame);
  document.getElementById("playAgainBtn").addEventListener("click", resetToLobby);
  document.getElementById("copyRoomLinkBtn").addEventListener("click", copyRoomLink);

  document.querySelectorAll(".station-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      switchStation(e.currentTarget.getAttribute("data-station"));
    });
  });

  document.querySelectorAll(".shout-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      triggerShout(e.currentTarget.getAttribute("data-shout"));
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
  const nameInput = document.getElementById("playerNameInput").value.trim();
  const codeInput = document.getElementById("joinRoomCodeInput").value.trim().toUpperCase();

  if (!codeInput || codeInput.length < 4) {
    alert("الرجاء إدخال كود الكافيه الصحيح");
    return;
  }

  if (nameInput) STATE.playerName = nameInput;
  STATE.roomCode = codeInput;

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
  document.getElementById("lobbyScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");
  document.getElementById("gameStatsBar").style.display = "flex";
  startGameLoop();
}

function copyRoomLink() {
  const link = `${window.location.origin}${window.location.pathname}?room=${STATE.roomCode}`;
  navigator.clipboard.writeText(link).then(() => showToast("تم نسخ رابط الكافيه! 📋"));
}

function startGameLoop() {
  STATE.timer = 180;
  STATE.score = 0;
  STATE.coins = 50;
  activeOrders = [];
  sharedCounterItems = [];

  updateStatsDisplay();
  switchStation("drinks");

  gameInterval = setInterval(() => {
    STATE.timer--;
    updateStatsDisplay();
    if (STATE.timer <= 0) endGameShift();
  }, 1000);

  orderSpawnerTimer = setInterval(() => {
    if (activeOrders.length < 4) spawnCustomerOrder();
  }, 7000);

  spawnCustomerOrder();
  spawnCustomerOrder();
}

function updateStatsDisplay() {
  document.getElementById("statScore").textContent = STATE.score;
  document.getElementById("statCoins").textContent = `${STATE.coins} 🪙`;
  document.getElementById("statLevel").textContent = `${STATE.level} ⭐`;
  
  const m = Math.floor(STATE.timer / 60);
  const s = STATE.timer % 60;
  document.getElementById("statTimer").textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
}

function spawnCustomerOrder() {
  const keys = Object.keys(RECIPES);
  const recipeKey = keys[Math.floor(Math.random() * keys.length)];
  const customer = CUSTOMERS_POOL[Math.floor(Math.random() * CUSTOMERS_POOL.length)];
  const isVip = Math.random() < 0.25;

  activeOrders.push({
    id: "ord_" + Math.random().toString(36).substring(2, 7),
    recipeKey: recipeKey,
    recipe: RECIPES[recipeKey],
    customer: customer,
    isVip: isVip
  });
  renderOrdersRack();
}

function switchStation(stationName) {
  STATE.activeStation = stationName;
  document.querySelectorAll(".station-tab-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-station") === stationName);
  });

  const hintEl = document.getElementById("stationHint");
  const gridEl = document.getElementById("ingredientsGrid");
  gridEl.className = "ingredients-grid";

  if (stationName === "drinks") {
    hintEl.textContent = "اختر المكونات وشغل آلة البوبا!";
    renderDrinksStation();
  } else if (stationName === "bakery") {
    hintEl.textContent = "اختر العجينة وأدخلها الفرن!";
    renderBakeryStation();
  } else if (stationName === "serving") {
    hintEl.textContent = "سلم الطلبات للزبائن من طاولة التجهيز!";
    renderServingStation();
  } else if (stationName === "shop") {
    hintEl.textContent = "طور الأجهزة والمكونات بأسعار واضحة!";
    renderShopStation();
  }
}

function renderDrinksStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = `
    <div class="machines-bar">
      <div class="machine-btn" onclick="useMachine('bobaMaker')">
        <span class="machine-icon">🧋</span>
        <div class="machine-text">
          <span class="machine-name">آلة البوبا (${STATE.machines.bobaMaker.level}⭐)</span>
          <span class="machine-action">تشغيل الآلة</span>
        </div>
      </div>
    </div>
  `;

  [
    { id: "milk", name: "حليب طازج", icon: "🥛", unlocked: STATE.inventory.milk },
    { id: "matcha", name: "بودرة الماتشا", icon: "🍵", unlocked: STATE.inventory.matcha },
    { id: "boba", name: "لؤلؤ البوبا", icon: "🧋", unlocked: STATE.inventory.boba },
    { id: "strawberry", name: "صوص الفراولة", icon: "🍓", unlocked: STATE.inventory.strawberry }
  ].forEach(item => {
    const card = document.createElement("button");
    card.className = `ingredient-card ${!item.unlocked ? 'locked' : ''}`;
    card.innerHTML = `<span class="ing-icon">${item.icon}</span><span class="ing-name">${item.name}</span>${!item.unlocked ? '<span class="lock-badge">مقفل</span>' : ''}`;
    card.addEventListener("click", () => {
      if (item.unlocked) addIngredientToCurrent(item.id);
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
      <div class="machine-btn" onclick="useMachine('oven')">
        <span class="machine-icon">🔥</span>
        <div class="machine-text">
          <span class="machine-name">فرن الحلويات (${STATE.machines.oven.level}⭐)</span>
          <span class="machine-action">خبز المعجنات</span>
        </div>
      </div>
    </div>
  `;

  [
    { id: "cookieDough", name: "عجينة الكوكيز", icon: "🍪", unlocked: STATE.inventory.cookieDough },
    { id: "cakeBatter", name: "خليط الكيك", icon: "🧁", unlocked: STATE.inventory.cakeBatter },
    { id: "chocolate", name: "شوكولاتة ساخنة", icon: "🍫", unlocked: STATE.inventory.chocolate },
    { id: "caramel", name: "صوص الكراميل", icon: "🍯", unlocked: STATE.inventory.caramel }
  ].forEach(item => {
    const card = document.createElement("button");
    card.className = `ingredient-card ${!item.unlocked ? 'locked' : ''}`;
    card.innerHTML = `<span class="ing-icon">${item.icon}</span><span class="ing-name">${item.name}</span>${!item.unlocked ? '<span class="lock-badge">مقفل</span>' : ''}`;
    card.addEventListener("click", () => {
      if (item.unlocked) addIngredientToCurrent(item.id);
      else showToast("هذا المكون مقفل، اطلبه من المتجر أولاً! 🛍️");
    });
    grid.appendChild(card);
  });
  renderWorkbenchPreview();
}

function addIngredientToCurrent(id) {
  STATE.currentRecipe.ingredients.push(id);
  renderWorkbenchPreview();
}

function useMachine(machineKey) {
  STATE.machines[machineKey].busy = true;
  setTimeout(() => {
    STATE.machines[machineKey].busy = false;
    showToast("تم الانتهاء من تجهيز الآلة بنجاح! ✨");
  }, 1500);
}

function renderWorkbenchPreview() {
  const bench = document.getElementById("currentItemVisual");
  const ings = STATE.currentRecipe.ingredients;

  if (ings.length === 0) {
    bench.innerHTML = `<span class="item-cup-preview" style="opacity:0.4">🥛</span><span style="font-size:12.5px;color:var(--text-muted)">طاولة التحضير فارغة.. أضف المكونات!</span>`;
    return;
  }

  bench.innerHTML = `
    <span class="item-cup-preview">✨</span>
    <div class="item-ingredients-tags">${ings.map(i => `<span class="ingredient-badge">${i}</span>`).join("")}</div>
    <div style="display:flex;gap:8px;margin-top:10px;">
      <button class="btn-primary" style="padding:6px 14px;font-size:12px;" onclick="finishCurrentDish()">وضع على الطاولة 🛎️</button>
      <button class="btn-secondary" style="padding:6px 14px;font-size:12px;" onclick="clearWorkbench()">إعادة 🗑️</button>
    </div>
  `;
}

function clearWorkbench() {
  STATE.currentRecipe.ingredients = [];
  renderWorkbenchPreview();
}

function finishCurrentDish() {
  const currentIngs = [...STATE.currentRecipe.ingredients].sort();
  let matchedKey = null;

  for (let [k, r] of Object.entries(RECIPES)) {
    if (JSON.stringify(currentIngs) === JSON.stringify([...r.req].sort())) {
      matchedKey = k;
      break;
    }
  }

  if (!matchedKey) {
    showToast("هذه الوصفة غير مطابقة لأي طلب حالي! ❌");
    return;
  }

  sharedCounterItems.push({ recipeKey: matchedKey, recipe: RECIPES[matchedKey], maker: STATE.playerName });
  clearWorkbench();
  renderSharedCounter();
  showToast("تم وضع الطبق على طاولة التجهيز! 🛎️");
  switchStation("serving");
}

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
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--text-muted)">لا توجد طلبات زبائن معلقة حالياً.. انتظر قليلاً! 🌸</div>`;
    return;
  }

  activeOrders.forEach((ord) => {
    const card = document.createElement("div");
    card.className = "serve-card";
    card.innerHTML = `
      <div class="serve-card-icon">${ord.recipe.cup}</div>
      <div class="serve-card-name">${ord.recipe.name}</div>
      <div style="font-size:11px;color:var(--pink-main);font-weight:700;">الزبون: ${ord.customer.name}</div>
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

  updateStatsDisplay();
  renderOrdersRack();
  showToast(`أتممت الطلب بنجاح! +${order.isVip ? 250 : 100} نقطة ⭐`);
}

function renderOrdersRack() {
  const rack = document.getElementById("ordersRack");
  if (!rack) return;

  if (activeOrders.length === 0) {
    rack.innerHTML = `<div style="font-size:13px;color:var(--text-muted);padding:10px;">جميع الطلبات مسلمة! الكافيه هادئ وجميل 🌸</div>`;
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
      <div class="patience-bar-bg"><div class="patience-bar-fill" style="width: 100%;"></div></div>
      <div class="order-recipe">
        <div class="recipe-title">${ord.recipe.name}</div>
        <div class="recipe-tags">${ord.recipe.req.map(r => `<span class="recipe-tag">${r}</span>`).join("")}</div>
      </div>
      <button class="order-serve-btn" onclick="fulfillOrder('${ord.id}')">جاهز للتسليم 🛎️</button>
    `;
    rack.appendChild(card);
  });
}

function renderShopStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.className = "ingredients-grid shop-mode";
  grid.innerHTML = `
    <div style="font-size: 14px; font-weight: 900; color: var(--pink-main); margin-bottom: 6px;">
      🛍️ متجر كافيه بوكي (أرباحك الحالية: <span style="color:#d63031;">${STATE.coins} 🪙</span>)
    </div>
  `;

  [
    { id: "oven", title: "تطوير الفرن السريع", desc: "يضاعف سرعة خبز المعجنات والحلويات الكيوت.", cost: STATE.machines.oven.cost, level: STATE.machines.oven.level, max: STATE.machines.oven.maxLevel, type: "machine", icon: "🔥" },
    { id: "bobaMaker", title: "تطوير آلة البوبا", desc: "يزيد سرعة تحضير مشروبات الماتشا والبوبا.", cost: STATE.machines.bobaMaker.cost, level: STATE.machines.bobaMaker.level, max: STATE.machines.bobaMaker.maxLevel, type: "machine", icon: "🧋" },
    { id: "strawberry", title: "فتح مكون الفراولة وتوت العليق", desc: "يسمح لكِ بتحضير مشروبات وردية جديدة للزبائن.", cost: 45, unlocked: STATE.inventory.strawberry, type: "ingredient", icon: "🍓" },
    { id: "chocolate", title: "فتح صوص الشوكولاتة الغنية", desc: "يفتح لكِ إمكانية إعداد دونات وصواني شوكولاتة فاخرة.", cost: 55, unlocked: STATE.inventory.chocolate, type: "ingredient", icon: "🍫" }
  ].forEach(item => {
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
  document.getElementById("resultLevel").textContent = STATE.level;
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
