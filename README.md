# catty-chat-server
server side of chat app on Node+GraphQL+Sequelize

---

Personal project of [Dmitriy Oskarov](http://frontendfrontier.com/)

---

Technology stack:

* Node
* Graphql
* Apollo
* Sequelize
* MySQL

---

### Description (Описание)

EN:

Backend for a chat built on architectural
Apollo solutions (GraphQL), but this time the database will have to
unfold yourself. This is a MySQL work with which is carried out through the ORM Sequelize

RU:

Серверная часть для чата, построенного на архитектурных
решениях Apollo (GraphQL), но на этот раз базу данных придётся 
разворачивать самому. Это MySQL работа с которой ведётся через ORM Sequelize

---

### Installing (Установка)

1. clone
2. npm install
3. install MySQL and run it
4. Create database, user and password   
5. place config.js file and fill in the following information:
   ```
   module.exports = {
    SECRET_KEY: 'some very secret, you know' #for token
    }
   ```
6. in config folder create config.json for database connection (you can use dummy-config)
7. npm run start

---

thanks [Classsed](https://www.patreon.com/classsed) for lessons and inspiration