// Tema claro u oscuro, y comprobación de que los sitios publicados responden.
(function () {
  "use strict";
  var raiz = document.documentElement;

  // ---- Tema ----
  function temaActual() {
    var t = raiz.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var boton = document.getElementById("tema");
  function rotular() {
    if (!boton) return;
    boton.setAttribute("aria-label", temaActual() === "dark" ? "Pasar al tema claro" : "Pasar al tema oscuro");
  }
  if (boton) {
    rotular();
    boton.addEventListener("click", function () {
      var nuevo = temaActual() === "dark" ? "light" : "dark";
      raiz.setAttribute("data-theme", nuevo);
      try { localStorage.setItem("tema", nuevo === "light" ? "claro" : "oscuro"); } catch (e) {}
      rotular();
    });
  }

  // ---- Tablero: ¿responden los sitios? ----
  // Una consulta "no-cors" no deja leer la respuesta, pero sí saber si el sitio contestó.
  var filas = Array.prototype.slice.call(document.querySelectorAll(".servicio[data-url]"));
  var nota = document.getElementById("tablero-estado");
  if (!filas.length || !nota || typeof fetch !== "function") {
    if (nota) nota.textContent = "Sitios publicados en Netlify";
    return;
  }

  function comprobar(fila) {
    var url = fila.getAttribute("data-url");
    var control = typeof AbortController === "function" ? new AbortController() : null;
    var reloj = setTimeout(function () { if (control) control.abort(); }, 8000);
    return fetch(url, { mode: "no-cors", cache: "no-store", signal: control ? control.signal : undefined })
      .then(function () { return true; }, function () { return false; })
      .then(function (ok) {
        clearTimeout(reloj);
        if (ok) {
          var led = fila.querySelector(".led");
          var estado = fila.querySelector(".servicio-estado");
          if (led) led.setAttribute("data-estado", "ok");
          if (estado) estado.textContent = "En línea";
        }
        return ok;
      });
  }

  Promise.all(filas.map(comprobar)).then(function (resultados) {
    var ok = resultados.filter(Boolean).length;
    var total = resultados.length;
    var hora = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    if (ok === 0) { nota.textContent = "Sitios publicados en Netlify"; return; }
    nota.textContent = ok === total
      ? "Comprobado a las " + hora + ": los " + total + " sitios responden"
      : "Comprobado a las " + hora + ": " + ok + " de " + total + " sitios respondieron";
  });
})();
