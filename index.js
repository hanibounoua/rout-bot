const express = require('express');
const axios = require('axios');
const path = require('path');
const { CLIENT_RENEG_LIMIT } = require('tls');

const app = express();
const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN = '1305a4e5d5eb40'; // Remplace par ton token ipinfo.io

// Pour servir les fichiers statiques (comme les images)
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', true);

app.get('/image1.jpg', async (req, res) => {
// Obtenir l'IP du client
let ip = req.ip;

  // Nettoyer IPv6/IPv4 mix ::ffff:
if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
}
try {
    // Requête vers l'API ipinfo
    const response = await axios.get(`http://ipinfo.io/${ip}/json?token=${ACCESS_TOKEN}`);
    const data = response.data;

    // Vérifier le pays
    if (data.country === 'DZ') {
        res.send(`
        <h1>Bienvenue !</h1>
        <img src="/image1.jpg" alt="Image 1">
        <img src="/image2.jpg" alt="Image 2">
    `);
    } else {
        console.log(data.country)
        res.send(`<p>Les images sont masquées pour les utilisateurs non algériens.</p>`);
    }
} catch (error) {
    console.error('Erreur lors de la géolocalisation:', error.message);
    res.status(500).send('Erreur de géolocalisation IP.');
}
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);    
});
