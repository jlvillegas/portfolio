# Portfolio de Jorge Luis Villegas Oliva

Sitio personal publicado en GitHub Pages: https://jlvillegas.github.io/portfolio/

HTML, CSS y JavaScript sin dependencias ni paso de compilación. Tiene tema claro y oscuro, efectos de movimiento y un tablero en la portada que comprueba al cargar si los sitios publicados responden.

Este README alcanza para seguir actualizando el sitio sin depender de ningún chat.

## Qué muestra (al 25/11/2026)

### Sistemas

| Proyecto | Estado | Dónde está |
| --- | --- | --- |
| Sistema de gestión de la Clínica Villegas | En producción | Código privado (`jlvillegas/clinica-villegas`) |
| Compresores y carteles con Smart Switch Tuya | En producción desde octubre de 2026 | Parte del sistema de la clínica (ver más abajo) |
| Sistema de gestión para comercios | Demo online | https://marblanco-demo-sistema.netlify.app/ |
| AI Lead Qualifier | Código abierto | https://github.com/jlvillegas/ai-lead-qualifier |

### Sitios web (Netlify)

| Sitio | Link |
| --- | --- |
| Tienda online Villegas Insumos | https://villegasinsumos.com/ |
| Inmobiliaria Graciela Nicoletti | https://graciela-nicoletti-demo.netlify.app/ |
| Nicoletti TV, pantalla de propiedades | https://nicoletti-tv.netlify.app/ |
| Unalome Aparts | https://unalome-aparts.netlify.app/ |
| Cabañas Abuela Lety | https://abuela-lety-demo.netlify.app/ |
| Sitio de la Clínica Villegas | https://villegascentromedicoodontologico.com/ |
| Manjares de Merlo (propuesta) | https://manjares-de-merlo.netlify.app/ |
| Odontóloga Alejandra Villegas | https://odontologa-alejandravillegas.netlify.app/ |
| Residencia Franciscus | https://franciscus-merlo-san-luis.netlify.app/ |

### Sistemas en curso (sección "Sistemas que estoy armando")

Vigía Clínica (en uso), Reservas para hoteles, Piedra en Merlo (alertas de granizo, repositorio privado `jlvillegas/alertas-granizo-merlo`), Jarvis, Turnos para instaladores y Presupuesto personal en el celular. No tienen link público.

No se muestran borradores con notas internas ni sitios con acceso restringido.

## Cómo está armado

```
index.html              todo el contenido, por secciones
styles.css              diseño base: tema claro y oscuro, tablero, secciones, galería y tarjetas
fx.css, fx.js           efectos: auroras, red de nodos, aparición al hacer scroll, contadores,
                        texto que se escribe solo y tarjetas que se inclinan
script.js               cambio de tema y comprobación de los sitios del tablero
img/                    capturas de los sitios (JPG de 1280x614) y og.png para la vista previa del link
herramientas/capturar.py  saca la captura de un sitio con el tamaño justo
```

Secciones de `index.html`, en orden: portada con el tablero (`#inicio`), cifras, `#sistema`, `#iot`, `#sitios`, `#en-curso`, `#ia`, `#redes`, `#experiencia`, `#aptitudes` y `#contacto`. El menú de arriba tiene un link a cada una.

Todo el movimiento se apaga solo si la computadora tiene activado "reducir movimiento".

## Cómo agregar un sitio nuevo

1. Sacar la captura:
   ```
   python herramientas/capturar.py nombre-corto https://el-sitio.netlify.app/
   ```
   Queda en `img/nombre-corto.jpg`. La primera vez hay que instalar lo que usa: `pip install playwright pillow` y `python -m playwright install chromium`.
2. En `index.html`, sección `#sitios`, copiar un bloque `<article class="sitio revelar">` y cambiar el link, la captura, el texto alternativo (`alt`), el título y la descripción.
3. En el tablero de la portada, dentro de `<ul class="sitios-chips">`, agregar una línea `<li class="chip" data-url="https://...">`. El `data-url` hace que el sitio se compruebe solo cada vez que alguien abre el portfolio.
4. Si cambia la cantidad de sitios, actualizar la cifra de la portada (`data-contar` y el número, en `.cifras`).
5. Probarlo en local y publicarlo (abajo).

## Cómo agregar un sistema en curso

En la sección `#en-curso`, copiar un `<article class="proyecto">` y cambiar el estado (`estado-proyecto`: En uso, En desarrollo, Prototipo o Demo online), el título y la descripción. Las tarjetas se acomodan solas de a tres.

## La sección de los Smart Switch Tuya (`#iot`)

Explica una parte del sistema de la clínica (repositorio privado `jlvillegas/clinica-villegas`; el detalle está en su `ESTADO.md`):

- `api/compresor.mjs`: cada minuto mira los turnos de cada odontóloga. Prende su compresor 15 minutos antes del primer turno y lo apaga 15 minutos después del último. Lunes, miércoles y viernes lo apaga en la siesta, de 13 a 16. Si alguien lo cambia a mano, lo respeta hasta el próximo turno y queda anotado.
- `api/carteles.mjs`: carteles de la clínica y de Villegas Insumos. De noche desde 15 minutos antes del atardecer hasta la 01:30, en días de colegio de 07:15 a 08:30, y en feriados y vacaciones a la mañana mientras está oscuro. Los horarios se cambian desde el panel.
- Panel: Administración, Salud del sistema (lo ven administración y recepción).
- Conexión: Tuya Cloud API. Las claves van sólo en el `.env` del servidor, nunca en GitHub.
- Red: en la clínica hay una red Wi-Fi de 2,4 GHz sólo para dispositivos IoT, en el access point Omada, para que los enchufes no se queden sin conexión.

## Ver en local

En la carpeta del sitio:

```
python -m http.server
```

y abrir http://localhost:8000. También se puede abrir `index.html` directo, pero así el tablero no puede comprobar los sitios.

## Publicar

GitHub Pages publica sola la rama `main`:

```
git add -A
git commit -m "Qué cambió"
git push
```

Tarda uno o dos minutos en verse en https://jlvillegas.github.io/portfolio/.

Si se cambia `styles.css`, `fx.css`, `script.js` o `fx.js`, cambiar también el `?v=` con que los llama `index.html` (por ejemplo la fecha del día). Si no, los navegadores pueden seguir usando la versión vieja hasta 10 minutos.

## Historial

- 25/11/2026: sección de los Smart Switch Tuya con su diagrama; cuatro sitios nuevos (Inmobiliaria Graciela Nicoletti con su pantalla de TV, Unalome Aparts, Cabañas Abuela Lety y Manjares de Merlo); sección "Sistemas que estoy armando" con la demo del sistema para comercios; tablero de la portada con los sitios en chips; novedades del sistema de la clínica (turnos por chat, Laboratorio 3D, robot del sistema anterior, versión para otra profesional); 77 grupos de pruebas; menú en un solo renglón en pantallas medianas.
- 01/11/2026: rediseño visual (colores, auroras, red de nodos animada y efectos al hacer scroll); certificaciones AZ-900 y AI-901 aprobadas.
