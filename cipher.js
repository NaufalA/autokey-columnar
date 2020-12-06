var ptLength = 0; // public variable to cut excess character on columnar decipher

// Autokey functions
function AutokeyEncipher(keyword, plaintext) {
  var ciphertext = "";

  for (var i = 0; i < plaintext.length; i++) {
    var pCode = plaintext.charCodeAt(i) - 65;
    var kCode = keyword.charCodeAt(i) - 65;
    ciphertext += String.fromCharCode(((pCode + kCode) % 26) + 65);
  }

  return ciphertext;
}

function AutokeyDecipher(keyword, ciphertext) {
  var plaintext = "";
  var currentKey = keyword;

  for (var i = 0; i < ciphertext.length; i++) {
    var cCode = ciphertext.charCodeAt(i) - 65;
    var kCode = currentKey.charCodeAt(i) - 65;
    var pCode = cCode - kCode;
    pCode = pCode < 0 ? ((pCode % 26) + 26) % 26 : pCode % 26;
    plaintext += String.fromCharCode(pCode + 65);
    currentKey += String.fromCharCode(pCode + 65);
  }
  return plaintext;
}

// Columnar Functions

function ColumnarCreateMatrix(keyword, message, mode) {
  var matrix = [];
  for (var i = 0; i < keyword.length; i++) {
    matrix[i] = [];
    matrix[i].push(i);
    matrix[i].push(keyword[i]);
  }

  var messageIndex = 0;

  if (mode == "encipher") {
    while (messageIndex < message.length) {
      for (var x = 0; x < keyword.length; x++) {
        if (messageIndex < message.length) {
          matrix[x].push(message[messageIndex]);
        } else {
          matrix[x].push("X");
        }
        messageIndex++;
      }
    }
  } else {
    ColumnarSort(matrix, "encipher");
    var index = 0;
    while (messageIndex < message.length) {
      for (var x = 0; x < message.length / keyword.length; x++) {
        if (messageIndex < message.length) {
          matrix[index].push(message[messageIndex]);
        } else {
          matrix[index].push("*");
        }
        messageIndex++;
      }
      index++;
    }
  }

  return matrix;
}

function ColumnarSort(matrix, mode) {
  var lowerLimit = 0;
  var swapLocation = 0;

  if (mode == "encipher") {
    while (lowerLimit < matrix.length) {
      var lowest = matrix[lowerLimit][1];

      for (var i = lowerLimit + 1; i < matrix.length; i++) {
        if (lowest > matrix[i][1]) {
          lowest = matrix[i][1];
          swapLocation = i;
        }
      }

      var temp = matrix[lowerLimit];
      matrix[lowerLimit] = matrix[swapLocation];
      matrix[swapLocation] = temp;

      lowerLimit++;
      swapLocation = lowerLimit;
    }
  } else if (mode == "decipher") {
    while (lowerLimit < matrix.length) {
      var lowest = matrix[lowerLimit][0];

      for (var i = lowerLimit + 1; i < matrix.length; i++) {
        if (lowest > matrix[i][0]) {
          lowest = matrix[i][0];
          swapLocation = i;
        }
      }

      var temp = matrix[lowerLimit];
      matrix[lowerLimit] = matrix[swapLocation];
      matrix[swapLocation] = temp;

      lowerLimit++;
      swapLocation = lowerLimit;
    }
  }

  return matrix;
}

function GetText(matrix, mode) {
  var text = "";

  if (mode == "encipher") {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 2; j < matrix[0].length; j++) {
        text += matrix[i][j];
      }
    }
  } else {
    for (var j = 2; j < matrix[0].length; j++) {
      for (var i = 0; i < matrix.length; i++) {
        text += matrix[i][j];
      }
    }
    console.log(text);
    if (ptLength > 0) {
      text = text.slice(0, ptLength);
    }
    console.log(text);
  }
  return text;
}

// Action Functions
function Encipher() {
  var plaintext = document.getElementById("plaintext").value.toUpperCase();
  var autokeyToggle = document.getElementById("autokey-toggle").checked;
  var columnarToggle = document.getElementById("columnar-toggle").checked;

  ptLength = plaintext.length;
  console.log(ptLength);

  if (plaintext.length > 0) {
    if (autokeyToggle) {
      // execute autokey
      var key = document.getElementById("atk-keyword").value.toUpperCase();

      if (key.length > 0) {
		CleanErrors();

        var keyword = key + plaintext;
        var ciphertext = AutokeyEncipher(keyword, plaintext);
        document.getElementById("ciphertext").value = ciphertext;
        plaintext = ciphertext;
      } else {
        document.getElementById("atk-keyword").classList.add("error");
        document.getElementById("atk-error").innerHTML =
          "Expected Input for Autokey Keyword!";
      }
    }

    if (columnarToggle) {
      // execute columnar
      var keyword = document.getElementById("cnr-keyword").value.toUpperCase();

      if (keyword.length > 0) {
		CleanErrors();

        var matrix = ColumnarCreateMatrix(keyword, plaintext, "encipher");
        matrix = ColumnarSort(matrix, "encipher");

        var message = GetText(matrix, "encipher");
        document.getElementById("ciphertext").value = message;
      } else {
        document.getElementById("cnr-keyword").classList.add("error");
        document.getElementById("cnr-error").innerHTML =
          "Expected Input for Columnar Keyword!";
      }
    }
  } else {
    document.getElementById("plaintext").classList.add("error");
    document.getElementById("pt-error").innerHTML =
        "Expected Input for Plaintext!";
  }
}

function Decipher() {
  var ciphertext = document.getElementById("ciphertext").value.toUpperCase();
  var autokeyToggle = document.getElementById("autokey-toggle").checked;
  var columnarToggle = document.getElementById("columnar-toggle").checked;

  if (ciphertext.length > 0) {
    if (columnarToggle) {
      // execute columnar
      var keyword = document.getElementById("cnr-keyword").value.toUpperCase();

      if (keyword.length > 0) {
		CleanErrors();

        var matrix = ColumnarCreateMatrix(keyword, ciphertext, "decipher");
        matrix = ColumnarSort(matrix, "decipher");

        var message = GetText(matrix, "decipher");
        document.getElementById("plaintext").value = message;
      } else {
        document.getElementById("cnr-keyword").classList.add("error");
        document.getElementById("cnr-error").innerHTML =
          "Expected Input for Columnar Keyword!";
      }
      ciphertext = message;
    }

    if (autokeyToggle) {
      // execute autokey
      var key = document.getElementById("atk-keyword").value.toUpperCase();

      if (key.length > 0) {
		CleanErrors();

        var plaintext = AutokeyDecipher(key, ciphertext);
        document.getElementById("plaintext").value = plaintext;
      } else {
        document.getElementById("atk-keyword").classList.add("error");
        document.getElementById("atk-error").innerHTML =
          "Expected Input for Autokey Keyword!";
      }
    }
  } else {
    document.getElementById("cnr-keyword").classList.remove("error");
    document.getElementById("ciphertext").classList.add("error");
    document.getElementById("ct-error").innerHTML =
        "Expected Input for Ciphertext!";
  }
}

function CleanErrors() {
    document.getElementById("plaintext").classList.remove("error");
    document.getElementById("ciphertext").classList.remove("error");
    document.getElementById("cnr-keyword").classList.remove("error");
    document.getElementById("atk-keyword").classList.remove("error");
    document.getElementById("pt-error").innerHTML = "";
    document.getElementById("ct-error").innerHTML = "";
    document.getElementById("atk-error").innerHTML = "";
    document.getElementById("cnr-error").innerHTML = "";
}

/* Clear Inputs */
function ClearInputs() {	
  document.getElementById("plaintext").value = "";
  document.getElementById("ciphertext").value = "";
  document.getElementById("atk-keyword").value = "";
  document.getElementById("cnr-keyword").value = "";
	CleanErrors();
}
