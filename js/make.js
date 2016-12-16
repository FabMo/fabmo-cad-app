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
	spb+="SO,1,1\n"
	sbp+="PAUSE 5\n"

	for(i=0;i<lines.length;i++){


	}




}
