#FabMo CAD

##Overview
FabMo CAD is a web app for drawing simple shapes in a browser and creating toolpaths for ShopBot tools and other 3 axis CNC routers that run standard Gcode.   
[LIVE DEMO](http://gofabmo.org/fabmo-cad-app)  

##Download
[FabMo app](https://github.com/FabMo/fabmo-cad-app/releases/download/v0.1.4/CAD_v0.1.4.fma)

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

This project is designed for machining plywood with a material thickness slightly less than 1/4" (~0.248") and using a 1/8" endmill to make a simple press fit joint. 

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
cutdepth=0.26
cutout
makeg
```

####Make Commands

makesbp (download ShopBot program)  
makeg (download gcode)  
makedxf (download dxf)  

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad2.png)  

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/preview2.png)  

###Macros

The 'macro' command will show/hide the macro text area.  
Copy and paste the commands below into the macro text area and then click the 'run' button.

```
circle2,2,1.5
circle1.3,2.5,0.25
circle2.7,2.5,0.25
arc2,2,1,100,260
cutout
```
![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad3.png)  

##Default Settings

tool diameter: 0.125"  
pass depth: tool diameter  
cut depth: 0.05"  
fillet radius: tool radius  
feedrate: 0.5 inch/sec  
plunge rate: 0.2 inch/sec  
unit: inch  
stock: 4" x 4"
grid: 0.25"

##Dimensions

The 'dim' command will show/hide drawing dimensions.

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad4.png)  

##Units

The default units are inches and degrees. The length unit can be changed to millimeter by typing the command 'unit=mm' + enter.  The grid space can be set with the command 'grid=2' to change the space to 2mm.  

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad5.png)  


[shopbottools.com](http://shopbottools.com)


