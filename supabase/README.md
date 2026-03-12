# 🛒 Mercadeo PCB - Configuración de Supabase

Este proyecto ahora puede usar Supabase como base de datos en la nube. Esta guía te mostrará cómo configurarlo.

## 📋 Requisitos

- Una cuenta de [Supabase](https://supabase.com)
- Un proyecto de Supabase creado

## 🚀 Pasos de Configuración

### Paso 1: Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que termine de configurarse (aproximadamente 2 minutos)

### Paso 2: Ejecutar el schema SQL

1. En el panel de Supabase, haz clic en **SQL Editor** en el menú lateral
2. Haz clic en **New query**
3. Copia todo el contenido del archivo [`schema.sql`](schema.sql)
4. Pégalo en el editor de SQL
5. Haz clic en **Run** para ejecutar el script

Esto creará las siguientes tablas:
- `products` - Productos del catálogo
- `orders` - Pedidos de clientes
- `users` - Usuarios registrados
- `config` - Configuración de la tienda
- `favorites` - Productos favoritos
- `notifications` - Notificaciones

### Paso 3: Obtener credenciales

1. En el panel de Supabase, ve a **Settings** (ícono de engranaje)
2. Selecciona **API**
3. Copia los siguientes valores:
   - **Project URL** (ejemplo: `https://abc123.supabase.co`)
   - **anon public key** (una cadena larga que comienza con `eyJ...`)

### Paso 4: Configurar la aplicación

1. Abre el archivo [`supabase-config.js`](supabase-config.js)
2. Reemplaza los valores:

```javascript
const SUPABASE_CONFIG = {
  url: 'TU_SUPABASE_PROJECT_URL',  // Ejemplo: 'https://abc123.supabase.co'
  anonKey: 'TU_SUPABASE_ANON_KEY'  // Ejemplo: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

## 📁 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| [`schema.sql`](schema.sql) | Estructura de la base de datos (tablas, índices, RLS) |
| [`supabase-config.js`](supabase-config.js) | Configuración de conexión a Supabase |
| [`database.js`](database.js) | Módulo de integración con funciones CRUD |
| [`setup.js`](setup.js) | Script de ayuda para configuración y sincronización |
| [`index.html`](index.html) | Interfaz visual para configurar y probar |

## 🔧 Uso

### Interfaz Visual

Abre `supabase/index.html` en tu navegador para ver la interfaz de configuración con:
- Estado de la conexión
- Botones para probar conexión
- Sincronización de datos
- Estadísticas

### Desde Consola

También puedes usar las funciones desde la consola del navegador:

```javascript
// Probar conexión
SUPABASE_SETUP.testConnection();

// Sincronizar datos locales a Supabase
SUPABASE_SETUP.syncData();

// Descargar datos de Supabase a localStorage
SUPABASE_SETUP.loadToLocal();

// Ver estadísticas
SUPABASE_SETUP.getStats();
```

## 🔄 Sincronización de Datos

La aplicación funciona con **localStorage** como respaldo cuando Supabase no está configurado.

### Para migrar datos existentes:

1. Configura Supabase siguiendo los pasos anteriores
2. Ejecuta `SUPABASE_SETUP.syncData()` en la consola
3. Esto subirá todos los pedidos y productos a la nube

### Para descargar datos de la nube:

1. Ejecuta `SUPABASE_SETUP.loadToLocal()`
2. Esto descargará todos los datos de Supabase a localStorage

## 🔒 Seguridad

El schema incluye **Row Level Security (RLS)** que protege los datos:
- Los usuarios pueden ver sus propios pedidos
- Solo administradores pueden modificar productos y pedidos
- La configuración es pública para lectura

## 📊 Funciones Avanzadas

El schema incluye funciones SQL útiles:

```sql
-- Obtener estadísticas de pedidos
SELECT * FROM get_order_stats();

-- Obtener productos populares
SELECT * FROM get_popular_products(10);
```

## 🆘 Solución de Problemas

### "URL no configurada"
Asegúrate de haber editado `supabase-config.js` con tu URL real de Supabase.

### "Error de conexión"
1. Verifica que el proyecto de Supabase esté activo
2. Confirma que las credenciales sean correctas
3. Revisa la consola del navegador para más detalles

### "Error de permisos"
Asegúrate de haber ejecutado el script SQL completo, que incluye la configuración de RLS.

## 📱 Integración con la App

Para usar Supabase en tu aplicación, agrega estos scripts en tu HTML:

```html
<!-- Supabase Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Configuration -->
<script src="supabase/supabase-config.js"></script>
<script src="supabase/database.js"></script>
```

Luego usa el objeto `DB` para todas las operaciones:

```javascript
// Obtener productos
const products = await DB.getProducts();

// Crear pedido
const order = await DB.createOrder(orderData);

// Obtener pedidos
const orders = await DB.getOrders();
```

## 📄 Licencia

MIT License - Feel free to use and modify as needed.
