
function Process()
{
		//Constants I got from my Python ANN with help from myselph.de
		//Weights and biases are stored in WB.js (Weights and Biases) now
		sizes = [784, 200, 10];

		//Converts from the many pixel that's been inputted by the user and downgrades it to a 15x15 grid
		var drawing = getDownsampledDrawing();

		//This method is made to center the image so that the Neural Net is able to better read the data in
		//var cd = centerData(drawing); //This Line is relativally unstable and so has been commented out.


		//Define a variable which will later hold our final output for the program
		var maxIndex = -1;

		//RUNS THE ACTUAL NEURAL NET and stores the certainty values produced by the net in a var "output"
		var output = compute(drawing);
		//Prints out the Array(in console) for easier debugging
    console.log(output);

		//finds the largest value in the array "output"
    output.reduce(function(p, c, i)
		{
			if(p < c)
			{
				//stores the index(the number that the neural net thinks has been written) in the higher scope variable "maxIndex"
				maxIndex = i;
				return c;
			}
			else return p;
		});

		//prints the "maxIndex" for easier debugging
    console.log('maxIndex: ' + maxIndex);


		//Adding the data to the actual webpage for user viewing
		var x = document.getElementById("output");
		x.innerHTML = "You have drawn a: " + maxIndex;

		//alert in case the user has a small screen and doesn't see the added text
		alert("You have drawn a: " + maxIndex);
}

function compute(input)
{
		/*
				Grabs the downgraded input from the user and runs through
		    the math for the first layer of the nueral net and
				stores the result in "outL1[]"
		*/
		var outL1 = [];
		for (var i = 0; i < wL1.length; i++)
		{
		  outL1[i] = b1[i];
		  for (var j = 0; j < wL1[i].length; j++)
			{
		    outL1[i] += input[j] * wL1[i][j];
		  }
		  outL1[i] = sigmoid(outL1[i]);
		}

		var out = [];
		for (var i = 0; i < wL2.length; i++)
		{
		  out[i] = b2[i];
		  for (var j = 0; j < wL2[i].length; j++)
			{
		    out[i] += outL1[j] * wL2[i][j];
		  }
		}

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
		//mathematical sigmoid function
    return 1/(1 + Math.exp(-z));
}

function centerData(input)
{
		//Tempermental Portion of the program: IMAGE PROCESSING
		/*
			Tries to find the centeroid of the digit drawn and
			using that point, it defines a bounding rectangle around the digit.
			Finally, it moves the bounding rectangle to the center of the main rectangle
			so that it looks like a regular image from MNIST, but there are no size or
			shape modifications on the input.
		*/
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
	 //helper function 1 for image processing
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
		//helper function 2 for image processing
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
