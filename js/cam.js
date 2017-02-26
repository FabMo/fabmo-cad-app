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

	t = Math.floor((tool/2*grid) * scale)

	if(out==true){
		co.Execute(cutout,(t))
	}
	else if(out==false){
		co.Execute(cutout,-(t))
	}

	ClipperLib.JS.ScaleDownPaths(cutout, scale)

	cutout.reverse()


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

	t = Math.floor((tool/2*grid) * scale)

	pockets=[]
	o=1
	while(o>0){
		offset = new ClipperLib.Paths()

		co.Execute(offset,-(t*o))

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

