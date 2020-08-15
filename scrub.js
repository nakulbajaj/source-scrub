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
  var pattern = new RegExp(chars.join('[\W_]*'), 'gi');
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

      var month_dob = document.getElementById('month_dob').value;
      var day_dob = document.getElementById('day_dob').value;
      var year_dob = document.getElementById('year_dob').value;

      var areanumber_ssn = document.getElementById('areanumber_ssn').value;
      var groupnumber_ssn = document.getElementById('groupnumber_ssn').value;
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

      // Address: scrub while ignoring delimiters (whitespace) in street and city and any zip code references
      source = scrub_ignoring_delimiters(source, street_address, '*STREETADDRESS*');
      source = scrub_ignoring_delimiters(source, city_address, '*CITYADDRESS*');
      source = scrub_whole_number(source, zip_address, '*ZIPADDRESS*');

      // Phone: scrub each section of phone number and the phone number in full with delimiters included
      source = scrub_whole_number(source, areacode_phone, '*AREACODEPHONE*');
      source = scrub_whole_number(source, centraloffice_phone, '*CENTRALOFFICEPHONE*');
      source = scrub_whole_number(source, subscribernumber_phone, '*SUBSCRIBERNUMBERPHONE*');
      source = scrub_ignoring_delimiters(source, areacode_phone + "-" + centraloffice_phone + "-" + subscribernumber_phone, '*FULLPHONENUMBER*');

      // DOB: scrub all instances of month, day, and year numbers along while stripping leading zeroes
      // TODO: Is month and day filtering necessary?
      source = scrub_whole_number(source, month_dob, '*MONTHDOB*');
      source = scrub_whole_number(source, month_dob - 0, '*MONTHDOB*');
      source = scrub_whole_number(source, day_dob, '*DAYDOB*');
      source = scrub_whole_number(source, day_dob - 0, '*DAYDOB*');
      source = scrub_whole_number(source, year_dob, '*YEARDOB*');

      // SSN: scrub each section of SSN and the SSN in full with delimiters included
      source = scrub_whole_number(source, areanumber_ssn, '*AREANUMBERSSN*');
      source = scrub_whole_number(source, groupnumber_ssn, '*GROUPNUMBERSSN*');
      source = scrub_whole_number(source, serialnumber_ssn, '*SERIALNUMBERSSN*');
      source = scrub_ignoring_delimiters(source, areanumber_ssn + "-" + groupnumber_ssn + "-" + serialnumber_ssn, '*FULLSSN*');

      // DLN: Scrub driver's license number
      source = scrub_word(source, driverID, '*DRIVERID*');

      // Voter ID: Scrub voter ID number
      source = scrub_word(source, voterID, '*VOTERID');

      // All other PII
      for (var keyword of piiInput) {
        source = scrub_multi_word(source, keyword, 'PII');
      }

      // After all PII is scrubbed, button can become a "download" button
      document.getElementById('scrubButton').classList.replace('btn-primary', 'btn-success');
      document.getElementById('scrubButton').style.backgroundColor = "";
      document.getElementById('scrubButton').innerText = "Download";
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

  // If file has been uploaded, then create download button
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
    scrubButton.innerText = "Upload File"
    scrubButton.style.display = 'none';
    scrubButton.style.backgroundColor = "";
  }
 }