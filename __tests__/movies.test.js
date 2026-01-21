
//__tests__/movies.test.js
import request from "supertest";
import { app, server } from "../server.js";

// 1. Verifies that a movie page shows the correct title.
describe("Integrationstest för filmsidor", () => {
  it("Visa rätt titel för en film", async () => {

    // 2. Fetch movies from API (JSON response
    // Gets an array with all movies, take first element in the array.
    const apiRes = await fetch("https://plankton-app-xhkom.ondigitalocean.app/api/movies");
    const json = await apiRes.json();
    const movies = json.data;
    const firstMovie = movies[0];

    // 3. Using supertest to call SSR-route (movies: movieID)
    const res = await request(app).get(`/movies/${firstMovie.id}`);

    // 4. Checks that the HTML response contains the movie title 
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain(firstMovie.attributes.title);
  });
});

// 5. Close server after test.
afterAll(() => {
  server.close();
});
