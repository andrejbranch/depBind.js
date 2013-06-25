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