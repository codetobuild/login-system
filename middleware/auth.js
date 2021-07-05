function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect('/home');
      }
      next();
}

function checkIsAuthenticated(req, res, next){   
    if(req.isAuthenticated()) {
        next();
    }else{
        res.redirect('/user/login');
    }
}

module.exports = {checkIsAuthenticated, checkNotAuthenticated };