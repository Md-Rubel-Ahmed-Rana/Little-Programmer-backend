const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");


const GOOGLE_CLIENT_ID = "902089342185-o81krg7v4el8nvlpfpga4qh3rka56eks.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken: any, refreshToken: any, profile: any, done: (arg0: null, arg1: any) => void) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
  done(null, user);
});
