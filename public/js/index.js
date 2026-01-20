// index.js

// UI-funktioner
import { initMemberPage, initMemberButtons } from '../../scripts/member-page.js';
import { toggleLogin } from '../../scripts/login.js';
import { toggleRegister } from '../../scripts/register.js';
import { toggleMenu } from '../../scripts/menu.js'; 
import { closeNotice } from '../../scripts/notice.js';
import { toggleTheme } from '../../scripts/tema.js';

// Filmrelaterade funktioner
import { fetchMovies } from "../../scripts/api.js";
import { renderMovieList } from "../../scripts/createcard.js";
//import { openTrailer } from "../../scripts/trailermodal.js"; 
import { movieCarousel } from "../../scripts/carousel.js"; 

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isUpcoming(movie) {
  const d = parseDate(movie.Show_Date);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d > today;
}

// Initiera allt när DOM:en är klar
document.addEventListener("DOMContentLoaded", async () => {
  // Initiera UI-komponenter
  if (document.querySelector('.members__offers')) {
    initMemberPage();
  }
  initMemberButtons();
  toggleLogin();
  toggleRegister();
  toggleMenu();
  closeNotice();
  toggleTheme();

  // Filmspår
  const currentTrack = document.getElementById("currentMoviesTrack");
  const comingSoonTrack = document.getElementById("comingSoonTrack");
  const eventsTrack = document.getElementById("eventsTrack");

  if (currentTrack) currentTrack.innerHTML = "<p>Laddar…</p>";
  if (comingSoonTrack) comingSoonTrack.innerHTML = "<p>Laddar…</p>";
  if (eventsTrack) eventsTrack.innerHTML = "<p>Laddar…</p>";

  try {
    const movies = await fetchMovies();

    movieCarousel(movies);
    const upcoming = movies.filter(isUpcoming);
    const current = movies.filter((m) => !isUpcoming(m));

    renderMovieList(currentTrack, current.slice(0, 20));
    renderMovieList(comingSoonTrack, upcoming.slice(0, 10));
    renderMovieList(eventsTrack, current.slice(0, 10));

    // Trailer-knappar
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".movies-carousel__button");
      if (!btn) return;

      if (btn.textContent === "Trailer") {
        const movieId = Number(btn.dataset.id);
        const movie = movies.find(m => m.id === movieId);

        if (!movie?.Trailer_Id) {
          alert("Trailer saknas");
          return;
        }

        openTrailer(movie.Trailer_Id);
      }
    });

  } catch (err) {
    console.error(err);
    const msg = `<p class="empty_state">Kunde inte hämta filmer: ${err.message}</p>`;
    if (currentTrack) currentTrack.innerHTML = msg;
    if (comingSoonTrack) comingSoonTrack.innerHTML = msg;
    if (eventsTrack) eventsTrack.innerHTML = msg;
  }
});
