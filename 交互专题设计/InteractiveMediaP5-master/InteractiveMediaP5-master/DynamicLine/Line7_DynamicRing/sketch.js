// base line
var L;
var LD;
var VtNum = 512;
var LineWd = 2.0;
var LLength = 0;

// dynamic line params
var DAmp;
var DFreq;
var DPhase;

// 函数setup() ：准备阶段
function setup() 
{
	createCanvas(400,400);
	//L = createBaseLine_Hor(VtNum);
	L = createBaseLine_Ring(VtNum,width/2,height/2,120, HALF_PI);
	LLength = ComputeLineLength(L);
	LD = GenLD();
	InitDAFP();
}

function InitDAFP()
{
	InitDAFPLC(L,1);

	//GenDAFP_0(0);
	//GenDAFP_1(0);
	//GenDAFP_2(0);

	//GenDAFP_VaryA_Sin5(0);
	//GenDAFP_VaryA_AbsSin5(0);
	//GenDAFP_VaryA_AbsSin5(0);

	//GenDAFP_VaryA_Noise5(0);
	//GenDAFP_VaryA_Noise50(0);
	//GenDAFP_VaryA_Noise50_PhaseSin10(0);
	//GenDAFP_ANoise50_PhaseNoise10(0);
	//DAmp[0] = GenDynamicProp_PowSin(DAmp[0],0.1,12,0.3);
	//DAmp[0] = GenDynamicProp_Noise(DAmp[0],0.1,10);
	//DAmp[0] = GenDynamicProp_PowComplementSin(DAmp[0],0.1,36,0.5);
	//DAmp[0] = GenDynamicProp_PowComplementAbsSin(
	//	DAmp[0],0.06,36,0.3);
	//DAmp[0] = GenDynamicProp_Saw(DAmp[0],0.06,0.1,0.1);

	// 振幅和频率的分布
	var amp = 0.045;// 0.005 0.015 0.045
	var freq = 4; // 2,4,8
	DAmp[0] = GenDynamicProp_Linear(DAmp[0],1,1,amp,1);
	DFreq[0] = GenDynamicProp_Linear(DFreq[0],1,1,freq,1);
	
	// 相位分布
	// 1. 线性分布
	//DPhase[0] = GenDynamicProp_Linear(DPhase[0],0,3*TWO_PI,1);
	//DPhase[0] = GenDynamicProp_Linear(DPhase[0],0,15*TWO_PI,1);
	// 2. 正弦分布
	//DPhase[0] = GenDynamicProp_PowSin(DPhase[0],5,10,1);
	//DPhase[0] = GenDynamicProp_PowSin(DPhase[0],30,10,1);
	//DPhase[0] = GenDynamicProp_PowSin(DPhase[0],5,3.3,1);
	DPhase[0] = GenDynamicProp_PowSin(DPhase[0],30,3.3,1);
	//DPhase[0] = GenDynamicProp_PowComplementAbsSin(DPhase[0],5,10,1);
	// 3. 噪声分布
	//DPhase[0] = GenDynamicProp_Noise(DPhase[0],20,1);
	//DPhase[0] = GenDynamicProp_Noise(DPhase[0],100,1);
	//DPhase[0] = GenDynamicProp_Noise(DPhase[0],20,8);
	//DPhase[0] = GenDynamicProp_Noise(DPhase[0],100,8);
	// 4. 锯齿分布
	//DPhase[0] = GenDynamicProp_Saw(DPhase[0],1,0.25,1);
	//DPhase[0] = GenDynamicProp_Saw(DPhase[0],3,0.25,1);
	//DPhase[0] = GenDynamicProp_Saw(DPhase[0],1,0.05,1);
	//DPhase[0] = GenDynamicProp_Saw(DPhase[0],3,0.05,1);


}

// 函数draw()：作画阶段
function draw() {
	fill(255,255,255,125);
	rect(-1,-1,2*width,2*height);
	noFill();
	strokeWeight(2);
	stroke(0);
	rect(2,2,width-4,height-4);

	// 动态效果
	var tNow = millis()/1000;
	LD = DynamicLD_VertBias(L,LLength,DAmp,DFreq,DPhase,3*tNow);

	// 端点断开
	//drawLD(LD,2,false);

	// 端点相连
	drawLD(LD,2,true);
	//drawFace(width/2,height/2,1,"Smile");// 笑脸
	//drawFace(width/2,height/2,1,"Sad");// 丧脸
	//drawFace(width/2,height/2,1,"Surprise");// 吃惊

	// 对白气泡
	/*
	drawLD_Arrow(LD,12,new Vector(width/2,height-10,0));
	textAlign(CENTER);
	textSize(28);
	fill(0);
	text('XOXXO\nOXOOX\nXOOXX', width/2, height/2.3);
	*/

	// 移动的小球
	//drawMovingBallAtSpd(1);
	//drawMovingBallAtSpd(1,0);
	//drawMovingBallAtSpd(0.33,0.5);
	
	//ellipse(width/2,height/2,50,50);
}

function drawFace(ctrX,ctrY,Scale,type)
{
	push();
	strokeWeight(2);
	var lx = ctrX - 50*Scale;
	var ly = ctrY - 20*Scale;
	ellipse(lx,ly,50,50);
	fill(0);
	ellipse(lx,ly+5,30,30);

	var rx = ctrX + 50*Scale;
	var ry = ctrY - 20*Scale;
	fill(255)
	ellipse(rx,ry,50,50);
	fill(0);
	ellipse(rx,ry+5,30,30);

	var mx = ctrX;
	if(type=="Smile")
	{
		var my = ctrY+30;
		arc(mx,my,80*Scale,80*Scale,0,PI);
	}
	else if(type=="Sad")
	{
		var my = ctrY+60;
		arc(mx,my,80*Scale,80*Scale,PI,TWO_PI);
	}
	else if(type=="Surprise")
	{
		var my = ctrY+40;
		ellipse(mx,my,50*Scale,80*Scale);
	}
	pop();
}


function drawMovingBallAtSpd(speed,tBias)
{
	var t = fract(speed*millis()/5000);
	push();
	stroke(0);
	fill(0);
	drawMovingBall(LD,t+tBias,8);
	pop();
}

function drawMovingBall(LD,t,ballSize)
{
	var vtId = lerp(0,LD.length-1,t);

	var id0 = floor(vtId);
	var id1 = id0 +1;
	var idt = vtId - id0;
	if(id1>=LD.length-1)
	{
		id1 = 0;
	}
	var V0 = LD[id0];
	var V1 = LD[id1];

	//idt = 0.5;
	var Pos = Vector.lerp(V0,V1,idt);
	ellipse(Pos.x,Pos.y,ballSize,ballSize);
}

function drawLD(LD,vtBias,bClose)
{
	push();
	strokeWeight(LineWd);
	stroke(0);
	for(var i=vtBias;i<LD.length-vtBias+1;i++)
	{
		var v0 = LD[i-1];
		var v1 = LD[i];
		line(v0.x,v0.y,v1.x,v1.y);
		//print(v0);
	}
	if(bClose)
	{
		var v0 = LD[LD.length-vtBias];
		var v1 = LD[vtBias];
		line(v0.x,v0.y,v1.x,v1.y);
	}
	pop();
}

function drawLD_Arrow(LD,vtBias,tgtPos)
{
	push();
	strokeWeight(LineWd);
	stroke(0);
	for(var i=vtBias;i<LD.length-vtBias+1;i++)
	{
		var v0 = LD[i-1];
		var v1 = LD[i];
		line(v0.x,v0.y,v1.x,v1.y);
		//print(v0);
	}
	var v0 = LD[LD.length-vtBias+1];
	line(v0.x,v0.y,tgtPos.x,tgtPos.y);
	var v1 = LD[vtBias-1];
	line(tgtPos.x,tgtPos.y,v1.x,v1.y);
	pop();
}

function GenLD()
{
	var L2 = genLine_Base(L,LLength);

	// 正弦
	//var L2 = genLineSin(L,LLength,0.0165,5,0);
	//var L2 = genLineSin(L,LLength,0.05,5,0);
	//var L2 = genLineSin(L,LLength,0.0165,15,0);
	//var L2 = genLineSin(L,LLength,0.05,15,0);

	// 双正弦
	//var L2 = genLineSinSin(L,LLength,0.05,2,0,20,0);
	//var L2 = genLineSinSin(L,LLength,0.05,2,0,60,0);
	//var L2 = genLineSinSin(L,LLength,0.02,2,0,20,0);
	//var L2 = genLineSinSin(L,LLength,0.02,2,0,60,0);

	// 噪声
	//var L2 = genLineNoise(L,LLength,0.05,3.3,0);
	//var L2 = genLineNoise(L,LLength,0.015,3.3,0);
	//var L2 = genLineNoise(L,LLength,0.05,10,0);
	//var L2 = genLineNoise(L,LLength,0.015,10,0);
	//var L2 = genLineNoise(L,LLength,0.05,30,0);
	//var L2 = genLineNoise(L,LLength,0.015,30,0);

	// 随机干扰
	//var L2 = genLineRand(L,LLength,-2,2,5000);
	//var L2 = genLineRand(L,LLength,-10,10,5000);
	//var L2 = genLineRand(L,LLength,-20,20,5000);
	//var L2 = genLineRand(L,LLength,-2,2,50);
	//var L2 = genLineRand(L,LLength,-10,10,50);
	//var L2 = genLineRand(L,LLength,-20,20,50);


	// 圆形
	//var L2 = genLineHalfCirc(L,LLength,LLength/28,-0.4);
	//var L2 = genLineHalfCirc(L,LLength,LLength/28,-1);
	//var L2 = genLineHalfCirc(L,LLength,LLength/28,0.4);
	//var L2 = genLineHalfCirc(L,LLength,LLength/28,1);
	//var L2 = genLineHalfCirc(L,LLength,LLength/80,-0.4);
	//var L2 = genLineHalfCirc(L,LLength,LLength/80,-1);
	//var L2 = genLineHalfCirc(L,LLength,LLength/80,0.4);
	//var L2 = genLineHalfCirc(L,LLength,LLength/80,1);


	// 三角波
	//var L2 = genLineTriangle(L,LLength,LLength/20,-1.5,1);
	//var L2 = genLineTriangle(L,LLength,LLength/20,-0.5,1);
	//var L2 = genLineTriangle(L,LLength,LLength/60,-4.5,1);
	//var L2 = genLineTriangle(L,LLength,LLength/60,-1.5,1);

	// 三角曲线波
	//var L2 = genLineTriangle(L,LLength,LLength/20,-1.5,2);
	//var L2 = genLineTriangle(L,LLength,LLength/20,-0.5,2);
	//var L2 = genLineTriangle(L,LLength,LLength/60,-4.5,2);
	//var L2 = genLineTriangle(L,LLength,LLength/60,-1.5,2);

	// 锯齿波
	//var L2 = genLineSaw(L,LLength,LLength/40,-3,1);
	//var L2 = genLineSaw(L,LLength,LLength/40,-3,2.5);
	//var L2 = genLineSaw(L,LLength,LLength/40,-3,0.4);
	//var L2 = genLineSaw(L,LLength,LLength/40,-1,1);
	//var L2 = genLineSaw(L,LLength,LLength/40,-1,2.5);
	//var L2 = genLineSaw(L,LLength,LLength/40,-1,0.4);

	// 矩形波
	//var L2 = genLineRect(L,LLength,LLength/40,1,0.8);
	//var L2 = genLineRect(L,LLength,LLength/40,1,0.5);
	//var L2 = genLineRect(L,LLength,LLength/40,1,0.2);
	//var L2 = genLineRect(L,LLength,LLength/40,0.3,0.8);
	//var L2 = genLineRect(L,LLength,LLength/40,0.3,0.5);
	//var L2 = genLineRect(L,LLength,LLength/40,0.3,0.2);


	//云状波
	//var L2 = genLineCloud(L,LLength,20,0.05);
	//var L2 = genLineCloud(L,LLength,20,0.025);
	//var L2 = genLineCloud(L,LLength,-20,0.05);
	//var L2 = genLineCloud(L,LLength,-20,0.025);
	//var L2 = genLineCloud(L,LLength,50,0.015);
	//var L2 = genLineCloud(L,LLength,50,0.0075);
	//var L2 = genLineCloud(L,LLength,-50,0.015);
	//var L2 = genLineCloud(L,LLength,-50,0.0075);

	// 噪声位移
	//var L2 = genLineNoiseOffset(L,LLength,0.025,20,0);
	//var L2 = genLineNoiseOffset(L,LLength,0.0075,20,0);
	//var L2 = genLineNoiseOffset(L,LLength,0.025,80,0);
	//var L2 = genLineNoiseOffset(L,LLength,0.0075,80,0);

	// 随机位移
	//var L2 = genLineRandomOffset(L,LLength,0.0125);
	//var L2 = genLineRandomOffset(L,LLength,0.025);
	//var L2 = genLineRandomOffset(L,LLength,0.05);


	// 特殊云状
	//var L2 = genLineCloudXY(L,LLength,20,20,0.03);
	//var L2 = genLineCloudXY(L,LLength,30,20,0.04);
	//var L2 = genLineCloudXY(L,LLength,30,10,0.03);
	//var L2 = genLineCloudXY(L,LLength,30,21,0.04);
	//var L2 = genLineCloudXY(L,LLength,50,40,0.03);
	//var L2 = genLineCloudXY(L,LLength,50,60,0.03);
	//var L2 = genLineCloudXY(L,LLength,50,70,0.03);
	//var L2 = genLineCloudXY(L,LLength,50,80,0.03);
	//var L2 = genLineCloudXY(L,LLength,50,90,0.03);
	//var L2 = genLineCloudXY(L,LLength,5,100,0.03);
	//var L2 = genLineCloudXY(L,LLength,10.75,100,0.03);
	//var L2 = genLineCloudXY(L,LLength,13,100,0.03);
	//var L2 = genLineCloudXY(L,LLength,19,100,0.03);
	//var L2 = genLineCloudXY(L,LLength,20,100,0.03);
	//var L2 = genLineCloudXY(L,LLength,25,100,0.03);
	//var L2 = genLineCloudXY(L,LLength,30,100,0.03);
	//var L2 = genLineCloudXY(L,LLength,45,100,0.03);

	// Sin+Sin
	//var L2 = genLineSinPSin(L,LLength,0.05,5,0,0.005,50,0);
	//var L2 = genLineSinPSin(L,LLength,0.05,5,0,0.033,50,0);
	//var L2 = genLineSinPSin(L,LLength,0.05,5,0,0.05,50,0);
	//var L2 = genLineSinPSin(L,LLength,0.02,5,0,0.005,20,0);
	//var L2 = genLineSinPSin(L,LLength,0.02,5,0,0.0165,20,0);
	//var L2 = genLineSinPSin(L,LLength,0.02,5,0,0.05,20,0);

	// SinNoise
	//var L2 = genLineSinNoise(L,LLength,0.1,1.5,0,200,0);
	//var L2 = genLineSinNoise(L,LLength,0.1,1.5,0,25,0);
	//var L2 = genLineSinNoise(L,LLength,0.04,1.5,0,200,0);
	//var L2 = genLineSinNoise(L,LLength,0.04,1.5,0,25,0);
	//var L2 = genLineSinNoise(L,LLength,0.1,3,0,50,0);
	//var L2 = genLineSinNoise(L,LLength,0.04,3,0,50,0);

	return L2;
}




