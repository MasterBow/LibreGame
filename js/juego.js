document.addEventListener("DOMContentLoaded", () => {
  // Opciones y efectividades
  const opciones = ["piedra", "papel", "tijera", "fuego", "agua", "rayo"];
  const maxVida = 100;
  const danioBase = 20;
  const bloqueoReduccion = 0.5;
  const esperaRecuperacion = 15;

  // Dificultad progresiva
  let nivel = 1;
  let vidaJugador = maxVida;
  let vidaComputadoraBase = maxVida;
  let vidaComputadora = vidaComputadoraBase;
  const aumentoVidaPorNivel = 20;

  // Estados de turno
  let eleccionJugador = null;
  let computadoraBloqueando = false;
  let jugadorBloqueando = false;

  // Tabla de efectividad
  const efectividad = {
    piedra: { fuerte: ["tijera", "rayo"], debil: ["papel", "agua"] },
    papel: { fuerte: ["piedra", "agua"], debil: ["tijera", "fuego"] },
    tijera: { fuerte: ["papel", "agua"], debil: ["piedra", "fuego"] },
    fuego: { fuerte: ["papel", "tijera"], debil: ["agua", "rayo"] },
    agua: { fuerte: ["fuego", "piedra"], debil: ["papel", "rayo"] },
    rayo: { fuerte: ["agua", "fuego"], debil: ["piedra", "tijera"] },
  };

  // DOM
  const resultadoDiv = document.getElementById("resultado");
  const vidaJugadorBarra = document.getElementById("vida-jugador");
  const vidaComputadoraBarra = document.getElementById("vida-computadora");
  const textoVidaJugador = document.getElementById("texto-vida-jugador");
  const textoVidaComputadora = document.getElementById("texto-vida-computadora");
  const botonesOpciones = document.querySelectorAll(".opcion");
  const btnAtacar = document.getElementById("atacar");
  const btnBloquear = document.getElementById("bloquear");
  const btnEsperar = document.getElementById("esperar");

  // Actualiza barras y texto de vida
  function actualizarVida() {
    vidaJugadorBarra.style.width = `${Math.max(vidaJugador, 0)}%`;
    vidaComputadoraBarra.style.width = `${Math.max(vidaComputadora, 0)}%`;
    textoVidaJugador.textContent = `${Math.max(vidaJugador, 0)} / ${maxVida}`;
    textoVidaComputadora.textContent = `${Math.max(vidaComputadora, 0)} / ${maxVida}`;
  }

  // Escoger opción del jugador
  botonesOpciones.forEach(boton => {
    boton.addEventListener("click", () => {
      eleccionJugador = boton.dataset.opcion;
      botonesOpciones.forEach(b => b.classList.remove("seleccionado"));
      boton.classList.add("seleccionado");
      resultadoDiv.innerHTML = `<p>Has seleccionado <strong>${capitalizar(eleccionJugador)}</strong>. Elige acción.</p>`;
    });
  });

  // Elección aleatoria de computadora
  function eleccionRandom() {
    return opciones[Math.floor(Math.random() * opciones.length)];
  }

  // Evento aleatorio al inicio de ronda
  function eventoAleatorio() {
    const eventos = [
      {
        descripcion: "Tormenta eléctrica: el enemigo recibe 10 de daño extra.",
        efecto: () => { vidaComputadora = Math.max(vidaComputadora - 10, 0); }
      },
      {
        descripcion: "Curación rápida: el enemigo recupera 15 de vida.",
        efecto: () => { vidaComputadora = Math.min(vidaComputadora + 15, maxVida * 2); }
      },
      {
        descripcion: "Inspiración: recuperas 10 puntos de vida.",
        efecto: () => { vidaJugador = Math.min(vidaJugador + 10, maxVida); }
      },
      {
        descripcion: "No ocurre nada extraordinario.",
        efecto: () => {}
      }
    ];
    const evento = eventos[Math.floor(Math.random() * eventos.length)];
    evento.efecto();
    return evento.descripcion;
  }

  // Reinicia ronda con nivel y dificultad incrementada
  function reiniciarRonda() {
    nivel++;
    vidaJugador = maxVida;
    vidaComputadoraBase += aumentoVidaPorNivel;
    vidaComputadora = vidaComputadoraBase;
    jugadorBloqueando = false;
    computadoraBloqueando = false;
    botonesOpciones.forEach(b => b.disabled = false);
    btnAtacar.disabled = false;
    btnBloquear.disabled = false;
    btnEsperar.disabled = false;
    actualizarVida();
    resultadoDiv.innerHTML = `<h3>¡Nivel ${nivel}!</h3><p>Dificultad aumentada, prepárate.</p>`;
    setTimeout(() => resultadoDiv.innerHTML = `<p>Nueva ronda, elige elemento.</p>`, 2000);
  }

  // Deshabilita botones
  function deshabilitarBotones() {
    botonesOpciones.forEach(b => b.disabled = true);
    btnAtacar.disabled = true;
    btnBloquear.disabled = true;
    btnEsperar.disabled = true;
  }

  // Calcular daño usando efectividad y bloqueo
  function calcularDanio(atacante, defensor, defensorBloqueando) {
    let mult = 1;
    if (efectividad[atacante].fuerte.includes(defensor)) mult = 2;
    else if (efectividad[atacante].debil.includes(defensor)) mult = 0.5;
    let danio = danioBase * mult;
    return defensorBloqueando ? danio * bloqueoReduccion : danio;
  }

  // Funciones de acción
  function turnoBase(accionJugador) {
    if (!eleccionJugador) {
      resultadoDiv.innerHTML = `<p>Primero selecciona un elemento.</p>`;
      return;
    }
    // Elección de computadora
    const eleccionCompu = eleccionRandom();
    const accionesCompu = ["atacar", "bloquear", "esperar"];
    const accionCompu = accionesCompu[Math.floor(Math.random() * accionesCompu.length)];

    // Calcular daño
    const danioACompu = calcularDanio(eleccionJugador, eleccionCompu, computadoraBloqueando);
    const danioAJug = calcularDanio(eleccionCompu, eleccionJugador, jugadorBloqueando);

    // Aplicar acción jugador
    if (accionJugador === "atacar") vidaComputadora = Math.max(vidaComputadora - Math.round(danioACompu), 0);
    else if (accionJugador === "esperar") vidaJugador = Math.min(vidaJugador + esperaRecuperacion, maxVida);
    else if (accionJugador === "bloquear") jugadorBloqueando = true;

    // Aplicar acción computadora
    if (accionCompu === "atacar") vidaJugador = Math.max(vidaJugador - Math.round(danioAJug), 0);
    else if (accionCompu === "esperar") vidaComputadora = Math.min(vidaComputadora + esperaRecuperacion, maxVida * 2);
    else if (accionCompu === "bloquear") computadoraBloqueando = true;

    // Evento aleatorio
    const descEvento = eventoAleatorio();
    actualizarVida();

    // Mostrar resultados
    let res = `<p>Elegiste <strong>${capitalizar(eleccionJugador)}</strong> y ${accionJugador}.</p>`;
    res += `<p>La computadora eligió <strong>${capitalizar(eleccionCompu)}</strong> y ${accionCompu}.</p>`;
    res += `<p>Daño a compu: ${Math.round(danioACompu)} | Daño a ti: ${Math.round(danioAJug)}</p>`;
    res += `<p><em>Evento: ${descEvento}</em></p>`;

    if (vidaJugador === 0 || vidaComputadora === 0) {
      res += `<h3>${vidaJugador === 0 ? "¡Perdiste esta ronda!" : "¡Ganaste esta ronda!"}</h3>`;
      res += `<button id="siguienteNivel">Siguiente nivel</button>`;
      deshabilitarBotones();
    }

    resultadoDiv.innerHTML = res;
  }

  function atacar() { turnoBase("atacar"); }
  function bloquear() { turnoBase("bloquear"); }
  function esperar() { turnoBase("esperar"); }

  // Capitalizar
  function capitalizar(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Eventos de botones
  btnAtacar.addEventListener("click", atacar);
  btnBloquear.addEventListener("click", bloquear);
  btnEsperar.addEventListener("click", esperar);

  // Reiniciar ronda al pulsar "Siguiente nivel"
  document.body.addEventListener("click", e => {
    if (e.target.id === "siguienteNivel") reiniciarRonda();
  });

  // Inicializar primera ronda
  actualizarVida();
  resultadoDiv.innerHTML = `<p>Nivel ${nivel}. Selecciona un elemento.</p>`;
});
