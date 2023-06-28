const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/submit', (req, res) => {
  // Get the form data from the request body
  const formData = req.body;

  // Load the credentials file
  const credentials = require('./credentials.json'); // Replace with the path to your credentials file

  // Configure the Google Sheets API client
  const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  // ID of the Google Sheet to append the data
  const spreadsheetId = '17CtL3-jyJQJOpu38WB47PBg78QWS0ZfffppdDEJPA10'; // Replace with your Google Sheet ID

  // Append the new form data to the Google Sheet
  client.authorize((err) => {
    if (err) {
      console.error('Error authorizing Google Sheets API:', err);
      res.sendStatus(500);
      return;
    }

    const sheets = google.sheets({ version: 'v4', auth: client });

    sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: 'Sheet1', // Replace with your sheet name or range
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[formData.department, formData.year, formData.name, formData.mentor, formData.notes]],
        },
      },
      (err, response) => {
        if (err) {
          console.error('Error appending data to Google Sheets:', err);
          res.sendStatus(500);
          return;
        }

        // Send a response indicating the form data was successfully saved
        res.sendStatus(200);
      }
    );
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
