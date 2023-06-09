## Install

- type in console or terminal `npm i` or `npm install`
- copy and rename **env.example** to **.env** and configure database
- run migrate `node ace migration:run --seed` or `node ace migration:fresh --seed` to migrate database and adding default user data
- run in local by typing `node ace serve --watch`