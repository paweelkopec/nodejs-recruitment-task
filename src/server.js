const express = require("express");
const bodyParser = require("body-parser");
const {authFactory, AuthError} = require("./auth");
const mongoose = require("mongoose");
const Movie = require("./movie");
const request = require('request');
const verifyTokenFactory = require("./verifyToken");

const PORT = 3000;
const {
    JWT_SECRET,
    OMDB_API_KEY,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;

if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

const auth = authFactory(JWT_SECRET);
const verifyToken = verifyTokenFactory(JWT_SECRET);
const app = express();

app.use(bodyParser.json());

mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the database!");
}).catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

//auth
app.post("/auth", async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({error: "invalid payload"});
    }
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({error: "invalid payload"});
    }

    try {
        const token = auth(username, password);
        return res.status(200).json({token});
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(401).json({error: error.message});
        }

        next(error);
    }
});

//movies
app.post("/movies", verifyToken, async (req, res, next) => {
    //validate request
    if (!req.body) {
        return res.status(400).json({error: "invalid payload"});
    }
    const {title} = req.body;
    if (!title) {
        return res.status(400).json({error: "invalid title"});
    }
    try {
        //movie title
        var filter = {user_id: req.user.userId, title: title};
        const userMovies = await Movie.count(filter);
        if (userMovies !== 0) {
            return res.status(400).json({error: "Movie " + title + " already exist"});
        }
        //user limit
        if (req.user.role == "basic") {
            var condition = {};
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(1);
            condition.createdAt = {$gt: date.toISOString()};
            const total = await Movie.count(condition);
            if (total >= 5) {
                throw new Error("User limit excited");
            }
        }
        //OMDB api
        var options = {
            'method': 'GET',
            'url': 'http://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '&t=' + title,
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var data = JSON.parse(response.body);
            if (data.Title != title) {
                return res.status(400).json({error: "Movie not found: " + title});
            }
            // Create a movie
            const movie = new Movie({
                title: data.Title,
                released: data.Released == "N/A" ? null : data.Released,
                genre: data.Genre,
                director: data.Director,
                user_id: req.user.userId
            });
            // Save movie in the database
            const newMove = await = Movie.create(movie);
            return res.status(200).json({movie});
        });
    } catch (error) {
        return res.status(401).json({error: error.message});

        next(error);
    }
});

app.get("/movies", verifyToken, (req, res, next) => {
    //auth
    var condition = {user_id: req.user.userId};
    Movie.find(condition)
        .then(data => {
            return res.json({movies: data});
        })
        .catch(err => {
            return res.status(500).json({
                error:
                    err.message || "Some error occurred while retrieving movies."
            });
            next(err);
        });

});

app.use((error, _, res, __) => {
    console.error(
        `Error processing request ${error}. See next message for details`
    );
    console.error(error);
    return res.status(500).json({error: "internal server error"});
});

module.exports = app.listen(PORT, () => {
    console.log(`auth svc running at port ${PORT}`);
});
