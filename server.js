const express = require('express');
require('dotenv').config();
const app = express();

const cRoutes = require('./routes/api/client');

const aRoutes = require('./routes/api/agent');

const pRoutes = require('./routes/api/property');

const acRoutes = require('./routes/api/auth');


app.use(express.json({extended:false}));

app.use('/api/client',cRoutes);

app.use('/api/agent',aRoutes);

app.use('/api/property',pRoutes);

app.use('/api/auth',acRoutes);

app.get('/',(req,res)=> res.send('API Running!'));

const PORT=9090;

app.listen(PORT,()=>console.log(`Server started on ${PORT}`));