define([], function() {
    window.DepBind = {
        services: {},
        loadServices: function(configs) {
            var that = this;
            var totalLoaded = 0;
            for (var i = 0; i <= configs.length - 1; i++) {
                $.getJSON(configs[i], function(data) {
                    $.each(data, function(key, service) {
                        that.set(service);
                    });
                    totalLoaded++;
                    // wait till all configuration files are loaded before loading all objects
                    totalLoaded == configs.length ? that.loadObjects() : '';
                });
            }
        },
        set: function(service) {
            this.services[service.id] = service;
        },
        get: function(serviceId) {
            return this.services[serviceId];
        },
        loadObjects: function() {
            var that = this;
            var filesToLoad = [];
            $.each(this.services, function(serviceId, service) {
                filesToLoad.push(service.file);
            });

            // use require.js to load up all the files
            require(filesToLoad, function() {
                // all files loaded, now set the objects on the services 
                $.each(that.services, function(serviceId, service) {
                    service.object = require(service.file);
                });

                // inject all dependenices into service objects initialize function
                that.injectDependencies();
                // bind events and global events
                that.bindEvents();
            });
        },
        injectDependencies: function() {
            var that = this;
            $.each(this.services, function(serviceId, service) {
                var deps = service.arguments;
                var dependencies = new Array();
                $.each(deps, function(k, serviceId) {
                    dependencies.push(that.get(serviceId).object);
                });
                service.object.initialize.apply(service.object, dependencies);
            });
        },
        bindEvents: function() {
            $.each(this.services, function(serviceId, service) {
                var events = service.events ? service.events : [];
                var globalEvents = service.globalEvents ? service.globalEvents : [];
                // listen to all events in the scope of the objects el selector
                $.each(events, function(type, fun) {
                    (function() {
                        $('body').on(type, service.object.el.selector, function(e) {
                            var target = $(this);
                            service.object[fun](e, target);
                        })
                    })();
                });
                // listen to all events in the document bodies scope
                $.each(globalEvents, function(type, fun) {
                    (function() {
                        $('body').on(type, function(e, data) {
                            service.object[fun](e, data);
                        })
                    })();
                });
            });
        }
    }

    return window.DepBind;
});