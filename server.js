const express = require('express');
const fs = require('fs');

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

  // Read the existing CSV file
  fs.readFile('Mentors.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSV file:', err);
      res.sendStatus(500);
      return;
    }

    // Append the new form data to the CSV file
    const newData = `${formData.department},${formData.year},${formData.name},${formData.mentor},${formData.notes}\n`;
    const updatedData = data + newData;

    // Write the updated data to the CSV file
    fs.writeFile('Mentors.csv', updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to CSV file:', err);
        res.sendStatus(500);
        return;
      }

      // Send a response indicating the form data was successfully saved
      res.sendStatus(200);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
