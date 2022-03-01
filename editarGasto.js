const fs = require('fs').promises;

async function editarGasto(body, queryId) {
    let db = await fs.readFile('db.json', 'utf-8');
    db = JSON.parse(db);

    db.gastos.map((gasto) => {
        if (gasto.id == queryId) {
            gasto.monto = body.monto
            gasto.descripcion = body.descripcion
        }
        
    })
    
    let roommate = db.roommates.find(r => r.nombre == body.roommate);
    let montos = db.gastos.map( x => {
        if (x.roommate == body.roommate) {
            return x.monto
        } else {
            return 0
        }
    })
    let gastosRoommate = montos.reduce((x, y) => x + y)
    roommate.debe = gastosRoommate;

    
    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')

    return
}

module.exports = editarGasto