//EXPRESS SERVER WITH HANDLEBARS SETUP


import express from "express";
import { engine } from "express-handlebars";
import { loadMovie, loadMovies } from "./SSR/lib/movies.js";

const app = express();

// Handlebars setup
app.engine("handlebars", engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "SSR/templates/layout"),
  partialsDir: path.join(__dirname, "SSR/templates/partials")
}));

app.get("/", async (req, res) => {
  const movies = await loadMovies();
  res.render("home", { movies });
});

app.get("/movies/:movieId", async (req, res) => {
  const movie = await loadMovie(req.params.movieId);
  res.render("movie", { movie });
});

app.use("/static", express.static("./static"));

app.listen(5080);