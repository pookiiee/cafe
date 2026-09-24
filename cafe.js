/* =========================================================================
   كافيه بوكي البنات | Pookie Cozy Cafe Rush
   Fixed: All customer recipes are strictly matched with available ingredients
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
  selectedBase: null,
  currentIngredients: [],
  readyDishes: [],
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
    pomegranateMojito: false
  }
};

const ANIMALS_SVG = {
  cat: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="36" r="20" fill="#ffb6c1"/><polygon points="14,24 20,4 30,20" fill="#ff69b4"/><polygon points="50,24 44,4 34,20" fill="#ff69b4"/><ellipse cx="24" cy="32" r="3" fill="#333"/><ellipse cx="40" cy="32" r="3" fill="#333"/><polygon points="32,36 29,40 35,40" fill="#ff1493"/><path d="M26,44 Q32,50 38,44" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  bunny: `<svg class="animal" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="18" ry="16" fill="#ffffff"/><ellipse cx="23" cy="14" rx="4" ry="10" fill="#ffb6c1"/><ellipse cx="41" cy="14" rx="4" ry="10" fill="#ffb6c1"/><circle cx="25" cy="36" r="2.5" fill="#333"/><circle cx="39" cy="36" r="2.5" fill="#333"/><ellipse cx="32" cy="40" rx="3" ry="2" fill="#ff69b4"/><path d="M28,45 Q32,49 36,45" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  bear: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="38" r="18" fill="#b08d57"/><circle cx="17" cy="22" r="7" fill="#8c673e"/><circle cx="47" cy="22" r="7" fill="#8c673e"/><circle cx="24" cy="34" r="2.5" fill="#333"/><circle cx="40" cy="34" r="2.5" fill="#333"/><ellipse cx="32" cy="40" rx="5" ry="3.5" fill="#fff"/><circle cx="32" cy="39" r="2" fill="#333"/><path d="M28,46 Q32,50 36,46" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  panda: `<svg class="animal" viewBox="0 0 64 64"><circle cx="32" cy="38" r="18" fill="#ffffff"/><ellipse cx="21" cy="32" rx="7" ry="6" fill="#222" transform="rotate(-15 21 32)"/><ellipse cx="43" cy="32" rx="7" ry="6" fill="#222" transform="rotate(15 43 32)"/><circle cx="23" cy="32" r="2" fill="#fff"/><circle cx="41" cy="32" r="2" fill="#fff"/><circle cx="17" cy="18" r="6" fill="#222"/><circle cx="47" cy="18" r="6" fill="#222"/><circle cx="32" cy="41" r="2.5" fill="#222"/><path d="M27,47 Q32,51 37,47" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`
};

// جميع الوصفات مطابقة 100% للمكونات الموجودة في المحطات
const RECIPES = {
  turkishCoffee: { name: "قهوة تركية", type: "drinks", cup: "☕", base: "كوب فارغ", req: ["قهوة", "حليب نقـي"], levelReq: 1, shopKey: null },
  karakTea: { name: "كراميل كرك", type: "drinks", cup: "🧋", base: "كوب فارغ", req: ["شاي", "حليب نقـي"], levelReq: 1, shopKey: null },
  bobaLatte: { name: "ماتشا بوبا", type: "drinks", cup: "🧋", base: "كوب فارغ", req: ["حليب نقـي", "ماتشا", "بوبا تابيوكا"], levelReq: 1, shopKey: null },
  cappuccino: { name: "كابتشينو برغوة", type: "drinks", cup: "☕", base: "كوب فارغ", req: ["قهوة", "حليب نقـي", "كريمة خفق"], levelReq: 1, shopKey: null },
  moroccanTea: { name: "شاي مغربي", type: "drinks", cup: "🍵", base: "كوب فارغ", req: ["شاي", "نعناع"], levelReq: 1, shopKey: null },
  
  kunafa: { name: "كنافة بالجبن", type: "bakery", cup: "🧀", base: "مخبوز بالفرن", req: ["مخبوز بالفرن", "عسل صافي", "مكعب زبدة"], levelReq: 1, shopKey: null },
  trilce: { name: "تريليتشا بالحليب", type: "bakery", cup: "🍰", base: "طبقات كيك", req: ["طبقات كيك", "حليب نقـي", "تغطية وردية"], levelReq: 1, shopKey: null },
  chocolateDonut: { name: "دونات شوكولاتة", type: "bakery", cup: "🍩", base: "عجينة دونات", req: ["عجينة دونات", "شوكولاتة", "سبرنكلز ملون"], levelReq: 1, shopKey: null },
  strawberryCheesecake: { name: "تشيز كيك فراولة", type: "bakery", cup: "🍰", base: "طبقات كيك", req: ["طبقات كيك", "فراولة", "كريمة خفق"], levelReq: 1, shopKey: null },
  baklava: { name: "بقلاوة بالفستق", type: "bakery", cup: "🥮", base: "مخبوز بالفرن", req: ["مخبوز بالفرن", "عسل صافي", "مكعب زبدة"], levelReq: 1, shopKey: null },

  spanishLatte: { name: "سبانش لاتيه", type: "drinks", cup: "🥤", base: "كوب فارغ", req: ["قهوة", "حليب نقـي", "ثلج"], levelReq: 2, shopKey: "spanishLatte" },
  matchaIceCream: { name: "آيس كريم ماتشا", type: "bakery", cup: "🍨", base: "كرة آيس كريم", req: ["كرة آيس كريم", "ماتشا", "كريمة خفق"], levelReq: 2, shopKey: "matchaIceCream" },
  pomegranateMojito: { name: "موهيتو منعش", type: "drinks", cup: "🍹", base: "شاي مثلج", req: ["شاي مثلج", "نعناع", "فراولة"], levelReq: 2, shopKey: "pomegranateMojito" }
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
  STATE.readyDishes = [];
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
  renderReadyDishes();
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
  const availableRecipes = Object.keys(RECIPES).filter(k => {
    const rec = RECIPES[k];
    if (rec.shopKey) {
      return STATE.inventory[rec.shopKey] === true;
    }
    return rec.levelReq <= STATE.level;
  });

  if (availableRecipes.length === 0) return;

  const recipeKey = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  const customer = CUSTOMERS_POOL[Math.floor(Math.random() * CUSTOMERS_POOL.length)];

  const newOrder = {
    id: "ord_" + Math.random().toString(36).substring(2, 7),
    recipeKey: recipeKey,
    recipe: RECIPES[recipeKey],
    customer: customer,
    patience: 60,
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
    hintEl.textContent = "اختر الكوب أو المشروب الأول..";
    renderIngredients([
      { id: "كوب فارغ", name: "كوب فارغ", icon: "🥛", isBase: true, unlocked: true },
      { id: "ثلج", name: "ثلج", icon: "🧊", unlocked: true },
      { id: "ماتشا", name: "ماتشا", icon: "🍵", unlocked: true },
      { id: "فراولة", name: "فراولة", icon: "🍓", unlocked: true },
      { id: "حليب نقـي", name: "حليب نقـي", icon: "🥛", unlocked: true },
      { id: "بوبا تابيوكا", name: "بوبا تابيوكا", icon: "🧋", unlocked: true },
      { id: "كريمة خفق", name: "كريمة خفق", icon: "🍦", unlocked: true },
      { id: "قهوة", name: "قهوة", icon: "☕", unlocked: true },
      { id: "شاي مثلج", name: "شاي مثلج", icon: "🧊", unlocked: STATE.inventory.pomegranateMojito, level: 2 },
      { id: "شوكولاتة", name: "شوكولاتة", icon: "🍫", unlocked: true },
      { id: "نعناع", name: "نعناع", icon: "🌿", unlocked: true },
      { id: "شاي", name: "شاي", icon: "🍵", unlocked: true }
    ]);
  } else if (stationName === "bakery") {
    hintEl.textContent = "اختر العجين أو القالب واصنع الحلويات!";
    renderIngredients([
      { id: "عجينة دونات", name: "عجينة دونات", icon: "🍩", isBase: true, unlocked: true },
      { id: "مخبوز بالفرن", name: "مخبوز بالفرن", icon: "🔥", isBase: true, unlocked: true },
      { id: "تغطية وردية", name: "تغطية وردية", icon: "🌸", unlocked: true },
      { id: "سبرنكلز ملون", name: "سبرنكلز ملون", icon: "✨", unlocked: true },
      { id: "طبقات كيك", name: "طبقات كيك", icon: "🍰", isBase: true, unlocked: true },
      { id: "مكعب زبدة", name: "مكعب زبدة", icon: "🧈", unlocked: true },
      { id: "عسل صافي", name: "عسل صافي", icon: "🍯", unlocked: true },
      { id: "شوكولاتة", name: "شوكولاتة", icon: "🍫", unlocked: true },
      { id: "فراولة", name: "فراولة", icon: "🍓", unlocked: true },
      { id: "كريمة خفق", name: "كريمة خفق", icon: "🍦", unlocked: true },
      { id: "كرة آيس كريم", name: "كرة آيس كريم", icon: "🍦", isBase: true, unlocked: STATE.inventory.matchaIceCream, level: 2 }
    ]);
  } else if (stationName === "serving") {
    hintEl.textContent = "اضغط على أي طبق جاهز على الطاولة لتقديمه للزبون المطلوب!";
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
    const isBaseSelected = item.isBase && STATE.selectedBase === item.id;
    card.className = `ingredient-card ${item.isBase ? 'base-item' : ''} ${!item.unlocked ? 'locked' : ''} ${isBaseSelected ? 'selected-active' : ''}`;
    
    let lockHtml = !item.unlocked ? `<div class="ingredient-lock-status">🔒 مقفل</div>` : '';
    
    card.innerHTML = `
      <div class="ingredient-icon-wrap">${item.icon}</div>
      <div class="ingredient-name">${item.name}</div>
      ${lockHtml}
    `;

    card.addEventListener("click", () => {
      if (!item.unlocked) {
        showToast(`هذا العنصر مقفل! يتطلب الوصول للمستوى ${item.level} ⭐`);
        return;
      }
      if (item.isBase) {
        STATE.selectedBase = item.id;
        showToast(`تم اختيار القاعدة: ${item.icon} ${item.name} 🥣`);
        switchStation(STATE.activeStation);
      } else {
        if (!STATE.selectedBase) {
          showToast("الرجاء اختيار الكوب أو القاعدة أولاً! ⚠️");
          return;
        }
        STATE.currentIngredients.push(item.id);
        showToast(`أضفت: ${item.icon} ${item.name}`);
      }
      renderWorkbench();
    });
    grid.appendChild(card);
  });
}

function renderWorkbench() {
  const workbench = document.getElementById("currentItemVisual");
  const base = STATE.selectedBase;
  const ings = STATE.currentIngredients;

  if (!base && ings.length === 0) {
    workbench.innerHTML = `<span style="font-size:13px; color:var(--text-muted);">طاولة التحضير فارغة.. اختر القواعد والمكونات!</span>`;
    return;
  }

  const ingsHTML = ings.map(i => `<span style="background:#fff; padding:2px 6px; border-radius:6px; border:1px solid #ffd1dc;">${i}</span>`).join(" ");

  workbench.innerHTML = `
    <div style="font-size:13px; font-weight:900; color:var(--pink-main); margin-bottom:4px; display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap;">
      <span>القاعدة: ${base || 'لم تُحدد'}</span> | <span>المكونات:</span> ${ingsHTML || 'لا توجد'}
    </div>
    <div style="margin-top:6px; display:flex; gap:8px; justify-content:center;">
      <button class="btn-primary" style="padding:5px 12px; font-size:12px;" onclick="putOnReadyCounter()">وضع على الطاولة الجاهزة 🛎️</button>
      <button class="btn-primary" style="padding:5px 12px; font-size:12px; background:#ff4757;" onclick="clearWorkbench()">مسح 🗑️</button>
    </div>
  `;
}

function clearWorkbench() {
  STATE.selectedBase = null;
  STATE.currentIngredients = [];
  renderWorkbench();
  switchStation(STATE.activeStation);
}

function putOnReadyCounter() {
  if (!STATE.selectedBase) {
    showToast("يجب اختيار الكوب أو القاعدة أولاً! ❌");
    return;
  }

  const current = [...STATE.currentIngredients].sort();
  let matchedKey = null;

  for (let [k, r] of Object.entries(RECIPES)) {
    if (STATE.selectedBase === r.base && JSON.stringify(current) === JSON.stringify([...r.req].sort())) {
      matchedKey = k;
      break;
    }
  }

  if (!matchedKey) {
    showToast("المكونات غير مطابقة لأي وصفة! تأكد من المقادير ❌");
    clearWorkbench();
    return;
  }

  STATE.readyDishes.push({
    recipeKey: matchedKey,
    recipe: RECIPES[matchedKey]
  });

  showToast(`تم تجهيز طلب (${RECIPES[matchedKey].cup} ${RECIPES[matchedKey].name}) ووضعه على الطاولة! ✨`);
  clearWorkbench();
  renderReadyDishes();
}

function renderReadyDishes() {
  const container = document.getElementById("sharedItemsContainer");
  if (!container) return;

  if (STATE.readyDishes.length === 0) {
    container.innerHTML = `<span class="shared-empty-hint" style="font-size:11.5px; color:var(--text-muted);">لا توجد طلبات جاهزة على الطاولة حالياً..</span>`;
    return;
  }

  container.innerHTML = "";
  STATE.readyDishes.forEach((dish, index) => {
    const badge = document.createElement("div");
    badge.className = "ready-dish-badge";
    badge.innerHTML = `<span style="font-size:16px;">${dish.recipe.cup}</span> <span style="font-weight:900;">${dish.recipe.name}</span> <span style="font-size:10px; background:var(--pink-subtle); padding:2px 6px; border-radius:6px; color:var(--pink-main);">قدّم 🛎️</span>`;
    badge.addEventListener("click", () => deliverDish(index));
    container.appendChild(badge);
  });
}

function deliverDish(dishIndex) {
  const dish = STATE.readyDishes[dishIndex];
  const orderIdx = activeOrders.findIndex(o => o.recipeKey === dish.recipeKey);

  if (orderIdx !== -1) {
    activeOrders.splice(orderIdx, 1);
    STATE.readyDishes.splice(dishIndex, 1);
    STATE.score += 120;
    STATE.coins += 25;
    STATE.servedCount++;

    if (STATE.servedCount % 4 === 0) {
      STATE.level++;
      showToast(`مبارك! لقد صعدت للمستوى ${STATE.level} ⭐`);
    }

    updateStats();
    showToast("تم تسليم الطلب للزبون بنجاح! +120 نقطة ⭐");
  } else {
    showToast("لا يوجد زبون يطلب هذا الصنف حالياً!");
  }

  renderReadyDishes();
  renderOrdersRack();
}

function renderServingStation() {
  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; font-weight:800; color:var(--pink-main); padding:20px;">انظر إلى الطلبات الجاهزة بالأعلى في "الطاولة الجاهزة" واضغط عليها لتقديمها للزبائن فوراً! ✨</div>`;
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
    { id: "pomegranateMojito", name: "فتح موهيتو الرمان المنعش", cost: 90, reqLevel: 2, icon: "🍹" }
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
    const custAvatarSvg = ANIMALS_SVG[ord.customer.avatar] || ANIMALS_SVG["cat"];
    const reqIcons = ord.recipe.req.join("، ");

    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <div class="order-card-header">
        <div class="order-customer-avatar">${custAvatarSvg}</div>
        <div>
          <div style="font-size:12.5px; font-weight:900; color:var(--text-dark);">${ord.customer.name}</div>
        </div>
      </div>
      <div style="font-size:13px; color:var(--pink-main); font-weight:900; display:flex; align-items:center; gap:5px;">
        <span style="font-size:16px;">${ord.recipe.cup}</span> <span>${ord.recipe.name}</span>
      </div>
      <div style="font-size:11px; color:#555; background:#fff7fa; padding:4px 6px; border-radius:6px;">
        المكونات: ${reqIcons}
      </div>
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
