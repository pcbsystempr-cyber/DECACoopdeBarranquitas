require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Product, Order, User, Config, Favorite, Notification } = require('./models');

const app  = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mercadeo_pcb';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// ── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 MongoDB conectado:', MONGO_URI))
  .catch(err => { console.error('❌ Error MongoDB:', err.message); process.exit(1); });

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// =====================================================================
// PRODUCTOS
// =====================================================================
app.get('/api/products', async (_req, res) => {
  try {
    const products = await Product.find({ is_active: true }).sort({ name: 1 });
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// =====================================================================
// ÓRDENES
// =====================================================================
app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/orders/stats', async (_req, res) => {
  try {
    const [total, revenue, pending, completed] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ estado: 'pendiente' }),
      Order.countDocuments({ estado: 'completado' })
    ]);
    res.json({
      total_orders: total,
      total_revenue: revenue[0]?.total || 0,
      pending_orders: pending,
      completed_orders: completed
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    // Actualizar estadísticas del usuario si está logueado
    if (order.user_id) {
      await User.findByIdAndUpdate(order.user_id, {
        $inc: { total_spent: order.total, orders_count: 1 }
      });
    }
    res.status(201).json(order);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// =====================================================================
// USUARIOS
// =====================================================================
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(user);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// =====================================================================
// CONFIGURACIÓN
// =====================================================================
app.get('/api/config', async (_req, res) => {
  try {
    let cfg = await Config.findById('store_config');
    if (!cfg) cfg = await Config.create({ _id: 'store_config' });
    res.json(cfg);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/config', async (req, res) => {
  try {
    const cfg = await Config.findByIdAndUpdate('store_config', req.body, { new: true, upsert: true, runValidators: true });
    res.json(cfg);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// =====================================================================
// FAVORITOS
// =====================================================================
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const favs = await Favorite.find({ user_id: req.params.userId });
    res.json(favs.map(f => f.product_id));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/favorites', async (req, res) => {
  try {
    await Favorite.findOneAndUpdate(
      { user_id: req.body.user_id, product_id: req.body.product_id },
      req.body,
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/favorites/:userId/:productId', async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user_id: req.params.userId, product_id: req.params.productId });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// =====================================================================
// NOTIFICACIONES
// =====================================================================
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifs = await Notification.find({ user_id: req.params.userId }).sort({ created_at: -1 }).limit(50);
    res.json(notifs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json(notif);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 API disponible en http://localhost:${PORT}/api`);
});

