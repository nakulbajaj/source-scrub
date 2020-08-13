 var downloadReady = false;
 var source;
 /* Scrubs all instances of word from source.
  * Will match even if word is inside another word.
  */
 function scrub_word(source, word, replacement) {
 	if (word === '') {
 		return source;
 	}
 	var pattern = new RegExp(word, 'gi');
 	return source.replace(pattern, replacement);
 };

 /* Scrubs a word from source.
  * Only matches entire word surrounded by regex's word boundries.
  */
 function scrub_whole_word(source, word, replacement) {
 	if (word === '') {
 		return source;
 	}
 	var pattern = new RegExp('[^a-z]' + word + '[^a-z]', 'gi');
 	return source.replace(pattern, replacement);
 };

 /* Scrubs a number from source.
  * Only matches entire number surrounded by non-digits.
  */
 function scrub_whole_number(source, number, replacement) {
 	if (number === '') {
 		return source;
 	}
 	var pattern = new RegExp('[^0-9]' + number + '[^0-9]', 'gi');
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
 function scrub_ignoring_delimiters(source, word, replacement) {
 	if (word === '') {
 		return source;
 	}
 	word = word.replace(/\W+|_/gi, '')
 	var chars = word.split('');
 	var pattern = new RegExp(chars.join('[\\W+|_]*'), 'gi');
 	return source.replace(pattern, replacement);
 }

 function scrub() {
 	if (downloadReady == true) {
 		console.log("ready");
 		//creating an invisible element 
 		var element = document.createElement('a');
 		element.setAttribute('href',
 			'data:text/plain;charset=utf-8, ' +
 			encodeURIComponent(source));
 		element.setAttribute('download', "scrubbed_" + document.getElementById('sourceInput').value.substring(12));

 		// Above code is equivalent to 
 		// <a href="path of file" download="file name"> 

 		document.body.appendChild(element);

 		//onClick property 
 		element.click();

 		document.body.removeChild(element);
 	}
 	else {
 		document.getElementById('scrubButton').innerText = "Scrubbing...";
 		let reader = new FileReader();
 		reader.readAsText(document.getElementById('sourceInput').files[0]);
 		reader.onload = function () {
 			var text = reader.result;
 			source = reader.result;

 			var first_name = document.getElementById('first_name').value;
 			var middle_name = document.getElementById('middle_name').value;
 			var last_name = document.getElementById('last_name').value;

 			var email = document.getElementById('email').value;

 			var street_address = document.getElementById('street_address').value;
 			var city_address = document.getElementById('city_address').value;
 			var zip_address = document.getElementById('zip_address').value;

 			var areacode_phone = document.getElementById('areacode_phone').value;
 			var centraloffice_phone = document.getElementById('centraloffice_phone').value;
 			var subscribernumber_phone = document.getElementById('subscribernumber_phone').value;

 			var month_dob = document.getElementById('month_dob').value;
 			var day_dob = document.getElementById('day_dob').value;
 			var year_dob = document.getElementById('year_dob').value;

 			var areanumber_ssn = document.getElementById('areanumber_ssn').value;
 			var groupnumber_ssn = document.getElementById('groupnumber_ssn').value;
 			var serialnumber_ssn = document.getElementById('serialnumber_ssn').value;

 			var driverID = document.getElementById('driverID').value;

 			var voterID = document.getElementById('voterID').value;

 			var piiInput = document.getElementById('piiInput').value;

 			source = scrub_whole_word(source, first_name, '*FIRSTNAME*');
 			source = scrub_whole_word(source, middle_name, '*MIDDLENAME*');
 			source = scrub_whole_word(source, last_name, '*LASTNAME*');

 			source = scrub_word(source, email, '*EMAIL*');
 			source = scrub_word(source, encodeURI(email), '*EMAIL*');

 			source = scrub_ignoring_delimiters(source, street_address, '*STREETADDRESS*');
 			source = scrub_ignoring_delimiters(source, city_address, '*CITYADDRESS*');
 			source = scrub_whole_word(source, zip_address, '*ZIPADDRESS*');

 			source = scrub_whole_number(source, areacode_phone, '*AREACODEPHONE*');
 			source = scrub_whole_number(source, centraloffice_phone, '*CENTRALOFFICEPHONE*');
 			source = scrub_whole_number(source, subscribernumber_phone, '*SUBSCRIBERNUMBERPHONE*');
 			source = scrub_ignoring_delimiters(source, areacode_phone + centraloffice_phone + subscribernumber_phone, '*FULLPHONENUMBER*');

 			// BIRTHDATE FILTERING – use only year?
 			source = scrub_whole_number(source, month_dob, '*MONTHDOB*');
 			source = scrub_whole_number(source, month_dob - 0, '*MONTHDOB*');
 			source = scrub_whole_number(source, day_dob, '*DAYDOB*');
 			source = scrub_whole_number(source, day_dob - 0, '*DAYDOB*');
 			source = scrub_whole_number(source, year_dob, '*YEARDOB*');


 			source = scrub_whole_number(source, areanumber_ssn, '*AREANUMBERSSN*');
 			source = scrub_whole_number(source, groupnumber_ssn, '*GROUPNUMBERSSN*');
 			source = scrub_whole_number(source, serialnumber_ssn, '*SERIALNUMBERSSN*');
 			source = scrub_ignoring_delimiters(source, areanumber_ssn + groupnumber_ssn + serialnumber_ssn, '*FULLSSN*');

 			source = scrub_word(source, driverID, '*DRIVERID*');

 			source = scrub_word(source, voterID, '*VOTERID');

 			for (var keyword of piiInput) {
 				source = scrub_multi_word(source, keyword, 'PII');
 			}

 			document.getElementById('scrubButton').classList.replace('btn-primary', 'btn-success');
 			document.getElementById('scrubButton').style.backgroundColor = "";
 			document.getElementById('scrubButton').innerText = "Download";

 			downloadReady = true;
 		}
 	};
 };

 function reset() {
 	downloadReady = false;
 	document.getElementById('sourceFilename').innerText = document.getElementById('sourceInput').files[0].name;
 	let sourceInput = document.getElementById('sourceInput');
 	let scrubButton = document.getElementById('scrubButton');
 	if (sourceInput.files.length > 0) {
 		if (scrubButton.classList.contains("btn-light")) {
 			scrubButton.classList.replace("btn-light", "btn-primary");
 		}
 		else if (scrubButton.classList.contains("btn-success")) {
 			scrubButton.classList.replace("btn-success", "btn-primary");
 		}
 		scrubButton.disabled = false;
 		scrubButton.innerText = "Scrub";
 		scrubButton.style.display = 'block';
 		scrubButton.style.backgroundColor = "#163D74";
 	}
 	else {
 		if (scrubButton.classList.contains("btn-primary")) {
 			scrubButton.classList.replace("btn-primary", "btn-light");
 		}
 		else if (scrubButton.classList.contains("btn-success")) {
 			scrubButton.classList.replace("btn-success", "btn-light");
 		}
 		scrubButton.disabled = true;
 		scrubButton.innerText = "Upload File"
 		scrubButton.style.display = 'none';
 		scrubButton.style.backgroundColor = "";
 	}
 }