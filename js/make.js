var xmin = 0
var ymin = 0
var xmax = 0
var ymax = 0

function make(){

	//min/max
	/*

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

	*/
	//console.log(xmin,ymin)
	//console.log(xmax,ymax)
	//console.log(unit)
	//console.log(lines)

	if((output=='sbp')||(output=='gcode')){
		var pt= Math.ceil(cutDepth/tool)  //passes
		var pd = parseFloat(cutDepth/pt) //depth of pass
		alert(pt)
	}


	if(output=='sbp'){

		var sbp = ""

		sbp+="MS," + feedrate + "," + plungerate + "\n"
		sbp+="JZ,0.1\n"
		sbp+="SO,1,1\n"
		sbp+="PAUSE 3\n"

		if((pockets.length==0)&&(cutout.length==0)){
			//on
			for(i=0;i<polygons.length;i++){
				sbp+="J2,"+(polygons[i][0].X/grid).toFixed(3) + "," + (polygons[i][0].Y/grid).toFixed(3) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						sbp+="MZ,-"+cutDepth+"\n"
					}
					else{
						sbp+="MZ,-" + (p*pd).toFixed(3) + "\n"
					}	

					for(j=1;j<polygons[i].length;j++){
						sbp+="M2,"+(polygons[i][j].X/grid).toFixed(3) + "," + (polygons[i][j].Y/grid).toFixed(3) + "\n"
					}
				}

				sbp+="JZ,0.1\n"
			}
		}
		else if(pockets.length!=0){
			//pocket

			for(p=1;p<=pt;p++){


				for(i=0;i<pockets.length;i++){
					sbp+="J2,"+(pockets[i][0].X/grid).toFixed(3) + "," + (pockets[i][0].Y/grid).toFixed(3) +"\n"
					if(p==pt){
						sbp+="MZ,-"+cutDepth+"\n"
					}
					else{
						sbp+="MZ,-" + (p*pd).toFixed(3) + "\n"
					}	
					for(j=1;j<pockets[i].length;j++){
						sbp+="M2,"+(pockets[i][j].X/grid).toFixed(3) + "," + (pockets[i][j].Y/grid).toFixed(3) + "\n"
					}
					sbp+="M2,"+(pockets[i][0].X/grid).toFixed(3) + "," + (pockets[i][0].Y/grid).toFixed(3) + "\n"
					sbp+="JZ,0.1\n"
				}

			}
		}
		else if(cutout.length!=0){
			//cutout
			for(i=0;i<cutout.length;i++){
				sbp+="J2,"+(cutout[i][0].X/grid).toFixed(3) + "," + (cutout[i][0].Y/grid).toFixed(3) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						sbp+="MZ,-"+cutDepth+"\n"
					}
					else{
						sbp+="MZ,-" + (p*pd).toFixed(3) + "\n"
					}
	
					for(j=1;j<cutout[i].length;j++){
						sbp+="M2,"+(cutout[i][j].X/grid).toFixed(3) + "," + (cutout[i][j].Y/grid).toFixed(3) + "\n"
					}
					sbp+="M2,"+(cutout[i][0].X/grid).toFixed(3) + "," + (cutout[i][0].Y/grid).toFixed(3) + "\n"

					sbp+="JZ,0.1\n"
				}	
			}
		}

	
		sbp+="SO,1,0\n"
		sbp+="J2,0,0\n"

		fabmo.submitJob({
		   file : sbp,
		   filename : name + '.SBP',
		   name : name,
			description :  ''
		})

	}
	else if(output=='gcode'){

		var g = ""

		var feed = (feedrate*60).toFixed(1)
		var plunge = (plungerate*60).toFixed(1)

		g+="m20\n"
		g+="g1f" + feed + "\n" 
		g+="g0z0.2\n"
		g+="m3\n"
		g+="g4p3\n"

		if((pockets.length==0)&&(cutout.length==0)){

			for(i=0;i<polygons.length;i++){
				g+="g0x"+(polygons[i][0].X/grid).toFixed(3) + "y" + (polygons[i][0].Y/grid).toFixed(3) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						g+="g1z-" + cutDepth + "f" + plunge +"\n"
					}
					else{
						g+="g1z-" + (p*pd).toFixed(3) + "f" + plunge +"\n"
					}

					for(j=1;j<polygons[i].length;j++){
						g+="g1x"+(polygons[i][j].X/grid).toFixed(3) + "y" + (polygons[i][j].Y/grid).toFixed(3) + "f" + feed + "\n"
					}

				}				
	
				g+="g0z0.2\n"
			}
		}
		else if(pockets.length!=0){

			for(p=1;p<=pt;p++){

				for(i=0;i<pockets.length;i++){
					g+="g0x"+(pockets[i][0].X/grid).toFixed(3) + "y" + (pockets[i][0].Y/grid).toFixed(3) +"\n"
					if(p==pt){
						g+="g1z-" + cutDepth + "f" + plunge +"\n"
					}
					else{
						g+="g1z-" + (p*pd).toFixed(3) + "f" + plunge +"\n"
					}
					for(j=1;j<pockets[i].length;j++){
						g+="g1x"+(pockets[i][j].X/grid).toFixed(3) + "y" + (pockets[i][j].Y/grid).toFixed(3)+ "f" + feed + "\n"
					}
					g+="g1x"+(pockets[i][0].X/grid).toFixed(3) + "y" + (pockets[i][0].Y/grid).toFixed(3)+ "f" + feed + "\n"
					g+="g0z0.2\n"
				}

			}
		}
		else if(cutout.length!=0){
			//cutout
			for(i=0;i<cutout.length;i++){
				g+="g0x"+(cutout[i][0].X/grid).toFixed(3) + "y" + (cutout[i][0].Y/grid).toFixed(3) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						g+="g1z-" + cutDepth + "f" + plunge +"\n"
					}
					else{
						g+="g1z-" + (p*pd).toFixed(3) + "f" + plunge +"\n"
					}
			
					for(j=1;j<cutout[i].length;j++){
						g+="g1x"+(cutout[i][j].X/grid).toFixed(3) + "y" + (cutout[i][j].Y/grid).toFixed(3)+ "f" + feed + "\n"
					}
					g+="g1x"+(cutout[i][0].X/grid).toFixed(3) + "y" + (cutout[i][0].Y/grid).toFixed(3)+ "f" + feed + "\n"
				}

				g+="g0z0.2\n"
			}

		}

	
		g+="m5\n"
		g+="g0x0y0\n"

		fabmo.submitJob({
		   file : g,
		   filename : name + '.g',
		   name : name,
			description :  ''
		})



	}
	else if(output=='dxf'){

		var dxf = "0\nSECTION\n2\nENTITIES\n999\nw4rd.com\n0\n"
			
		for(i=0;i<polygons.length;i++){
			dxf+="POLYLINE\n8\n0\n70\n1\n0\n"
			for(j=0;j<polygons[i].length;j++){
				dxf+="VERTEX\n8\n0\n10\n"
				dxf+=((polygons[i][j].X/grid)).toFixed(3) + "\n20\n"
				dxf+=((polygons[i][j].Y/grid)).toFixed(3) + "\n0\n"			
			}
			dxf+="SEQEND\n0\n"
		}
	

	dxf+="ENDSEC\n0\nEOF"
	//console.log(dxf)

	var link = document.getElementById("download")
	link.setAttribute("href", "data:text/plain;base64," + btoa(dxf))
	link.setAttribute("download", name + ".dxf")
	link.click()

	}

}
