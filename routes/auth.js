const express = require("express");
const passport = require("../config/passport");

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
  }),
  (req, res) => {
    res.json({
      success: true,
      message: "Authentication successful",
      user: req.user,
    });
  },
);

router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      user: req.user,
    });
  }

  res.status(401).json({
    authenticated: false,
    message: "Not authenticated",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
});

module.exports = router;
