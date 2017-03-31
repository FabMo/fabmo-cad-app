
function arc(pts){

	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	r=parseFloat(pts[2])
	a1=(parseFloat(pts[3]))*(Math.PI/180)
	a2=(parseFloat(pts[4]))*(Math.PI/180)
	v=Math.ceil((r/2)*2*Math.PI*10)

	a3=Math.round(((a2-a1)/(Math.PI*2))*v)

	//lines.push([Cx,Cy])
	lines.push([])
	for(i=0;i<(a3);i++){
		lines[lines.length-1].push((Cx)+Math.sin((Math.PI*2)/v*i+a1)*r)
		lines[lines.length-1].push((Cy)+Math.cos((Math.PI*2)/v*i+a1)*r)
	}
	lines[lines.length-1].push(((Cx)+Math.sin(a2)*r),((Cy)+Math.cos(a2)*r))

	endPts.push({X:Cx/grid,Y:Cy/grid,i:lines.length-1})
	endPts.push({X:lines[lines.length-1][0]/grid,Y:lines[lines.length-1][1]/grid,i:lines.length-1})
	endPts.push({X:lines[lines.length-1][lines[lines.length-1].length-2]/grid,Y:lines[lines.length-1][lines[lines.length-1].length-1]/grid,i:lines.length-1})

}


function circle(pts){
	
	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	r=parseFloat(pts[2])
	if(r<0.5){
		v=Math.ceil((r/grid)*2*Math.PI*100)
	}
	else{
		v=Math.ceil((r/grid)*2*Math.PI*10)
	}
	//console.log(v)

	lines.push([])
	for(i=0;i<=v;i++){
		lines[lines.length-1].push((Cx)+Math.sin((Math.PI*2)/v*i)*r)
		lines[lines.length-1].push((Cy)+Math.cos((Math.PI*2)/v*i)*r)
	}
	endPts.push({X:Cx/grid,Y:Cy/grid,i:lines.length-1})

}


function polygon(pts){
	
	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	r=parseFloat(pts[2])
	v=parseInt(pts[3]/grid)
	if(v<3){
		v=3
	}

	lines.push([])
	for(i=0;i<=v;i++){
		lines[lines.length-1].push((Cx)+Math.sin((Math.PI*2)/v*i)*r)
		lines[lines.length-1].push((Cy)+Math.cos((Math.PI*2)/v*i)*r)
		endPts.push({X:((Cx)+Math.sin((Math.PI*2)/v*i)*r)/grid,Y:((Cy)+Math.cos((Math.PI*2)/v*i)*r)/grid,i:i})
	}

	endPts.push({X:Cx/grid,Y:Cy/grid,i:lines.length-1})
}


function drill(pts){
	if(pts.length==2){
		lines.push([pts[0],pts[1],pts[0],pts[1]])
		point = [pts[0],pts[1]]
	}	
}


function ellipse(pts){
	
	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	r=parseFloat(pts[2])
	r2=parseFloat(pts[3])
	v=Math.ceil((r/grid)*2*Math.PI*10)

	lines.push([])
	for(i=0;i<=v;i++){
		lines[lines.length-1].push((Cx)+Math.sin((Math.PI*2)/v*i)*r)
		lines[lines.length-1].push((Cy)+Math.cos((Math.PI*2)/v*i)*r2)
	}

	endPts.push({X:(Cx)/grid,Y:(Cy+r2)/grid,i:lines.length-1})
	endPts.push({X:(Cx)/grid,Y:(Cy-r2)/grid,i:lines.length-1})
	endPts.push({X:(Cx+r)/grid,Y:(Cy)/grid,i:lines.length-1})
	endPts.push({X:(Cx-r)/grid,Y:(Cy)/grid,i:lines.length-1})

	endPts.push({X:Cx/grid,Y:Cy/grid,i:lines.length-1})

}



function heart(pts){

	Cx=parseFloat(pts[0])
	Cy=parseFloat(pts[1])
	radius=parseFloat(pts[2])
	//v=Math.ceil(radius*2*Math.PI*10)
	v=64*radius

	lines.push([])

	for(i=0;i<=v;i++){

		t = (Math.PI*2/v*i)
		r = ((Math.sin(t) * (Math.sqrt(Math.abs(Math.cos(t)))) ) /(Math.sin(t)+ 1.4) - (2*Math.sin(t)) + 2 + 0.001)

		lines[lines.length-1].push(Cx+r*Math.sin(t-Math.PI/2)*(radius/2.52))
		lines[lines.length-1].push((radius/1.69)+Cy+r*Math.cos(t-Math.PI/2)*(radius/2.52))
	}

	endPts.push({X:Cx/grid,Y:Cy/grid,i:lines.length-1})
}

function line(pts){
	if(pts.length==4){
		lines.push(pts)
		point = [lines[lines.length-1][2],lines[lines.length-1][3]]
	}
	else if(pts.length==2){
		centerPoints[centerPoints.length-1]=({X:parseFloat(point[0]/grid),Y:parseFloat(point[1]/grid)})
		pts.splice(0,0,point[1])
		pts.splice(0,0,point[0])
		lines.push(pts)
		point = [lines[lines.length-1][2],lines[lines.length-1][3]]
	}
	endPts.push({X:lines[lines.length-1][0]/grid,Y:lines[lines.length-1][1]/grid,i:lines.length-1})
	endPts.push({X:lines[lines.length-1][2]/grid,Y:lines[lines.length-1][3]/grid,i:lines.length-1})	
}


function rect(pts){
	if(pts.length==4){
		lines.push([])
		lines[lines.length-1].push(pts[0],pts[1],(pts[0]+pts[2]),pts[1],(pts[0]+pts[2]),(pts[1]+pts[3]),(pts[0]),(pts[1]+pts[3]),pts[0],pts[1])
		
	}
	else if(pts.length==3){
		lines.push([])
		lines[lines.length-1].push(pts[0],pts[1],(pts[0]+pts[2]),pts[1],(pts[0]+pts[2]),(pts[1]+pts[2]),(pts[0]),(pts[1]+pts[2]),pts[0],pts[1])
	}

	endPts.push({X:lines[lines.length-1][0]/grid,Y:lines[lines.length-1][1]/grid,i:lines.length-1})
	endPts.push({X:lines[lines.length-1][2]/grid,Y:lines[lines.length-1][3]/grid,i:lines.length-1})
	endPts.push({X:lines[lines.length-1][4]/grid,Y:lines[lines.length-1][5]/grid,i:lines.length-1})	
	endPts.push({X:lines[lines.length-1][6]/grid,Y:lines[lines.length-1][7]/grid,i:lines.length-1})	
	
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
			endPts.push({X:((Cx)+Math.sin((Math.PI*2)/v*(i+j))*r)/grid,Y:((Cy)+Math.cos((Math.PI*2)/v*(i+j))*r)/grid,i:lines.length-1})
			j+=2
			
		}
	}
	endPts.push({X:Cx/grid,Y:Cy/grid,i:lines.length-1})

}


