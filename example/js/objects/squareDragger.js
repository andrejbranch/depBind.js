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