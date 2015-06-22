//this is only for dev work
var bs = require("browser-sync").create();
var history = require('connect-history-api-fallback');

bs.init({
    server: "public",
    port: 3001,
    middleware: [ history() ],
    files: "**/*.html, **/*.ts",
    notify: false
});