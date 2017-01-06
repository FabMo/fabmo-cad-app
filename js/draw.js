function draw(){

	c = document.getElementById("cad-canvas")
	ctx = c.getContext("2d")

	ctx.canvas.height = $(window).innerHeight()
	ctx.canvas.width = $(window).innerWidth()

	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
	ctx.lineJoin="round"
	ctx.lineCap="round"

	sf = zoom
	ctx.translate(panX+mousePanX,panY+mousePanY)

	//origin
	ctx.lineWidth = 1
	ctx.strokeStyle = '#999'
	ctx.fillStyle = '#000'
	ctx.arc(ctx.canvas.width/2,ctx.canvas.height/2,2,0,Math.PI*2)
	ctx.fill()

	//grid

	ctx.lineWidth = 0.1*sf
	
	for(x=0;x<(ctx.canvas.width/2)-(panX+mousePanX);x+=gridSpace*sf){
		ctx.moveTo(ctx.canvas.width/2+x,-(panY+mousePanY))
		ctx.lineTo(ctx.canvas.width/2+x,ctx.canvas.height-(panY+mousePanY))
	}
	for(x=-gridSpace*sf;x>(-ctx.canvas.width/2)-(panX+mousePanX);x-=gridSpace*sf){
		ctx.moveTo(ctx.canvas.width/2+x,-(panY+mousePanY))
		ctx.lineTo(ctx.canvas.width/2+x,ctx.canvas.height-(panY+mousePanY))
	}

	for(y=0;y<(ctx.canvas.height/2)-(panY+mousePanY);y+=gridSpace*sf){
		ctx.moveTo(0-(panX+mousePanX),ctx.canvas.height/2+y)
		ctx.lineTo(ctx.canvas.width-(panX+mousePanX),ctx.canvas.height/2+y)
	}
	for(y=-gridSpace*sf;y>(-ctx.canvas.height/2)-(panY+mousePanY);y-=gridSpace*sf){
		ctx.moveTo(0-(panX+mousePanX),ctx.canvas.height/2+y)
		ctx.lineTo(ctx.canvas.width-(panX+mousePanX),ctx.canvas.height/2+y)
	}
	ctx.stroke()

	ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2)

	//stock
	if(stock.length>0){
		ctx.fillStyle='rgba(0,0,200,0.1)'
		ctx.beginPath()
		ctx.rect(0,0,(stock[0])*gridSpace*sf,(0-stock[1])*gridSpace*sf)
		ctx.fill()
	}

	//dogbones
	ctx.strokeStyle='#000'
	for(i=0;i<dogbones.length;i++){
		ctx.beginPath()
		for(j=0;j<dogbones[i].length;j+=2){			
			//ctx.lineTo((dogbones[i][j]*gridSpace*sf),(0-dogbones[i][j+1]*gridSpace*sf))
		}
		ctx.stroke()	
	}

	//lines
	//ctx.setLineDash([2*sf, 3*sf])
	ctx.lineWidth=0.7*sf
	ctx.strokeStyle='#666'
	for(i=0;i<lines.length;i++){
		ctx.beginPath()
		ctx.moveTo(lines[i][0]*gridSpace*sf,0-lines[i][1]*gridSpace*sf)
		if(lines[i].length>2){
			for(j=2;j<lines[i].length;j+=2){
				ctx.lineTo(lines[i][j]*gridSpace*sf,0-lines[i][j+1]*gridSpace*sf)
			}
		}
		ctx.stroke()
	}
	//ctx.setLineDash([0, 0])

	//polygons
	ctx.lineWidth=0.7*sf
	ctx.strokeStyle='#ee00ee'
	for(i=0;i<polygons.length;i++){

		ctx.beginPath()
		for(j=0;j<polygons[i].length;j++){
			//console.log(polygons[i][j].X)
			ctx.lineTo(polygons[i][j].X*gridSpace*sf,0-(polygons[i][j].Y*gridSpace*sf))
		}
		//ctx.lineTo(polygons[i][0].X*gridSpace*sf,0-(polygons[i][0].Y*gridSpace*sf))
		ctx.stroke()
	}

	//start point
	if(polygons.length>0){
		ctx.fillStyle='#000'
		ctx.beginPath()
		//ctx.arc(polygons[0][0].X*gridSpace*sf,0-polygons[0][0].Y*gridSpace*sf,sf,0,Math.PI*2)
		ctx.fill()
	}

	//start end point
	ctx.lineWidth=0.4*sf
	ctx.strokeStyle='#333'
	if(lines.length==0){

	}
	else if(lines[lines.length-1].length>2){
		ctx.fillStyle='#ff0000'
	}
	else{
		ctx.fillStyle='#00ff00'
	}

	if(lines.length>0){
		ctx.beginPath()
		ctx.arc(point[0]*sf*gridSpace,0-point[1]*sf*gridSpace,3*sf,0,Math.PI*2)
		ctx.fill()
		ctx.stroke()
	}

	//
	//pockets

	if(pockets.length>0){
		ctx.lineWidth=0.4*sf
		ctx.strokeStyle='#0000ff'
		for(i=0;i<pockets.length;i++){
			for(j=0;j<pockets[i].length;j++){
				ctx.beginPath()
				for(k=0;k<pockets[i][j].length;k++){
					ctx.lineTo(pockets[i][j][k].X*gridSpace*sf,0-(pockets[i][j][k].Y*gridSpace*sf))
				}
				ctx.lineTo(pockets[i][j][0].X*gridSpace*sf,0-(pockets[i][j][0].Y*gridSpace*sf))
				ctx.stroke()
			}
		}
	}

	//cutout

	if(cutout.length>0){
		ctx.lineWidth=0.4*sf
		ctx.strokeStyle='#0000ff'
		for(i=0;i<cutout.length;i++){
			ctx.beginPath()
			for(j=0;j<cutout[i].length;j++){
				ctx.lineTo(cutout[i][j].X*gridSpace*sf,0-(cutout[i][j].Y*gridSpace*sf))
			}
			ctx.lineTo(cutout[i][0].X*gridSpace*sf,0-(cutout[i][0].Y*gridSpace*sf))
			ctx.stroke()
		}
	}



	//cursor
	ctx.lineWidth = 1
	ctx.fillStyle='#fff'
	ctx.beginPath()

	ctx.strokeStyle='#333'
	ctx.moveTo(mouseX,mouseY-(gridSpace/4*sf))
	ctx.lineTo(mouseX,mouseY+(gridSpace/4*sf))
	ctx.moveTo(mouseX-(gridSpace/4*sf),mouseY)
	ctx.lineTo(mouseX+(gridSpace/4*sf),mouseY)
	ctx.stroke()

	ctx.beginPath()
	ctx.strokeStyle='#333'
	ctx.moveTo(mouseX,mouseY)
	ctx.arc(mouseX,mouseY,1*sf,0,Math.PI*2)
	
	if(lines.length>0){
		if(lines[lines.length-1].length==2){
			ctx.moveTo(point[0]*sf*gridSpace,0-point[1]*sf*gridSpace)
			ctx.arc(point[0]*sf*gridSpace,0-point[1]*sf*gridSpace,1*sf,0,Math.PI*2)
			ctx.moveTo(point[0]*sf*gridSpace,0-point[1]*sf*gridSpace)
			ctx.lineTo(mouseX,mouseY)
		}
	}
	ctx.stroke()
	ctx.fill()

	ctx.lineWidth=1.1*sf
	ctx.strokeStyle='#333'
	for(i=0;i<fillets.length;i++){
				
		ctx.beginPath()

		for(j=0;j<fillets[i].length;j++){
			//ctx.lineTo(fillets[i][j].X*gridSpace*sf,0-fillets[i][j].Y*gridSpace*sf)
		}
		//ctx.lineTo(fillets[i][0].X*gridSpace*sf,0-fillets[i][0].Y*gridSpace*sf)
		ctx.stroke()
	}

	/*
	ctx.fillStyle='#ff0000'
	for(i=0;i<filletIn.length;i++){
		ctx.beginPath()
		ctx.arc(filletIn[i].X*gridSpace*sf,0-filletIn[i].Y*gridSpace*sf,sf,0,Math.PI*2)
		ctx.fill()
	}
	ctx.fillStyle='#0000ff'
	for(i=0;i<filletOut.length;i++){
		ctx.beginPath()
		ctx.arc(filletOut[i].X*gridSpace*sf,0-filletOut[i].Y*gridSpace*sf,sf,0,Math.PI*2)
		ctx.fill()
	}
	*/


}
