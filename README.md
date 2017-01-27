#FabMo CAD

##Overview
FabMo CAD is a web app for drawing simple shapes in a browser and creating cut files for ShopBot tools and other 3 axis CNC routers that run standard G-code.   
[LIVE DEMO](http://gofabmo.org/fabmo-cad-app)  

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/crab_cad.png)

##Download
[FabMo APP](https://github.com/FabMo/fabmo-cad-app/releases/download/v0.1.5/CAD_v0.1.5.fma)

##Examples

###Drawing with Commands

Enter these commands in the text area to draw and toolpath a simple pocket.


`rect0,0,1` (draw a 1" square at 0,0)  
`dogbone` (create dogbone fillets)  
`pocket` (create pocket toolpath)  
`makeg` (download gcode file or `makesbp` to download the ShopBot program)  


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

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad2.png)  

###Macros

The `macro` command will show/hide the macro text area.  
Copy and paste the commands below into the macro text area and then click the 'run' button or use the `runmacro` command.  

```
circle2,2,1.5
circle1.3,2.5,0.25
circle2.7,2.5,0.25
arc2,2,1,90,270
cutout
```

####Toolpath Commands

`cutin` (cut in toolpath)  
`cutout` (cut out toolpath)  
`drillx,y` (drill @ x,y)  
`pocket` (pocket toolpath)  

####Make Commands

`makesbp` (download ShopBot program)  
`makeg` (download gcode)  
`makedxf` (download dxf)  

###Drill Points

A click on the same point twice or the `drillx,y` command will insert a drill point.  

![cad](https://raw.github.com/FabMo/fabmo-cad-app/master/img/cad4.png)  

###Dimensions & Units

The `dim` command will show/hide drawing dimensions.  
The default units are inches and degrees. The length unit can be changed to millimeter by entering this command: `unit=mm`  The grid space can be set with the command `grid=2` to change the grid space to 2mm.  


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

The `settings` command will show current settings.  

##Commands

The `help` or `?` command will show all commands.  

###Drawing


####shapes

`arc'x','y','r','a1','a2'`  
`circle'x','y','r'`  
`drill'x','y'`  
`ellipse'x','y','rx','ry'`  
`heart 'x','y','r'`  
`line 'x1','y1','x2','y2'`   
`line 'x2','y2'`  
`polygon 'x','y','r','n'`   
`rect'x','y','lx','ly'`  
`star'x','y','r'`  

####features

`chamfer` toggle chamfer=(true/false)  
`dogbone` make dog-bone fillets  
`fillet` toggle fillet=(true/false)  

####transforms

`move'x','y'` translate all  
`movelast'x','y'` translate last shape/line  
`rotate'a'` rotate last shape/line  

###Settings

`cutdepth='z'`  
`dogbone= '1','-1'or'0'` (0=none)  
`feedrate='cut (xy) velocity'` (inch/sec)  
`grid='grid space'`'  
`name='filename'`  
`output='dxf','gcode' or 'sbp'`  
`passdepth='z' or '-1'` (default='-1' for tool diameter)  
`plungerate='plunge (-z) velocity'` (inch/sec)  
`rectmode='center'or'lower-left'`  
`stock='xl','yl'`  
`tool='diameter'` (inch)  
`unit='length unit` ('inch' or 'mm')  

###Tools

`calc` evaluate (e.g. `calc5/25.4`)  
`clear` new drawing  
`cutin` offset toolpath inside  
`cutout` offset toolpath to cut out  
`dim` toggle dimensions  
`g,'gcode'` run gcode (eg `g,g0x0y0`  
`macro` show macro text area  
`make` download cut file  
`makedxf` download dxf  
`makeg` download gcode  
`makesbp` download sbp  
`pocket` pocket toolpath  
`sbp,'sbp'` run sbp command (e.g. `sbp,JZ,0.5`)  
`settings` show current settings  

