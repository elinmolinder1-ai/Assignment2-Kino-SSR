// EXPRESS SERVER WITH HANDLEBARS SETUP

import express from "express";
import { engine } from "express-handlebars";
import { loadMovie, loadMovies } from "./SSR/lib/movies.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Statisk serving
app.use(express.static(path.join(process.cwd(), "dist")));
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/scripts", express.static(path.join(process.cwd(), "scripts")));

// Handlebars setup
app.engine("handlebars", engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "SSR/templates/layout"),
  partialsDir: path.join(__dirname, "SSR/templates/partials")
}));

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "SSR/templates"));

// Meny-array
const MENU = [
  { label: "Alla filmer", id: "movies", link: "/movies" },
  { label: "Barnbio", id: "kids", link: "/kids" },
  { label: "Presentkort", id: "gift", link: "/gift" },
  { label: "Café & Bistro", id: "cafe", link: "/#cafe-bistro" },
  { label: "Event", id: "events", link: "/events" },
  { label: "Kundservice", id: "support", link: "/support" },
  { label: "Mina sidor", id: "profile", link: "/profile" },
  { label: "Företag", id: "business", link: "/business" }
];


// Startsidan
app.get("/", async (req, res) => {
  const movies = await loadMovies();
  res.render("home", { movies, menu: MENU });
});

// Alla filmer
app.get("/movies", async (req, res) => {
  const movies = await loadMovies();
  res.render("movies", { movies, menu: MENU });
});

// Enskild film
app.get("/movies/:movieId", async (req, res) => {
  const movie = await loadMovie(req.params.movieId);
  res.render("movie", { movie, menu: MENU });
});

// Starta servern
app.listen(5080, () => {
  console.log("Servern kör på http://localhost:5080");
});
