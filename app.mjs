'use strict';

import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes/indexRoutes.mjs';
import connectDB from './mongoose/connectMongo.mjs';

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
connectDB();
app.use(express.json());
app.use(cookieParser());

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            message: err.message,
            error: err // Show stack trace in development
        });
    });
}


app.get('/', (req, res) => {
    res.send('Welcome to the home page');
});


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: {} // Hide stack trace in production
    });
});

app.set('port', process.env.PORT || 3200);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
