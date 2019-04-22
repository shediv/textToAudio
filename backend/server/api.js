/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const jwt = require('express-jwt');
var mongoose = require('mongoose');
const jwks = require('jwks-rsa');
var passport = require('passport');
var nodemailer = require('nodemailer');
const fs = require("fs");
const Event = require('./models/Event');
const Rsvp = require('./models/Rsvp');
const User = require('./models/User');
const Task = require('./models/Task');
const AudioTextFile = require('./models/audioTextFiles');
const UserTextAudio = require('./models/userTextAudio');
var async = require('async');

// [SH] Bring in the Passport config after model is defined
require('./passport');
// Config
const config = require('./config');

//Muter Requirements
const multer = require('multer');

//Multer config
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })

/*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */

module.exports = function(app, config) {
  // Authentication middlewares
  //JWT Token Auth
  var auth = jwt({
    secret: config.secret,
    userProperty: 'payload'
  });

/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */

  // GET API root
  app.get('/api/', (req, res) => {
    res.send('API works');
  });

  // Add a new user
  app.post('/api/user/register', (req, res) => {
    User.findOne({ username: req.body.username }, (err, existingUser) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (existingUser) {
        return res.status(409).send({message: 'User Already Registered'});
      }
      var newUser = new User();
      newUser.username = req.body.username;
      newUser.firstName = req.body.firstName;
			newUser.lastName = req.body.lastName;
      newUser.isActive = true;
      newUser.setPassword(req.body.password);
      newUser.save((err) => {
        if (err) {
          return res.status(500).send({message: err});
        }
        res.send(newUser);
      });
    });
  });

  // Sign In API
  app.post('/api/auth/login/', (req, res) => {
    passport.authenticate('local', function(err, user, info){
	    var token;
	    // If Passport throws/catches an error
	    if (err) {
	      res.status(404).json(err);
	      return;
	    }

	    // If a user is found
	    if(user){
        token = user.generateJwt();
        const userInfo = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive
        };
        return res.status(200).json({idToken: token, expiresIn: 10, user: userInfo});  
	    } else {
	      // If user is not found
	      return res.status(401).json(info);
	    }

	  })(req, res);
  });

  //Get all task
  // GET userInfo API
  app.get('/api/task', auth, (req, res) => {
    Task.getAllTasks(req.query, (err, tasks, totalTasks) => {
      if (err) {
          res.status(501).json({
              success: false,
              message: `Failed to load all tasks. Error: ${err}`
          });
      } else {
          res.status(200).write(JSON.stringify({
              success: true,
              tasks: tasks,
              totalTasks: totalTasks
          }, null, 2));
          res.end();

      }
    });
  });

  //POST HTTP method to add task
  app.post('/api/task', auth, (req, res, next) => {
    let newTask = new Task({
        email: req.body.email,
        description: req.body.description
    });
    Task.addTask(newTask, (err, list) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: `Failed to create a new task. Error: ${err}`
            });

        } else {
            const textPath = "textFiles/"+req.body.email+"_"+new Date()+"_temp.txt";
            fs.writeFile(textPath, req.body.description, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
                res.status(200).json({
                    success: true,
                    message: "Added successfully."
                });
            });
        }    
    });
  });

  //DELETE HTTP method to delete task. Here, we pass in a param which is the object id.
  app.delete('/api/task/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    Task.deleteTaskById(id, (err, list) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: `Failed to delete the task. Error: ${err}`
            });
        } else if (list) {
            res.status(200).json({
                success: true,
                message: "Deleted successfully"
            });
        } else {
            res.status(501).json({
                success: false,
                message: `Failed to delete the task. Unknown Error.`
            });
        }
    });
  });

  //Send Mail
  app.get('/api/user/mail', function(req, res){
    UserTextAudio.find({ })
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
             user: config.userNameGmail,
             pass: config.passwordGmail
         }
     });
  
    const mailOptions = {
      from: config.sendMailFrom, // sender address
      to: 'pebi@5-mail.info', // list of receivers
      subject: 'Subject of your email', // Subject line
      html: '<p>Your html here</p>'// plain text body
    };
    
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });
  })

};