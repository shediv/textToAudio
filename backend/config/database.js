const mongoose = require('mongoose');
const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'mean-material-app-db';      // REPLACE WITH YOUR DB NAME
const localConnectionString = `mongodb://${server}/${database}`;
const remoteConnectionString = `mongodb://developer:!recordtv8@ds145146.mlab.com:45146/text-audio`;
class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose.connect(remoteConnectionString)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error')
            });
    }
}
module.exports = new Database();