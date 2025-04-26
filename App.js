const API_KEY = "e01e119e7e11933fef36af89800e1757";
const contenedor = document.querySelector(".contenedor");
const inputBusqueda = document.getElementById("busqueda");
const botonesCategoria = document.querySelectorAll(".btn-categoria");

let peliculasDisponibles = [];

function getEstrellas(puntaje) {
  const estrellasLlenas = Math.round(puntaje / 2);
  let estrellasHTML = "";
  for (let i = 1; i <= 5; i++) {
    estrellasHTML += `<span style="color: gold;">${i <= estrellasLlenas ? "★" : "☆"}</span>`;
  }
  return estrellasHTML;
}

function limpiarTitulo(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[!¡¿?'"()]/g, "")
    .replace(/[:]/g, "")
    .trim();
}

function cargarPeliculas(url) {
  contenedor.innerHTML = "";

  fetch("peliculas-disponibles.json")
    .then(res => res.json())
    .then(json => {
      peliculasDisponibles = json.disponibles;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          data.results.forEach(pelicula => {
            const nombreBase = pelicula.title || pelicula.original_title || "";
            const nombreLimpio = limpiarTitulo(nombreBase);

            if (!peliculasDisponibles.includes(nombreBase)) return;

            const peli = document.createElement("div");
            peli.classList.add("card");
            peli.setAttribute("data-categoria", pelicula.genre_ids[0] || "otros");

            const tituloLimpio = encodeURIComponent(nombreLimpio);
            const linkAvapelis = `https://www.avapelis.com/?s=${tituloLimpio}`;

            peli.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}" class="card-img">
              <h3 class="card-title">${pelicula.title}</h3>
              <p>${pelicula.overview.substring(0, 100)}...</p>
              <div class="estrellas" style="text-align:center;">
                ${getEstrellas(pelicula.vote_average)}
              </div>
              <a href="#" class="btn ver-pelicula" data-link="${linkAvapelis}">Ver Película</a>
            `;

            contenedor.appendChild(peli);

            const botonVer = peli.querySelector(".ver-pelicula");
            let primerClick = true;

            botonVer.addEventListener("click", function (e) {
              e.preventDefault();
              const linkFinal = this.getAttribute("data-link");

              if (primerClick) {
                window.open("https://www.profitableratecpm.com/ibx8gisss?key=723d13ba955c55a87baedc32647bc1f6", "_blank");
                primerClick = false;
                this.textContent = "Haz clic de nuevo para ver la película";

                setTimeout(() => {
                  primerClick = true;
                  this.textContent = "Ver Película";
                }, 10000);
              } else {
                window.open(linkFinal, "_blank");
                primerClick = true;
                this.textContent = "Ver Película";

                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            });
          });
        })
        .catch(error => console.error("Error al cargar películas desde TMDb:", error));
    })
    .catch(error => console.error("Error al cargar peliculas-disponibles.json:", error));
}

const API_POPULARES = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
cargarPeliculas(API_POPULARES);

inputBusqueda.addEventListener("input", () => {
  const query = inputBusqueda.value.trim();
  if (query.length > 2) {
    const API_BUSQUEDA = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}`;
    cargarPeliculas(API_BUSQUEDA);
  } else {
    cargarPeliculas(API_POPULARES);
  }
});

botonesCategoria.forEach(boton => {
  boton.addEventListener("click", () => {
    const generoID = boton.dataset.genero;
    if (generoID === "all") {
      cargarPeliculas(API_POPULARES);
    } else {
      const URL_GENERO = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${generoID}`;
      cargarPeliculas(URL_GENERO);
    }
  });
});

let paginaActual = 1;
const peliculasPorPagina = 4;

function mostrarPagina(pagina) {
  const tarjetas = document.querySelectorAll('.card');
  const inicio = (pagina - 1) * peliculasPorPagina;
  const fin = inicio + peliculasPorPagina;

  tarjetas.forEach((card, index) => {
    card.style.display = index >= inicio && index < fin ? 'block' : 'none';
  });

  const indicador = document.getElementById('pagina-actual');
  if (indicador) indicador.textContent = pagina;
}

document.getElementById('siguiente')?.addEventListener('click', () => {
  const tarjetas = document.querySelectorAll('.card');
  if (paginaActual * peliculasPorPagina < tarjetas.length) {
    paginaActual++;
    mostrarPagina(paginaActual);
  }
});

document.getElementById('anterior')?.addEventListener('click', () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarPagina(paginaActual);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  mostrarPagina(paginaActual);
});
