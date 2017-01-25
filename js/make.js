
function make(){


	if((output=='sbp')||(output=='gcode')){
		if(passDepth==-1){
			var pt= Math.ceil(cutDepth/tool)  //passes
			var pd = parseFloat(cutDepth/pt) //depth of pass
		}
		else{
			var pt= Math.ceil(cutDepth/passDepth)  //passes
			var pd = parseFloat(cutDepth/pt) //depth of pass
		}
}

	fixed = 3 
	sf2 = 1
	safe = 0.1

	if(unit=='mm'){
		fixed = 2
		sf2 = 25.4
		safe=Math.round(safe*sf2)
	}

	if(output=='sbp'){

		var sbp = ""
			sbp+="VD,,1\n"
		if(unit=='mm'){

		}

		sbp+="MS," + (feedrate*sf2).toFixed(2) + "," + (plungerate*sf2).toFixed(2) + "\n"
		sbp+="JZ," + safe + "\n"
		sbp+="SO,1,1\n"
		sbp+="PAUSE 3\n"

		//drill
		for(i=0;i<lines.length;i++){
			if((lines[i].length==4)&&(lines[i][0]==lines[i][2])&&(lines[i][1]==lines[i][3])){
				sbp+="J2,"+(lines[i][0]/grid*sf2).toFixed(fixed) + "," + (lines[i][1]/grid*sf2).toFixed(fixed) +"\n"
				for(p=1;p<=pt;p++){
					if(p==pt){
						sbp+="MZ,-"+(cutDepth*sf2).toFixed(fixed)+"\n"
					}
					else{
						sbp+="MZ,-" + (p*pd*sf2).toFixed(fixed) + "\n"
					}
				sbp+="JZ," + safe + "\n"
				}
			}
		}


		if((pockets.length==0)&&(cutout.length==0)){
			//on
			for(i=0;i<polygons.length;i++){
				sbp+="J2,"+(polygons[i][0].X/grid*sf2).toFixed(fixed) + "," + (polygons[i][0].Y/grid*sf2).toFixed(fixed) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						sbp+="MZ,-"+(cutDepth*sf2).toFixed(fixed)+"\n"
					}
					else{
						sbp+="MZ,-" + (p*pd*sf2).toFixed(fixed) + "\n"
					}	

					for(j=1;j<polygons[i].length;j++){
						sbp+="M2,"+(polygons[i][j].X/grid*sf2).toFixed(fixed) + "," + (polygons[i][j].Y/grid*sf2).toFixed(fixed) + "\n"
					}
					if(p==pt){
						sbp+="JZ," + safe + "\n"
					}
				}

			}
		}
		else if(pockets.length!=0){

			for(i=0;i<pockets.length;i++){
		
				for(p=1;p<=pt;p++){

					for(j=0;j<pockets[i].length;j++){

						sbp+="J2,"+(pockets[i][j][0].X/grid*sf2).toFixed(fixed) + "," + (pockets[i][j][0].Y/grid*sf2).toFixed(fixed) +"\n"
						if(p==pt){
							sbp+="MZ,-"+(cutDepth*sf2).toFixed(fixed)+"\n"
						}
						else{
							sbp+="MZ,-" + (p*pd*sf2).toFixed(fixed) + "\n"
						}
	
						for(k=1;k<pockets[i][j].length;k++){
							sbp+="M2,"+(pockets[i][j][k].X/grid*sf2).toFixed(fixed) + "," + (pockets[i][j][k].Y/grid*sf2).toFixed(fixed) + "\n"
						}
						sbp+="M2,"+(pockets[i][j][0].X/grid*sf2).toFixed(fixed) + "," + (pockets[i][j][0].Y/grid*sf2).toFixed(fixed) + "\n"

						sbp+="JZ," + safe + "\n"
					}

				}

			}
		}
		else if(cutout.length!=0){
			//cutout
			for(i=0;i<cutout.length;i++){
				sbp+="J2,"+(cutout[i][0].X/grid*sf2).toFixed(fixed) + "," + (cutout[i][0].Y/grid*sf2).toFixed(fixed) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						sbp+="MZ,-"+(cutDepth*sf2).toFixed(fixed)+"\n"
					}
					else{
						sbp+="MZ,-" + (p*pd*sf2).toFixed(fixed) + "\n"
					}
	
					for(j=1;j<cutout[i].length;j++){
						sbp+="M2,"+(cutout[i][j].X/grid*sf2).toFixed(fixed) + "," + (cutout[i][j].Y/grid*sf2).toFixed(fixed) + "\n"
					}
					sbp+="M2,"+(cutout[i][0].X/grid*sf2).toFixed(fixed) + "," + (cutout[i][0].Y/grid*sf2).toFixed(fixed) + "\n"

					if(p==pt){
						sbp+="JZ," + safe + "\n"
					}
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

		var feed = (feedrate*60*sf2).toFixed(2)
		var plunge = (plungerate*60*sf2).toFixed(2)
		
		if(unit=='inch'){
			g+="g20\n"
		}
		else if(unit=='mm'){
			g+="g21\n"
		}
		g+="g1f" + feed + "\n" 
		g+="g0z" + safe + "\n"
		g+="m3\n"
		g+="g4p3\n"

		//drill
		for(i=0;i<lines.length;i++){
			if((lines[i].length==4)&&(lines[i][0]==lines[i][2])&&(lines[i][1]==lines[i][3])){
				g+="g0x"+(lines[i][0]/grid*sf2).toFixed(fixed) + "y" + (lines[i][1]/grid*sf2).toFixed(fixed) +"\n"
				for(p=1;p<=pt;p++){
					if(p==pt){
						g+="g1z-"+(cutDepth*sf2).toFixed(fixed)+ "f" + plunge + "\n"
					}
					else{
						g+="g1z-" + (p*pd*sf2).toFixed(fixed) +  "f" + plunge + "\n"
					}
				g+="g0z" + safe + "\n"
				}
			}
		}


		if((pockets.length==0)&&(cutout.length==0)){

			for(i=0;i<polygons.length;i++){
				g+="g0x"+(polygons[i][0].X/grid*sf2).toFixed(fixed) + "y" + (polygons[i][0].Y/grid*sf2).toFixed(fixed) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						g+="g1z-" + (cutDepth*sf2).toFixed(fixed) + "f" + plunge +"\n"
					}
					else{
						g+="g1z-" + (p*pd*sf2).toFixed(fixed) + "f" + plunge +"\n"
					}

					for(j=1;j<polygons[i].length;j++){
						if(j==1){
							g+="g1x"+(polygons[i][j].X/grid*sf2).toFixed(fixed) + "y" + (polygons[i][j].Y/grid*sf2).toFixed(fixed) + "f" + feed + "\n"
						}
						else{
							g+="g1x"+(polygons[i][j].X/grid*sf2).toFixed(fixed) + "y" + (polygons[i][j].Y/grid*sf2).toFixed(fixed)+"\n"
						}
					}
					if(p==pt){
						g+="g0z" + safe + "\n"
					}
				}				
				
			}
		}
		else if(pockets.length!=0){

			for(i=0;i<pockets.length;i++){

				for(p=1;p<=pt;p++){

					for(j=0;j<pockets[i].length;j++){

						g+="g0x"+(pockets[i][j][0].X/grid*sf2).toFixed(fixed) + "y" + (pockets[i][j][0].Y/grid*sf2).toFixed(fixed) +"\n"
						if(p==pt){
							g+="g1z-" + (cutDepth*sf2).toFixed(fixed) + "f" + plunge +"\n"
						}
						else{
							g+="g1z-" + (p*pd*sf2).toFixed(fixed) + "f" + plunge +"\n"
						}
						//
						for(k=1;k<pockets[i][j].length;k++){
							if(k==1){
								g+="g1x"+(pockets[i][j][k].X/grid*sf2).toFixed(fixed) + "y" + (pockets[i][j][k].Y/grid*sf2).toFixed(fixed)+ "f" + feed + "\n"
							}
							else{
								g+="g1x"+(pockets[i][j][k].X/grid*sf2).toFixed(fixed) + "y" + (pockets[i][j][k].Y/grid*sf2).toFixed(fixed) + "\n"
							}
						}
						//
						g+="g1x"+(pockets[i][j][0].X/grid*sf2).toFixed(fixed) + "y" + (pockets[i][j][0].Y/grid*sf2).toFixed(fixed)+ "\n"
					
						g+="g0z" + safe + "\n"
					}
					//

				}
			}
		}
		else if(cutout.length!=0){
			//cutout
			for(i=0;i<cutout.length;i++){
				g+="g0x"+(cutout[i][0].X/grid*sf2).toFixed(fixed) + "y" + (cutout[i][0].Y/grid*sf2).toFixed(fixed) +"\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						g+="g1z-" + (cutDepth*sf2).toFixed(fixed) + "f" + plunge +"\n"
					}
					else{
						g+="g1z-" + (p*pd*sf2).toFixed(fixed) + "f" + plunge +"\n"
					}
			
					for(j=1;j<cutout[i].length;j++){
						if(j==1){
							g+="g1x"+(cutout[i][j].X/grid*sf2).toFixed(fixed) + "y" + (cutout[i][j].Y/grid*sf2).toFixed(fixed)+ "f" + feed + "\n"
						}
						else{
							g+="g1x"+(cutout[i][j].X/grid*sf2).toFixed(fixed) + "y" + (cutout[i][j].Y/grid*sf2).toFixed(fixed)+ "\n"
						}
					}
					g+="g1x"+(cutout[i][0].X/grid*sf2).toFixed(fixed) + "y" + (cutout[i][0].Y/grid*sf2).toFixed(fixed)+ "\n"

					if(p==pt){
						g+="g0z" + safe + "\n"
					}
				}

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
				dxf+=((polygons[i][j].X/grid)).toFixed(fixed) + "\n20\n"
				dxf+=((polygons[i][j].Y/grid)).toFixed(fixed) + "\n0\n"			
			}
			dxf+="SEQEND\n0\n"
		}
	
		dxf+="ENDSEC\n0\nEOF"

		var link = document.getElementById("download")
		link.setAttribute("href", "data:text/plain;base64," + btoa(dxf))
		link.setAttribute("download", name + ".dxf")
		link.click()

	}

}
