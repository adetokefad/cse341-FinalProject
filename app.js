require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("./config/passport");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const moviesRoutes = require("./routes/movies");
const reviewsRoutes = require("./routes/reviews");
const watchlistsRoutes = require("./routes/watchlists");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to MovieVault API",
  });
});

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication routes
app.use("/auth", authRoutes);

// API routes
app.use("/movies", moviesRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/watchlists", watchlistsRoutes);
app.use("/users", usersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler MUST be last
app.use(errorHandler);

module.exports = app;
