import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { cookieExtractor } from '../utils/cookieExtractor.js';
import User from '../dao/models/user.model.js';
import config from '../../config/config.js';

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: config.jwtSecret,
};

passport.use('current', new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id).select('-password');
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;