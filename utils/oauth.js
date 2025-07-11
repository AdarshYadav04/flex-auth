const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User=require("../models/User")
const jwt = require('jsonwebtoken');

function setupOAuth({ jwtSecret }) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_CALLBACK}/google`
  }, async (_, __, profile, done) => {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({ email: profile.emails[0].value, username: profile.displayName });
      await user.save();
    }
    return done(null, user);
  }));

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_CALLBACK}/github`
  }, async (_, __, profile, done) => {
    let user = await User.findOne({ email: profile.username + "@github.com" });
    if (!user) {
      user = new User({ email: profile.username + "@github.com", username: profile.username });
      await user.save();
    }
    return done(null, user);
  }));
}

function generateOAuthRoutes(app, jwtSecret) {
  app.use(require('express-session')({ secret: jwtSecret, resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

  app.get('/auth/callback/:provider', (req, res, next) => {
    passport.authenticate(req.params.provider, { session: false }, (err, user) => {
      if (err || !user) return res.redirect(`${process.env.CLIENT_BASE_URL}`);
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
      const redirectUrl = `${process.env.CLIENT_BASE_URL}/oauth-success?token=${token}&message=OAuth login success`
      res.redirect(redirectUrl)
      
    })(req, res, next);
  });
}

module.exports = { setupOAuth, generateOAuthRoutes };
