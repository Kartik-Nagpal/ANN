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
	var b = document.createElement('button');
	b.id = "submit";
	b.innerHTML = "Submit";
	b.onclick = function Process()
	{
		console.log("--------------------------------------------------");
		var g = document.getElementsByClassName('clicked');
		for(var i = 0; i < g.length; i++)
		{
			var d = g[i].id;
			console.log(d);
			console.log("(" + (parseInt((d-1)/28) + 1) + ", " + (d%29) + ")");
		}
	}
	document.body.appendChild(document.createElement('br'));
	document.body.appendChild(b);

	//H:/Java/ANN/ANNData.json
	//https://github.com/LightningLord4/Temp/blob/master/ANNData.json
	$.getJSON("H:/Java/ANN/CleanData.json", function(json)
	{
    var data = JSON.parse(json);
		console.log(data["sizes"]);
	});
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
			cell.className = "clicked";
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

function FeedForward(input)
{
	var b = [0.855724693973768, 0.37908101251988063, -1.456173439219931, -0.8613014961815683, -2.338243115103708, 1.130078893779829, 1.6496399256028145, -1.6938414725715638, -4.054361690087427, -0.9040435896456974, -0.3724785109168674, 1.1683970573030265, -2.0970082594505537, 2.876784875637503, -2.7132548990781733, -1.9441879447797346, -2.2364657196741127, 2.6006650226666332, 6.193159414167463, -3.467801154355447, -1.9991899349359015, 0.19436494990514416, 3.7280512950191373, -2.5006536203614473, -2.071878238359604, 0.3156085540598513, 3.674900394419812, -1.5457612902198394, -2.2757059682346257, -4.315967334995603, -6.2871082370866045, -1.0387750276302679, -9.033291825310602, -10.508095640537322, -3.4408314969357345, -13.281259490371298, -7.321168966571576, -3.6600586546936236, -11.414541869166454, -12.209507505888665];
	for(var i = 0; i < b.length; i++)
	{
		for(var j = 0; j < w.length; j++)
		{
				var a = w[j] * input[j];
		}
		var g = sigmoid(a + b[i]);
	}
	return g;
}

function sigmoid(a)
{
	return 1/(1 + Math.pow(Math.E, -a));
}

function loadData()
{
	/*
	def load(filename):
	f = open(filename, "r")
	data = json.load(f)
	f.close()
	net = Network(data["sizes"])
	net.weights = [np.array(w) for w in data["weights"]]
	net.biases = [np.array(b) for b in data["biases"]]
	return net
	*/
}
