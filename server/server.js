const http = require('http').Server();
const hash = require('object-hash');
const io = require('socket.io')(http);
const mongodb = require('mongodb').MongoClient;
const oID = require('mongodb').ObjectID;
const express = require('express');
const app = express();
const cors = require('cors');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const bodyparser = require('body-parser');
const mingo = require('mingo');
const {
    BANCO_DE_DADOS,
    COLLECTION,
    URL,
    PORTA_HTTP,
    PORTA_WEBSOCKET
} = require('./configs');

io.on('connection', (socket) => {

    const notificarClientes = async (observers) => {
        console.log(`notificando cliente: ${socket.id}`);
        observers
            .filter(observer => observer.id === socket.id)
            .forEach( async observer => {
                const db = await mongodb.connect(URL);
                socket.emit(observer.queryHash, await db.db(BANCO_DE_DADOS).collection(COLLECTION).find(observer.query).toArray());
                db.close();
            });
    };

    myEmitter.on('/notificar', notificarClientes);

    socket.on('disconnect', () => {
        myEmitter.removeListener('/notificar', notificarClientes);
    });

});

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cors());

app.post('/list', async (req, res) => {
    try {
        const query = req.body.query;
        const consulta = req.body;
        const db = await mongodb.connect(URL);
        const queryHash = hash(consulta);
        consulta.queryHash = queryHash;
        const resultados = await db.db(BANCO_DE_DADOS).collection(COLLECTION).find(query).toArray();
        persistirHashQueryEmObjetos(resultados, consulta);
        persistirHashQueryEmCollection(consulta);
        db.close();
        res.send({resultados, queryHash});
    } catch (e) {
        res.send({e});
    }
});

app.post('/post', async (req, res) => {
    const dados = req.body;
    const lista = await listarQuerysHash();
    const queryHashEvento = mingoComparacao(lista, dados);
    await persistirPostagem(dados);

    if (queryHashEvento.length > 0) {
        myEmitter.emit('/notificar', queryHashEvento);
    }

    res.sendStatus(200);
});

app.delete('/post', async (req, res) => {
    const _id = oID(req.body._id);
    const db = await mongodb.connect(URL);
    const { observers } = await db.db(BANCO_DE_DADOS).collection(COLLECTION).findOne({_id});
    await db.db(BANCO_DE_DADOS).collection(COLLECTION).deleteOne({_id});
    db.close();
    if (observers) {
        myEmitter.emit('/notificar', observers);
    }
    res.send('ok');
});

app.put('/post', async (req, res) => {
    try {
        const $set = req.body.$set;
        const _id = oID(req.body._id);
        const db = await mongodb.connect(URL);
        await db.db(BANCO_DE_DADOS).collection(COLLECTION).updateOne({_id}, {$set});
        const novoObjeto = await db.db(BANCO_DE_DADOS).collection(COLLECTION).findOne({_id});

        if (novoObjeto.observers) {
            const observers = mingoComparacao(novoObjeto.observers, novoObjeto);
            if (observers) {
                myEmitter.emit('/notificar', observers);
            }
            await db.db(BANCO_DE_DADOS).collection(COLLECTION).updateOne({_id}, {$set : {observers}});
        }
        db.close();
        res.send('ok');
    } catch (e) {
        console.log(`Ocorreu um erro ao atulizar um objeto: ${e}`);
    }
});

const persistirHashQueryEmCollection = async (queryHashObjeto) => {

    /**
     * Objeto:
     * {
     *  query: object,
     *  id: string hash,
     *  queryHash
     * }
     */
    try {
        const db = await mongodb.connect(URL);
        await db.db(BANCO_DE_DADOS).collection('queryHash').insertOne(queryHashObjeto);
        db.close();
    } catch (e) {
        console.log(`Erro ao persistir QueryHash: ${e}`)
    }
};

const persistirHashQueryEmObjetos = async  (objetos, consulta) => {
    try {
        const db = await mongodb.connect(URL);
        objetos.forEach(async resultado => {
            const _id = oID(resultado._id);
            await db
                .db(BANCO_DE_DADOS)
                .collection(COLLECTION)
                .updateOne({_id}, {$addToSet: {observers: consulta}});
        });
        db.close();
        console.log('Todos os objetos foram persistidos');
    } catch (e) {
        db.close();
        console.log(`Ocorreu um erro ao persistir observers nos objetos da query ${consulta.queryHash}`);
    }
};

const mingoComparacao = (queryHashArray, obj) => {

    /**
     * Retorna todos as queryHash que o objeto da match
     */

    if (!queryHashArray) {
       return [];
    }

    return queryHashArray.filter(queryHash => {
        const test = new mingo.Query(queryHash.query);
        return test.test(obj);
    })
};

const persistirPostagem = async (post) => {
    const db = await mongodb.connect(URL);
    await db.db(BANCO_DE_DADOS).collection(COLLECTION).insertOne(post);
    db.close();
};

const listarQuerysHash = async () => {
    const db = await mongodb.connect(URL);
    const resultado = await db.db(BANCO_DE_DADOS).collection('queryHash').find({}).toArray();
    db.close();
    return resultado;
};


app
    .listen(PORTA_HTTP, () => console.log(`Rodando HTTP na porta ${PORTA_HTTP}`));

http
    .listen(PORTA_WEBSOCKET);