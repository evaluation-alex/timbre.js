(function(T) {
    "use strict";
    
    var fn = T.fn;
    
    function PanNode(_args) {
        T.Object.call(this, 2, _args);
        fn.fixAR(this);
        
        var _ = this._;
        _.value = T(0);
        _.panL = 0.5;
        _.panR = 0.5;
    }
    fn.extend(PanNode);
    
    var $ = PanNode.prototype;
    
    Object.defineProperties($, {
        pos: {
            set: function(value) {
                this._.pos = T(value);
            },
            get: function() {
                return this._.pos;
            }
        }
    });
    
    $.process = function(tickID) {
        var _ = this._;
        
        if (this.tickID !== tickID) {
            this.tickID = tickID;
            
            var changed = false;
            
            var pos = _.pos.process(tickID).cells[0][0];
            if (_.prevPos !== pos) {
                _.prevPos = pos;
                changed = true;
            }
            if (changed) {
                _.panL = Math.cos(0.5 * Math.PI * ((pos * 0.5) + 0.5));
                _.panR = Math.sin(0.5 * Math.PI * ((pos * 0.5) + 0.5));
            }
            
            var nodes = this.nodes;
            var cellL = this.cells[1];
            var cellR = this.cells[2];
            var i, imax = nodes.length;
            var j, jmax = cellL.length;
            var tmp;
            
            for (j = 0; j < jmax; ++j) {
                cellL[j] = cellR[j] = 0;
            }
            for (i = 0; i < imax; ++i) {
                tmp = nodes[i].process(tickID).cells[0];
                for (j = 0; j < jmax; ++j) {
                    cellL[j] = (cellR[j] += tmp[j]);
                }
            }
            
            var panL = _.panL;
            var panR = _.panR;
            for (j = 0; j < jmax; ++j) {
                cellL[j] = cellL[j] * panL;
                cellR[j] = cellR[j] * panR;
            }
            fn.outputSignalAR(this);
        }
        
        return this;
    };
    
    fn.register("pan", PanNode);
    
})(timbre);