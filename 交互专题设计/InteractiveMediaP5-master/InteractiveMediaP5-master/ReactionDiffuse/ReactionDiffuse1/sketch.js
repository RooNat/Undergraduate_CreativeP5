var A,B;
var LA,LB;
var DA = 1.0;
var DB = 0.5;
var f = 0.045;
var k = 0.062;
var dt = 1;

// 函数setup() ：准备阶段
function setup() {
	createCanvas(400,400);
	//colorMode(HSB,360,100,100,100);
	A = new Array();
	B = new Array();
	LA = new Array();
	LB = new Array();
	for(var i=0;i<width;i++)
	{
		A[i] = new Array();
		B[i] = new Array();
		LA[i] = new Array();
		LB[i] = new Array();
		for(var j=0;j<height;j++)
		{
			A[i][j] = 1;
			B[i][j] = 0;
			LA[i][j] = 0;
			LB[i][j] = 0;
		}
	}

	var hw = width/2;
	var hh = height/2;

	for(var i=0;i<width;i++)
	{
		for(var j=0;j<height;j++)
		{
			var x = (i-hw)/width;
			var y = (j-hh)/height;
			b = initValueSinRCosTheta(40*x,40*y);
			A[i][j] = 0;
			B[i][j] = b;
		}
	}
}

// 函数draw()：作画阶段
function draw() {
	fill(255);// 填充白色
	for(var i=0;i<100;i++)
	{
		StepDE(dt);
	}
	drawField();

	fill(1,1,1,1);
	//ellipse(200,200,50,50);
}

function StepDE(dt)
{
	for(var i=1;i<width-1;i++)
	{
		for(var j=1;j<height-1;j++)
		{
			var a = A[i][j];
			var b = B[i][j];
			var abb = a*b*b;
			LA[i][j] = 
				DA*laplace(i,j,A) 
				- abb + f*(1-a);
			LB[i][j] = 
				DB*laplace(i,j,B) 
				+ abb - (k+f)*b;

			var a2 = 
				constrain(a + LA[i][j]*dt,0,1);
			var b2 = 
				constrain(b + LB[i][j]*dt,0,1);
			A[i][j] = a2;
			B[i][j] = b2;
		}
	}
}

function laplace(i,j,P)
{
	v = -P[i][j];
	//v += -1 * P[i][j];
	v += 0.2 * P[i-1][j];
	v += 0.2 * P[i+1][j];
	v += 0.2 * P[i][j-1];
	v += 0.2 * P[i][j+1];
	v += 0.05* P[i-1][j-1];
	v += 0.05* P[i+1][j-1];
	v += 0.05* P[i-1][j+1];
	v += 0.05* P[i+1][j+1];
	return v;
}

function drawField()
{
	push();
	rectMode(CENTER);
	colorMode(HSB,1,1,1,1);
	for(var i=0;i<width;i++)
	{
		for(var j=0;j<height;j++)
		{
			var a = A[i][j];
			var b = B[i][j];
			
			var hue = a;
			var sat = b;
			var bright = map(a-b,-1,1,0,1);

			fill(hue,sat,bright,1);
			noStroke();
			rect(i,j,1,1);
		}
	}
	pop();
}
