require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("./config/passport");
const { connectDB } = require("./db/connection");
const moviesRouter = require("./routes/movies");
const reviewsRouter = require("./routes/reviews");
const watchlistsRouter = require("./routes/watchlists");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const { serve, setup } = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Session setup
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

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Swagger
app.use("/api-docs", serve, setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("MovieVault API");
});

// Routes
app.use("/auth", authRouter);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/watchlists", watchlistsRouter);
app.use("/users", usersRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
