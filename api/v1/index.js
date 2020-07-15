var express = require('express');
var app = express();
var mongoose = require('mongoose');
var CommentModel = require('./models/commentModel.js')

const connectionOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ExpressAPI', connectionOption);
mongoose.connection.on('error', function(err) {
    console.error("MongoDB connection error: " + err);
    process.exit(1);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var port = process.env.PORT || 3000;
var router = require('./routes');

app.use('/api/v1', router);
app.listen(port)

console.log("listen on port " + port);
