const uuid = require('uuid');
const fs = require('fs').promises;

async function nuevoGasto(body) {

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

    return
}

module.exports = nuevoGasto