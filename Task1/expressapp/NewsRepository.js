class NewsRepository {
    constructor() {
        const news = [
            {
                id: 1,
                title: 'title1',
                text: 'Text1'
            },
            {
                id: 2,
                title: 'title2',
                text: 'Text2'
            },
            {
                id: 3,
                title: 'title3',
                text: 'Text3'
            }
        ];
        this.getAll = () => {
            return news;
        };
        this.find = (id) => {
            return news.find((elem) => elem.id == id);
        };
        function getRandomInt() {
            return Math.floor(Math.random() * Math.floor(100000));
        }
        this.add = (newItem) => {
            newItem.id = getRandomInt();
            news.push(newItem);
        };
        this.addOrUpdate = (item) => {
            const index = news.findIndex((elem) => elem.id == item.id);
            if (index !== -1) {
                news[index] = item;
            }
            else {
                this.add(item);
            }
        };
        this.remove = (id) => {
            const index = news.findIndex((elem) => elem.id == id);
            if (index !== -1) {
                news.splice(index, 1);
            }
        };
    }
}

export default NewsRepository;