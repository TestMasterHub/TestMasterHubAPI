const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/proxy', async (req, res) => {
  const { method, url, headers, data } = req.body;
  console.log(method +'\n'+ url +'\n'+headers +'\n'+data )
  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
