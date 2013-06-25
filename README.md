Summary
------------
DepBind.js is an extremely easy to use dependency injection manager, and event binder for javascript. It uses jquery and require.js to make more modular javascript code. Inspired by Symfony 2's container (with some Backbone influences), DepBind uses a json configuration file to label services, their dependencies (other services), and the events they listen to. In the example provided you can see the benefit quickly. You have a square that you want to drag around the screen, so you create a square object and a manager object (SquareDragger) to manage the dragging. A nifty way to do this is to make both the square object and the dragger dependent on each other. Things like require.js are not good for this because you get circular dependencies. With DepBind.js all object are first loaded from the configuration files using require.js and then their dependencies are injected into each services initialize function. To get the example provided to work you will have to point you local web server to the depbind folder. This is because jquery's $.getJSON method is used to load your configuration file which can only be done if the file is hosted.

Requirements
------------
* `jquery`
* `require.js`

Use
------------
In your page include jquery and require.js with the path to your main js file in data-main attribute

```html
    <script src="path/to/jquery.js"></script>
    <script data-main="/path/to/main.js" src="path/to/require.js"></script>
```
Then in your main js file user the loadServices method to include an array of json configuration files.
    
```js
define([
    'path/to.depBind.js'
], function(DepBind) {
    DepBind.loadServices([
        'path/to/jsonConfig1',
        'path/to/jsonConfig2'
    ]);
});
```

In your configuration files, put json arrays of service objects you want to load up including the service id, file path, its dependencies (arguments) to be injected into the initialize method, and the events your object will listen to with the function to call on trigger. Example:
```json
[
    {
        "id": "square",
        "file": "/example/js/objects/square.js",
        "arguments": [
            "square_dragger"
        ],
        "events": {
            "mousedown" : "onMouseDown",
            "mouseup"   : "onMouseUp"
        }
    },
    {
        "id": "square_dragger",
        "file": "/example/js/objects/squareDragger.js",
        "arguments": [
            "square"
        ],
        "globalEvents": {
            "mousemove" : "onMouseMove"
        }
    }
]
```

In this configuration file there are two services, square and square_dragger and both are dependent on each other. The "arguments" key is an array of the service ids you want injected into the services initialize method. In the above configuration file the service square will have the service square_dragger injected, and the service square_dragger will have the square service injected. Global events will be triggered in the scope of the documents body, but normal events will only call the specified method in the scope of the services selector.
Square.js looks like this: 
```js
define([], function() {
    var Square = {
        el: $('#square'),
        initialize: function(SquareDragger) {
            this.squareDragger = SquareDragger;
        },
        onMouseDown: function(e, target) {
            this.squareDragger.enabled = true;
            this.squareDragger.mouseX = e.pageX;
            this.squareDragger.mouseY = e.pageY;
        },
        onMouseUp: function(e, target) {
            this.squareDragger.enabled = false;
        },
        getOffestTop: function() {
            return this.el.offset().top; 
        },
        getOffestLeft: function() {
            return this.el.offset().left; 
        },
        incrementTop: function(diff) {
            this.el.css('top', this.getOffestTop() + diff);
        },
        incrementLeft: function(diff) {
            this.el.css('left', this.getOffestLeft() + diff);
        }
    }

    return Square;
});
```
and squareDragger.js looks like this
```js
define([], function() {
    var SquareDragger = {
        el: null,
        enabled: false,
        mouseX: null,
        mouseY: null,
        initialize: function(Square) {
            this.square = Square;
        },
        onMouseMove: function(e, target) {
            if (this.enabled) {
                var topDifference = e.pageY - this.mouseY;
                var leftDifference = e.pageX - this.mouseX;
                this.square.incrementTop(topDifference);
                this.square.incrementLeft(leftDifference);
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
            }
        }
    }

    return SquareDragger;
});
```

    

