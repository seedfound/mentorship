const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/submit', (req, res) => {
  // Get the form data from the request body
  const formData = req.body;

  // Read the CSV file
  const csvData = fs.readFileSync('Mentors.csv', 'utf8');

  // Append the new form data to the CSV file
  const newData = `${formData.department},${formData.year},${formData.name},${formData.mentor},${formData.notes}\n`;
  fs.appendFileSync('Mentors.csv', newData);

  // Send a response indicating the form data was successfully saved
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


