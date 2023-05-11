const { defineConfig } = require('cypress');
let clearDb;

import('./db/index.mjs').then((db) => {
  clearDb = db.clearDb;
});

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        'clear:db': () => {
          return clearDb();
        },
      });
    },
  },
});
