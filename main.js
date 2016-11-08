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
		console.log("Working");
	}
	document.body.appendChild(document.createElement('br'));
	document.body.appendChild(b);
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
