const config = {
  development: {
    server: {
      port: 3000
    },
    database: {
      url: 'mongodb://localhost/exbbs_dev'
    }
  },
  testing: {
    server: {
      port: 3001
    },
    database: {
      url: 'mongodb://localhost/exbss_test'
    }
  },
  production: {
    server: {
      port: 8080
    },
    database: {
      url: 'mongodb://localhost/exbbs'
    }
  }
};

module.exports = config[process.env.NODE_ENV] || config.development;
