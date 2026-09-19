const express = require('express');
const trilhaRouter = require('./routes/trilha');
const certificadoRouter = require('./routes/certificado');
const desafioRouter = require('./routes/desafio');

const app = express();
app.use(express.json());

app.use('/trilha', trilhaRouter);
app.use('/certificado', certificadoRouter);
app.use('/desafio', desafioRouter);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`DIO Explorer API running on port ${PORT}`));
}
