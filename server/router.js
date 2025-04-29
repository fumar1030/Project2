const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    
    
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    //Garden related calls
    app.get('/garden', mid.requiresLogin, controllers.Flower.gardenPage);
    app.get('/getFlowers', mid.requiresLogin, controllers.Flower.getFlowers);
    app.post('/garden', mid.requiresLogin, controllers.Flower.plantFlower);
    app.post('/water/:id', mid.requiresLogin, controllers.Flower.waterFlower);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;