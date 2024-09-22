const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/proxy', async (req, res) => {
  const { method, url, headers, data } = req.body;
  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.statusText || error.message || 'Internal Server Error';
    res.status(status).send({ "Error": message });
    console.log(error);
  }
});

// Corrected GET route handler
app.get('/api/proxystatus', async (req, res) => {
  try {
    res.status(200).json({
      "message": "Online"
    });
  } catch (error) {
    res.status(500).json({
      "message": `${error.message}`
    });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});