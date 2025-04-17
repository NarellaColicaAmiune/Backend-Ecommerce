import passport from "passport";
import jwt from "passport-jwt";
import { getUserById } from "../services/auth.services.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
}

export const initializePassport = () => {
  passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "coderSecret",
      }, async(jwt_payload, done) => {
        try {
          console.log(jwt_payload)
          return done(null, jwt_payload);
        } 
          catch (error) {
            console.log(error);
            return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    try {
      console.log(user)
      done(null, user._id);
    } catch (error) {
      done(error);
    }
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

