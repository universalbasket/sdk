'use strict';

/**
 * This server is for local development purposes. You may prefer to integrate
 * against your own API.
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { createClientSdk } = require('@ubio/client-library');
const serviceConfig = require('./service-config');

const { CLIENT_TOKEN, PORT = 3000 } = process.env;

const app = express();
const sdk = createClientSdk({ token: CLIENT_TOKEN, fetch });

app.use(express.static('public'));
app.use('/web_modules', express.static('web_modules'));
app.use(cors());

app.post('/create-job', bodyParser.json(), async (_req, res) => {
    const { serviceId, input, local } = serviceConfig;

    try {
        const { id: jobId } = await sdk.createJob({ serviceId, input });
        const { token } = await sdk.getJobEndUser(jobId);

        res.status(201).send({ jobId, serviceId, token, local, input });
    } catch (error) {
        res.status(500).send({ error });
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
