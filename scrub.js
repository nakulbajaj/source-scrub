 /* Scrubs all instances of word from source.
  * Will match even if word is inside another word.
  */
function scrub_word(source, word, replacement){
	if (word === ''){ return source; }
	var pattern = new RegExp(word, 'gi');
	return source.replace(pattern, replacement);
};

/* Scrubs a word from source.
 * Only matches entire word surrounded by regex's word boundries.
 */
function scrub_whole_word(source, word, replacement) {
	if (word === ''){ return source; }
	var pattern = new RegExp('\\b' + word + '\\b', 'gi');
	return source.replace(pattern, replacement);
};

/* Scrubs each word in keyword. Only matches entire words
 * in source, using scrub_whole_word().
 */
function scrub_multi_word(source, keyword, replacement) {
	var ret = source;
	var words = keyword.split(/\W+|_/);
	for (var word of words) {
		ret = scrub_whole_word(ret, word, replacement);
	}
	return ret;
};

/* Scrubs each instance of word but ignores delimiters
 * the source.
 * e.g. 123456789 matches 123 45 6789
 */
function scrub_ignoring_delimiters(source, word, replacement){
	if (word === ''){ return source; }
	word = word.replace(/\W+|_/gi, '')
	var chars = word.split('');
	var pattern = new RegExp(chars.join('[\\W+|_]*'), 'gi');
	return source.replace(pattern, replacement);
}

function scrub(){
	var source = document.getElementById('sourceInput').value;
	var pii = document.getElementById('piiInput').value;
	var output = document.getElementById('output');
	var py_name = document.getElementById('name').value;
	var email = document.getElementById('email').value;
	var address = document.getElementById('address').value;
	var ssn = document.getElementById('ssn').value;
	// Format the ssn into three separate parts
	pattern = new RegExp('([0-9]{3})([0-9]{2})([0-9]{4})')
	ssn = ssn.replace(pattern, '$1-$2-$3')
	var voterID = document.getElementById('voterID').value;
	var driverID = document.getElementById('driverID').value;
	source = scrub_multi_word(source, py_name, 'NAME');
	source = scrub_word(source, email, 'EMAIL');
	source = scrub_word(source, encodeURI (email), 'EMAIL');
	source = scrub_multi_word(source, address, 'ADDRESS');
	source = scrub_multi_word(source, ssn, 'SSN');
	source = scrub_multi_word(source, voterID, 'voterID');
	source = scrub_ignoring_delimiters(source, driverID, 'driverID')
	for (var keyword of pii) {
		var source = scrub_multi_word(source, keyword, 'PII');
	}
	output.value = source;
};

function copyToClipboard(){
	// var range = document.createRange();
	// var selection = window.getSelection();
	// range.selectNodeContents(document.getElementById('output'));
	// selection.removeAllRanges();
	// selection.addRange(range);
	var output = document.getElementById('output')
	output.select() 
	document.execCommand("copy");

}

