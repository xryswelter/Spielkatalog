module.exports={
  "development": {
<<<<<<< HEAD:config/config.json
    "username": "root",
    "password": null,
=======
    "username": "process.env.DEV_DB_USER",
    "password": "process.env.DEV_DB_PASSWORD",
>>>>>>> b437830e784fa0b6dc448df62b1b54ca32c4142b:config/config.js
    "database": "exampledb",
    "host": "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "testdb",
    "host": "localhost",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "use_env_variable": "JAWSDB_URL",
    "dialect": "mysql"
  }
}
