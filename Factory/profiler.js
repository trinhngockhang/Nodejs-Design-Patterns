function Profiler(label) {
    this.label = label;
    this.lastTime = null;
}
  Profiler.prototype.start = function() {
    this.lastTime = process.hrtime();
}
  Profiler.prototype.end = function() {
    var diff = process.hrtime(this.lastTime);
    console.log('Timer "' + this.label + '" took '
    + diff[0] + ' seconds and '
    + diff[1] + ' nanoseconds.');
}

module.exports = function(label) {
    if(process.env.NODE_ENV === 'development') {
      return new Profiler(label);        //[1]
    } else if(process.env.NODE_ENV === 'production') {
      return {             //[2]
        start: function() {},
        end: function() {}
}
} else {
      throw new Error('Must set NODE_ENV');
    }
}
