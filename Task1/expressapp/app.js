const express = require('express');
const { createLogger, format, transports }  = require('winston');
const NewsRepository = require('./newsRepository.js');

const newsRepository = new NewsRepository();

const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      new transports.Console({ format: format.simple() })
    ]
  });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
});

app.get('/news', (req, res) => {
    res.json(newsRepository.getAll());
});

app.get('/error', (req, res) => {
    throw new Error('Error');
});

app.delete('/news/:id', (req, res) => {
    const newsId = req.params['id'];
    newsRepository.remove(newsId);
    res.redirect('/news');
});

app.post('/news', (req, res) => {
    newsRepository.add(req.body)
    res.redirect('/news');
});

app.put('/news', (req, res) => {
    newsRepository.addOrUpdate(req.body);
    res.redirect('/news');
});

app.get('/news/:id', (req, res) => {
    const newsId = req.params['id'];
    const item = newsRepository.find(newsId);
    if (item) {
        res.json(item);
    } else {
        res.sendStatus(404);
    }
});

app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({error: {mwssage: err.message}})
});

app.listen(3000);