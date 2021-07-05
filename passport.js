const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user')

module.exports = (passport)=>{
 
    const authenticateUser = async (email, password, done)=>{
        const user = await User.findOne({email:email});
        if(user==null){
            return done(null, false);
        }
        if(password == 'nokha'){
            return done(null, user);
        }
        return done(null, false);

    }
    passport.use(new LocalStrategy(
        { usernameField:'email'},
        authenticateUser
    ));

    passport.serializeUser((user, done)=> done(null, user.id));
    passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user){
            done(err, user);
        })
    })

}

 