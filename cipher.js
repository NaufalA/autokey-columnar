// Autokey functions
function AutokeyEncipher(keyword, plaintext){
	var ciphertext = "";

	for (var i = 0; i < plaintext.length; i++){
		var pCode = plaintext.charCodeAt(i) - 65;
		var kCode = keyword.charCodeAt(i) - 65;
		ciphertext += String.fromCharCode(((pCode + kCode) % 26) + 65);
	}

	return ciphertext;
}

function AutokeyDecipher(keyword, ciphertext){
	var plaintext = "";
	var currentKey = keyword;

	for (var i = 0; i < ciphertext.length; i++){
		var cCode = ciphertext.charCodeAt(i) - 65;
		var kCode = currentKey.charCodeAt(i) - 65;
		var pCode = cCode - kCode;
		pCode = (pCode < 0) ? (((pCode % 26) + 26) % 26) : pCode % 26;
		plaintext += String.fromCharCode(pCode + 65);
		currentKey += String.fromCharCode(pCode + 65);
    	console.log(currentKey);
	}
    console.log(plaintext);
	return plaintext;
}
// Columnar Functions

function ColumnarCreateMatrix(keyword, message, mode) {
	var matrix = [];
	for( var i = 0; i < keyword.length; i++) {
		matrix[i] = [];
		matrix[i].push(i);
		matrix[i].push(keyword[i]);
		console.log(matrix[i]);
	}
	
	var messageIndex = 0;
	
	if(mode == "encipher") {
		while(messageIndex < message.length) {
			for( var x = 0; x < keyword.length; x++)
			{
				if(messageIndex < message.length)
				{
					matrix[x].push(message[messageIndex]);
				}
				else
				{
					matrix[x].push("X");			
				}
				messageIndex++;
				console.log(matrix[x]);
			}
		}
	}
	else {
		console.log("decipher");
		ColumnarSort(matrix, "encipher")
		var index = 0;
		while(messageIndex < message.length) {
			for( var x = 0; x < message.length/keyword.length; x++) {
				if(messageIndex < message.length) {
					matrix[index].push(message[messageIndex]);
				}
				else {
					matrix[index].push("*");			
				}
				messageIndex++;
			}
			console.log(matrix[index]);
			index++;
		}
	}

	console.log(matrix);

	return matrix;
}

function ColumnarSort(matrix, mode) {
	var lowerLimit = 0;
	var swapLocation = 0;
	
	
	if(mode == "encipher") {
		while(lowerLimit < matrix.length) {
			var lowest = matrix[lowerLimit][1];

			for(var i = lowerLimit + 1; i < matrix.length; i++) {
				if(lowest > matrix[i][1]) {
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
	}

	else if(mode == "decipher") {
		while(lowerLimit < matrix.length) {
			var lowest = matrix[lowerLimit][0];

			for(var i = lowerLimit + 1; i < matrix.length; i++) {
				if(lowest > matrix[i][0]) {
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
	
	console.log(matrix);
	return matrix;
}

function GetText(matrix, mode) {
	var text = "";
	
	if(mode == "encipher") {
		for( var i = 0; i < matrix.length; i++)
		{
			for(var j = 2; j < matrix[0].length; j++) {
				text += matrix[i][j];
			}	
		}
	}

	else {
		for(var j = 2; j < matrix[0].length; j++) {
			for( var i = 0; i < matrix.length; i++) {
				text += matrix[i][j];
			}	
		}
	}
	return text;
}

// Action Functions
function Encipher(){
    var plaintext = document.getElementById("plaintext").value.toUpperCase();
    var autokeyToggle = document.getElementById("autokey-toggle").checked;
    var columnarToggle = document.getElementById("columnar-toggle").checked;

    if (plaintext.length > 0)
    {
        if (autokeyToggle) {
            // execute autokey
			var key = document.getElementById("atk-keyword").value.toUpperCase();

			if(key.length > 0) {
				var keyword = key + plaintext;
				var ciphertext = AutokeyEncipher(keyword, plaintext);
				document.getElementById("ciphertext").value = ciphertext;
				plaintext = ciphertext;
			}
			else {
				document.getElementById("message").innerHTML = 
					'Error - Expected Input for Autokey Keyword!';
			}
        }

        if (columnarToggle) {
            // execute columnar
            var keyword = document.getElementById("cnr-keyword").value.toUpperCase();
			
			if(keyword.length > 0) {
				var matrix = ColumnarCreateMatrix(keyword, plaintext, "encipher");
				matrix = ColumnarSort(matrix, "encipher");
				
				var message = GetText(matrix, "encipher");
				console.log(message);
				document.getElementById("ciphertext").value = message;
			}
			else {
				document.getElementById("message").innerHTML = 
					'Error - Expected Input for Columnar Keyword!';
			}
        }
    }
}

function Decipher(){
    var ciphertext = document.getElementById("ciphertext").value.toUpperCase();
    var autokeyToggle = document.getElementById("autokey-toggle").checked;
    var columnarToggle = document.getElementById("columnar-toggle").checked;

    console.log(ciphertext + " " + autokeyToggle + " " + columnarToggle);

    if (ciphertext.length > 0)
    {
        if (columnarToggle) {
            // execute columnar
            var keyword = document.getElementById("cnr-keyword").value.toUpperCase();
			var reorderedKey = keyword.split('').sort().join('');
			
			if(keyword.length > 0) {
				var matrix = ColumnarCreateMatrix(keyword, ciphertext, "decipher");
				matrix = ColumnarSort(matrix, "decipher");
				
				var message = GetText(matrix, "decipher");
				console.log(message);
				document.getElementById("plaintext").value = message;
			}
			else {
				document.getElementById("message").innerHTML = 
					'Error - Expected Input for Columnar Keyword!';
			}
		}

        if (autokeyToggle) {
            // execute autokey
			var key = document.getElementById("atk-keyword").value.toUpperCase();

			if(key.length > 0) {
            	console.log(keyword);
				var plaintext = AutokeyDecipher(key, ciphertext);
    			document.getElementById("plaintext").value = plaintext;
			}
			else {
				document.getElementById("message").innerHTML = 
					'Error - Expected Input for Autokey Keyword!';
			}
        }
    }
}

/* Clear Inputs */
function ClearInputs(){
    document.getElementById("plaintext").value = "";
    document.getElementById("ciphertext").value = "";
    document.getElementById("atk-keyword").value = "";
    document.getElementById("cnr-keyword").value = "";
}
