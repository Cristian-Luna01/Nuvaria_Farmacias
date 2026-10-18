# Nuvaria Farmacia

Catálogo web y buscador de productos para una farmacia local, desarrollado con **HTML, CSS y JavaScript**.

[Sitio web](https://nuvariafarmacia.online/) · [Perfil profesional](https://www.linkedin.com/in/cristianhern%C3%A1ndezluna/)

## Funcionalidades

- Búsqueda dinámica de productos en el catálogo del navegador.
- Lista de productos con persistencia local mediante `localStorage`.
- Enlaces a WhatsApp para consultar disponibilidad de un producto o de la lista seleccionada.
- Carrusel de promociones con navegación y gestos de arrastre.
- Menú móvil y opción para compartir el enlace del sitio.

## Ejecutar en local

```bash
git clone https://github.com/Cristian-Luna01/Nuvaria_Farmacias.git
cd Nuvaria_Farmacias
```

Abre `index.html` en un navegador moderno. Para desarrollo, también puedes servir la carpeta con un servidor estático, por ejemplo Live Server de VS Code. No hay un paso de compilación ni un gestor de paquetes en esta versión. Las funciones de compartir y portapapeles dependen del navegador y del contexto seguro (HTTPS o localhost).

## Estructura

| Archivo | Propósito |
| --- | --- |
| `index.html` | Estructura de la página |
| `styles.css` | Estilos e interfaz |
| `app.js` | Búsqueda, lista local, carrusel y enlaces a WhatsApp |
| `productos.js` | Datos del catálogo |
| `promociones.js` | Datos de promociones |
| `logo.png`, `logof.png` | Recursos gráficos |

## Mantenimiento

Actualiza el catálogo en `productos.js` y las ofertas en `promociones.js`, respetando su estructura. El número de destino de WhatsApp está configurado en `app.js` como `WHATSAPP_PHONE`. Revisa los cambios en el navegador antes de publicarlos.

Comprobación manual sugerida: buscar un producto existente y uno inexistente; añadir y quitar productos; recargar para comprobar la lista local; recorrer las promociones y revisar el menú en móvil. Revisa el destino y el texto de los enlaces de WhatsApp sin enviar consultas de prueba a la farmacia.

## Alcance y límites

El catálogo está incluido en archivos JavaScript. Esta versión no incluye un servidor de inventario ni confirma existencias en tiempo real. La lista sirve para preparar una consulta; no constituye un pago ni una reserva. No se documenta una suite de pruebas automatizadas en esta versión.

## Autoría y créditos

Proyecto individual de **Cristian Hernández Luna**, según su perfil profesional. Se conserva el historial del repositorio y cualquier atribución existente en el código y los recursos. Esta documentación se preparó con asistencia de Codex.
