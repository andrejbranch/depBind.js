define([
    '/src/depBind.js'
], function(DepBind) {
    DepBind.loadServices([
        '/example/js/config/config.json'
    ]);

    // prevent cursor from changing
    $('body').on('selectstart', function(e) {
        return false;
    })
});