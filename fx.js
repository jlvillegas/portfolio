// Efectos: red de nodos en la portada, luz que sigue al mouse, aparición al hacer scroll,
// contadores, texto que se escribe solo, tarjetas que se inclinan y barra de progreso.
(function () {
  "use strict";
  var raiz = document.documentElement;
  raiz.classList.add("js");
  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tactil = window.matchMedia && window.matchMedia("(hover: none)").matches;

  // ---- Aparición al hacer scroll + contadores ----
  var revelar = document.querySelectorAll(".revelar");
  function contar(el) {
    var fin = parseInt(el.getAttribute("data-contar"), 10), t0 = null, dur = 1400;
    function paso(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(fin * e);
      if (p < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }
  if ("IntersectionObserver" in window && !quieto) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("visto");
        var n = en.target.querySelector("[data-contar]");
        if (n) contar(n);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revelar.forEach(function (el) { io.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add("visto"); });
  }

  // ---- Menú: marca la sección visible ----
  var enlaces = document.querySelectorAll(".menu a");
  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section[id]").forEach(function (s) { io2.observe(s); });
  }

  // ---- Barra de progreso ----
  var barra = document.querySelector(".progreso");
  function progreso() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (barra) barra.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
  }
  addEventListener("scroll", progreso, { passive: true });
  progreso();

  if (quieto) return;

  // ---- Texto que se escribe solo ----
  var rota = document.getElementById("rota");
  var frases = ["sistemas en producción", "enchufes que siguen la agenda", "cloud e IA sobre Azure", "redes Starlink y Wi-Fi mesh", "sitios que traen clientes", "automatizaciones con n8n"];
  if (rota) {
    var i = 0, j = frases[0].length, borrando = true;
    (function tic() {
      var f = frases[i];
      j += borrando ? -1 : 1;
      rota.textContent = f.slice(0, j);
      var espera = borrando ? 35 : 70;
      if (!borrando && j === f.length) { borrando = true; espera = 1800; }
      else if (borrando && j === 0) { borrando = false; i = (i + 1) % frases.length; espera = 300; }
      setTimeout(tic, espera);
    })();
    // arranca mostrando la primera frase un rato
  }

  // ---- Luz que sigue al mouse ----
  var foco = document.querySelector(".foco");
  if (foco && !tactil) {
    var fx = innerWidth / 2, fy = innerHeight / 2, cx = fx, cy = fy;
    addEventListener("pointermove", function (e) { fx = e.clientX; fy = e.clientY; foco.classList.add("on"); }, { passive: true });
    (function mover() {
      cx += (fx - cx) * 0.12; cy += (fy - cy) * 0.12;
      foco.style.transform = "translate(" + (cx - 260) + "px," + (cy - 260) + "px)";
      requestAnimationFrame(mover);
    })();
    foco.style.left = "0"; foco.style.top = "0";
  }

  // ---- Tarjetas que se inclinan ----
  if (!tactil) {
    document.querySelectorAll(".inclinar").forEach(function (el) {
      var fuerza = el.classList.contains("tablero") ? 5 : 7;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateY(" + x * fuerza + "deg) rotateX(" + -y * fuerza + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  // ---- Red de nodos en la portada ----
  var lienzo = document.getElementById("red");
  if (!lienzo || !lienzo.getContext) return;
  var ctx = lienzo.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2);
  var W, H, nodos = [], mouse = { x: -9999, y: -9999 };
  var colores = ["46,230,201", "59,140,255", "163,92,255"];
  function medir() {
    var r = lienzo.getBoundingClientRect();
    W = r.width; H = r.height;
    lienzo.width = W * dpr; lienzo.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, (W * H) / 16000));
    nodos = [];
    for (var k = 0; k < n; k++) {
      nodos.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.8 + 0.8, c: colores[k % 3] });
    }
  }
  lienzo.parentElement.addEventListener("pointermove", function (e) {
    var r = lienzo.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  lienzo.parentElement.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  addEventListener("resize", medir);
  medir();

  var visible = true;
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(lienzo);

  var claro = function () { return raiz.getAttribute("data-theme") === "light"; };
  (function dibujar() {
    requestAnimationFrame(dibujar);
    if (!visible) return;
    ctx.clearRect(0, 0, W, H);
    var max = 130, alfa = claro() ? 0.35 : 0.55;
    for (var a = 0; a < nodos.length; a++) {
      var p = nodos[a];
      var dxm = p.x - mouse.x, dym = p.y - mouse.y, dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 160) { p.vx += dxm / dm * 0.03; p.vy += dym / dm * 0.03; }
      p.vx *= 0.99; p.vy *= 0.99;
      if (Math.abs(p.vx) < 0.08) p.vx += (Math.random() - 0.5) * 0.05;
      if (Math.abs(p.vy) < 0.08) p.vy += (Math.random() - 0.5) * 0.05;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      for (var b = a + 1; b < nodos.length; b++) {
        var q = nodos[b], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < max * max) {
          ctx.strokeStyle = "rgba(" + p.c + "," + (1 - Math.sqrt(d) / max) * alfa * 0.6 + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      if (dm < 180) {
        ctx.strokeStyle = "rgba(" + p.c + "," + (1 - dm / 180) * alfa + ")";
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = "rgba(" + p.c + "," + (alfa + 0.3) + ")";
      ctx.shadowColor = "rgba(" + p.c + ",1)"; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  })();
})();
