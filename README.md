#FabMo CAD

##Overview
FabMo CAD is a web app for drawing simple shapes in a browser and creating toolpaths for ShopBot tools and other 3 axis CNC routers that run standard Gcode.  
[LIVE DEMO](http://gofabmo.org/fabmo-cad-app) 

##Examples

###Drawing with Commands

```
rect0,0,1 + 'enter' (draw 1" square at 0,0)
dogbone + 'enter' (create dogbone fillets)
pocket + 'enter' (create pocket toolpath)
makeg + 'enter' (download gcode or 'makesbp' to download the ShopBot program file)
```

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad1.png)

###Simple Press-Fit Joint

This project is for cutting plywood with a material thickness slightly less than 1/4" (~0.248"). 

```
rect0,0,1,0.75
rect0.25,0.25,0.5,0.25
line0,1.25,0,1.5
line1,1.5
line1,1.25
line0.748,1.25
line0.748,1
line0.252,1
line0.252,1.25
dogbone=1
fillet
cutdepth=0.26 (default = 0.05")
cutout
makesbp (or makeg for Gcode)
```

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad2.png)  

default tool diameter: 0.125"  
default fillet radius: tool radius  
default feedrate: 0.5 inch/sec  
default plungerate: 0.2 inch/sec  

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/preview2.png)  

[shopbottools.com](http://shopbottools.com)


