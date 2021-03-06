 /* Author: Nakul Bajaj & Kevin Chang
  * Halderman Lab
  *
  * ,,,,,,,,,,,                 ,,,,,,,,,,,
  * ,,,,,,,,,,,,,             ,,,,,,,,,,,,,
  * ,,,,,,,,,,,,,,,         ,,,,,,,,,,,,,,,
  * ,,,,,,,,,,,,,,,,,     ,,,,,,,,,,,,,,,,,
  *    ,,,,,,,,,,,,,,,, ,,,,,,,,,,,,,,,,   
  *    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,   
  *    ,,,,,,,,  ,,,,,,,,,,,,,  ,,,,,,,,   
  *    ,,,,,,,,    ,,,,,,,,,    ,,,,,,,,   
  *    ,,,,,,,,      ,,,,,      ,,,,,,,,   
  * ,,,,,,,,,,,,,,,    ,    ,,,,,,,,,,,,,,,
  * ,,,,,,,,,,,,,,,         ,,,,,,,,,,,,,,,
  * ,,,,,,,,,,,,,,,         ,,,,,,,,,,,,,,,
  * 
  *   University of Michigan – Est. 1817
  */

 /* Setup:
  * Create downloadReady flag to reveal "Scrub" button when appropriate
  * Create global variable for source code
  */
 var downloadReady = false;
 var source;

// changeOutputDisplay('none');

 // Word Scrubbing Functions

 /* Scrubs all instances of the word from the source.
  * Case and context insensitive.
  */
 function scrub_word(source, word, replacement) {
  if (word === '') {
    return source;
  }
  var pattern = new RegExp(word, 'gi');
  return source.replace(pattern, replacement);
 };

 /* Scrubs instances of the word between non letter characters (i.e. GET request queries).
  * Case insensitive.
  */
 function scrub_whole_word(source, word, replacement) {
  if (word === '') {
    return source;
  }
  var pattern = new RegExp('[^a-zA-Z]' + word + '[^a-zA-Z]', 'gi');
  return source.replace(pattern, replacement);
 };

 /* Scrubs a number from source between non digit characters.
  */
 function scrub_whole_number(source, number, replacement) {
  if (number === '') {
    return source;
  }
  var pattern = new RegExp('[^0-9]' + number + '[^0-9]', 'gi');
  return source.replace(pattern, replacement);
 };

 /* Scrubs each word in keyword by splitting via non-word characters.
  * Uses scrub_whole_word for each word, so case-insensitive.
  */
 function scrub_multi_word(source, keyword, replacement) {
  var ret = source;
  var words = keyword.split(/\W+|_/);
  for (var word of words) {
    ret = scrub_whole_word(ret, word, replacement);
  }
  return ret;
 };

 /* Scrubs each instance of word while ignoring delimiters (non-word characters and underscore).
  * Case-insensitive.
  */
 function scrub_ignoring_delimiters(source, word, replacement) {
  if (word === '') {
    return source;
  }
  word = word.replace(/[\W_]+/gi, '-')
  var chars = word.split('-');
  var pattern = new RegExp(chars.join('[\\W_]*'), 'gi');
  return source.replace(pattern, replacement);
 }

 // Scrub button

 function scrub() {

  // If a file has been scrubbed and the download is ready, then the download button is visible.
  if (downloadReady == true) {

    // Create an invisible button to download the file, and execute its click functionality.
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(source));
    element.setAttribute('download', "scrubbed_" + document.getElementById('sourceInput').value.substring(12));
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // Otherwise, scrub the file with user's information to create a new file
  else {

    // For large files, indicate that the scrubbing process has started by changing button title
    document.getElementById('scrubButton').innerText = "Scrubbing...";

    // Read in the file as text
    let reader = new FileReader();
    reader.readAsText(document.getElementById('sourceInput').files[0]);

    reader.onload = function () {
      source = reader.result;

      // Get value of all input fields, and save to corresponding variable name

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

      var year_dob = document.getElementById('year_dob').value;

      var serialnumber_ssn = document.getElementById('serialnumber_ssn').value;

      var driverID = document.getElementById('driverID').value;

      var voterID = document.getElementById('voterID').value;

      var piiInput = document.getElementById('piiInput').value;

      // Scrub file with each input information as needed

      // Names: scrub all instances
      source = scrub_word(source, first_name, '*FIRSTNAME*');
      source = scrub_word(source, middle_name, '*MIDDLENAME*');
      source = scrub_word(source, last_name, '*LASTNAME*');

      // Emails: scrub all instances, including as URL and seperately between username and domain
      source = scrub_word(source, email, '*EMAIL*');
      source = scrub_word(source, encodeURI(email), '*EMAIL*');
      if(email.includes("@")){
        let emailComponents = email.split("@");
        source = scrub_word(source, emailComponents[0], '*EMAILUSERNAME*');
        source = scrub_word(source, emailComponents[1], '*EMAILDOMAIN*');
      }

      // Address: scrub while ignoring delimiters (whitespace) in street and city and any zip code references
      source = scrub_ignoring_delimiters(source, street_address, '*STREETADDRESS*');
      source = scrub_ignoring_delimiters(source, city_address, '*CITYADDRESS*');
      source = scrub_whole_number(source, zip_address, '*ZIPADDRESS*');

      // Phone: scrub each section of phone number and the phone number in full with delimiters included
      // TODO: Find out if "full phone scrubbing" is good enough
      if(centraloffice_phone != "" && subscribernumber_phone != ""){
        if(areacode_phone != ""){
          source = scrub_ignoring_delimiters(source, areacode_phone + "-" + centraloffice_phone + "-" + subscribernumber_phone, '*FULLPHONENUMBER*');
        } else {
          source = scrub_ignoring_delimiters(source, centraloffice_phone + "-" + subscribernumber_phone, '*LASTSEVENPHONENUMBER*');
        }
      }

      // DOB: scrub all instances of year numbers
      source = scrub_whole_number(source, year_dob, '*YEARDOB*');

      // SSN: Scrub last four of SSN
      source = scrub_whole_number(source, serialnumber_ssn, '*LASTFOURSSN*');

      // DLN: Scrub driver's license number
      source = scrub_word(source, driverID, '*DRIVERID*');

      // Voter ID: Scrub voter ID number
      source = scrub_word(source, voterID, '*VOTERID');

      // All other PII
      for (var keyword of piiInput) {
        source = scrub_multi_word(source, keyword, 'PII');
      }

      // Delete BLOBs by deleting "content" categories
      // var outputLog = source.replace(new RegExp(/"content": {.*?},/, 'sg'), "");
      // document.getElementById('outputText').value = outputLog;

      // Delete BLOBs by deleting "response" categories
      var outputLog = source.replace(new RegExp(/"response": {.*?},\s*"cache"/, 'sg'), "\"cache\"");
      document.getElementById('outputText').value = outputLog;

      // Parse and serialize JSON to delete response categories from entries (big ewww)
      // var jsonArray = JSON.parse(source);
      // for (entry in jsonArray['log']['entries']){
      //   delete jsonArray['log']['entries'][entry].response;
      // }
      // document.getElementById('outputText').value = JSON.stringify(jsonArray);



      // After all PII is scrubbed, button can become a "download" button
      document.getElementById('scrubButton').classList.replace('btn-primary', 'btn-success');
      document.getElementById('scrubButton').style.backgroundColor = "";
      document.getElementById('scrubButton').innerText = "Download";
      changeOutputDisplay('block');
      downloadReady = true;
    }
  };
 };

 // Reset method used on any change in input field to check whether scrub button should appear
 function reset() {

  // Reset any downloads and show filename on upload box
  downloadReady = false;
  document.getElementById('sourceFilename').innerText = document.getElementById('sourceInput').files[0].name;
  let sourceInput = document.getElementById('sourceInput');
  let scrubButton = document.getElementById('scrubButton');

  changeOutputDisplay('none');
  // If file has been uploaded, then create scrub button
  if (sourceInput.files.length > 0) {
    if (scrubButton.classList.contains("btn-light")) {
      scrubButton.classList.replace("btn-light", "btn-primary");
    } else if (scrubButton.classList.contains("btn-success")) {
      scrubButton.classList.replace("btn-success", "btn-primary");
    }
    scrubButton.disabled = false;
    scrubButton.innerText = "Scrub";
    scrubButton.style.display = 'block';
    scrubButton.style.backgroundColor = "#163D74";
  }

  // Otherwise, hide button
  else {
    if (scrubButton.classList.contains("btn-primary")) {
      scrubButton.classList.replace("btn-primary", "btn-light");
    } else if (scrubButton.classList.contains("btn-success")) {
      scrubButton.classList.replace("btn-success", "btn-light");
    }
    scrubButton.disabled = true;
  }
 }

 function changeOutputDisplay(state) {
  document.getElementById('outputContainer').style.display = state;
  document.getElementById('outputLegend').style.display = state;
  document.getElementById('outputForm').style.display = state;
  document.getElementById('outputRow').style.display = state;
  document.getElementById('outputDescription').style.display = state;
  document.getElementById('outputText').style.display = state;
 }