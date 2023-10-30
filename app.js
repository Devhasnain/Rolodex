"use strict"

import express from 'express';
import logger from 'morgan';
import usersRouter from './routes/users.js';
import addsRouter from './routes/adds.js';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/add', addsRouter);


export default app;