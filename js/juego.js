document.addEventListener("DOMContentLoaded", () => {
  const opciones = ["piedra", "papel", "tijera", "fuego", "agua", "rayo"];
  const maxVida = 100;

  // Tabla de efectividades tipo Pokémon (multiplicador de daño)
  const efectividad = {
    piedra:   { fuerte: ["tijera", "rayo"],    "débil": ["papel", "agua"] },
    papel:    { fuerte: ["piedra", "agua"],    "débil": ["tijera", "fuego"] },
    tijera:   { fuerte: ["papel", "agua"],     "débil": ["piedra", "fuego"] },
    fuego:    { fuerte: ["papel", "tijera"],   "débil": ["agua", "rayo"] },
    agua:     { fuerte: ["fuego", "piedra"],   "débil": ["papel", "rayo"] },
    rayo:     { fuerte: ["agua", "fuego"],     "débil": ["piedra", "tijera"] }
  };

let vidaJugador = maxVida;
  let vidaComputadora = maxVida;
  let eleccionJugador = null;
  let eleccionComputadora = null;
  let jugadorBloqueando = false;
  let computadoraBloqueando = false;

  const resultadoDiv = document.getElementById("resultado");
  const vidaJugadorBarra = document.getElementById("vida-jugador");
  const vidaComputadoraBarra = document.getElementById("vida-computadora");
  const textoVidaJugador = document.getElementById("texto-vida-jugador");
  const textoVidaComputadora = document.getElementById("texto-vida-computadora");

  // Botones
  const botonesOpciones = document.querySelectorAll(".opcion");
  const btnAtacar = document.getElementById("atacar");
  const btnBloquear = document.getElementById("bloquear");
  const btnEsperar = document.getElementById("esperar");

  // Actualiza las barras de vida
  function actualizarVida() {
    vidaJugadorBarra.style.width = (vidaJugador > 0 ? vidaJugador : 0) + "%";
    vidaComputadoraBarra.style.width = (vidaComputadora > 0 ? vidaComputadora : 0) + "%";
    textoVidaJugador.textContent = ${vidaJugador > 0 ? vidaJugador : 0} / ${maxVida};
    textoVidaComputadora.textContent = ${vidaComputadora > 0 ? vidaComputadora : 0} / ${maxVida};
  }

  // Elige opción jugador
  botonesOpciones.forEach(boton => {
    boton.addEventListener("click", () => {
      eleccionJugador = boton.dataset.opcion;
      // Visualmente marcar selección
      botonesOpciones.forEach(b => b.classList.remove("seleccionado"));
      boton.classList.add("seleccionado");
      resultadoDiv.innerHTML = <p>Has seleccionado <strong>${capitalizar(eleccionJugador)}</strong>. Ahora elige una acción.</p>;
    });
  });

  // Función para elegir aleatoriamente opción de computadora
  function eleccionRandom() {
    return opciones[Math.floor(Math.random() * opciones.length)];
  }

  // Calcular daño base
  const danioBase = 20;
  const bloqueoReduccion = 0.5;
  const esperaRecuperacion = 15;

  // Acción atacar
  function atacar() {
    if (!eleccionJugador) {
      resultadoDiv.innerHTML = <p>Primero selecciona un elemento.</p>;
      return;
    }

    eleccionComputadora = eleccionRandom();

    // Computadora elige acción aleatoria (atacar, bloquear, esperar)
    const accionesComputadora = ["atacar", "bloquear", "esperar"];
    const accionCompu = accionesComputadora[Math.floor(Math.random() * accionesComputadora.length)];

    // Calcular multiplicador de daño
    let multiplicador = 1;
    if (efectividad[eleccionJugador].fuerte.includes(eleccionComputadora)) multiplicador = 2;
    else if (efectividad[eleccionJugador].débil.includes(eleccionComputadora)) multiplicador = 0.5;

    // Daño jugador a computadora
    let danioJugador = danioBase * multiplicador;
    if (computadoraBloqueando) danioJugador *= bloqueoReduccion;

    // Calcular daño computadora a jugador si ataca
    let danioComputadora = 0;
    if (accionCompu === "atacar") {
      multiplicador = 1;
      if (efectividad[eleccionComputadora].fuerte.includes(eleccionJugador)) multiplicador = 2;
      else if (efectividad[eleccionComputadora].débil.includes(eleccionJugador)) multiplicador = 0.5;

      danioComputadora = danioBase * multiplicador;
      if (jugadorBloqueando) danioComputadora *= bloqueoReduccion;
    }

    // Aplicar daños o recuperación según acción computadora
    switch (accionCompu) {
      case "atacar":
        vidaJugador -= Math.round(danioComputadora);
        computadoraBloqueando = false;
        break;
      case "bloquear":
        computadoraBloqueando = true;
        break;
      case "esperar":
        vidaComputadora += esperaRecuperacion;
        if (vidaComputadora > maxVida) vidaComputadora = maxVida;
        computadoraBloqueando = false;
        break;
    }

    // Aplicar daño jugador a computadora
    vidaComputadora -= Math.round(danioJugador);

    // Reset bloqueos jugador
    jugadorBloqueando = false;

    // Limitar vida a rango válido
    if (vidaJugador < 0) vidaJugador = 0;
    if (vidaComputadora < 0) vidaComputadora = 0;

    // Actualizar barras de vida
    actualizarVida();

    // Mostrar resultado
    let textoResultado = <p>Elegiste <strong>${capitalizar(eleccionJugador)}</strong> y atacaste.</p>;
    textoResultado += <p>La computadora eligió <strong>${capitalizar(eleccionComputadora)}</strong> y su acción fue <strong>${accionCompu}</strong>.</p>;
    textoResultado += <p>Daño a computadora: ${Math.round(danioJugador)}</p>;
    if (accionCompu === "atacar") textoResultado += <p>Daño a ti: ${Math.round(danioComputadora)}</p>;
    else if (accionCompu === "bloquear") textoResultado += <p>Computadora se bloqueó y reduce daño el siguiente turno.</p>;
    else textoResultado += <p>Computadora recuperó vida (+${esperaRecuperacion}).</p>;

    if (vidaJugador === 0 || vidaComputadora === 0) {
      textoResultado += <h3>${vidaJugador === 0 ? "¡Perdiste el juego!" : "¡Ganaste el juego!"}</h3>;
      deshabilitarBotones();
    }

    resultadoDiv.innerHTML = textoResultado;
  }

  // Acción bloquear
  function bloquear() {
    if (!eleccionJugador) {
      resultadoDiv.innerHTML = <p>Primero selecciona un elemento.</p>;
      return;
    }
    jugadorBloqueando = true;

    eleccionComputadora = eleccionRandom();
    const accionesComputadora = ["atacar", "bloquear", "esperar"];
    const accionCompu = accionesComputadora[Math.floor(Math.random() * accionesComputadora.length)];

    // Computadora ataca si el jugador bloquea, jugador no recibe daño este turno
    let textoResultado = <p>Elegiste <strong>${capitalizar(eleccionJugador)}</strong> y te bloqueaste.</p>;
    textoResultado += <p>La computadora eligió <strong>${capitalizar(eleccionComputadora)}</strong> y su acción fue <strong>${accionCompu}</strong>.</p>;

    if (accionCompu === "atacar") {
      // Computadora ataca, jugador bloquea y reduce daño
      let multiplicador = 1;
      if (efectividad[eleccionComputadora].fuerte.includes(eleccionJugador)) multiplicador = 2;
      else if (efectividad[eleccionComputadora].débil.includes(eleccionJugador)) multiplicador = 0.5;

      let danio = danioBase * multiplicador * bloqueoReduccion;
      vidaJugador -= Math.round(danio);
      textoResultado += <p>Computadora atacó, pero tu bloqueo redujo daño a ${Math.round(danio)}.</p>;
    } else if (accionCompu === "bloquear") {
      computadoraBloqueando = true;
      textoResultado += <p>Computadora también se bloqueó.</p>;
    } else {
      vidaComputadora += esperaRecuperacion;
      if (vidaComputadora > maxVida) vidaComputadora = maxVida;
      computadoraBloqueando = false;
      textoResultado += <p>Computadora recuperó vida (+${esperaRecuperacion}).</p>;
    }

    jugadorBloqueando = false;

    if (vidaJugador < 0) vidaJugador = 0;
    if (vidaComputadora < 0) vidaComputadora = 0;

    actualizarVida();

    if (vidaJugador === 0 || vidaComputadora === 0) {
      textoResultado += <h3>${vidaJugador === 0 ? "¡Perdiste el juego!" : "¡Ganaste el juego!"}</h3>;
      deshabilitarBotones();
    }

    resultadoDiv.innerHTML = textoResultado;
  }

  // Acción esperar
  function esperar() {
    if (!eleccionJugador) {
      resultadoDiv.innerHTML = <p>Primero selecciona un elemento.</p>;
      return;
    }
    // Jugador recupera vida
    vidaJugador += esperaRecuperacion;
    if (vidaJugador > maxVida) vidaJugador = maxVida;

    eleccionComputadora = eleccionRandom();
    const accionesComputadora = ["atacar", "bloquear", "esperar"];
    const accionCompu = accionesComputadora[Math.floor(Math.random() * accionesComputadora.length)];

    let textoResultado = <p>Elegiste <strong>${capitalizar(eleccionJugador)}</strong> y esperaste para recuperar vida (+${esperaRecuperacion}).</p>;
    textoResultado += <p>La computadora eligió <strong>${capitalizar(eleccionComputadora)}</strong> y su acción fue <strong>${accionCompu}</strong>.</p>;

    if (accionCompu === "atacar") {
      let multiplicador = 1;
      if (efectividad[eleccionComputadora].fuerte.includes(eleccionJugador)) multiplicador = 2;
      else if (efectividad[eleccionComputadora].débil.includes(eleccionJugador)) multiplicador = 0.5;

      let danio = danioBase * multiplicador;
      vidaJugador -= Math.round(danio);
      textoResultado += <p>Computadora atacó y te hizo ${Math.round(danio)} de daño.</p>;
    } else if (accionCompu === "bloquear") {
      computadoraBloqueando = true;
      textoResultado += <p>Computadora se bloqueó para reducir daño en el siguiente turno.</p>;
    } else {
      vidaComputadora += esperaRecuperacion;
      if (vidaComputadora > maxVida) vidaComputadora = maxVida;
      computadoraBloqueando = false;
      textoResultado += <p>Computadora también esperó y recuperó vida (+${esperaRecuperacion}).</p>;
    }

    if (vidaJugador < 0) vidaJugador = 0;
    if (vidaComputadora < 0) vidaComputadora = 0;

    actualizarVida();

    if (vidaJugador === 0 || vidaComputadora === 0) {
      textoResultado += <h3>${vidaJugador === 0 ? "¡Perdiste el juego!" : "¡Ganaste el juego!"}</h3>;
      deshabilitarBotones();
    }

    resultadoDiv.innerHTML = textoResultado;
  }

  // Deshabilitar botones cuando termina el juego
  function deshabilitarBotones() {
    botonesOpciones.forEach(b => b.disabled = true);
    btnAtacar.disabled = true;
    btnBloquear.disabled = true;
    btnEsperar.disabled = true;
  }

  // Capitalizar texto
  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Eventos botones de acción
  btnAtacar.addEventListener("click", atacar);
  btnBloquear.addEventListener("click", bloquear);
  btnEsperar.addEventListener("click", esperar);

  // Inicializar barras de vida
  actualizarVida();
});
 
