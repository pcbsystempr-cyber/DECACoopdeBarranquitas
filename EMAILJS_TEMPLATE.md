# 📧 Template para EmailJS - Mercado PCB

Copia y pega este diseño en tu template de EmailJS (template_kz5nu6n):

---

## DISEÑO DEL EMAIL (HTML):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Pedido - Mercadeo PCB</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Contenedor Principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header con gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🛒 Nuevo Pedido</h1>
              <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">Mercadeo PCB - Tienda Escolar</p>
            </td>
          </tr>

          <!-- Información del Cliente -->
          <tr>
            <td style="padding: 25px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">👤 Información del Cliente</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📛 <strong>Nombre:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">{{from_name}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🎓 <strong>Grado:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 16px;">{{grado}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">👥 <strong>Grupo:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 16px;">{{grupo}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🏫 <strong>Salón:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 16px;">{{salon}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📞 <strong>Teléfono:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 16px;">{{telefono}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Artículos Pedidos (Lista Vertical) -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">🍬 Artículos Pedidos</h2>
              
              <!-- Lista de productos -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                
                <!-- Item 1 -->
                {{#item_1}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_1}}
                  </td>
                </tr>
                {{/item_1}}
                
                <!-- Item 2 -->
                {{#item_2}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_2}}
                  </td>
                </tr>
                {{/item_2}}
                
                <!-- Item 3 -->
                {{#item_3}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_3}}
                  </td>
                </tr>
                {{/item_3}}
                
                <!-- Item 4 -->
                {{#item_4}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_4}}
                  </td>
                </tr>
                {{/item_4}}
                
                <!-- Item 5 -->
                {{#item_5}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_5}}
                  </td>
                </tr>
                {{/item_5}}
                
                <!-- Item 6 -->
                {{#item_6}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_6}}
                  </td>
                </tr>
                {{/item_6}}
                
                <!-- Item 7 -->
                {{#item_7}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_7}}
                  </td>
                </tr>
                {{/item_7}}
                
                <!-- Item 8 -->
                {{#item_8}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_8}}
                  </td>
                </tr>
                {{/item_8}}
                
                <!-- Item 9 -->
                {{#item_9}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_9}}
                  </td>
                </tr>
                {{/item_9}}
                
                <!-- Item 10 -->
                {{#item_10}}
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                    {{item_10}}
                  </td>
                </tr>
                {{/item_10}}

              </table>
            </td>
          </tr>

          <!-- Totales -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">💰 Resumen del Pago</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 15px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subtotal:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 16px; text-align: right;">${{subtotal}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🚚 Entrega (9AM-2PM):</td>
                  <td style="padding: 8px 0; color: #f59e0b; font-size: 16px; text-align: right;">${{delivery}}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 8px 0; border-top: 2px solid #e5e7eb; color: #1f2937; font-size: 18px; font-weight: bold;">TOTAL A PAGAR:</td>
                  <td style="padding: 12px 0 8px 0; border-top: 2px solid #e5e7eb; color: #10b981; font-size: 24px; font-weight: bold; text-align: right;">${{total}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fecha y Hora -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 15px; text-align: center;">
                <p style="color: #1e40af; margin: 0; font-size: 14px;">📅 <strong>Pedido realizado el:</strong> {{fecha}}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">🛒 Mercadeo PCB - Tienda Escolar</p>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 11px;">Escuela Superior Vocacional Pablo Colón Berdecia</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
```

---

## 📋 RESUMEN DE VARIABLES USADAS:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{from_name}}` | Nombre del cliente | Juan Pérez |
| `{{grado}}` | Grado del estudiante | 10mo |
| `{{grupo}}` | Grupo | A |
| `{{salon}}` | Número de salón | 101 |
| `{{telefono}}` | Teléfono de contacto | 787-123-4567 |
| `{{item_1}}` | Primer producto | 2x Snickers |
| `{{item_2}}` | Segundo producto | 1x Oreo |
| `{{item_3}}` | Tercer producto | 3x Mentos |
| `{{item_4}}` | Cuarto producto | - |
| `{{item_5}}` | Quinto producto | - |
| `{{item_6}}` | Sexto producto | - |
| `{{item_7}}` | Séptimo producto | - |
| `{{item_8}}` | Octavo producto | - |
| `{{item_9}}` | Noveno producto | - |
| `{{item_10}}` | Décimo producto | - |
| `{{subtotal}}` | Subtotal sin entrega | 5.50 |
| `{{delivery}}` | Costo de entrega | 2.00 |
| `{{total}}` | Total a pagar | 7.50 |
| `{{fecha}}` | Fecha y hora del pedido | 15/01/2025 10:30 AM |

---

## 🎨 NOTAS IMPORTANTES:

1. **Cada producto aparece en una línea separada** con un punto azul decorativo
2. **Si no hay producto**, esa línea no aparecerá (gracias a las condiciones `{{#item_X}}`)
3. El diseño soporta hasta 10 productos individuales
4. Si el cliente pide más de 10 productos, los demás aparecerán en la variable `{{dulces}}` como lista adicional

---

## ⚙️ INSTRUCCIONES PARA CONFIGURAR EN EMAILJS:

1. Ve a tu dashboard de **EmailJS**
2. Selecciona tu servicio: **service_67viccy**
3. Selecciona tu template: **template_kz5nu6n**
4. Copia el código HTML de arriba y pégalo en el editor de template
5. Usa las variables entre dobles llaves `{{variable}}` donde corresponda
6. Guarda el template

¡Listo! Cada vez que un cliente haga un pedido, recibirás un correo hermoso con la lista de productos hacia abajo 📧✨
