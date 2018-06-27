module.exports = {
    BANCO_DE_DADOS: 'simulador',
    COLLECTION: 'posts',
    URL: 'mongodb://localhost:27017',
    PORTA_HTTP: 8080,
    PORTA_WEBSOCKET: 3000,
    DADOS: [
        {"titulo":"Ciêntistas comprovam: A Culpa é sempre do Front","autor":"mathias","likes":2, "observers": []},
        {"titulo":"PHP é o novo Cobol? ","autor":"eduardo","likes":3, "observers": []},
        {"titulo":"Java 10 finalmente é lançado","autor":"eduardo","likes":15, "observers": []},
        {"titulo":"Node 10.05 vem com suporte a threads","autor":"mathias","likes":0, "observers": []}
    ]
};