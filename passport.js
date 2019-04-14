const { User } = require("./models/user");
var ObjectId = require("mongodb").ObjectID;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { JWT_SECRET } = require("./config");
const opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

passport.use(new JWTStrategy(opts, (jwtPayload, callback) => {
    const id = jwtPayload._id;
    return User.find(ObjectId(id))
      .then(user => {
        return callback(null, user);
      })
      .catch(err => {
        return callback(err);
      });
  })
);

// Setting up and use passport local strategy
passport.use("login", new LocalStrategy({
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      return (
        User.findOne({ email: email })
          // Find user unique email and verify password
          .then(user => {
            // Validate password matches with the corresponding hash
            const validated = user.validatePassword(password);
            validated.then(isValid => {
              // done invoked with false instead of a user to indicate an authentication failure.
              if (!isValid) {
                return done(null, false, { message: "Incorrect password." });
              }

              //Send the user information to the next middleware
              return done(null, user);
            });
          })
          // No user found in the database
          .catch(err => {
            return done(null, false, { message: "User does not exist." });
          })
      );
    }
  )
);