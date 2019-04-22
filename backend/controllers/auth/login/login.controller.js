const express = require('express');
const router = express.Router();
const fs = require('fs');
const privateKey = fs.readFileSync('config/private.key', 'utf-8');
// const privateKey = "shediv";
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const child_process = require('child_process');

// routes
router.post('/', authenticate);

router.get('/', function(req, res){
    const child = child_process.spawn('bash', [__dirname + '/myscript.sh']);
    child.on('exit', () => {
        console.log('process exit');
    });

    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
});

router.get('/test', function(req, res){
    return res.status(200).json({ msg: "You have hit test" });
});

module.exports = router;

function authenticate(req, res) {
    User.findOne(
        { 
            username: req.body.username, 
            password: req.body.password 
        }
    )
    .then(function(user) {
        const token = jwt.sign({}, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            subject: user._id.toString()
        });
        const { password, ...userWithoutPassword } = user;
        const authRes = {
            idToken: token,
            expiresIn: 10,
            user: userWithoutPassword
        };
        return res.status(200).json({idToken: authRes.idToken, expiresIn: authRes.expiresIn, user: authRes.user});
    })
    .catch(function(err) {
        return res.status(400).json({msg: "User not found"});
    });    
}