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

function drill(pts){
	if(pts.length==2){
		lines.push([pts[0],pts[1],pts[0],pts[1]])
		point = [pts[0],pts[1]]
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
	//console.log(lines)
}


