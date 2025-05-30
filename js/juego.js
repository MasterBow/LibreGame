document.addEventListener("DOMContentLoaded", () => {
  const opciones = ["piedra", "papel", "tijera", "fuego", "agua", "rayo"];

  const reglas = {
    piedra:     { gana: ["tijera", "rayo"],    pierde: ["papel", "agua"] },
    papel:      { gana: ["piedra", "agua"],    pierde: ["tijera", "fuego"] },
    tijera:     { gana: ["papel", "agua"],     pierde: ["piedra", "fuego"] },
    fuego:      { gana: ["papel", "tijera"],   pierde: ["agua", "rayo"] },
    agua:       { gana: ["fuego", "piedra"],   pierde: ["papel", "rayo"] },
    rayo:       { gana: ["agua", "fuego"],     pierde: ["piedra", "tijera"] }
  };
const efectividades = {
  piedra: { fuego: 2, agua: 0.5, rayo: 1, ... },
  fuego: { papel: 2, agua: 0.5, piedra: 0.5, ... },
  // Completar para todos
};

  const botones = document.querySelectorAll(".opcion");
  const resultadoDiv = document.getElementById("resultado");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const eleccionJugador = boton.dataset.opcion;
      const eleccionComputadora = opciones[Math.floor(Math.random() * opciones.length)];

      let resultadoTexto = "";

      if (eleccionJugador === eleccionComputadora) {
        resultadoTexto = `Empate. Ambos eligieron ${eleccionJugador}.`;
      } else if (reglas[eleccionJugador].gana.includes(eleccionComputadora)) {
        resultadoTexto = `¡Ganaste! ${capitalizar(eleccionJugador)} vence a ${eleccionComputadora}.`;
      } else {
        resultadoTexto = `Perdiste. ${capitalizar(eleccionComputadora)} vence a ${eleccionJugador}.`;
      }

      resultadoDiv.innerHTML = `
        <p><strong>Tu elección:</strong> ${eleccionJugador}</p>
        <p><strong>Computadora:</strong> ${eleccionComputadora}</p>
        <p><strong>Resultado:</strong> ${resultadoTexto}</p>
      `;
    });
  });

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
});
