const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { getDB } = require("../db/connection");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDB();

        const users = db.collection("users");

        let user = await users.findOne({
          githubId: profile.id,
        });

        if (!user) {
          const newUser = {
            githubId: profile.id,
            displayName: profile.displayName || profile.username,
            username: profile.username,
            email:
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null,
            profileUrl: profile.profileUrl,
            photos: profile.photos || [],
            createdAt: new Date(),
          };

          const result = await users.insertOne(newUser);

          user = {
            _id: result.insertedId,
            ...newUser,
          };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDB();

    const { ObjectId } = require("mongodb");

    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
