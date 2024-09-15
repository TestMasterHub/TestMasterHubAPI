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
    res.status(error.response ? error.response.status : 500).send({"Error":error.code});
    console.log(error.code);
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
    console.log(error.code);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
