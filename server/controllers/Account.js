const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const changePasswordPage = (req, res) => {
    res.render('changePassword');
};

const logout = (req, res) =>{
    req.session.destroy();
    return res.redirect('/');
};

const login = (req, res) =>{
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if(!username || !pass){
        return res.status(400).json({error: 'Must have username and password'});
    }

    return Account.authenticate(username, pass, (err, account) => {
        if(err || !account){
            return res.status(401).json({error: 'Wrong username or password!'});
        }

        req.session.account = Account.toAPI(account);

        return res.json({redirect: '/garden'});
    });
};

const signup = async (req,res) =>{
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    //Making sure the login info is viable
    if(!username || !pass || !pass2){
        return res.status(400).json({error: 'All fields are required!'});
    }

    if(pass !== pass2){
        return res.status(400).json({error: 'Passwords do not match!'});
    }
    
    //Attempt to hash the password
    try{
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username,password:hash});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({redirect: '/garden'});
    }
    catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'Username already in use!'});
        }
        return res.status(500).json({error: 'An error occured!'});
    }
};

const buyMoreSpace = async (req, res) => {
    try {
      const account = await Account.findById(req.session.account._id).exec();
      account.flowerLimit += 10;
      await account.save();
  
      return res.status(200).json({ message: 'Purchased 10 more flower slots!' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Could not increase flower capacity.' });
    }
  };

const changePassword = (req, res) => {
const { oldPass, newPass, newPass2 } = req.body;

if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
}

if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match' });
}

const authenticateAsync = (username, password) =>
    new Promise((resolve, reject) => {
    Account.authenticate(username, password, (err, account) => {
        if (err || !account) {
        return reject(new Error('Invalid credentials'));
        }
        return resolve(account);
    });

    return null;

    });

authenticateAsync(req.session.account.username, oldPass)
    .then(async (account) => {
    const hash = await Account.generateHash(newPass);
    account.set('password', hash);
    await account.save();
    return res.status(200).json({ message: 'Password updated successfully' });
    })
    .catch((err) => {
    const msg =
        err.message === 'Invalid credentials'
        ? 'Incorrect current password'
        : 'Error saving new password';
    return res.status(500).json({ error: msg });
    });
};
  
  

module.exports ={
    loginPage,
    logout,
    login,
    signup,
    buyMoreSpace,
    changePassword,
    changePasswordPage,
}