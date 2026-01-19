//EXPRESS SERVER WITH HANDLEBARS SETUP


import express from "express";
import { engine } from "express-handlebars";
import { loadMovie, loadMovies } from "./SSR/lib/movies.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "dist")));
//app.use("/static", express.static(path.join(__dirname, "SSR/static")));

// Handlebars setup
app.engine("handlebars", engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "SSR/templates/layout"),
  partialsDir: path.join(__dirname, "SSR/templates/partials")
}));


app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "SSR/templates"));

/*
// Startsidan → skicka index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});*/

app.get("/", async (req, res) => {
  const movies = await loadMovies(); // om du vill visa filmer direkt
  res.render("home", { movies });
});

app.get("/", async (req, res) => { const movies = await loadMovies(); res.render("home", { movies }); });
// SSR-sidor
app.get("/movies", async (req, res) => {
  const movies = await loadMovies();
  res.render("home", { movies });
});

app.get("/movies/:movieId", async (req, res) => {
  const movie = await loadMovie(req.params.movieId);
  res.render("movie", { movie });
});



app.listen(5080, () => {
  console.log("Servern kör på http://localhost:5080");
});