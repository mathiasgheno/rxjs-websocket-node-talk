# Node.js, WebSocket e Rxjs: Simulando o Comportamento do Firebase #

## Sobre ##

Esse repositório contêm o código e a apresentação que foi apresentado no meetup Node.JS POA, em 21 de Junho de 2018;


## Apresentação ##

Meu nome é Mathias Gheno Azzolini, sou desenvolvedor fullstack na empresa DBServer, formado em Análise e Desenvolvimento de Sistema pelo IFRS e militante LGBT. Acredito que a tecnologia é peça fundamental para a criação de um mundo mais inclusivo e igualitário, sendo assim, apenas tecnologia pela tecnologia não é o suficiente. Acredito que a comunidade JavaScript é formada por pessoas que querem, além de tudo, criar coisas e é por esse motivo que sou um grande entusiasta de todo o ecossistema JavaScript.

## Dependências ##

Para conseguir rodar o projeto você deve:

1) Ter o Node.JS instalado no seu sistema operacional;
2) Ter o MongoDB instalado no seu sistema operacional¹;
3) Ter uma conta e um projeto no firebase;

## Rodando o Projeto ##

1) Instalando as dependências necessárias para o server

Dentra da pasta /server, execute:

> npm install

2) Instalando as dependências necessárias para o front:

Dentro da pasta /client, execute:

> npm install

3) Importar dados do Banco de dados

Dentro da pasta /server, execute:

> node import.js

4) Rodando o backend

Dentro da pasta /server, execute:

> node server.js

5) Rodando o front-end:

Dentro da pasta /client, execute:

> ng serve



## Documentação ##

1) [Acesso ao fluxo da arquitetura proposta.](https://realtimeboard.com/app/board/o9J_kzH5N6s=/)
2) [Acesso à Apresentação](https://docs.google.com/presentation/d/1ZDlgNSBG4awqNgnQ2KZbAAClvTLnWYKchIKjjeNf1w0/edit?usp=sharing)

### Rodapé ###

1) No exemplo, o MongoDB não está com autenticação habilitada.