var xmin = 0
var ymin = 0
var xmax = 0
var ymax = 0

function make(){


	if(lines.length>0){
		xmin=lines[0][0]
		ymin=lines[0][1]
		xmax=xmin
		ymax=ymin
		
		for(i=0;i<lines.length;i++){
			//min
			if(lines[i][0]<xmin){
				xmin = lines[i][0]
			}
			if(lines[i][2]<xmin){
				xmin = lines[i][2]
			}

			if(lines[i][1]<ymin){
				ymin = lines[i][1]
			}
			if(lines[i][3]<ymin){
				ymin = lines[i][3]
			}
			//max
			if(lines[i][0]>xmax){
				xmax = lines[i][0]
			}
			if(lines[i][2]>xmax){
				xmax = lines[i][2]
			}

			if(lines[i][1]>ymax){
				ymax = lines[i][1]
			}
			if(lines[i][3]>ymax){
				ymax = lines[i][3]
			}

		}
	}
	//console.log(xmin,ymin)
	//console.log(xmax,ymax)
	//console.log(unit)
	//console.log(lines)
	var sbp = ""

	sbp+="MS," + 0.5 + "," + 0.25 + "\n"
	sbp+="JZ,0.2\n"
	sbp+="SO,1,1\n"
	sbp+="PAUSE 3\n"
	
	/*
	for(i=0;i<lines.length;i++){
		sbp+="J2,"+lines[i][0]+","+lines[i][1]+"\n"
		sbp+="MZ,-0.1\n"
		sbp+="M2,"+lines[i][2]+","+lines[i][3]+"\n"
		sbp+="JZ,0.2\n"
	}
	*/

	if((pockets.length==0)&&(cutout.length==0)){
		//on
		for(i=0;i<polygons.length;i++){
			sbp+="J2,"+(polygons[i][0].X/grid).toFixed(3) + "," + (polygons[i][0].Y/grid).toFixed(3) +"\n"
			sbp+="MZ,-0.05\n"
			for(j=1;j<polygons[i].length;j++){
				sbp+="M2,"+(polygons[i][j].X/grid).toFixed(3) + "," + (polygons[i][j].Y/grid).toFixed(3) + "\n"
			}
			sbp+="JZ,0.2\n"
		}
	}
	else if(pockets.length!=0){
		//pocket
		for(i=0;i<pockets.length;i++){
			sbp+="J2,"+(pockets[i][0].X/grid).toFixed(3) + "," + (pockets[i][0].Y/grid).toFixed(3) +"\n"
			sbp+="MZ,-0.05\n"
			for(j=1;j<pockets[i].length;j++){
				sbp+="M2,"+(pockets[i][j].X/grid).toFixed(3) + "," + (pockets[i][j].Y/grid).toFixed(3) + "\n"
			}
			sbp+="M2,"+(pockets[i][0].X/grid).toFixed(3) + "," + (pockets[i][0].Y/grid).toFixed(3) + "\n"
			sbp+="JZ,0.2\n"
		}
	}
	else if(cutout.length!=0){
		//cutout
		for(i=0;i<cutout.length;i++){
			sbp+="J2,"+(cutout[i][0].X/grid).toFixed(3) + "," + (cutout[i][0].Y/grid).toFixed(3) +"\n"
			sbp+="MZ,-0.05\n"
			for(j=1;j<cutout[i].length;j++){
				sbp+="M2,"+(cutout[i][j].X/grid).toFixed(3) + "," + (cutout[i][j].Y/grid).toFixed(3) + "\n"
			}
			sbp+="M2,"+(cutout[i][0].X/grid).toFixed(3) + "," + (cutout[i][0].Y/grid).toFixed(3) + "\n"
			sbp+="JZ,0.2\n"
		}

	}

	
	sbp+="SO,1,0\n"
	sbp+="J2,0,0\n"

	fabmo.submitJob({
	   file : sbp,
	   filename : 'cad.SBP',
	   name : 'cad',
		description :  ''
	})




}
