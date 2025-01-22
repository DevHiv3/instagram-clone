import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

 passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: `https://backend-second.vercel.app/auth/google/callback`, // Redirect URI
 },
 (accessToken, refreshToken, profile, done) => {
   // Here you can save user details to a database
   const user = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    };
   console.log('Google Profile:', profile);
   return done(null, profile); // Pass the user profile
 }
));

passport.serializeUser((user, done) => {
 done(null, user);
});
passport.deserializeUser((user, done) => {
 done(null, user);
});

export default passport;