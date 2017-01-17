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

		//1" lines
		ctx.lineWidth = sf/9

		ctx.beginPath()
		for(i=1;i<=stock[0]/grid;i++){
			ctx.moveTo(i*gridSpace*sf*grid,0)
			ctx.lineTo(i*gridSpace*sf*grid,0-(stock[1]*gridSpace*sf))		
		}
		for(i=1;i<=stock[1]/grid;i++){
			ctx.moveTo(0,0-(i*gridSpace*sf*grid))
			ctx.lineTo(stock[0]*gridSpace*sf,0-(i*gridSpace*sf*grid))		
		}

		ctx.stroke()

		//axis lines
		ctx.lineWidth = sf/5
		ctx.strokeStyle='#aa0000'

		ctx.beginPath()
		ctx.moveTo(0,0)
		ctx.lineTo((stock[0])*gridSpace*sf,0)
		ctx.stroke()

		ctx.beginPath()
		ctx.strokeStyle='#00aa00'
		ctx.moveTo(0,0)
		ctx.lineTo(0,(0-stock[1])*gridSpace*sf)
		ctx.stroke()

		//dims

		stockX = ((stock[0])/grid).toFixed(2)+"\""
		stockY = ((stock[1])/grid).toFixed(2)+"\""

		ctx.beginPath()
		ctx.strokeStyle = '#333'
		ctx.moveTo(0,7)
		ctx.lineTo(0,15)
		ctx.lineTo(0,11)
		ctx.lineTo(((stock[0])*gridSpace*sf/2)-(ctx.measureText(stockX).width/2)-5,11)
		ctx.moveTo(((stock[0])*gridSpace*sf/2)+(ctx.measureText(stockX).width/2)+5,11)
		ctx.lineTo(((stock[0])*gridSpace*sf),11)
		ctx.moveTo(((stock[0])*gridSpace*sf),7)
		ctx.lineTo(((stock[0])*gridSpace*sf),15)

		ctx.moveTo(3-ctx.measureText(stockY).width/2,0)
		ctx.lineTo(-7-ctx.measureText(stockY).width/2,0)
		ctx.moveTo(-2-ctx.measureText(stockY).width/2,0)
		ctx.lineTo((-2-ctx.measureText(stockY).width/2),(((0-stock[1])*gridSpace*sf)/2)+10)
		ctx.moveTo((-2-ctx.measureText(stockY).width/2),(((0-stock[1])*gridSpace*sf)/2)-10)
		ctx.lineTo((-2-ctx.measureText(stockY).width/2),(((0-stock[1])*gridSpace*sf)))
		ctx.moveTo((3-ctx.measureText(stockY).width/2),(((0-stock[1])*gridSpace*sf)))
		ctx.lineTo((-7-ctx.measureText(stockY).width/2),(((0-stock[1])*gridSpace*sf)))
		ctx.stroke()


		ctx.fillStyle="#666"
		ctx.font = "12px Arial";
		ctx.fillText(stockX,((stock[0])*gridSpace*sf)/2-(ctx.measureText(stockX).width/2),15);

		ctx.fillText(stockY,0-(ctx.measureText(stockY).width)-4,4-((stock[1]*gridSpace*sf)/2));

	}

	ctx.beginPath()
	ctx.lineWidth = sf/3
	//ctx.strokeStyle="#333"
	ctx.fillStyle = '#333'
	ctx.arc(0,0,sf,0,Math.PI*2)
	ctx.fill()
	//ctx.stroke()

	//dogbones

	/*

	ctx.lineWidth = sf
	ctx.strokeStyle='#000'
	for(i=0;i<dogbones.length;i++){
		ctx.beginPath()
		for(j=0;j<dogbones[i].length;j++){			
			//ctx.lineTo((dogbones[i][j].X*gridSpace*sf),(0-dogbones[i][j].Y*gridSpace*sf))
		}
		ctx.stroke()	
	}

	ctx.lineWidth = sf
	ctx.strokeStyle='#ff0000'
	for(i=0;i<dogbonesIn.length;i++){
		ctx.beginPath()
		for(j=0;j<dogbonesIn[i].length;j++){			
			//ctx.lineTo((dogbonesIn[i][j].X*gridSpace*sf),(0-dogbonesIn[i][j].Y*gridSpace*sf))
		}
		ctx.stroke()	
	}

	*/

	//lines
	//ctx.setLineDash([2*sf, 3*sf])
	ctx.lineWidth=0.7*sf
	ctx.strokeStyle='#999'
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


	//Inside

	ctx.lineWidth=0.7*sf
	ctx.strokeStyle='#800080'
	for(i=0;i<insidePolygons.length;i++){

		ctx.beginPath()
		for(j=0;j<insidePolygons[i].length;j++){
			//console.log(polygons[i][j].X)
			ctx.lineTo(insidePolygons[i][j].X*gridSpace*sf,0-(insidePolygons[i][j].Y*gridSpace*sf))
		}
		//ctx.lineTo(insidePolygons[i][0].X*gridSpace*sf,0-(insidePolygons[i][0].Y*gridSpace*sf))
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
	


}
