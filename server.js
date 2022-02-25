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

        let id = uuid.v4().slice(30);

        const gasto = {
            roommate: body.roommate,
            descripcion: body.descripcion,
            monto: body.monto,
            id: id
        };

        let db = await fs.readFile('db.json', 'utf-8');
        db = JSON.parse(db);
        db.gastos.push(gasto)
        
        db.roommates.map((roommate) => {
            if (roommate.nombre == gasto.roommate) {
                roommate.debe += body.monto
            }
        })

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

app.put('/gasto', (req, res) => {
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });
    req.on('end', async () => {

        let db = await fs.readFile('db.json', 'utf-8');
        db = JSON.parse(db);

        db.gastos.map((gasto) => {
            if (gasto.id == req.query.id) {
                gasto.monto = body.monto
                gasto.descripcion = body.descripcion
            }
            
        })
        
        const roommate = db.roommates.find(r => r.nombre == body.roommate);
        const gastosRoommate = db.gastos.filter( g => g.roommate = roommate.nombre).map(g => g.monto).reduce( (x, y) => x + y);
        roommate.debe = gastosRoommate;

        
        await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')

        res.send({todo: 'OK'});
    });
})


app.delete('/gasto', async (req, res) => {

    let db = await fs.readFile('db.json', 'utf-8');
    db = JSON.parse(db);

    let gastos = db.gastos
    gastos = gastos.filter((gasto) => gasto.id !== req.query.id)
    db.gastos = gastos   


    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')

    res.send({todo: 'OK'});
})


app.listen(3000, () => {
    console.log('servidor corriendo en puerto 3000')
});