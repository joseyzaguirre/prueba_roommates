const express = require('express');
const fs = require('fs').promises;
const nuevoRoommate = require('./nuevoRoommate.js');
const nuevoGasto = require('./nuevoGasto.js');
const editarGasto = require('./editarGasto.js');
const borrarGasto = require('./borrarGasto.js');

const app = express();

app.use(express.static('static'));
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

app.post('/roommate', async (req, res) => {
    
    await nuevoRoommate();
    
    res.send({todo: 'OK'})
});

app.post('/gasto', async (req, res) => {
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });
    req.on('end', async () => {

        await nuevoGasto(body);
        res.send({todo: 'OK'});
    });
});

app.get('/roommates', async(req, res) => {

    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db)
    let roommates = db.roommates

    res.json({ roommates })
});

app.get('/gastos', async(req, res) => {

    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);
    let gastos = db.gastos

    res.json({ gastos });
});

app.put('/gasto', async(req, res) => {
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });
    req.on('end', async () => {
        let queryId = req.query.id
        await editarGasto(body, queryId);
        res.send({todo: 'OK'});
    });
});

app.delete('/gasto', async (req, res) => {
    
    let queryId = req.query.id

    await borrarGasto(queryId);

    res.send({todo: 'OK'});
});

app.listen(3000, () => {
    console.log('servidor corriendo en puerto 3000')
});