 var downloadReady = false;
 var source;
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
	if(downloadReady == true){
		console.log("ready");
		//creating an invisible element 
                var element = document.createElement('a'); 
                element.setAttribute('href',  
                'data:text/plain;charset=utf-8, ' 
                + encodeURIComponent(source)); 
                element.setAttribute('download', document.getElementById('sourceInput').value.substring(12)); 
              
                // Above code is equivalent to 
                // <a href="path of file" download="file name"> 
              
                document.body.appendChild(element); 
              
                //onClick property 
                element.click(); 
              
                document.body.removeChild(element); 
	} else {
		document.getElementById('scrubButton').innerText = "Scrubbing...";
		let reader = new FileReader();
		reader.readAsText(sourceInput.files[0]);
		reader.onload = function(){
	      var text = reader.result;
	      source = reader.result;

	      var sourceInput = document.getElementById('sourceInput').value;
	      var pii = document.getElementById('piiInput').value;
	      var py_name = document.getElementById('name').value;
	      var email = document.getElementById('email').value;
	      var address = document.getElementById('address').value;
	      var ssn = document.getElementById('ssn').value;
	      var voterID = document.getElementById('voterID').value;
	      var driverID = document.getElementById('driverID').value;
			// Format the ssn into three separate parts
			pattern = new RegExp('([0-9]{3})([0-9]{2})([0-9]{4})');
			ssn = ssn.replace(pattern, '$1-$2-$3');
			source = scrub_multi_word(source, py_name, 'NAME');
			source = scrub_word(source, email, 'EMAIL');
			source = scrub_word(source, encodeURI (email), 'EMAIL');
			source = scrub_multi_word(source, address, 'ADDRESS');
			source = scrub_ignoring_delimiters(source, ssn, 'SSN');
			source = scrub_multi_word(source, voterID, 'voterID');
			source = scrub_ignoring_delimiters(source, driverID, 'driverID');
			for (var keyword of pii) {
				source = scrub_multi_word(source, keyword, 'PII');
			}

	  		document.getElementById('scrubButton').classList.replace('btn-primary', 'btn-success');
	  		document.getElementById('scrubButton').innerText = "Download";

	  		downloadReady = true;
	  	}
    };
};

function reset(){
	downloadReady = false;
	document.getElementById('sourceFilename').innerText = document.getElementById('sourceInput').files[0].name;
	let sourceInput = document.getElementById('sourceInput');
	let scrubButton = document.getElementById('scrubButton');
	if(sourceInput.files.length > 0){
		if(scrubButton.classList.contains("btn-light")){
			scrubButton.classList.replace("btn-light", "btn-primary");
		} else if (scrubButton.classList.contains("btn-success")){
			scrubButton.classList.replace("btn-success", "btn-primary");
		}
		scrubButton.disabled = false;
		scrubButton.innerText = "Scrub"
	} else {
		if(scrubButton.classList.contains("btn-primary")){
			scrubButton.classList.replace("btn-primary", "btn-light");
		} else if (scrubButton.classList.contains("btn-success")){
			scrubButton.classList.replace("btn-success", "btn-light");
		}
		scrubButton.disabled = true;
		scrubButton.innerText = "Upload File"
	}	
}