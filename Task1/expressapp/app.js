const express = require('express');
const { createLogger, format, transports } = require('winston');
//const NewsRepository = require('./newsRepository.js');

const NewsMongooseRepository = require('./NewsMongoRepository.js');
const newsRepository = new NewsMongooseRepository();

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

app.get('/news', async (req, res) => {
    var result = await newsRepository.getAll();
    res.json(result);
    newsRepository.dispose();
});

app.get('/news/:id', async (req, res) => {
    const newsId = req.params['id'];
    const item = await newsRepository.find(newsId);
    if (item) {
        res.json(item);
    } else {
        res.sendStatus(404);
    }
    newsRepository.dispose();
});

app.get('/error', (req, res) => {
    throw new Error('Error');
});

app.delete('/news/:id', async (req, res) => {
    const newsId = req.params['id'];
    await newsRepository.remove(newsId);
    res.redirect('/news');
    newsRepository.dispose();
});

app.post('/news', (req, res) => {
    newsRepository.add(req.body);
    res.redirect('/news');
    newsRepository.dispose();
});

app.put('/news', async (req, res) => {
    await newsRepository.addOrUpdate(req.body);
    res.redirect('/news');
    newsRepository.dispose();
});

app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ error: { mwssage: err.message } })
});

app.listen(3000);