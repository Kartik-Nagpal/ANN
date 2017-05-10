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
		//Constants I got from my Python ANN and courtesy of myselph.de
					//Mostly stored in WB.js (Weights and Biases) now
		sizes = [784, 10];

		//Maths
		var drawing = getDownsampledDrawing();
		//var cd = centerData(drawing);

		var maxIndex = 0;
    var output = compute(drawing);
    console.log(output);
    output.reduce(function(p, c, i)
		{
			if(p < c)
			{
				maxIndex = i;
				return c;
			}
			else return p;
		});
    console.log('maxIndex: ' + maxIndex);

		var x = document.getElementById("output");
		x.innerHTML = "You have drawn a: " + maxIndex;

		alert("You have drawn a: " + maxIndex);
}

function compute(data)
{
			// compute layer2 output
			var out2 = [];
			for (var i=0; i<w12.length; i++) {
				out2[i] = bias2[i];
				for (var j=0; j<w12[i].length; j++) {
					out2[i] += data[j] * w12[i][j];
				}
				out2[i] = 1 / (1 + Math.exp(-out2[i]));
			}
			//compute layer3 activation
			var out3 = [];
			for (var i=0; i<w23.length; i++) {
				out3[i] = bias3[i];
				for (var j=0; j<w23[i].length; j++) {
					out3[i] += out2[j] * w23[i][j];
				}
			}
			// compute layer3 output (softmax)
			var max3 = out3.reduce(function(p,c) { return p>c ? p : c; });
			var nominators = out3.map(function(e) { return Math.exp(e - max3); });
			var denominator = nominators.reduce(function (p, c) { return p + c; });
			var output = nominators.map(function(e) { return e / denominator; });

			// timing measurement
			return output;


		// compute final output
		var max = out.reduce(
			function(p, c)
			{
				return p > c ? p : c;
			});
		var nominators = out.map(
			function(e)
			{
				return Math.exp(e - max);
			});
		var denominator = nominators.reduce(
			function (p, c)
			{
				return p + c;
			});
		var output = nominators.map(
			function(e)
			{
				return e/denominator;
			});

		return output;
}

function sigmoid(z)
{
    return 1/(1 + Math.exp(-z));
}

function centerData(input)
{
	  var meanX = 0;
	  var meanY = 0;
	  var rows = input.length;
	  var columns = input[0].length;
	  var sumPixels = 0;
	  for (var y = 0; y < rows; y++) {
	    for (var x = 0; x < columns; x++) {
	      var pixel = (1 - input[y][x]);
	      sumPixels += pixel;
	      meanY += y * pixel;
	      meanX += x * pixel;
	    }
	  }
	  meanX /= sumPixels;
	  meanY /= sumPixels;

		var context = document.getElementById("canvas").getContext("2d");
		var imgData = context.getImageData(0, 0, 280, 280);
		//var grayscaleImg = imageDataToGrayscale(imgData);
    var boundingRectangle = getBoundingRectangle(imgData, 0.01);

	  var dY = Math.round(rows/2 - meanY);
	  var dX = Math.round(columns/2 - meanX);
	  var trans = {transX: dX, transY: dY};

		var canvasCopy = document.createElement("canvas");
    canvasCopy.width = imgData.width;
    canvasCopy.height = imgData.height;
    var copyCtx = canvasCopy.getContext("2d");
    var brW = boundingRectangle.maxX+1-boundingRectangle.minX;
    var brH = boundingRectangle.maxY+1-boundingRectangle.minY;
    var scaling = 190 / (brW>brH?brW:brH);
    // scale
    copyCtx.translate(canvas.width/2, canvas.height/2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvas.width/2, -canvas.height/2);
    // translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);

		imgData = copyCtx.getImageData(0, 0, 280, 280);
    grayscaleImg = imageDataToGrayscale(imgData);
    var nnInput = new Array(784);
    for (var y = 0; y < 28; y++)
		{
		    for (var x = 0; x < 28; x++)
				{
		      var mean = 0;
		      for (var v = 0; v < 10; v++)
					{
		        for (var h = 0; h < 10; h++)
						{
		          mean += grayscaleImg[y*10 + v][x*10 + h];
		        }
		      }
      mean = (1 - mean / 100); // average and invert
      nnInput[x*28+y] = (mean - .5) / .5;
    }
		console.log(nnInput);
		return nnInput;
}

function getBoundingRectangle(img, threshold)
{
	 var rows = img.length;
	 var columns = img[0].length;
	 var minX=columns;
	 var minY=rows;
	 var maxX=-1;
	 var maxY=-1;
	 for (var y = 0; y < rows; y++) {
		 for (var x = 0; x < columns; x++) {
			 if (img[y][x] < threshold) {
				 if (minX > x) minX = x;
				 if (maxX < x) maxX = x;
				 if (minY > y) minY = y;
				 if (maxY < y) maxY = y;
			 }
		 }
	 }
	 return { minY: minY, minX: minX, maxY: maxY, maxX: maxX};
}

function imageDataToGrayscale(imgData)
{
		var grayscaleImg = [];
		for (var y = 0; y < imgData.height; y++)
		{
		  grayscaleImg[y]=[];
		  for (var x = 0; x < imgData.width; x++)
			{
		    var offset = y * 4 * imgData.width + 4 * x;
		    var alpha = imgData.data[offset+3];
		    // weird: when painting with stroke, alpha == 0 means white;
		    // alpha > 0 is a grayscale value; in that case I simply take the R value
		    if (alpha == 0)
				{
		      imgData.data[offset] = 255;
		      imgData.data[offset+1] = 255;
		      imgData.data[offset+2] = 255;
		    }
		    imgData.data[offset+3] = 255;
		    // simply take red channel value. Not correct, but works for
		    // black or white images.
		    grayscaleImg[y][x] = imgData.data[y*4*imgData.width + x*4 + 0] / 255;
		  }
		}
		return grayscaleImg;
}
}
