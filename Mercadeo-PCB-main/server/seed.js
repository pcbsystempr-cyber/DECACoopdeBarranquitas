/**
 * seed.js — Carga datos iniciales en MongoDB
 * Uso: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { Product, Config } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mercadeo_pcb';

const DEFAULT_PRODUCTS = [
  { name: 'Chicles Trident',    price: 0.50, emoji: '🎀', category: 'dulces',     popular: true,  nutrition: { calories: 5,   sugar: 0,  fat: 0,  protein: 0 } },
  { name: 'Caramelos Halls',    price: 0.75, emoji: '🍭', category: 'dulces',     popular: false, nutrition: { calories: 15,  sugar: 4,  fat: 0,  protein: 0 } },
  { name: 'Chocolate Hershey',  price: 1.00, emoji: '🍫', category: 'chocolates', popular: true,  nutrition: { calories: 220, sugar: 25, fat: 13, protein: 3 } },
  { name: 'Galletas Oreo',      price: 1.25, emoji: '🍪', category: 'snacks',     popular: true,  nutrition: { calories: 160, sugar: 14, fat: 7,  protein: 2 } },
  { name: 'Paleta Dum Dums',    price: 0.25, emoji: '🍭', category: 'dulces',     popular: false, nutrition: { calories: 25,  sugar: 6,  fat: 0,  protein: 0 } },
  { name: 'Gomas Haribo',       price: 1.50, emoji: '🍬', category: 'dulces',     popular: true,  nutrition: { calories: 140, sugar: 21, fat: 0,  protein: 2 } },
  { name: 'Refresco Sprite',    price: 1.50, emoji: '🥤', category: 'bebidas',    popular: false, nutrition: { calories: 140, sugar: 38, fat: 0,  protein: 0 } },
  { name: 'Doritos',            price: 1.25, emoji: '🧡', category: 'snacks',     popular: true,  nutrition: { calories: 150, sugar: 1,  fat: 8,  protein: 2 } },
  { name: 'Papas Lays',         price: 1.00, emoji: '🟡', category: 'snacks',     popular: false, nutrition: { calories: 160, sugar: 0,  fat: 10, protein: 2 } },
  { name: 'Wafers Krakers',     price: 0.75, emoji: '🍘', category: 'snacks',     popular: false, nutrition: { calories: 130, sugar: 8,  fat: 6,  protein: 1 } },
  { name: 'M&Ms',               price: 1.00, emoji: '🌈', category: 'chocolates', popular: true,  nutrition: { calories: 240, sugar: 31, fat: 10, protein: 2 } },
  { name: 'Coca Cola',          price: 1.50, emoji: '🥤', category: 'bebidas',    popular: true,  nutrition: { calories: 140, sugar: 39, fat: 0,  protein: 0 } },
  { name: 'Skittles',           price: 1.25, emoji: '🌈', category: 'dulces',     popular: false, nutrition: { calories: 250, sugar: 47, fat: 2.5,protein: 0 } },
  { name: 'Kit Kat',            price: 1.00, emoji: '🍫', category: 'chocolates', popular: true,  nutrition: { calories: 210, sugar: 22, fat: 11, protein: 3 } }
];

const DEFAULT_CONFIG = {
  _id:              'store_config',
  store_name:       'Mercadeo',
  tagline:          'Selecciona tus dulces favoritos y nosotros te los llevamos al salón',
  delivery_cost:    2,
  delivery_hours:   '9:00 AM - 2:00 PM',
  primary_color:    '#1e40af',
  secondary_color:  '#3b82f6',
  accent_color:     '#f59e0b',
  background_color: '#0f172a'
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🍃 Conectado a MongoDB:', MONGO_URI);

    // ── Configuración ────────────────────────────────────────────────────
    const existingConfig = await Config.findById('store_config');
    if (!existingConfig) {
      await Config.create(DEFAULT_CONFIG);
      console.log('✅ Configuración creada');
    } else {
      console.log('⏭  Configuración ya existe, omitiendo...');
    }

    // ── Productos ────────────────────────────────────────────────────────
    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      await Product.insertMany(DEFAULT_PRODUCTS);
      console.log(`✅ ${DEFAULT_PRODUCTS.length} productos insertados`);
    } else {
      console.log(`⏭  Ya existen ${existingCount} productos, omitiendo...`);
    }

    console.log('\n🎉 ¡Base de datos lista! Corre "npm start" para iniciar el servidor.');
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

