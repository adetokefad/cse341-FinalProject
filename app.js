require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("./config/passport");
const booksRouter = require("./routes/movies");
const reviewsRouter = require("./routes/reviews");
const watchlistsRouter = require("./routes/watchlists");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const { serve, setup } = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", serve, setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("MovieVault API");
});

app.use("/auth", authRouter);
app.use("/movies", booksRouter);
app.use("/reviews", reviewsRouter);
app.use("/watchlists", watchlistsRouter);
app.use("/users", usersRouter);

if (process.env.NODE_ENV === "test") {
  app.post("/login", (req, res) => {
    // Fake user session for tests
    req.session.user = { username: "testuser" };
    res.status(200).json({ message: "Logged in (test mode)" });
  });
}

module.exports = app;
