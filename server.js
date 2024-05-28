const express = require("express");
const app = express();
const PORT = 3000;
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

app.listen(PORT, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(express.static("imagenes-procesadas"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/imagen-procesada', async (req, res) => {
    const urlImagen = req.body.urlImagen;

    try {
        const imagen = await Jimp.read(urlImagen);
        imagen.resize(350, Jimp.AUTO).greyscale();
        const nombreImagen = `${uuidv4()}.jpg`;        
        
        const rutaImagen = path.join(__dirname, '/assets/imagenes-procesadas', nombreImagen);
        await imagen.writeAsync(rutaImagen);
        
        res.send(`<img src="/imagenes-procesadas/${nombreImagen}" alt="Imagen procesada">`);
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        res.status(500).send('Error interno del servidor');
    }
});