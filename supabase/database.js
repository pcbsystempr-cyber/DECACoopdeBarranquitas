/**
 * Database Integration Module - Mercadeo PCB
 *
 * Conecta con Supabase (PostgreSQL en la nube).
 * Si Supabase no está configurado, usa localStorage como respaldo.
 *
 * ▶ Configurar en supabase/supabase-config.js con tu URL y anonKey
 */

/**
 * Mapea un producto de Supabase al formato que usa el frontend
 */
function mapProduct(p) {
  if (!p) return p;
  return {
    ...p,
    image: p.image_url || 'galeria/image1.png',
    stock: p.stock !== undefined ? p.stock : null
  };
}

const DB = {
  isOnline: false,

  /**
   * Verifica si Supabase está disponible
   */
  async init() {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    this.isOnline = !!client;
    if (this.isOnline) {
      console.log('🟢 Database: Conectado a Supabase');
    } else {
      console.log('🟡 Database: Supabase no configurado, usando localStorage');
    }
    return this.isOnline;
  },
  
  // =====================================================
  // PRODUCTOS
  // =====================================================

  /**
   * Obtiene todos los productos activos desde Supabase o localStorage
   */
  async getProducts() {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('category')
          .order('name');
        if (!error && data && data.length > 0) {
          const mapped = data.map(mapProduct);
          localStorage.setItem('mercadeo_products', JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) { console.log('getProducts Supabase error:', e.message); }
    }
    return this.getLocalProducts();
  },

  getLocalProducts() {
    const stored = localStorage.getItem('mercadeo_products');
    return stored ? JSON.parse(stored) : this.getDefaultProducts();
  },

  getDefaultProducts() {
    return [
      { id: 1, name: 'Dentyne Ice (verdes, negro, azul)', price: 1.50, emoji: '🟢', category: 'dulces', popular: true, image: 'galeria/image1.png', nutrition: { calories: 5, sugar: 0, fat: 0, protein: 0 } },
      { id: 2, name: 'Chicles Grosso', price: 0.10, emoji: '🎀', category: 'dulces', popular: false, image: 'galeria/image1.png', nutrition: { calories: 5, sugar: 0, fat: 0, protein: 0 } },
      { id: 3, name: 'Chicle Bubbaloo', price: 0.15, emoji: '🫧', category: 'dulces', popular: false, image: 'galeria/image1.png', nutrition: { calories: 5, sugar: 0, fat: 0, protein: 0 } },
      { id: 4, name: 'Haribo', price: 1.50, emoji: '🍬', category: 'dulces', popular: true, image: 'galeria/image1.png', nutrition: { calories: 140, sugar: 21, fat: 0, protein: 2 } },
      { id: 5, name: 'Sour Patch', price: 1.50, emoji: '🍬', category: 'dulces', popular: true, image: 'galeria/image1.png', nutrition: { calories: 150, sugar: 25, fat: 1, protein: 0 } },
      { id: 6, name: 'Skittles Verdes', price: 1.50, emoji: '🟢', category: 'dulces', popular: true, image: 'galeria/image1.png', nutrition: { calories: 250, sugar: 47, fat: 2.5, protein: 0 } },
      { id: 7, name: 'Skittles Rojo', price: 1.50, emoji: '🔴', category: 'dulces', popular: true, image: 'galeria/image1.png', nutrition: { calories: 250, sugar: 47, fat: 2.5, protein: 0 } },
      { id: 8, name: 'Snickers', price: 1.50, emoji: '🍫', category: 'chocolates', popular: true, image: 'galeria/image1.png', nutrition: { calories: 250, sugar: 27, fat: 12, protein: 4 } },
      { id: 9, name: 'Kit Kat', price: 1.50, emoji: '🍫', category: 'chocolates', popular: true, image: 'galeria/image1.png', nutrition: { calories: 210, sugar: 22, fat: 11, protein: 3 } },
      { id: 10, name: 'M&M Amarillo', price: 1.50, emoji: '🌈', category: 'chocolates', popular: true, image: 'galeria/image1.png', nutrition: { calories: 240, sugar: 31, fat: 10, protein: 2 } },
      { id: 11, name: 'Twix', price: 1.50, emoji: '🍫', category: 'chocolates', popular: true, image: 'galeria/image1.png', nutrition: { calories: 250, sugar: 25, fat: 12, protein: 3 } },
      { id: 12, name: 'Oreo', price: 1.25, emoji: '🍪', category: 'snacks', popular: true, image: 'galeria/image1.png', nutrition: { calories: 160, sugar: 14, fat: 7, protein: 2 } },
      { id: 13, name: 'Cornnuts Verdes', price: 1.75, emoji: '🌽', category: 'snacks', popular: false, image: 'galeria/image1.png', nutrition: { calories: 150, sugar: 1, fat: 8, protein: 3 } },
      { id: 14, name: 'Cornnuts Rojos', price: 1.75, emoji: '🌽', category: 'snacks', popular: false, image: 'galeria/image1.png', nutrition: { calories: 150, sugar: 1, fat: 8, protein: 3 } }
    ];
  },

  saveLocalProducts(products) {
    localStorage.setItem('mercadeo_products', JSON.stringify(products));
  },

  /**
   * Guarda (crea o actualiza) un producto en Supabase o localStorage
   */
  async saveProduct(product) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const row = {
          name: product.name,
          price: parseFloat(product.price) || 0,
          emoji: product.emoji || '🍬',
          category: product.category || 'dulces',
          popular: product.popular || false,
          image_url: product.image || product.image_url || null,
          nutrition: product.nutrition || { calories: 0, sugar: 0, fat: 0, protein: 0 },
          stock: product.stock !== undefined && product.stock !== '' ? parseInt(product.stock) : null,
          is_active: true
        };
        if (product.id) {
          const { data, error } = await client.from('products').update(row).eq('id', product.id).select().single();
          if (!error && data) return mapProduct(data);
        } else {
          const { data, error } = await client.from('products').insert(row).select().single();
          if (!error && data) return mapProduct(data);
        }
      } catch (e) { console.error('saveProduct:', e.message); }
    }
    const products = this.getLocalProducts();
    if (product.id) {
      const idx = products.findIndex(p => String(p.id) === String(product.id));
      if (idx !== -1) products[idx] = { ...products[idx], ...product };
    } else {
      product.id = Date.now();
      products.push(product);
    }
    this.saveLocalProducts(products);
    return product;
  },

  /**
   * Elimina (desactiva) un producto en Supabase o lo quita de localStorage
   */
  async deleteProduct(productId) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { error } = await client.from('products').update({ is_active: false }).eq('id', productId);
        if (!error) return true;
      } catch (e) { console.error('deleteProduct:', e.message); }
    }
    let products = this.getLocalProducts();
    products = products.filter(p => String(p.id) !== String(productId));
    this.saveLocalProducts(products);
    return true;
  },
  
  // =====================================================
  // ÓRDENES
  // =====================================================

  async getOrders() {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.error('getOrders:', e.message); }
    }
    return this.getLocalOrders();
  },

  getLocalOrders() {
    const stored = localStorage.getItem('orders');
    return stored ? JSON.parse(stored) : [];
  },

  async createOrder(orderData) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('orders').insert(orderData).select().single();
        if (!error && data) return data;
      } catch (e) { console.error('createOrder:', e.message); }
    }
    const orders = this.getLocalOrders();
    const order = { ...orderData, id: Date.now(), created_at: new Date().toISOString() };
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
  },

  async updateOrderStatus(orderId, status) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('orders').update({ estado: status }).eq('id', orderId).select().single();
        if (!error && data) return data;
      } catch (e) { console.error('updateOrderStatus:', e.message); }
    }
    const orders = this.getLocalOrders();
    const idx = orders.findIndex(o => String(o.id) === String(orderId));
    if (idx !== -1) { orders[idx].estado = status; localStorage.setItem('orders', JSON.stringify(orders)); }
    return orders[idx];
  },

  async getOrderStats() {
    const orders = await this.getOrders();
    return {
      total_orders:     orders.length,
      total_revenue:    orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0),
      pending_orders:   orders.filter(o => o.estado === 'pendiente').length,
      completed_orders: orders.filter(o => o.estado === 'completado').length
    };
  },

  // =====================================================
  // USUARIOS
  // =====================================================

  getLocalUsers() {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  },

  saveLocalUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  },

  async findUserByEmail(email) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data } = await client.from('users').select('*').eq('email', email).single();
        if (data) return data;
      } catch { /* no encontrado */ }
    }
    return this.getLocalUsers().find(u => u.email === email);
  },

  async saveUser(userData) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('users').upsert(userData, { onConflict: 'email' }).select().single();
        if (!error && data) return data;
      } catch (e) { console.error('saveUser:', e.message); }
    }
    const users = this.getLocalUsers();
    const idx = users.findIndex(u => u.email === userData.email);
    if (idx !== -1) { users[idx] = { ...users[idx], ...userData }; }
    else { userData.id = userData.id || Date.now(); users.push(userData); }
    this.saveLocalUsers(users);
    return userData;
  },

  async updateUserStats(_userId, _totalSpent) {
    // Supabase puede manejar esto con triggers si se desea
  },

  // =====================================================
  // CONFIGURACIÓN
  // =====================================================

  async getConfig() {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('config').select('*').eq('id', 'store_config').single();
        if (!error && data) return data;
      } catch (e) { console.error('getConfig:', e.message); }
    }
    return this.getLocalConfig();
  },

  getLocalConfig() {
    const stored = localStorage.getItem('mercadeo_config');
    if (stored) return JSON.parse(stored);
    return {
      store_name: 'Mercadeo',
      tagline: 'Selecciona tus dulces favoritos y nosotros te los llevamos al salón',
      delivery_cost: 2,
      delivery_hours: '9:00 AM - 2:00 PM',
      primary_color: '#1e40af',
      secondary_color: '#3b82f6',
      accent_color: '#f59e0b',
      background_color: '#0f172a'
    };
  },

  async saveConfig(configData) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('config').upsert({ ...configData, id: 'store_config' }).select().single();
        if (!error && data) return data;
      } catch (e) { console.error('saveConfig:', e.message); }
    }
    localStorage.setItem('mercadeo_config', JSON.stringify(configData));
    return configData;
  },

  // =====================================================
  // FAVORITOS
  // =====================================================

  async getFavorites(userId) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('favorites').select('product_id').eq('user_id', userId);
        if (!error && data) return data.map(f => f.product_id);
      } catch (e) { console.error('getFavorites:', e.message); }
    }
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  },

  async addFavorite(userId, productId) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        await client.from('favorites').upsert({ user_id: userId, product_id: productId });
        return true;
      } catch (e) { console.error('addFavorite:', e.message); }
    }
    const favs = await this.getFavorites(userId);
    if (!favs.includes(productId)) { favs.push(productId); localStorage.setItem('favorites', JSON.stringify(favs)); }
    return true;
  },

  async removeFavorite(userId, productId) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        await client.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);
        return true;
      } catch (e) { console.error('removeFavorite:', e.message); }
    }
    const favs = await this.getFavorites(userId);
    const idx = favs.indexOf(productId);
    if (idx > -1) { favs.splice(idx, 1); localStorage.setItem('favorites', JSON.stringify(favs)); }
    return true;
  },

  // =====================================================
  // NOTIFICACIONES
  // =====================================================

  async getNotifications(userId) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.error('getNotifications:', e.message); }
    }
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  },

  async addNotification(userId, notification) {
    const notifData = {
      user_id: userId,
      title:   notification.title,
      message: notification.message,
      type:    notification.type || 'info',
      icon:    notification.icon || '🔔',
      is_read: false
    };
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        const { data, error } = await client.from('notifications').insert(notifData).select().single();
        if (!error && data) return data;
      } catch (e) { console.error('addNotification:', e.message); }
    }
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifs.unshift({ ...notifData, id: Date.now(), created_at: new Date().toISOString() });
    localStorage.setItem('notifications', JSON.stringify(notifs.slice(0, 50)));
    return notifData;
  },

  // =====================================================
  // IMÁGENES (Supabase Storage)
  // =====================================================

  /**
   * Sube una imagen al bucket 'product-images' de Supabase Storage
   * y devuelve la URL pública.
   * Requisito: crear el bucket 'product-images' con acceso público en Supabase.
   */
  async uploadImage(file) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (!client) throw new Error('Supabase no configurado');

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await client.storage
      .from('product-images')
      .upload(fileName, file, { upsert: false, contentType: file.type });

    if (error) throw new Error(error.message);

    const { data } = client.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  },

  async markNotificationRead(notificationId) {
    const client = (typeof getSupabase === 'function') ? getSupabase() : null;
    if (client) {
      try {
        await client.from('notifications').update({ is_read: true }).eq('id', notificationId);
      } catch (e) { console.error('markNotificationRead:', e.message); }
    }
  }
};

// Initialize database on load
document.addEventListener('DOMContentLoaded', async () => {
  await DB.init();
});
