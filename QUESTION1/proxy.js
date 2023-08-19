const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors()); // Enable CORS for all routes

app.get('/numbers', async (req, res) => {
  const urls = req.query.url || [];

  try {
    const fetchPromises = urls.map(url => fetch(url));
    const responses = await Promise.allSettled(fetchPromises);
    const responseData = responses
      .filter(response => response.status === 'fulfilled' && response.value.ok)
      .map(response => response.value.json());

    const mergedData = await Promise.all(responseData);
    res.json({ data: mergedData });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
