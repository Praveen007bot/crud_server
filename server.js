const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { row_data, col_config } = require('./config/config');


const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const data = [...row_data]
app.get('/rows', (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  const start = (page - 1) * limit;
  const end = start + limit;

  const pagedData = data.slice(start, end);

  res.json({
    total: data.length,
    page,
    limit,
    data: pagedData,
  });
});

// GET single row
app.get('/rows/:id', (req, res) => {
  const row = data.find(item => item.account_id === req.params.id);
  row ? res.json(row) : res.status(404).json({ message: 'Not found' });
});

// POST (Create)
app.post('/rows', (req, res) => {
  const newRow = req.body;
  data.unshift(newRow);
  res.status(201).json(newRow);
});

// PUT (Update)
app.put('/rows/:id', (req, res) => {
  const index = data.findIndex(item => item.account_id === req.params.id);
  if (index !== -1) {
    data[index] = req.body;
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// DELETE
app.delete('/rows/:id', (req, res) => {
  data = data.filter(item => item.account_id !== req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// GET column config
app.get('/config', (req, res) => {
  res.json(col_config);
});

