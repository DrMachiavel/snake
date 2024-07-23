const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/webhook", (req, res) => {
    const receivedData = req.body;
    console.log('Received JSON:', JSON.stringify(receivedData, null, 2));

    const userType = receivedData.caller.userType;
    const environment = receivedData.environment;

    let response;

    // Condition pour student
    if (userType === 'student') {
        if (environment[0].VALUE === true) {
            response = [
                {
                    "id": "9lor6",
                    "block": "iframe",
                    "url": "https://snake-edusign.replit.app/",
                    "height": "670px"
                }
            ];
        } else {
            response = [
                {
                    "id": "epn2o",
                    "block": "text",
                    "text": "# No game for you :'(\n We are so sorry, your admin didn't activate the option for you to play."
                }
            ];
        }
    }
    // Condition pour professor
    else if (userType === 'professor') {
        if (environment[1].VALUE === true) {
            response = [
                {
                    "id": "9lor6",
                    "block": "iframe",
                    "url": "https://snake-edusign.replit.app/",
                    "height": "670px"
                }
            ];
        } else {
            response = [
                {
                    "id": "epn2o",
                    "block": "text",
                    "text": "# No game for you :'(\n We are so sorry, your admin didn't activate the option for you to play."
                }
            ];
        }
    }
    // Condition pour admin
    else if (userType === 'school') {
        if (environment[2].VALUE === true) {
            response = [
                {
                    "id": "9lor6",
                    "block": "iframe",
                    "url": "https://snake-edusign.replit.app/",
                    "height": "670px"
                }
            ];
        } else {
            response = [
                {
                    "id": "epn2o",
                    "block": "text",
                    "text": "# No game for you :'(\n We are so sorry, your admin didn't activate the option for you to play."
                }
            ];
        }
    }
    // Si userType ne correspond à aucune condition spécifiée
    else {
        response = [
            {
                "id": "epn2o",
                "block": "text",
                "text": "# No game for you :'(\n We are so sorry, your admin didn't activate the option for you to play."
            }
        ];
    }

    res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
