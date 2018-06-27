const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017')
    .then((db) => {
        db
            .db('simulador')
            .collection('posts')
            .updateOne({_id: "5b17ec141e93d9792440860f"}, {$addToSet: {observers: {vai: true}}})
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    })
    .catch(erro => console.log(erro));