const mongodb = require('mongodb').MongoClient;
const {
    URL,
    COLLECTION,
    BANCO_DE_DADOS,
    DADOS
} = require('./configs');

const importarDadaos = async function () {
    try {
        const db = await mongodb.connect(URL);
        // await db.db(BANCO_DE_DADOS).collection(COLLECTION).drop();
        // await db.db(BANCO_DE_DADOS).collection('queryHash').drop();
        await db
            .db(BANCO_DE_DADOS)
            .collection(COLLECTION)
            .insertMany(DADOS);

        console.log('Todo certo!');
    } catch (e) {
        console.log(`Ocorreu um erro: ${e}`);
    }
};

importarDadaos();