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
	var pattern = new RegExp('\\b' + word + '\\b', 'gi')
	return source.replace(pattern, replacement)
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

function scrub(){
	var sourceInput = document.getElementById ('sourceInput');
	var piiInput = document.getElementById ('piiInput');
	var output = document.getElementById ('output');
	var py_name = document.getElementById ('name').value;
	var email = document.getElementById ('email').value;
	var address = document.getElementById ('address').value;
	var ssn = document.getElementById ('ssn').value;
	// Format the ssn into three separate parts
	pattern = new RegExp('([0-9]{3})([0-9]{2})([0-9]{4})')
	ssn = ssn.replace(pattern, '$1-$2-$3')
	var source = sourceInput.value;
	var pii = piiInput.value.split(/\n/gi);
	var source = scrub_multi_word (source, py_name, 'NAME');
	var source = scrub_word (source, email, 'EMAIL');
	var source = scrub_word (source, encodeURI (email), 'EMAIL');
	var source = scrub_multi_word (source, address, 'ADDRESS');
	var source = scrub_multi_word (source, ssn, 'SSN');
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

