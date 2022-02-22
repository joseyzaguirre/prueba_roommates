const express = require('express');
const uuid = require('uuid');
const fs = require('fs').promises;

const app = express();

app.use(express.static('static'));

app.get('/roommate', async (req, res) => {
    
})

app.get('/gastos', async (req, res) => {

})

app.listen(3000, () => {
    console.log('servidor corriendo en puerto 3000')
});