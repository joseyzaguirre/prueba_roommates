const express = require('express');
const uuid = require('uuid');
const fs = require('fs').promises;
const axios = require('axios');

const app = express();

app.use(express.static('static'));
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

app.post('/roommate', async (req, res) => {

    const datos = await axios.get('https://randomuser.me/api/');
    const userData = datos.data.results[0];

    let id = uuid.v4().slice(30);
    
    const usuarioRandom = {
        nombre: userData.name.first + " " + userData.name.last,
        id: id,
        debe: 0,
        recibe: 0        
    }

    let db = await fs.readFile('db.json', 'utf-8');
    db = JSON.parse(db);
    db.roommates.push(usuarioRandom)

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')

    res.json(db)
})

app.post('/gasto', async (req, res) => {
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });
    req.on('end', async () => {

      // acá tenemos que crear el gasto
        let id = uuid.v4().slice(30);

        const gasto = {
            roommate: body.roommate,
            descripcion: body.descripcion,
            monto: body.monto,
            id: id
        };

        console.log(gasto)

        let db = await fs.readFile('db.json', 'utf-8');
        db = JSON.parse(db);
        db.gastos.push(gasto)

        await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')

        res.send({todo: 'OK'});
    });
});

app.get('/roommates', (req, res) => {   
    let db = require('./db.json')
    let roommates = db.roommates
    res.json({roommates})
})

app.get('/gastos', (req, res) => {
    let db = require('./db.json')
    let gastos = db.gastos
    res.json({gastos})
})

app.listen(3000, () => {
    console.log('servidor corriendo en puerto 3000')
});