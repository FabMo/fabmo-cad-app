//TODO
//
//polyline (close:true/false)
//line join update
//fillet curves

var gridSpace = 20
var gridIncrement = 10
var grid = 4 //1/4"
var stock = []
var tool = 0.125
var units
var scale = 1000   //
var layer = 0
var output = 'gcode'  //sbp gcode dxf
var cutDepth = 0.05
var feedrate = 0.5
var plungerate = 0.2
var passDepth = -1
var name = 'cad'

var dims=false
var xmin = 10000
var xmax	= -10000
var ymin	= 10000
var ymax = -10000
var dims2 = []

var dogbone = false
var dogbones = []
var dogbonesIn = []
var bones =[]
var dbo
var inside = true

var macro = []

var difference = []
var untion = []

var chamfer = false
var chamfers = []

var fillet = false
var fillets = []
var filletOut = []
var filletIn = []

var sf = 1

var zoom = 2
var panX = 0
var panY = 0

var mouseX
var mouseY
var ts
var pan = false
var panStart = new Object()
var panEnd = new Object()
var mousePanX = 0 
var mousePanY = 0

var point = [0,0]

var lines = []

var polygons = []
var insidePolygons = []

var pockets = []
var cutout = []

var toolpath

var help="\
arc \'x1\',\'y1\',\'r\',\'a1\',\'a2\'<br>\n\
calc (eval)<br>\n\
chamfer (toggle chamfer)<br>\n\
circle \'x1\',\'y1\',\'r\'<br>\n\
clear (new drawing)<br>\n\
cutdepth=\'z\'<br>\n\
cutin (offset toolpath in)<br>\n\
cutout (offset toolpath out)<br>\n\
dim (toggle dimensions)<br>\n\
dogbone (make dog-bone fillets)<br>\n\
dogbone= \'1\',\'-1\'or\'0\' (0=none)<br>\n\
feedrate=\'inch/sec\'<br>\n\
fillet (toggle fillet)<br>\n\
g,\'gcode\'<br>\n\
grid=\'grid space (inch)\'<br>\n\
line \'x1\',\'y1',\'x2\',\'y2\' <br>\n\
line \'x2\',\'y2\'<br>\n\
macro (show macro text area)<br>\n\
make (download cut file)<br>\n\
makedxf (download dxf)<br>\n\
makeg (download gcode)<br>\n\
makesbp (download sbp)<br>\n\
mousewheel/pinch (zoom)<br>\n\
move\'x\',\'y\'<br>\n\
movelast\'x\',\'y\'<br>\n\
name= \'filename\'<br>\n\
output=\'dxf\',\'gcode\' or \'sbp\'<br>\n\
passdepth=\'z\' or \'-1\' (default: \'-1\' for tool diameter)<br>\n\
pocket (pocket toolpath)<br>\n\
plungerate=\'inch/sec\'<br>\n\
rect\'x\',\'y\',\'lx\',\'ly\'<br>\n\
sbp,\'sbp command\'<br>\n\
settings<br>\n\
star\'x\',\'y\',\'r\'<br>\n\
stock=\'x\',\'y\'<br>\n\
tool=\'diameter\'<br>\n\
touch hold (pan)<br>\n\
units=inch<br>\n\
"

function runCmd(cmd){
	if(cmd.substring(0,3)=="arc"){
		cmd = rmComma(cmd,3)
		pts = cmd.substring(3).split(',')

		for(i=0;i<3;i++){
			pts[i]=pts[i]*grid
		}
		pts[3]=parseFloat(pts[3])
		pts[4]=parseFloat(pts[4])
		
		arc(pts)
	}
	else if(cmd=="chamfer"){
		pockets=[]
		cutout=[]

		fillet=false
		if(chamfer==true){
			chamfer=false
		}	
		else{
			chamfer=true
		}
	}
	else if(cmd.substring(0,6)=="circle"){
		cmd = rmComma(cmd,6)
		pts = cmd.substring(6).split(',')
		scalePts(pts)
		circle(pts)	
	}
	else if(cmd=="fillet"){
		pockets=[]
		cutout=[]

		chamfer=false
		if(fillet==true){
			fillet=false
		}	
		else{
			fillet=true
		}
	}
	else if(cmd.substring(0,4)=="line"){
		cmd = rmComma(cmd,4)
		pts = cmd.substring(4).split(',')
		scalePts(pts)
		line(pts)
	}
	else if(cmd.substring(0,8)=="movelast"){
		cmd = rmComma(cmd,8)
		pts = cmd.substring(8).split(',')
		scalePts(pts)
		moveLast(pts)
	}
	else if(cmd.substring(0,4)=="move"){
		cmd = rmComma(cmd,4)
		pts = cmd.substring(4).split(',')
		scalePts(pts)
		move(pts)
	}
	else if((cmd.substring(0,4)=="rect") && (cmd.substring(0,9)!="rectangle")){
		cmd = rmComma(cmd,4)
		pts = cmd.substring(4).split(',')
		scalePts(pts)
		rect(pts)
	}
	else if(cmd.substring(0,4)=="star"){
		console.log('star')
		cmd = rmComma(cmd,4)
		pts = cmd.substring(4).split(',')
		scalePts(pts)
		star(pts)	
	}
	//toolpath & settings
	else if(cmd.substring(0,4)=="calc"){
		cmd = eval(cmd.substring(4))
		console.log(cmd)
	}
	else if(cmd=="cutin"){
		console.log('cutin')
		cutOut(false)
	}
	else if(cmd=="cutout"){
		console.log('cutout')
		cutOut(true)
	}
	else if(cmd.substring(0,2)=="g,"){
		cmd=cmd.substring(2,cmd.length)
		fabmo.runGCode(cmd)
	}
	else if(cmd=="dogbone"){
		console.log('dogbone1')

		dogbonesIn=[]			
		dogbones=[]
		pockets=[]
		cutout=[]

		makePath()

		find90(polygons,inside,true)

		inside=!inside
		//console.log(inside)
		find90(insidePolygons,inside,false)

		inside=!inside
	}
	else if(cmd.substring(0,8)=="dogbone="){
		console.log('dogbone')
		cmd = rmComma(cmd,8)
		if(cmd.substring(8)=='-1'){
			inside=true
		}
		else if(cmd.substring(8)=='1'){
			inside=false
		}
		if(cmd.substring(8)=='0'){
			dogbonesIn=[]
			dogbones=[]
			pockets=[]
			cutout=[]
		}
		else{			
			dogbonesIn=[]
			dogbones=[]
			pockets=[]
			cutout=[]

			makePath()

			find90(polygons,inside,true)

			inside=!inside
			find90(insidePolygons,inside,false)
			inside=!inside
		}
	}
	else if(cmd=="pocket"){
		console.log('pocket')
		pocket()
	}
	else if(cmd.substring(0,4)=="sbp,"){
		cmd=cmd.substring(4,cmd.length)
		fabmo.runSBP(cmd)
	}
	//settings
	else if(cmd.substring(0,9)=="cutdepth="){
		cutDepth=parseFloat(cmd.substring(9))
		cmd = 'cutdepth = ' + cutDepth +"\""
	}
	else if(cmd=="dim"){
		if(dims==true){
			dims=false
			cmd="dim=false"
		}
		else{
			dims=true
			cmd="dim=true"
		}
		//minMax()
	}
	else if(cmd.substring(0,9)=="feedrate="){
		feedrate=parseFloat(cmd.substring(9))
		cmd = 'feedrate = ' + feedrate +" in/sec"
	}
	else if(cmd.substring(0,5)=="grid="){
		stock[0]=stock[0]/grid
		stock[1]=stock[1]/grid
		grid=1/(parseFloat(cmd.substring(5)))
		
		//zoom=1

		document.getElementById('grid').innerHTML = 'grid: ' + (parseFloat(cmd.substring(5))) + "\""
		cmd = 'grid = ' + (parseFloat(cmd.substring(5))) +"\""			
		defineStock(stock)
	}
	else if(cmd=="macro"){

		if(document.getElementById('macro').style.display=='inline'){			
			$("#macro").hide(200)
			$("#runmacro").hide(100)
			cmd='hide macro'
		}
		else{
			$("#macro").show(200)
			$("#runmacro").show(400)
			cmd='show macro'
			$("#macro").focus()
		}
	}
	else if(cmd=="make"){
		make()
	}
	else if(cmd.substring(0,5)=="name="){
		name=cmd.substring(5)
		cmd = "filename = " + name
	}
	else if(cmd.substring(0,7)=="output="){
		output=(cmd.substring(7))
		if(output=='sbp'){
			cmd = 'output=sbp (ShopBot program)'
		}
		else if(output=='gcode'){
			cmd = 'output=gcode'
		}
		else if(output=='dxf'){
			cmd = 'output=dxf'
		}
		else{
			output = 'sbp'
			cmd = output
		}
	}
	else if(cmd.substring(0,10)=="passdepth="){
		passDepth=parseFloat(cmd.substring(10))
		cmd = 'passdepth = ' + passDepth +"\""
	}
	else if(cmd.substring(0,11)=="plungerate="){
		plungerate=parseFloat(cmd.substring(11))
		cmd = 'plungerate = ' + plungerate +" in/sec"
	}
	else if(cmd=="runmacro"){
		console.log('runmacro')
		runMacro()			
	}
	else if(cmd.substring(0,6)=="stock="){
		cmd = rmComma(cmd,6)
		pts = cmd.substring(6).split(',')			
		defineStock(pts)
		cmd+="\""
	}
	else if(cmd.substring(0,5)=="tool="){
		tool=parseFloat(cmd.substring(5))
		cmd = 'tool diameter = ' + tool +"\""
	}
	else if((cmd=="units") && (cmd.length==5)){
		cmd=units
	}
	else if(cmd.substring(0,6)=="units="){
		cmd=cmd.substring(6,cmd.length)
		if((cmd =='cm') || (cmd =='CM')){
			units = 'cm'
			cmd='units=cm'
		}
		else if((cmd =='inch')||(cmd=="\"")){
			units = 'inch'
			cmd='units=inch'
		}
	}
	else if((cmd=="?")||(cmd=="help")){
		d = new Date()
		console.log(help)
		cmd = "console.log(help)"
		if(fabmo.isPresent()==true){
			fabmo.notify('info',help + '<font style=\'display:none\'>' + d.toLocaleString() + '</font>')
		}
		else{
			help = help.replace(/<br>/g,'')
			alert(help)
		}
	}
	else if(cmd=="settings"){

		var settings="\
		stock = " + (stock[0]/grid) + "," + (stock[1]/grid) +" <br>\n\
		tool diameter = " + tool + " <br>\n\
		units = " + units +" <br>\n\
		"
		settings = settings.replace(/\t/g,'')
		console.log(settings)

		d = new Date()

		if(fabmo.isPresent()==true){
			fabmo.notify('info',settings + '<font style=\'display:none\'>' + d.toLocaleString() + '</font>')
		}
		else{
			settings = settings.replace(/<br>/g,'')
			alert(settings)
		}

		cmd='console.log(settings)'
			
	}
	else if(cmd=="clear"){
		clearAll()
		window.setTimeout("console.clear()",50)
	}
	else if(cmd=="makedxf"){
		output='dxf'
		make()
	}
	else if(cmd=="makeg"){
		output='gcode'
		make()
		}
	else if(cmd=="makesbp"){
		output='sbp'
		make()
	}
	else if(cmd == "undo"){
		undo()
	}
	else if(cmd == "z"){
		zoom=4
		panX=0
		panY=0			
	}
	else{
		cmd = "FabMo CAD \(\'?\' for help\)"
	}


	return cmd

}

function runMacro(){

	clearAll()
	m = document.getElementById('macro').value
	macro = m.split('\n')

	toolpath=""

	for(m=0;m<macro.length;m++){
		if((macro[m]!='cutout')&&(macro[m]!='cutin')&&(macro[m]!='pocket')){
			if((macro[m]=='fillet')||(macro[m]=='chamfer')){
				chamfer=false
				fillet=false
			}
			runCmd(macro[m])
		}
		else{
			toolpath = macro[m]
		}
	}

	
	makePath()
	draw()

	window.setTimeout("runCmd(toolpath);makePath();draw()",5)

	$("#macro").focus()

}


function minMax(){

	//TODO minMax for each part
	//console.log("max")

	xmin = 1000
	xmax	= -1000
	ymin	= 1000
	ymax = -1000
	dims2 = []
	
	for(i=0;i<polygons.length;i++){

		dims2.push({
			xmin:	Math.min.apply(this,$.map(polygons[i], function(o){ return o.X; })),
			xmax:	Math.max.apply(this,$.map(polygons[i], function(o){ return o.X; })),
			ymin:	Math.min.apply(this,$.map(polygons[i], function(o){ return o.Y; })),
			ymax: Math.max.apply(this,$.map(polygons[i], function(o){ return o.Y; }))
		})

		if((Math.min.apply(this,$.map(polygons[i], function(o){ return o.X; })))<xmin){
			xmin = Math.min.apply(this,$.map(polygons[i], function(o){ return o.X; }))
		}
		if((Math.max.apply(this,$.map(polygons[i], function(o){ return o.X; })))>xmax){
			xmax = Math.max.apply(this,$.map(polygons[i], function(o){ return o.X; }))
		}
		if((Math.min.apply(this,$.map(polygons[i], function(o){ return o.Y; })))<ymin){
			ymin = Math.min.apply(this,$.map(polygons[i], function(o){ return o.Y; }))
		}
		if((Math.max.apply(this,$.map(polygons[i], function(o){ return o.Y; })))>ymax){
			ymax = Math.max.apply(this,$.map(polygons[i], function(o){ return o.Y; }))
		}

	}

	for(i=0;i<insidePolygons.length;i++){
		dims2.push({
			xmin:	Math.min.apply(this,$.map(insidePolygons[i], function(o){ return o.X; })),
			xmax:	Math.max.apply(this,$.map(insidePolygons[i], function(o){ return o.X; })),
			ymin:	Math.min.apply(this,$.map(insidePolygons[i], function(o){ return o.Y; })),
			ymax: Math.max.apply(this,$.map(insidePolygons[i], function(o){ return o.Y; }))
		})

	}

	//console.log(xmin)


}


function rmComma(s,v){

	if(s.charAt(v)==','){
		s = s.replace(/\,/,"")
	}
	return s

}

function undo(){
	cutout=[]
	pockets=[]
	if(dogbones.length>0){
		dogbones=[]
		bones = []
	}
	else if(lines.length>2){
		lines.pop()
		point = [lines[lines.length-1][2],lines[lines.length-1][3]]
	}
	else{
		lines.pop()
		point=[0,0]
	}
	console.log(lines)
	makePath()
	draw()
}

function clearAll(){
	//dims=false
	differnece = []
	union = []
	insidePolygons=[]
	fillets=[]
	filletIn=[]
	filletOut=[]
	bones=[]
	stock=[4,4]
	lines=[]
	pockets=[]
	polygons=[]
	dogbonesIn=[]
	dogbones=[]
	cutout=[]
	point=[0,0]
	panX=0
	panY=0
	//makePath()
	minMax()
	defineStock(stock)
	$('#clear').blur()
	draw()
}

function scalePts(pts,cmd){
	for(i=0;i<pts.length;i++){
		pts[i]=pts[i]*grid
	}
}

function rect(pts){
	if(pts.length==4){
		lines.push([])
		lines[lines.length-1].push(pts[0],pts[1],(pts[0]+pts[2]),pts[1],(pts[0]+pts[2]),(pts[1]+pts[3]),(pts[0]),(pts[1]+pts[3]),pts[0],pts[1])
		point = [lines[lines.length-1][0],lines[lines.length-1][1]]
	}
	else if(pts.length==3){
		lines.push([])
		lines[lines.length-1].push(pts[0],pts[1],(pts[0]+pts[2]),pts[1],(pts[0]+pts[2]),(pts[1]+pts[2]),(pts[0]),(pts[1]+pts[2]),pts[0],pts[1])
		point = [lines[lines.length-1][0],lines[lines.length-1][1]]
	}
	
}

function line(pts){
	if(pts.length==4){
		lines.push(pts)
		point = [lines[lines.length-1][2],lines[lines.length-1][3]]
	}
	else if(pts.length==2){
		pts.splice(0,0,point[1])
		pts.splice(0,0,point[0])
		lines.push(pts)
		point = [lines[lines.length-1][2],lines[lines.length-1][3]]
	}	
}


function move(pts){
	x=parseFloat(pts[0])
	y=parseFloat(pts[1])

	for(i=0;i<lines.length;i++){
		for(j=0;j<lines[i].length;j+=2){
			lines[i][j]+=x
			lines[i][j+1]+=y
		}
	}

}

function moveLast(pts){
	x=parseFloat(pts[0])
	y=parseFloat(pts[1])

	for(i=0;i<lines[lines.length-1].length;i+=2){
		lines[lines.length-1][i]+=x
		lines[lines.length-1][i+1]+=y
	}

}


function arc(pts){

	console.log(pts)
	
	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	r=parseFloat(pts[2])
	a1=(parseFloat(pts[3]))*(Math.PI/180)
	a2=(parseFloat(pts[4]))*(Math.PI/180)
	v=Math.ceil(r*2*Math.PI*30)

	a2=Math.round(((a2-a1)/(Math.PI*2))*v)

	lines.push([])
		for(i=0;i<(a2);i++){
			lines[lines.length-1].push((Cx)+Math.sin((Math.PI*2)/v*i+a1)*r)
			lines[lines.length-1].push((Cy)+Math.cos((Math.PI*2)/v*i+a1)*r)
		}

	point=[Cx,Cy]
	//point = [lines[lines.length-1][lines[lines.length-1].length-2],lines[lines.length-1][lines[lines.length-1].length-1]]
}



function circle(pts){
	
	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	r=parseFloat(pts[2])
	v=Math.ceil(r*2*Math.PI*30)

	lines.push([])
		for(i=0;i<=v;i++){
			lines[lines.length-1].push((Cx)+Math.sin((Math.PI*2)/v*i)*r)
			lines[lines.length-1].push((Cy)+Math.cos((Math.PI*2)/v*i)*r)
		}

	point=[Cx,Cy]
	//point = [lines[lines.length-1][lines[lines.length-1].length-2],lines[lines.length-1][lines[lines.length-1].length-1]]
}

function star(pts){
	lines.push([])

	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	r=parseFloat(pts[2])
	v=5

	for(i=0;i<2;i++){
		j=0
		while(j<=4){
			lines[lines.length-1].push((Cx)+Math.sin((Math.PI*2)/v*(i+j))*r)
			lines[lines.length-1].push((Cy)+Math.cos((Math.PI*2)/v*(i+j))*r)
			j+=2
		}
	}
	point=[Cx,Cy]
	console.log(lines)
}

function zoomExtents(s){
	console.log(s[1]*gridSpace*sf)
	console.log(ctx.canvas.height)
}

function defineStock(pts){
	stock=[]	
	
	zoom = ($(window).height()-150) / (pts[1]*grid*gridSpace)
	
	sf=zoom

	//console.log(zoom)

	panX=0-((pts[0]/2)*grid*gridSpace*sf)
	panY=(pts[1]/2)*grid*gridSpace*sf
	stock.push(parseFloat(pts[0]*grid),parseFloat(pts[1]*grid))

	//zoom=3

	draw()
}

function makePath(){

	paths=[]
	polygons = []

	for(i=0;i<lines.length;i++){
		paths.push([])
		for(j=0;j<lines[i].length;j+=2){
			paths[paths.length-1].push({X:lines[i][j]*scale,Y:lines[i][j+1]*scale})
		}			
	}


	while(paths.length>0){

		polygons.push(paths[0])
		paths.splice(0,1)

		for(i=0;i<paths.length;i++){
			end = polygons[polygons.length-1][polygons[polygons.length-1].length-1]
			start = polygons[polygons.length-1][0]

			if((paths[i][0].X==end.X)&&(paths[i][0].Y==end.Y)){
				for(j=0;j<paths[i].length;j++){
					polygons[polygons.length-1].push(paths[i][j])
				}
				paths.splice(i,1)
				i--
			}
			else if((paths[i][paths[i].length-1].X==end.X)&&(paths[i][paths[i].length-1].Y==end.Y)){
				for(j=paths[i].length-1;j>=0;j--){
					polygons[polygons.length-1].push(paths[i][j])
				}
				paths.splice(i,1)
				i--
			}
			else if((paths[i][0].X==start.X)&&(paths[i][0].Y==start.Y)){
				for(j=0;j<paths[i].length;j++){
					polygons[polygons.length-1].splice(0,0,paths[i][j])
				}
				paths.splice(i,1)
				i--
			}
			else if((paths[i][paths[i].length-1].X==start.X)&&(paths[i][paths[i].length-1].Y==start.Y)){
				for(j=paths[i].length-1;j>=0;j--){
					polygons[polygons.length-1].splice(0,0,paths[i][j])
				}
				paths.splice(i,1)
				i--
			}		
		}

	}

	

	for(i=0;i<polygons.length;i++){

		temp = ClipperLib.Clipper.SimplifyPolygon(polygons[i], ClipperLib.PolyFillType.pftNonZero)

		if(temp.length>0){
			polygons[i]=temp[0]
		}
	}
	

	var tempInside = []	

	for(i=0;i<polygons.length;i++){

		for(j=0;j<polygons.length;j++){
			ip = 0
			inpg = 0
			for(k=0;k<polygons[j].length;k++){
				if(polygons[j][k]!=undefined){
					inpg = ClipperLib.Clipper.PointInPolygon(polygons[j][k], polygons[i])
					if(((inpg==1)||(inpg==-1))&&(j!=i)){
						inpg=1
						ip+=inpg
					}
				}
			}
			if(ip>=polygons[j].length){
				tempInside.push(polygons[j])
			}
		}
		o = ClipperLib.Clipper.Orientation(polygons[i])
		if(o==true){
			polygons[i].reverse()
		}
	}

	
	for(i=0;i<tempInside.length;i++){
		o = ClipperLib.Clipper.Orientation(tempInside[i])
		if(o==true){
			tempInside[i].reverse()
		}
	}

	insidePolygons = tempInside

	insidePolygons = ClipperLib.JS.Clean(insidePolygons, 0.015*scale)

	insidePolygons = ClipperLib.Clipper.SimplifyPolygons(insidePolygons, ClipperLib.PolyFillType.pftNonZero)

	
	polygons = ClipperLib.Clipper.SimplifyPolygons(polygons, ClipperLib.PolyFillType.pftNonZero)

	ClipperLib.JS.ScaleUpPaths(dogbones, scale)
	ClipperLib.JS.ScaleUpPaths(dogbonesIn, scale)

	//dogbones
	if(dogbones.length>0){

		solution_paths = new ClipperLib.Paths()

		if(inside==true){
			
			cpr = new ClipperLib.Clipper()
			cpr.AddPaths(polygons, ClipperLib.PolyType.ptSubject, true)
			cpr.AddPaths(dogbones, ClipperLib.PolyType.ptClip, true)
			cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
			polygons=solution_paths
		}
		else if(inside==false){
			cpr = new ClipperLib.Clipper()
			cpr.AddPaths(polygons, ClipperLib.PolyType.ptSubject, true)
			cpr.AddPaths(dogbones, ClipperLib.PolyType.ptClip, true)
			cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
			polygons=solution_paths
		}

	}
	if(dogbonesIn.length>0){

		solution_paths = new ClipperLib.Paths()

		if(inside==true){
			cpr = new ClipperLib.Clipper()
			cpr.AddPaths(insidePolygons, ClipperLib.PolyType.ptSubject, true)
			cpr.AddPaths(dogbonesIn, ClipperLib.PolyType.ptClip, true)
			cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
			insidePolygons=solution_paths
		}
		else if(inside==false){
			cpr = new ClipperLib.Clipper()
			cpr.AddPaths(insidePolygons, ClipperLib.PolyType.ptSubject, true)
			cpr.AddPaths(dogbonesIn, ClipperLib.PolyType.ptClip, true)
			cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
			insidePolygons=solution_paths
		}

	}

	ClipperLib.JS.ScaleDownPaths(dogbones, scale)
	ClipperLib.JS.ScaleDownPaths(dogbonesIn, scale)
	ClipperLib.JS.ScaleDownPaths(insidePolygons, scale)

	for(i=0;i<insidePolygons.length;i++){
		insidePolygons[i].push(insidePolygons[i][0])
	}


	polygons = ClipperLib.JS.Clean(polygons, 0.015*scale)
	for(i=0;i<polygons.length;i++){
		for(j=0;j<polygons[i].length;j++){
			polygons[i][j].X=polygons[i][j].X/scale
			polygons[i][j].Y=polygons[i][j].Y/scale
		}
		polygons[i].push(polygons[i][0])
	}

	//fillet
	if((fillet==true)||(chamfer==true)){
		makeFillets(polygons, true)
		makeFillets(insidePolygons, false)
	}


	if(dims==true){
		minMax()
	}

}

function makeFillets(pg,pgOut){

	fillets=[]
	chamfers=[]

	var clip = []
	var temp = []
	var fc = [] 

	for(i=0;i<pg.length;i++){
		clip.push([])
		chamfers.push([])
		for(j=0;j<pg[i].length-1;j++){
			fillets.push(pg[i][j])

			if((j!=0)&&(j!=pg[i].length-1)){
				fillets[fillets.length-1].x2=pg[i][j+1].X
				fillets[fillets.length-1].y2=pg[i][j+1].Y

				fillets[fillets.length-1].x3=pg[i][j-1].X
				fillets[fillets.length-1].y3=pg[i][j-1].Y

				angle = ((Math.atan2(pg[i][j+1].X-pg[i][j].X, pg[i][j+1].Y-pg[i][j].Y) - Math.atan2(pg[i][j].X-pg[i][j-1].X,pg[i][j].Y-pg[i][j-1].Y) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
			}
			else if(j==0){
				fillets[fillets.length-1].x2=pg[i][j+1].X
				fillets[fillets.length-1].y2=pg[i][j+1].Y

				fillets[fillets.length-1].x3=pg[i][pg[i].length-2].X
				fillets[fillets.length-1].y3=pg[i][pg[i].length-2].Y

				var angle = ((Math.atan2(pg[i][j+1].X-pg[i][j].X, pg[i][j+1].Y-pg[i][j].Y) - Math.atan2(pg[i][j].X-pg[i][pg[i].length-2].X,pg[i][j].Y-pg[i][pg[i].length-2].Y) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
			}

			//console.log(angle*(180/Math.PI))

			var dist = Math.abs( ((tool)*grid) / (Math.sin(angle)) )
			var d2 = Math.abs( ((tool/2)*grid) * (Math.tan((Math.PI-angle)/2)) )
			var d3 = ((tool/2)*grid)
			
			var x1 = fillets[fillets.length-1].X
			var y1 = fillets[fillets.length-1].Y

			var x2 = fillets[fillets.length-1].x2
			var y2 = fillets[fillets.length-1].y2

			var x3 = fillets[fillets.length-1].x3
			var y3 = fillets[fillets.length-1].y3

			var l1 = Math.sqrt( (Math.pow(Math.abs(x1-x2),2)) + (Math.pow(Math.abs(y1-y2),2)) )
			var l2 = Math.sqrt( (Math.pow(Math.abs(x1-x3),2)) + (Math.pow(Math.abs(y1-y3),2)) )
			
			//fillet min length
			if((l1>(d3))&&(l2>(d3))){

				d = Math.sqrt( (Math.pow((x1-x3),2)) + (Math.pow((y1-y3),2)) ) 
				r = dist/d 

				x4 = r * x3 + (1 - r) * x1 
				y4 = r * y3 + (1 - r) * y1 

				temp.push({X:x4,Y:y4})

				r = d2/d
				x4 = r * x3 + (1 - r) * x1 
				y4 = r * y3 + (1 - r) * y1 
			
				clip[clip.length-1].push({X:x4,Y:y4})

				r = d3/d
				x4 = r * x3 + (1 - r) * x1 
				y4 = r * y3 + (1 - r) * y1 
				chamfers[chamfers.length-1].push({X:x4,Y:y4})
	
				//

				var d = Math.sqrt( (Math.pow((x1-x2),2)) + (Math.pow((y1-y2),2)) ) //distance
				var r = dist/d 

				var x4 = r * x2 + (1 - r) * x1 
				var y4 = r * y2 + (1 - r) * y1 

				temp.push({X:x4,Y:y4})

				var r = d2/d
				x4 = r * x2 + (1 - r) * x1 
				y4 = r * y2 + (1 - r) * y1
				clip[clip.length-1].push({X:x4,Y:y4})

				r = d3/d
				x4 = r * x2 + (1 - r) * x1 
				y4 = r * y2 + (1 - r) * y1 
				chamfers[chamfers.length-1].push({X:x4,Y:y4})
			}
			else{
				clip[clip.length-1].push({X:x1,Y:y1})
				chamfers[chamfers.length-1].push({X:x1,Y:y1})
			}
		}
	}


	fillets=[]

	for(i=0;i<temp.length-1;i+=2){
		fillets.push({X: ((temp[i].X+temp[i+1].X)/2), Y:((temp[i].Y+temp[i+1].Y)/2) })
	}	
	
	fc = fillets

	temp=[]
	for(i=0;i<fillets.length;i++){
	
	Cx=parseFloat(fillets[i].X)
	Cy=parseFloat(fillets[i].Y)
	r=parseFloat(tool/2*grid)

	v=Math.ceil(r*2*Math.PI*30)

	temp.push([])
		for(j=0;j<=v;j++){
			temp[temp.length-1].push({X:(Cx)+Math.sin((Math.PI*2)/v*j)*r,Y:(Cy)+Math.cos((Math.PI*2)/v*j)*r })
		}
	}

	fillets=temp
	filletIn=[]
	filletOut=[]

	//console.log(fc)

	if(chamfer==false){

		for(i=0;i<fc.length;i++){
			for(j=0;j<clip.length;j++){
				if(fc[i]!=undefined){
					inpg = ClipperLib.Clipper.PointInPolygon(fc[i], clip[j])
					if(inpg==1){
						filletIn.push(fc[i])		
						fc.splice(i,1)
						i--
					}
				}
			}

		}
	
		filletOut=fc
		
		temp = []
		for(i=0;i<filletIn.length;i++){
			Cx=parseFloat(filletIn[i].X)
			Cy=parseFloat(filletIn[i].Y)
			r=parseFloat(tool/2*grid)
			v=Math.ceil(r*2*Math.PI*30)
			temp.push([])
			for(j=0;j<=v;j++){
				temp[temp.length-1].push({X:(Cx)+Math.sin((Math.PI*2)/v*j)*r,Y:(Cy)+Math.cos((Math.PI*2)/v*j)*r })
			}
		}
		filletIn = temp

		//FilletInside

		ClipperLib.JS.ScaleUpPaths(clip, scale)
		ClipperLib.JS.ScaleUpPaths(filletIn, scale)


		for(i=0;i<clip.length;i++){
			o = ClipperLib.Clipper.Orientation(clip[i])
			if(o==false){
				//clip[i].reverse()
			}
		}

		solution_paths = new ClipperLib.Paths()
		cpr = new ClipperLib.Clipper()
		cpr.AddPaths(clip, ClipperLib.PolyType.ptSubject, true)
		cpr.AddPaths(filletIn, ClipperLib.PolyType.ptClip, true)
		cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)

		clip=solution_paths

		//
	
		temp = []
		for(i=0;i<filletOut.length;i++){
			Cx=parseFloat(filletOut[i].X)
			Cy=parseFloat(filletOut[i].Y)
			r=parseFloat(tool/2*grid)
			v=Math.ceil(r*2*Math.PI*30)
			temp.push([])
			for(j=0;j<=v;j++){
				temp[temp.length-1].push({X:(Cx)+Math.sin((Math.PI*2)/v*j)*r,Y:(Cy)+Math.cos((Math.PI*2)/v*j)*r })
			}
		}
		filletOut = temp

		//fillet outside
		solution_paths = new ClipperLib.Paths()
		ClipperLib.JS.ScaleUpPaths(filletOut, scale)

		cpr = new ClipperLib.Clipper()
		cpr.AddPaths(clip, ClipperLib.PolyType.ptSubject, true)
		cpr.AddPaths(filletOut, ClipperLib.PolyType.ptClip, true)
		cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
		clip=solution_paths

		clip = ClipperLib.JS.Clean(clip, 0.015*scale)

		ClipperLib.JS.ScaleDownPaths(clip, scale)
		ClipperLib.JS.ScaleDownPaths(filletOut, scale)
		ClipperLib.JS.ScaleDownPaths(filletIn, scale)

		if(pgOut==true){

			polygons=clip

			for(i=0;i<polygons.length;i++){
				polygons[i].push(polygons[i][0])
			}

		}	
		else if(pgOut==false){
			insidePolygons=clip

			for(i=0;i<insidePolygons.length;i++){
				insidePolygons[i].push(insidePolygons[i][0])
			}
		}

		}
		else{

			//ClipperLib.JS.ScaleUpPaths(chamfer, scale)
			//chamfer = ClipperLib.Clipper.SimplifyPolygons(chamfer, ClipperLib.PolyFillType.pftNonZero)
			//chamfer = ClipperLib.JS.Clean(chamfer, 10*scale)
			//ClipperLib.JS.ScaleDownPaths(chamfer, scale)

			for(i=0;i<chamfers.length;i++){
				chamfers[i].push(chamfers[i][0])
			}

			if(pgOut==true){
				polygons=chamfers
			}
			else if(pgOut==false){
				insidePolygons=chamfers
			}

		}

}


function find90(pg,dbin,pgOut){

	bones=[]

	dbo = (tool/2)*grid

	for(i=0;i<pg.length;i++){
		
		for(j=0;j<pg[i].length;j++){

			if((j!=0)&&(j!=pg[i].length-1)){
				angle = ((Math.atan2(pg[i][j+1].X-pg[i][j].X, pg[i][j+1].Y-pg[i][j].Y) - Math.atan2(pg[i][j].X-pg[i][j-1].X,pg[i][j].Y-pg[i][j-1].Y) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
				var a = Math.atan2(pg[i][j+1].X-pg[i][j].X, pg[i][j+1].Y-pg[i][j].Y)
			}
			else if(j==0){
				var angle = ((Math.atan2(pg[i][j+1].X-pg[i][j].X, pg[i][j+1].Y-pg[i][j].Y) - Math.atan2(pg[i][j].X-pg[i][pg[i].length-2].X,pg[i][j].Y-pg[i][pg[i].length-2].Y) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
				var a = Math.atan2(pg[i][j+1].X-pg[i][j].X, pg[i][j+1].Y-pg[i][j].Y)
			}

			angle = Math.round(angle*(180/Math.PI))
			if(Math.abs(angle)==90){
				bones.push(pg[i][j])
				bones[bones.length-1].A = a+0.7853
			}

		}
		
	}

	db = []	
	for(i=0;i<bones.length;i++){
		db.push([])

		for(j=0;j<4;j++){

			db[db.length-1].push({X:(bones[i].X)+Math.sin((Math.PI*2)/4*j+bones[i].A)*dbo,Y:(bones[i].Y)+Math.cos((Math.PI*2)/4*j+bones[i].A)*dbo})

		}

	}

	bones=db

	dogbonePts(pg,pgOut)

}

function dogbonePts(pg,pgOut){

	db=[]

   // 0 = false
   //-1 = on
   // 1 = in

	for(i=0;i<pg.length;i++){

		for(j=0;j<bones.length;j++){
			db.push([])
			for(k=0;k<bones[j].length;k++){
				inpg = ClipperLib.Clipper.PointInPolygon(bones[j][k], pg[i])

				if(inside==true){
					if(inpg==1){
						db[db.length-1].push(bones[j][k])
					}
				}
				else if(inside==false){
					if(inpg==0){
						db[db.length-1].push(bones[j][k])
					}
				}

			}

			if((db[db.length-1].length>1)&&(inside==true)){
				db.pop()
			}


			if(inside==false){
				if(db[db.length-1].length>1){
					db.pop()
				}
			}


		}			
	}

	bones=[]
	for(i=0;i<db.length;i++){
		if(db[i].length>0){
		bones.push(db[i][0])
		}
	}
	
	if(bones.length>0){
		makeDogbones(bones,pgOut)
	}	


}


function makeDogbones(pts,pgOut){

	for(i=0;i<pts.length;i++){
	
	Cx=parseFloat(pts[i].X)
	Cy=parseFloat(pts[i].Y)
	r=parseFloat(tool/2*grid)

	v=Math.ceil(r*2*Math.PI*30)


		if(pgOut==true){

			dogbones.push([])
				for(j=0;j<v;j++){
					dogbones[dogbones.length-1].push({X:(Cx)+Math.sin((Math.PI*2)/v*j)*r,Y:(Cy)+Math.cos((Math.PI*2)/v*j)*r})
				}
		}
		else if(pgOut==false){
			dogbonesIn.push([])
			for(j=0;j<v;j++){
				dogbonesIn[dogbonesIn.length-1].push({X:(Cx)+Math.sin((Math.PI*2)/v*j)*r,Y:(Cy)+Math.cos((Math.PI*2)/v*j)*r})
			}
		}

	}

}



function pocket(){

	cutout=[]

	console.log(polygons)

	pockets=polygons
	for(i=0;i<insidePolygons.length;i++){
		pockets.push(insidePolygons[i])
		o = ClipperLib.Clipper.Orientation(pockets[pockets.length-1])
		if(o==true){
			pockets[pockets.length-1].reverse()
		}
	}


	for(i=0;i<pockets.length;i++){
		pockets[i].pop()
	}

	ClipperLib.JS.ScaleUpPaths(pockets, scale)
	var co = new ClipperLib.ClipperOffset(0.25, 0.25)
	co.AddPaths(pockets, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon)

	pockets=[]
	o=1
	while(o>0){
		offset = new ClipperLib.Paths()

		co.Execute(offset,-(tool/2*grid*o) * scale)

		if(offset.length!=0){
			o++
			for(i=0;i<offset.length;i++){
				pockets.push(offset[i])
			}
		}
		else{
			o=0
		}
	}

	pockets.reverse()

	ClipperLib.JS.ScaleDownPaths(pockets, scale)

	//sort

	console.log(pockets)

   // 0 = false
   //-1 = on
   // 1 = in

	temp=[]

	while(pockets.length>0){

	temp.push([])
	temp[temp.length-1].push(pockets[pockets.length-1])
	pockets.pop()

	for(i=pockets.length-1;i>=0;i--){
		inpg = ClipperLib.Clipper.PointInPolygon(pockets[i][0],temp[temp.length-1][0])
		//console.log(inpg)
		if(inpg==1){
			temp[temp.length-1].push(pockets[i])
			pockets.splice(i,1)
		}
	}

	}


	for(i=0;i<temp.length;i++){
		temp[i][0].reverse()
		temp[i].reverse()
	}

	//console.log(temp)

	pockets=temp

	//draw()

}


function cutOut(out){

	pockets=[]

	cutout=polygons
	for(i=0;i<insidePolygons.length;i++){
		cutout.push(insidePolygons[i])
		o = ClipperLib.Clipper.Orientation(cutout[cutout.length-1])
		if(o==true){
			cutout[cutout.length-1].reverse()
		}
	}

	for(i=0;i<cutout.length;i++){
		cutout[i].pop()
	}

	ClipperLib.JS.ScaleUpPaths(cutout, scale)
	var co = new ClipperLib.ClipperOffset(0.25, 0.25)
	co.AddPaths(cutout, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon)
	cutout = new ClipperLib.Paths()
	if(out==true){
		co.Execute(cutout,(tool/2*grid) * scale)
	}
	else if(out==false){
		co.Execute(cutout,-(tool/2*grid) * scale)
	}

	ClipperLib.JS.ScaleDownPaths(cutout, scale)

	cutout.reverse()


}



