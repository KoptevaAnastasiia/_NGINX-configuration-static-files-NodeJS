const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 4001;

app.use(express.static(path.join(__dirname, 'front_end')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front_end', 'index.html'));
});

app.get('/planets', async (req, res) => {
    try {
        const response = await axios.get('https://swapi.tech/api/planets/');
        const planets = response.data.results;

        const detailedPlanets = await Promise.all(planets.map(async (planet) => {
            try {
                const planetResponse = await axios.get(planet.url);
                const planetData = planetResponse.data.result.properties;
                return {
                    name: planet.name,
                    climate: planetData.climate || "N/A",
                    terrain: planetData.terrain || "N/A"
                };
            } catch (error) {
                console.error('Error(', error);
                return {
                    name: planet.name,
                    climate: "N/A",
                    terrain: "N/A"
                };
            }
        }));

        res.json(detailedPlanets);
    } catch (error) {
        console.error('Error fetching planets:', error);
        res.status(500).send('Error fetching planets');
    }
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
