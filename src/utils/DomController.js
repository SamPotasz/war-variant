export default class DomController 
{
	static HideOverlay()
	{
		document.getElementById("overlay").style.display = "none"
	}

	static ShowOverlay(title = "", instructions = "")
	{
		document.getElementById('overlay').style.display = '';
		document.getElementById('titleText').innerHTML = title;
		document.getElementById('instructions').innerHTML = instructions;
		document.getElementById('endText').innerHTML = "";

		// document.getElementById('startButton').innerHTML = "Start";
	}

	static ShowEndgame(message)
	{
		document.getElementById('overlay').style.display = '';
		document.getElementById('titleText').innerHTML = "";
		document.getElementById('instructions').innerHTML = "";
		
		document.getElementById('endText').innerHTML = message;

		// document.getElementById('startButton').innerHTML = "Play again?";
	}
}