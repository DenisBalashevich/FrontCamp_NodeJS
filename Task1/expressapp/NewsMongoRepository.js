const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsScheme = new Schema(
    {
        title: String,
        text: String
    },
    { versionKey: false });

function NewsMongooseRepository() {
    const self = this;

    mongoose.connect('mongodb://localhost:27017/frontcamp', { useNewUrlParser: true, useUnifiedTopology: true });
    const News = mongoose.model('News', newsScheme);

    self.getAll = async () => {
        return await News.find(function (err, post) {
            if (err) return next(err);
            return post;
        });
    }

    self.find = async (id) => {
        return await News.findById(id, function (err, response) {
            if (err) return next(err);
            return response;
        });
    }

    self.add = async (newItem) => {
        News.create(newItem);
    }

    self.addOrUpdate = async (item) => {
        News.findByIdAndUpdate(item.id, item);
    }

    self.remove = async (id) => {
        return await News.findByIdAndDelete(id);
    }

    self.dispose = () => {
        mongoose.disconnect();
    }
}

module.exports = NewsMongooseRepository;