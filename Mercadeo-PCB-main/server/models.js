const mongoose = require('mongoose');

// =====================================================
// PRODUCTO
// =====================================================
const productSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  price:     { type: Number, required: true, default: 0 },
  emoji:     { type: String, default: '🍬' },
  category:  { type: String, default: 'dulces', enum: ['dulces', 'chocolates', 'bebidas', 'snacks'] },
  popular:   { type: Boolean, default: false },
  nutrition: {
    calories: { type: Number, default: 0 },
    sugar:    { type: Number, default: 0 },
    fat:      { type: Number, default: 0 },
    protein:  { type: Number, default: 0 }
  },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// =====================================================
// ORDEN / PEDIDO
// =====================================================
const orderSchema = new mongoose.Schema({
  nombre_completo: { type: String, required: true },
  grado:           { type: String, required: true },
  grupo:           { type: String, default: '' },
  salon:           { type: String, required: true },
  telefono:        { type: String, required: true },
  dulces:          { type: String, required: true },
  dulces_detalle:  { type: Array,  default: [] },
  subtotal:        { type: Number, default: 0 },
  delivery_cost:   { type: Number, default: 0 },
  total:           { type: Number, default: 0 },
  estado:          { type: String, default: 'pendiente', enum: ['pendiente', 'en proceso', 'completado', 'cancelado'] },
  metodo_pago:     { type: String, default: 'efectivo' },
  split_count:     { type: Number, default: 1 },
  per_person:      { type: Number, default: 0 },
  user_id:         { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// =====================================================
// USUARIO
// =====================================================
const userSchema = new mongoose.Schema({
  email:         { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  nombre:        { type: String, default: '' },
  provider:      { type: String, default: 'email' },
  google_id:     { type: String, default: null },
  avatar_url:    { type: String, default: null },
  total_spent:   { type: Number, default: 0 },
  orders_count:  { type: Number, default: 0 },
  role:          { type: String, default: 'customer', enum: ['customer', 'admin'] },
  is_active:     { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// =====================================================
// CONFIGURACIÓN DE LA TIENDA
// =====================================================
const configSchema = new mongoose.Schema({
  _id:              { type: String, default: 'store_config' },
  store_name:       { type: String, default: 'Mercadeo' },
  tagline:          { type: String, default: 'Selecciona tus dulces favoritos y nosotros te los llevamos al salón' },
  delivery_cost:    { type: Number, default: 2 },
  delivery_hours:   { type: String, default: '9:00 AM - 2:00 PM' },
  primary_color:    { type: String, default: '#1e40af' },
  secondary_color:  { type: String, default: '#3b82f6' },
  accent_color:     { type: String, default: '#f59e0b' },
  background_color: { type: String, default: '#0f172a' },
  logo_url:         { type: String, default: null },
  is_active:        { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// =====================================================
// FAVORITOS
// =====================================================
const favoriteSchema = new mongoose.Schema({
  user_id:    { type: String, required: true },
  product_id: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
favoriteSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

// =====================================================
// NOTIFICACIONES
// =====================================================
const notificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  type:    { type: String, default: 'info', enum: ['info', 'success', 'warning', 'error'] },
  icon:    { type: String, default: '🔔' },
  is_read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// =====================================================
// EXPORTAR MODELOS
// =====================================================
module.exports = {
  Product:      mongoose.model('Product', productSchema),
  Order:        mongoose.model('Order', orderSchema),
  User:         mongoose.model('User', userSchema),
  Config:       mongoose.model('Config', configSchema),
  Favorite:     mongoose.model('Favorite', favoriteSchema),
  Notification: mongoose.model('Notification', notificationSchema)
};

