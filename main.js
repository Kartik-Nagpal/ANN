function create()
{
		var grid = clickableGrid(28,28,function(e,row,col,i)
		{
			/*console.log("You clicked on element:",e);
			console.log("You clicked on row:",row);
			console.log("You clicked on col:",col);
			console.log("You clicked on item #:",i);*/

				if(e.className == 'clicked')
						e.className = '';
				else
						e.className = 'clicked';
		});

		document.body.appendChild(grid);
}

function clickableGrid(rows, cols, callback)
{
		var i = 0;
		var grid = document.createElement('table');
		grid.className = 'grid';
		for (var r = 0; r < rows; ++r)
		{
				var tr = grid.appendChild(document.createElement('tr'));
				for (var c = 0; c < cols; ++c)
				{
						var cell = tr.appendChild(document.createElement('td'));
						cell.id = ++i;
						cell.addEventListener('click',(function(e,r,c,i)
						{
								return function()
								{
										callback(e,r,c,i);
								}
						})(cell,r,c,i),false);
				}
		}
		return grid;
}

function Process()
{
		console.log("Working"); //Checkpoint


		//Constants
		var b = [0.855724693973768, 0.37908101251988063, -1.456173439219931, -0.8613014961815683, -2.338243115103708, 1.130078893779829, 1.6496399256028145, -1.6938414725715638, -4.054361690087427, -0.9040435896456974, -0.3724785109168674, 1.1683970573030265, -2.0970082594505537, 2.876784875637503, -2.7132548990781733, -1.9441879447797346, -2.2364657196741127, 2.6006650226666332, 6.193159414167463, -3.467801154355447, -1.9991899349359015, 0.19436494990514416, 3.7280512950191373, -2.5006536203614473, -2.071878238359604, 0.3156085540598513, 3.674900394419812, -1.5457612902198394, -2.2757059682346257, -4.315967334995603, -6.2871082370866045, -1.0387750276302679, -9.033291825310602, -10.508095640537322, -3.4408314969357345, -13.281259490371298, -7.321168966571576, -3.6600586546936236, -11.414541869166454, -12.209507505888665];



		/*const fs = require("fs");
		var text = fs.readFileSync("./Weights.txt");
		var weights = text.split(",");*/


		//Maths
		var drawing = getDownsampledDrawing();

		var first = [];
		for (var i = 0; i < (drawing.length/30); i++)
		{
				console.log(drawing[i]);
				first[i] = compute(drawing, i, [1, 2, 3]) + b[i];
		}

		console.log("First: ");
		for(j = 0; j < first.length; j++)
		{
			console.log(first[j]);
		}
}

function compute(input, j, w)
{
		var x;
		for(i = 0; i <= w.length; i++)
		{
			var z = multiply(w, input[i + j]);//weights, not Zero
			x = sigmoid(z);
		}
		return x;
}

function sigmoid(z)
{
    return 1/(1 + Math.exp(-z));
}

function multiply(a, b)
{
	  var aNumRows = a.length
		var aNumCols = a[0].length;
	  var bNumRows = b.length
		var bNumCols = b[0].length;
	  m = new Array(aNumRows);
	  for (var r = 0; r < aNumRows; ++r)
		{
		    m[r] = new Array(bNumCols);
			    for (var c = 0; c < bNumCols; ++c)
					{
				      m[r][c] = 0;
				      for (var i = 0; i < aNumCols; ++i)
							{
				        	m[r][c] += a[r][i] * b[i][c];
				      }
			    }
	  }
	  return m;
}
