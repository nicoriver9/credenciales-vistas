const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {db} = require("../database");
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {  
  const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0][0];
    // console.log(user);
    // console.log("desde el frontend " + password, 
    //   "desde la bd " + user.password);

    //const validPassword = await helpers.matchPassword(password, user.password)
    let validPassword;
    password == user.password ? validPassword = true: validPassword = false
    if (validPassword) {
      console.log('posting');
      done(null, user );
    } else {
      done(null, false);
    }
  } else {
    return done(null, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {  
  const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0][0]);
});

