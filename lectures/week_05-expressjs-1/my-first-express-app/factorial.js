function factorial(n) {
	if (n==0) {
		return 1;
	}
	if (n ==1) {
		return 1;
	}
	return n * factorial(n-1);
}

function square(n) {
	return n*n;
}

function root(n) {
	return Math.sqrt(n)
}

module.exports = {
	factorial: factorial,
	square: square,
	root: root
}