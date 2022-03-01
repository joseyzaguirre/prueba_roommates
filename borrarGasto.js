const fs = require('fs').promises;

async function borrarGasto(queryId) {
    let db = await fs.readFile('db.json', 'utf-8');
    db = JSON.parse(db);

    let gastoMod = db.gastos.find(g => g.id == queryId)

    let roommate = db.roommates.find(r => r.nombre == gastoMod.roommate);
    roommate.debe = roommate.debe - gastoMod.monto;


    let gastos = db.gastos
    gastos = gastos.filter((gasto) => gasto.id !== queryId)
    db.gastos = gastos   

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')

    return
}

module.exports = borrarGasto;