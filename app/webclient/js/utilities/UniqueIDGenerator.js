
var counter = 0;

function generateUniqueID() {
	var to_return = "ID-" + counter;
	counter++;
	return to_return;
}