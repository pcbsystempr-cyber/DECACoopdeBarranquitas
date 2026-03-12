/**
 * SUPABASE SETUP SCRIPT - Mercadeo PCB
 * 
 * Este script te ayuda a configurar Supabase para tu aplicación.
 * 
 * INSTRUCCIONES:
 * 1. Crea un proyecto en https://supabase.com
 * 2. Ve a Settings > API
 * 3. Copia la URL del proyecto y la anon key
 * 4. Actualiza el archivo supabase-config.js con esos valores
 * 5. Ejecuta este script en el SQL Editor de Supabase
 */

const SUPABASE_SETUP = {
  /**
   * Verificar configuración de Supabase
   */
  checkConfig() {
    const url = SUPABASE_CONFIG.url;
    const key = SUPABASE_CONFIG.anonKey;
    
    console.log('=== SUPABASE CONFIGURATION CHECK ===');
    
    if (url === 'YOUR_SUPABASE_PROJECT_URL') {
      console.log('❌ URL no configurada');
      return false;
    }
    
    if (key === 'YOUR_SUPABASE_ANON_KEY') {
      console.log('❌ Anon Key no configurada');
      return false;
    }
    
    console.log('✅ Configuración básica completada');
    console.log('📡 URL:', url);
    
    return true;
  },
  
  /**
   * Probar conexión a Supabase
   */
  async testConnection() {
    if (!this.checkConfig()) return false;
    
    try {
      const supabase = getSupabase();
      if (!supabase) {
        console.log('❌ No se pudo inicializar el cliente de Supabase');
        return false;
      }
      
      // Probar conexión
      const { data, error } = await supabase
        .from('config')
        .select('*')
        .eq('id', 'store_config')
        .single();
      
      if (error) {
        console.log('⚠️ Error de conexión:', error.message);
        return false;
      }
      
      console.log('✅ Conexión exitosa a Supabase!');
      console.log('📊 Datos de configuración:', data);
      return true;
    } catch (error) {
      console.log('❌ Error:', error.message);
      return false;
    }
  },
  
  /**
   * Sincronizar datos locales con Supabase
   */
  async syncData() {
    const supabase = getSupabase();
    if (!supabase) {
      console.log('❌ Supabase no está configurado');
      return false;
    }
    
    console.log('🔄 Sincronizando datos...');
    
    // Sincronizar productos
    const localProducts = JSON.parse(localStorage.getItem('mercadeo_products') || '[]');
    if (localProducts.length > 0) {
      console.log(`📦 Subiendo ${localProducts.length} productos...`);
      
      for (const product of localProducts) {
        await supabase
          .from('products')
          .upsert({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            category: product.category,
            popular: product.popular,
            nutrition: product.nutrition || {},
            is_active: true
          });
      }
      
      console.log('✅ Productos sincronizados');
    }
    
    // Sincronizar pedidos
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (localOrders.length > 0) {
      console.log(`📋 Subiendo ${localOrders.length} pedidos...`);
      
      for (const order of localOrders) {
        await supabase
          .from('orders')
          .upsert({
            id: order.id,
            nombre_completo: order.nombre_completo,
            grado: order.grado,
            grupo: order.grupo,
            salon: order.salon,
            telefono: order.telefono,
            dulces: order.dulces,
            dulces_detalle: order.dulces_detalle || [],
            subtotal: order.subtotal || order.total,
            delivery_cost: 2,
            total: order.total,
            estado: order.estado || 'pendiente',
            metodo_pago: order.metodo_pago || 'efectivo',
            created_at: order.fecha_pedido || order.created_at
          });
      }
      
      console.log('✅ Pedidos sincronizados');
    }
    
    // Sincronizar configuración
    const localConfig = JSON.parse(localStorage.getItem('mercadeo_config'));
    if (localConfig) {
      console.log('⚙️ Subiendo configuración...');
      
      await supabase
        .from('config')
        .upsert({
          id: 'store_config',
          ...localConfig
        });
      
      console.log('✅ Configuración sincronizada');
    }
    
    console.log('🎉 Sincronización completa!');
    return true;
  },
  
  /**
   * Cargar datos de Supabase a localStorage
   */
  async loadToLocal() {
    const supabase = getSupabase();
    if (!supabase) {
      console.log('❌ Supabase no está configurado');
      return false;
    }
    
    console.log('🔄 Descargando datos desde Supabase...');
    
    // Cargar configuración
    const { data: config } = await supabase
      .from('config')
      .select('*')
      .eq('id', 'store_config')
      .single();
    
    if (config) {
      localStorage.setItem('mercadeo_config', JSON.stringify(config));
      console.log('✅ Configuración descargada');
    }
    
    // Cargar productos
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (products && products.length > 0) {
      localStorage.setItem('mercadeo_products', JSON.stringify(products));
      console.log(`✅ ${products.length} productos descargados`);
    }
    
    // Cargar pedidos
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (orders && orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
      console.log(`✅ ${orders.length} pedidos descargados`);
    }
    
    console.log('🎉 Datos descargados correctamente!');
    return true;
  },
  
  /**
   * Obtener estadísticas de la base de datos
   */
  async getStats() {
    const supabase = getSupabase();
    if (!supabase) {
      console.log('❌ Supabase no está configurado');
      return null;
    }
    
    console.log('📊 Obteniendo estadísticas...');
    
    const [productsCount, ordersCount, usersCount] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true })
    ]);
    
    const stats = {
      products: productsCount.count || 0,
      orders: ordersCount.count || 0,
      users: usersCount.count || 0
    };
    
    console.log('📊 Estadísticas:', stats);
    return stats;
  },
  
  /**
   * Mostrar guía de configuración
   */
  showGuide() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║          CONFIGURACIÓN DE SUPABASE - MERCADEO PCB            ║
╚══════════════════════════════════════════════════════════════╝

PASO 1: Crear proyecto en Supabase
  1. Ve a https://supabase.com
  2. Crea una cuenta o inicia sesión
  3. Crea un nuevo proyecto
  4. Espera a que termine de configurarse

PASO 2: Configurar la base de datos
  1. Ve a "SQL Editor" en el menú lateral
  2. Copia todo el contenido del archivo: supabase/schema.sql
  3. Pégalo en el SQL Editor
  4. Ejecuta el script (botón "Run")

PASO 3: Obtener credenciales
  1. Ve a "Settings" (ícono de engranaje)
  2. Selecciona "API"
  3. Copia "Project URL"
  4. Copia "anon public" key (debajo de Project URL)

PASO 4: Actualizar configuración
  1. Abre el archivo: supabase/supabase-config.js
  2. Reemplaza 'YOUR_SUPABASE_PROJECT_URL' con tu URL
  3. Reemplaza 'YOUR_SUPABASE_ANON_KEY' con tu anon key
  4. Guarda el archivo

PASO 5: Verificar conexión
  1. Abre la consola del navegador (F12)
  2. Ejecuta: SUPABASE_SETUP.testConnection()
  3. Deberías ver "Conexión exitosa"

╔══════════════════════════════════════════════════════════════╗
║                    ¡LISTO! YA ESTÁ CONFIGURADO                ║
╚══════════════════════════════════════════════════════════════╝
    `);
  }
};

// Mostrar guía automáticamente al cargar
document.addEventListener('DOMContentLoaded', () => {
  if (isSupabaseConfigured()) {
    console.log('🔗 Supabase link detected - running connection test...');
    SUPABASE_SETUP.testConnection();
  } else {
    console.log('⚠️ Supabase not configured');
    SUPABASE_SETUP.showGuide();
  }
});
