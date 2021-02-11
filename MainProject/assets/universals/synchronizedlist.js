// Array.prototype.addOne = function() {
//     this[0]++;
// }


// module.exports.addOne = Array.prototype.addOne;



Array.prototype.isSynchronized = false;

Array.prototype.initSync = function(synchronizedRoom) {
    this.isSynchronized = true;
    this.synchronizedRoom = synchronizedRoom;
}










module.exports.isSynchronized = Array.prototype.isSynchronized;
module.exports.initSync = Array.prototype.initSync;