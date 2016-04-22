/*
 * Morse Code receiver app information:
 *
 * Function: messageFinished(): stops the capturing process
 *
 *     You can call this function to let the app know that the 
 *     end-of-transmission signal has been received.
 *
 * -------------------------------------------------------
 *
 * ID: messageField: id of the message text area
 *
 *     This will be a textarea element where you can display
 *     the recieved message for the user.
 * 
 * -------------------------------------------------------
 *
 * ID: restartButton: id of the Restart button
 *
 *     This is a button element.  When clicked this should 
 *     cause your app to reset its state and begin recieving
 *     a new message.
 *
 */

/*
 *  GLOBAL VARIABLES
 */


// Number of images taken without a state change 1 image per time unit
var timeCount = 0;

// Previous and current hold information about the on-off states of the preceding and current image
var previous = false; // Default is false as the screen starts out blue
var current = null;

// Morse contains the captured dots and dashes. 
//This variable is translated and cleared for each word. 
var morse = "";

// Message contains that text that is printed out in the message field
var message = "";

// Look up table to translate morse into letters.
var morseTable = {
    ".-": "A",
    "-...": "B",
    "-.-.": "C",
    "-..": "D",
    ".": "E",
    "..-.": "F",
    "--.": "G",
    "....": "H",
    "..": "I",
    ".---": "J",
    "-.-": "K",
    ".-..": "L",
    "--": "M",
    "-.": "N",
    "---": "O",
    ".--.": "P",
    "--.-": "Q",
    ".-.": "R",
    "...": "S",
    "-": "T",
    "..-": "U",
    "...-": "V",
    ".--": "W",
    "-..-": "X",
    "-.--": "Y",
    "--..": "Z",
    "-----": "0",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    "-.--.": "(",
    "-.--.-": ")",
    ".-..-.": "\"",  
    ".----.": "'", 
    "-..-.": "/",
    ".-.-.": "+",
    "---...": ":",
    ".-.-.-": ".",
    "--..--": ",",
    "..--..": "?",
    "-....-": "-",
    ".--.-.": "@",
    "-...-": "=",
    "...-..-": "$",
    "..--.-": "_",
    "-.-.--": "!", 
    ".-.-": "\n",
    "": "", // For the first blue to red transition 
};

/*
 *  FUNCTIONS
 */


/*
 * This function is used to reset the entire app. 
 * It will be used to initialize the variables and will 
 * reset the message images statuses and the message flags.
 *
 * Input  : None
 * Output : None
 */
function reset() 
{
		document.getElementById("messageField").value = "";
        timeCount = 0;
        previous = false;
        current = null;
        morse = "";
        message = "";
		// Thing
		clearInterval(capturingIntervalID);
		setImageStatus('restart');
		capturingIntervalID = setInterval(snapshot, unitTime);
		messageFinishedFlag = false;
}

/*
 * This function is used to determine which color is being read by the camera.
 * 
 * Input :  The Image Data that was passed in as a parameter 
 *          through the decodeCameraImage funcion
 *          is passed into this function again.
 * Output:  Ouputs the color that is read by the camera. 
 *          A return of false indicates that it is blue and
 *          a return value of true indicates that it is red.
 */
function determine(data)
{
	var red = [];
    var blue = [];
    var redCount = 0;
    var blueCount = 0;
    timeCount++
    
    for (i=0; i < data.length ; i += 4){
		red.push(data[i]);
    }
    
    for (i=2; i < data.length ; i += 4){
		blue.push(data[i]);
    }
    
    for (i = 0; i < red.length; i++)
    {
		if (red[i] >= blue[i])
		{
			redCount++;
		}

		else
		{
			blueCount++;
		}

	}
    // Saves the on-off state of the current image
	if(redCount > blueCount)
    {
        return true      
	}
	else
    {
        return false   
	}
}

/*
 * This function will be used to track the changes in the color and will 
 * determine the correspoding morese code. Then it will look up the value of the 
 * morse code received and will add the generated string to the message field.
 *
 * Input  : None
 * Output : None
 */
function stateReader()
{
	if (previous != current)
    {
		// If previous state was red, number of time units (timeCount) used to determine action
		if (previous === true)
        {
			if (timeCount >= 3){
				morse += "-";
			}
			else if (timeCount === 1 || timeCount === 2){
				morse += ".";  
			}
		}
		// If previous state was blue 
		else if (previous === false)
        {
			if (timeCount >= 7)
            {
				message += morseTable[morse] + " ";
				morse = "";                           
			}
			else if (timeCount <= 6 && timeCount >= 3)
            {
				message += morseTable[morse];
				morse = "";
			}                        
		}
		timeCount = 0;
	}
	
    // Sets global variable to remember the state of the current image
	previous = current;
      
    // Prints out the translated message letter by letter
	document.getElementById("messageField").value = message;
       
    // End Transmission
    if (morse === "...-.-")
    {
        messageFinished();
	}
}

/*
 * This function is called once per unit of time with camera image data.
 * 
 * Input : Image Data. An array of integers representing a sequence of pixels.
 *         Each pixel is representing by four consecutive integer values for 
 *         the 'red', 'green', 'blue' and 'alpha' values.  See the assignment
 *         instructions for more details.
 * Output: You should return a boolean denoting whether or not the image is 
 *         an 'on' (red) signal.
 */
function decodeCameraImage(data)
{
	current = determine(data);
	stateReader();
	return current;
}

/*
 *  DOM REFERENCES
 */

// When restart button is clicked the reset function is executed
document.getElementById("restartButton").onclick = function() {reset()};