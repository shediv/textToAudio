const fs = require('fs');
const privateKey = fs.readFileSync('config/private.key', 'utf-8');
// const privateKey = "shediv";
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate
};

async function authenticate({ username, password }) {
    User.findOne({ username: username, password: password }, (errLogin, userDetails) => {
        //console.log("errLogin = ", errLogin);
        //console.log("loginDetails = ", loginDetails);
        if (errLogin) {
          return null;
        }else{
            const token = jwt.sign({}, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                subject: userDetails._id.toString()
            });
            console.log("hereeeeeeeeeee");
            const { password, ...userWithoutPassword } = userDetails;
            console.log("hereeeeeeeeeee userWithoutPassword");
            return {
                idToken: token,
                expiresIn: 10,
                user: userWithoutPassword
            };
        }
    });
}

function validateEmailAndPassword(username, password) {
    //return users.find(u => u.username === username && u.password === password);
    User.findOne({ username: username, password: password }, (errLogin, loginDetails) => {
        //console.log("errLogin = ", errLogin);
        //console.log("loginDetails = ", loginDetails);
        if (errLogin) {
          return false;
        }
        if (loginDetails) {
          return loginDetails;
        }
    });
}
