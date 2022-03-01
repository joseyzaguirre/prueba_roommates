const axios = require('axios');
const uuid = require('uuid');
const fs = require('fs').promises;

// función para crear nuevo Roommate
async function nuevoRoommate() {

    const datos = await axios.get('https://randomuser.me/api/');
    const userData = datos.data.results[0];

    let id = uuid.v4().slice(30);
    
    let usuarioRandom = {
        nombre: userData.name.first + " " + userData.name.last,
        id: id,
        debe: 0,
        recibe: 0        
    }

    let db = await fs.readFile('db.json', 'utf-8');
    db = JSON.parse(db);
    db.roommates.push(usuarioRandom)

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')

    return
};



module.exports = nuevoRoommate;
