// Verificar autenticación
if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
  window.location.href = 'index.html';
}

let products = [];
let pendingImageFile = null; // archivo seleccionado pendiente de subir

// =====================================================
// MANEJO DE IMAGEN
// =====================================================

function handleImageFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast('⚠️ La imagen no puede superar 2 MB', 'error');
    input.value = '';
    return;
  }
  pendingImageFile = file;
  document.getElementById('product-image-url').value = '';
  const reader = new FileReader();
  reader.onload = e => showImagePreview(e.target.result);
  reader.readAsDataURL(file);
}

function handleImageUrl(url) {
  pendingImageFile = null;
  document.getElementById('product-image-file').value = '';
  if (url) showImagePreview(url);
  else hideImagePreview();
}

function showImagePreview(src) {
  const container = document.getElementById('image-preview-container');
  const img = document.getElementById('image-preview');
  img.src = src;
  container.classList.remove('hidden');
}

function hideImagePreview() {
  document.getElementById('image-preview-container').classList.add('hidden');
  document.getElementById('image-preview').src = '';
}

function clearImage() {
  pendingImageFile = null;
  document.getElementById('product-image-file').value = '';
  document.getElementById('product-image-url').value = '';
  hideImagePreview();
}

async function resolveImageUrl() {
  // Si hay archivo, subirlo a Supabase Storage
  if (pendingImageFile && typeof DB !== 'undefined' && typeof DB.uploadImage === 'function') {
    try {
      const url = await DB.uploadImage(pendingImageFile);
      if (url) return url;
    } catch (e) {
      console.error('Error subiendo imagen:', e.message);
      showToast('⚠️ No se pudo subir la imagen, guardando sin foto', 'info');
    }
  }
  // Si hay URL manual, usarla
  const urlInput = document.getElementById('product-image-url').value.trim();
  if (urlInput) return urlInput;
  return null;
}

// Cargar productos desde Supabase o localStorage al iniciar
async function loadProducts() {
  if (typeof DB !== 'undefined') {
    try {
      const data = await DB.getProducts();
      if (data && data.length > 0) {
        products = data;
        renderProducts();
        checkLowStock();
        return;
      }
    } catch (e) {
      console.log('Cargando desde localStorage...', e.message);
    }
  }
  const stored = localStorage.getItem('mercadeo_products');
  products = stored ? JSON.parse(stored) : [];
  renderProducts();
  checkLowStock();
}

function updateStats() {
  document.getElementById('total-products').textContent = products.length;
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
  document.getElementById('avg-price').textContent = `$${avgPrice.toFixed(2)}`;
}

function getCategoryName(category) {
  const names = {
    'dulces': '🍬 Dulces',
    'chocolates': '🍫 Chocolates',
    'bebidas': '🥤 Bebidas',
    'snacks': '🍿 Snacks'
  };
  return names[category] || category;
}

function renderProducts() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  tbody.innerHTML = products.map(product => `
    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td class="px-6 py-4">
        ${product.image || product.image_url
          ? `<img src="${product.image || product.image_url}" alt="${product.name}"
               class="w-12 h-12 object-contain rounded-lg bg-white/5 border border-white/10 p-1"
               onerror="this.outerHTML='<span class=\'text-2xl\'>${product.emoji || '🍬'}</span>'">`
          : `<span class="text-2xl">${product.emoji || '🍬'}</span>`}
      </td>
      <td class="px-6 py-4 font-semibold">${product.name}</td>
      <td class="px-6 py-4 text-sm">${getCategoryName(product.category)}</td>
      <td class="px-6 py-4 font-bold text-[#f59e0b]">$${parseFloat(product.price).toFixed(2)}</td>
      <td class="px-6 py-4">
        ${product.stock !== undefined && product.stock !== null
          ? `<span class="text-xs font-semibold ${product.stock === 0 ? 'text-red-400' : product.stock <= 5 ? 'text-yellow-400' : 'text-green-400'}">
               ${product.stock === 0 ? '😔 Agotado' : `📦 ${product.stock}`}
             </span>`
          : '<span class="text-xs text-gray-500">∞ Ilimitado</span>'}
      </td>
      <td class="px-6 py-4">
        ${product.popular ? '<span class="text-xs bg-[#f59e0b]/20 text-[#f59e0b] px-2 py-1 rounded-full font-semibold">⭐ Popular</span>' : '-'}
      </td>
      <td class="px-6 py-4">
        <div class="flex gap-2">
          <button onclick="editProduct('${product.id}')"
            class="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-400/10 rounded"
            title="Editar">
            ✏️
          </button>
          <button onclick="deleteProduct('${product.id}')"
            class="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded"
            title="Eliminar">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updateStats();
}

function showAddProductModal() {
  document.getElementById('modal-title').textContent = 'Añadir Producto';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  clearImage();
  document.getElementById('product-modal').classList.add('active');
}

function editProduct(id) {
  const product = products.find(p => String(p.id) === String(id));
  if (!product) return;

  document.getElementById('modal-title').textContent = 'Editar Producto';
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-emoji').value = product.emoji || '';
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-popular').checked = product.popular;

  // Cargar imagen existente
  clearImage();
  const existingImage = product.image || product.image_url || '';
  if (existingImage) {
    document.getElementById('product-image-url').value = existingImage;
    showImagePreview(existingImage);
  }

  // Cargar stock
  const stockInput = document.getElementById('product-stock');
  stockInput.value = (product.stock !== null && product.stock !== undefined) ? product.stock : '';

  document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

async function deleteProduct(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

  if (typeof DB !== 'undefined') {
    try { await DB.deleteProduct(id); } catch (e) { console.error('deleteProduct:', e.message); }
  }
  products = products.filter(p => String(p.id) !== String(id));
  localStorage.setItem('mercadeo_products', JSON.stringify(products));
  renderProducts();
  showToast('🗑️ Producto eliminado', 'info');
}

// Form submit
document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('product-id').value;
  const imageUrl = await resolveImageUrl();
  const stockVal = document.getElementById('product-stock').value;
  const productData = {
    name: document.getElementById('product-name').value,
    emoji: document.getElementById('product-emoji').value,
    price: parseFloat(document.getElementById('product-price').value),
    category: document.getElementById('product-category').value,
    popular: document.getElementById('product-popular').checked,
    stock: stockVal !== '' ? parseInt(stockVal) : null,
    ...(imageUrl && { image: imageUrl, image_url: imageUrl })
  };

  if (id) {
    // Editar producto existente
    const fullProduct = { ...products.find(p => String(p.id) === String(id)), ...productData, id };
    if (typeof DB !== 'undefined') {
      try { await DB.saveProduct(fullProduct); } catch (e) { console.error('saveProduct:', e.message); }
    }
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index !== -1) products[index] = fullProduct;
    showToast('✅ Producto actualizado', 'success');
  } else {
    // Añadir nuevo producto
    let saved = productData;
    if (typeof DB !== 'undefined') {
      try { saved = await DB.saveProduct(productData); } catch (e) { console.error('saveProduct:', e.message); }
    }
    if (!saved.id) saved.id = Date.now();
    products.push(saved);
    showToast('✅ Producto añadido', 'success');
  }

  localStorage.setItem('mercadeo_products', JSON.stringify(products));
  renderProducts();
  closeProductModal();
});

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// =====================================================
// CONFIGURACIÓN DE LA TIENDA (DECA Coop, alertas, email)
// =====================================================

let adminSettings = {};
let unreadOrders = [];

async function loadAdminSettings() {
  try {
    if (typeof DB !== 'undefined') {
      adminSettings = await DB.getConfig() || {};
    }
  } catch (e) {
    const stored = localStorage.getItem('mercadeo_config');
    adminSettings = stored ? JSON.parse(stored) : {};
  }

  // Cargar valores en los campos
  const decaToggle = document.getElementById('deca-coop-toggle');
  const decaMsg    = document.getElementById('deca-message');
  if (decaToggle) {
    decaToggle.checked = !!adminSettings.deca_coop_open;
    updateDecaLabel(!!adminSettings.deca_coop_open);
  }
  if (decaMsg && adminSettings.deca_coop_message) decaMsg.value = adminSettings.deca_coop_message;

  const setVal = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  setVal('low-stock-threshold', adminSettings.low_stock_threshold);
  setVal('admin-email',         adminSettings.admin_email);
  setVal('emailjs-service-id',  adminSettings.emailjs_service_id);
  setVal('emailjs-template-id', adminSettings.emailjs_template_id);
  setVal('emailjs-public-key',  adminSettings.emailjs_public_key);
}

function updateDecaLabel(isOpen) {
  const label = document.getElementById('deca-status-label');
  if (!label) return;
  label.textContent = isOpen ? '🟢 Abierto' : '🔴 Cerrado';
  label.style.color  = isOpen ? '#10b981' : '#ef4444';
}

async function toggleDecaCoop(isOpen) {
  updateDecaLabel(isOpen);
  // El guardado definitivo se hace al pulsar "Guardar"
}

async function saveDecaCoop() {
  const isOpen  = document.getElementById('deca-coop-toggle').checked;
  const message = document.getElementById('deca-message').value.trim() ||
                  '¡DECA Coop está abierto ahora! 🏪';

  const newConfig = { ...adminSettings, deca_coop_open: isOpen, deca_coop_message: message };
  try {
    if (typeof DB !== 'undefined') await DB.saveConfig(newConfig);
    else localStorage.setItem('mercadeo_config', JSON.stringify(newConfig));
    adminSettings = newConfig;
    showToast(isOpen ? '🏪 DECA Coop marcado como ABIERTO' : '🔴 DECA Coop marcado como CERRADO', 'success');
  } catch (e) {
    showToast('❌ Error guardando configuración', 'error');
  }
}

async function saveAlertSettings() {
  const getVal = (id, def = '') => document.getElementById(id)?.value?.trim() || def;
  const threshold   = parseInt(getVal('low-stock-threshold', '5')) || 5;
  const adminEmail  = getVal('admin-email');
  const ejsService  = getVal('emailjs-service-id');
  const ejsTemplate = getVal('emailjs-template-id');
  const ejsKey      = getVal('emailjs-public-key');

  const newConfig = {
    ...adminSettings, low_stock_threshold: threshold, admin_email: adminEmail,
    emailjs_service_id: ejsService, emailjs_template_id: ejsTemplate, emailjs_public_key: ejsKey
  };
  try {
    if (typeof DB !== 'undefined') await DB.saveConfig(newConfig);
    else localStorage.setItem('mercadeo_config', JSON.stringify(newConfig));
    adminSettings = newConfig;
    showToast('✅ Configuración de alertas guardada', 'success');
    checkLowStock(); // re-check con nuevo umbral
  } catch (e) {
    showToast('❌ Error guardando configuración', 'error');
  }
}

// =====================================================
// ALERTAS DE STOCK BAJO
// =====================================================

function checkLowStock() {
  const threshold = parseInt(adminSettings.low_stock_threshold) || 5;
  const lowItems  = products.filter(p => p.stock !== null && p.stock !== undefined && p.stock <= threshold);

  const banner = document.getElementById('low-stock-banner');
  const list   = document.getElementById('low-stock-list');
  if (!banner || !list) return;

  if (lowItems.length === 0) {
    banner.classList.add('hidden');
    return;
  }

  list.innerHTML = lowItems.map(p =>
    `<span>${p.emoji || '📦'} <b>${p.name}</b>: ${p.stock === 0 ? '😔 Agotado' : `${p.stock} unidades`}</span>`
  ).join('<br>');
  banner.classList.remove('hidden');

  // Notificación del navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('⚠️ Stock bajo en Mercadeo PCB', {
      body: `${lowItems.length} producto(s) con stock bajo: ${lowItems.map(p => p.name).join(', ')}`,
      icon: 'galeria/image1.png'
    });
  }

  // Auto-enviar correo — máximo 1 vez por hora para no saturar
  const now      = Date.now();
  const lastSent = parseInt(localStorage.getItem('low_stock_email_last_sent') || '0');
  const oneHour  = 60 * 60 * 1000;
  const hasEmail = adminSettings.admin_email && adminSettings.emailjs_service_id &&
                   adminSettings.emailjs_template_id && adminSettings.emailjs_public_key;

  if (hasEmail && (now - lastSent) > oneHour) {
    localStorage.setItem('low_stock_email_last_sent', now.toString());
    sendLowStockEmail(true); // true = silencioso (sin toast)
  }
}

async function sendLowStockEmail(silent = false) {
  const threshold  = parseInt(adminSettings.low_stock_threshold) || 5;
  const lowItems   = products.filter(p => p.stock !== null && p.stock !== undefined && p.stock <= threshold);

  // Leer credenciales: primero del DOM (puede tener valores actualizados), luego de adminSettings
  const getVal = (id, fallback) => document.getElementById(id)?.value?.trim() || fallback || '';
  const adminEmail = getVal('admin-email',        adminSettings.admin_email);
  const serviceId  = getVal('emailjs-service-id', adminSettings.emailjs_service_id);
  const templateId = getVal('emailjs-template-id',adminSettings.emailjs_template_id);
  const publicKey  = getVal('emailjs-public-key', adminSettings.emailjs_public_key);

  if (!adminEmail) {
    if (!silent) showToast('⚠️ Configura el correo del administrador primero', 'error'); return;
  }
  if (!serviceId || !templateId || !publicKey) {
    if (!silent) showToast('⚠️ Configura EmailJS primero (Service ID, Template ID, Public Key)', 'error'); return;
  }
  if (lowItems.length === 0) {
    if (!silent) showToast('✅ No hay productos con stock bajo', 'success'); return;
  }

  const btn = document.getElementById('send-email-btn');
  if (btn && !silent) { btn.disabled = true; btn.textContent = '⏳ Enviando...'; }

  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey });
      await emailjs.send(serviceId, templateId, {
        to_email:       adminEmail,
        subject:        '⚠️ Stock bajo - Mercadeo PCB',
        low_stock_list: lowItems.map(p => `${p.emoji || ''} ${p.name}: ${p.stock === 0 ? 'AGOTADO' : p.stock + ' unidades'}`).join('\n'),
        product_count:  String(lowItems.length),
        date:           new Date().toLocaleString('es-PR')
      });
      if (!silent) showToast('📧 Correo de alerta enviado', 'success');
      else console.log('📧 Correo de stock bajo enviado automáticamente');
    } else {
      if (!silent) showToast('⚠️ EmailJS no está cargado', 'error');
    }
  } catch (e) {
    console.error('sendLowStockEmail error:', e);
    if (!silent) showToast(`❌ Error: ${e.text || e.message}`, 'error');
  } finally {
    if (btn && !silent) { btn.disabled = false; btn.textContent = '📧 Enviar alerta por correo'; }
  }
}

// =====================================================
// PEDIDOS EN TIEMPO REAL (Supabase Realtime)
// =====================================================

function setupOrdersRealtime() {
  const client = (typeof getSupabase === 'function') ? getSupabase() : null;
  if (!client) { console.warn('setupOrdersRealtime: Supabase no disponible'); return; }

  client
    .channel('admin-orders-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
      console.log('📦 Nuevo pedido recibido via Realtime:', payload.new);
      handleNewOrder(payload.new);
    })
    .subscribe(status => {
      console.log('🔔 Orders Realtime status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Escuchando pedidos en tiempo real');
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error('❌ Error en Realtime de pedidos:', status);
        showToast('⚠️ Realtime no disponible — verifica Supabase Dashboard', 'error');
      }
    });
}

function handleNewOrder(order) {
  unreadOrders.unshift(order);
  updateOrdersBadge();
  renderOrdersDropdown();

  // Notificación del navegador
  const title = '🛒 Nuevo pedido recibido';
  const body  = `${order.nombre_completo} — $${parseFloat(order.total || 0).toFixed(2)}`;

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: 'galeria/image1.png' });
  }

  // Push via Service Worker (si está registrado)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(sw => {
      sw.active && sw.active.postMessage({ type: 'SHOW_NOTIFICATION', title, body, tag: 'new-order' });
    });
  }

  showToast(`🛒 ¡Nuevo pedido de ${order.nombre_completo}!`, 'success');
}

function updateOrdersBadge() {
  const badge = document.getElementById('orders-badge');
  if (!badge) return;
  if (unreadOrders.length > 0) {
    badge.textContent = unreadOrders.length > 9 ? '9+' : unreadOrders.length;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderOrdersDropdown() {
  const list = document.getElementById('orders-notification-list');
  if (!list) return;
  if (unreadOrders.length === 0) {
    list.innerHTML = '<p class="text-center text-gray-500 text-sm py-8">No hay pedidos nuevos</p>';
    return;
  }
  list.innerHTML = unreadOrders.map(o => `
    <div class="order-notif-item unread">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm font-bold text-white">🛒 ${o.nombre_completo}</p>
          <p class="text-xs text-gray-400 mt-0.5">${o.dulces || 'Sin detalle'}</p>
          <p class="text-xs text-gray-500">${o.salon || ''} · ${o.grado || ''}</p>
        </div>
        <span class="text-sm font-bold text-yellow-400 shrink-0 ml-2">$${parseFloat(o.total || 0).toFixed(2)}</span>
      </div>
      <p class="text-xs text-gray-600 mt-1">${new Date(o.created_at || Date.now()).toLocaleString('es-PR')}</p>
    </div>
  `).join('');
}

function toggleOrdersDropdown() {
  document.getElementById('orders-dropdown').classList.toggle('open');
}

function markAllOrdersRead() {
  unreadOrders = [];
  updateOrdersBadge();
  renderOrdersDropdown();
  document.getElementById('orders-dropdown').classList.remove('open');
}

// Cerrar el dropdown al hacer click fuera
document.addEventListener('click', e => {
  const btn  = document.getElementById('orders-bell-btn');
  const drop = document.getElementById('orders-dropdown');
  if (drop && !drop.contains(e.target) && btn && !btn.contains(e.target)) {
    drop.classList.remove('open');
  }
});

// =====================================================
// PUSH NOTIFICATIONS — desde el panel de admin
// =====================================================

async function sendTestPushNotification() {
  const title = '🧪 Prueba de Notificación';
  const body  = 'Si ves esto, las notificaciones push funcionan correctamente 🎉';
  await triggerPushToClients(title, body, 'test-push');
}

async function sendDecaCoopPush() {
  const msg   = document.getElementById('deca-message').value.trim() || '¡DECA Coop está abierto ahora!';
  await triggerPushToClients('🏪 DECA Coop', msg, 'deca-coop');
  showToast('📲 Notificación enviada a los clientes', 'success');
}

async function triggerPushToClients(title, body, tag = 'general') {
  // Si el SW está activo, usarlo para mostrar la notificación local
  if ('serviceWorker' in navigator) {
    const sw = await navigator.serviceWorker.ready;
    if (sw.active) {
      sw.active.postMessage({ type: 'SHOW_NOTIFICATION', title, body, tag });
      showToast('📲 Notificación enviada', 'success');
      return;
    }
  }
  // Fallback: Notification API directa
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: 'galeria/image1.png' });
    showToast('📲 Notificación enviada', 'success');
  } else {
    showToast('⚠️ Activa los permisos de notificación primero', 'error');
  }
}

// =====================================================
// INICIALIZAR
// =====================================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  await loadAdminSettings();
  checkLowStock();
  setupOrdersRealtime();

  // Pedir permiso de notificaciones al admin
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

