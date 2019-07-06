module.exports = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "WWdb",
    "host": "localhost",
    "dialect": "mysql",
    "port": "3306"
  },
  "test": {
    "username": "",
    "password": "",
    "database": "3306",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": "JAWSDB_URL",
    "dialect": "mysql"
  }

}