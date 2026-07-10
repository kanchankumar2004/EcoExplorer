import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const configurePassport = () => {

  // GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub email might be in profile.emails
          const emailObj = profile.emails?.find(e => e.primary) || profile.emails?.[0];
          const email = emailObj ? emailObj.value.toLowerCase().trim() : null;

          if (!email) {
            return done(null, false, { message: 'No public email found from GitHub' });
          }

          let user = await User.findOne({ email });

          if (user) {
            if (!user.githubId) {
              user.githubId = profile.id;
              await user.save();
            }
            return done(null, user);
          } else {
            user = await User.create({
              name: profile.displayName || profile.username || 'GitHub User',
              email,
              githubId: profile.id,
              userType: 'traveler',
              password: '',
            });
            return done(null, user);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

export default configurePassport;
