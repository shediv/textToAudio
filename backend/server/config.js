module.exports = {
  AUTH0_DOMAIN: 'clone-audio.auth0.com', // e.g., kmaida.auth0.com
  AUTH0_API_AUDIENCE: 'http://localhost:8083/api/', // e.g., 'http://localhost:8083/api/'
  //MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mean-material-app-db', //'mongodb://developer:developer123@ds263295.mlab.com:63295/clone-audio'
  MONGO_URI: process.env.MONGO_URI || 'mongodb://developer:!recordtv8@ds145146.mlab.com:45146/text-audio',
  NAMESPACE: '[YOUR_AUTH0_ROLES_RULES_NAMESPACE]', // e.g., http://myapp.com/roles
  secret: 'cloneAudio',
  tokenExpireInDays: 1,
  constUserWasNotFound: 'User not found',
  constUserPasswordIsNotCorrect: 'Password is incorrect',
  algorithm: 'sha512',
  userNameGmail: 'developer.recordtv@gmail.com',
  passwordGmail: 'news-everyday-test',
  sendMailFrom: 'developer.recordtv@gmail.com'
};
