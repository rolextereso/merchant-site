function addEvent ( obj, type, fn ) {
	if ( obj.attachEvent ) {
			obj["e"+type+fn] = fn;
			obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
			obj.attachEvent( "on"+type, obj[type+fn] );
	} else
		obj.addEventListener( type, fn, false );
}

function removeEvent ( obj, type, fn ) {
	if ( obj.detachEvent ) {
			obj.detachEvent( "on"+type, obj[type+fn] );
			obj[type+fn] = null;
	} else
			obj.removeEventListener( type, fn, false );
}

Function.prototype.bind = function(obj) {
		var _method = this;
		return function() {
				return _method.apply(obj, arguments);
		};    
}	

//constructor
function drag(id) {
		this.id = "id";
		this.direction = "xy";

}

var tdBottom=0;

drag.prototype = { 

	init:function(settings) {
							    
		for(var i in settings){
			this[i] = settings[i];
			for(var j in settings[i]){
				//if (typeof(this[i][j])=="undefined")
				this[i][j]=settings[i][j];						    		               		    
			}				
		}
		
		this.elem = (this.id.tagName==undefined) ? document.getElementById(this.id) : this.id;
		//this.elem = document.getElementById(this.id);	
		this.container = this.elem.parentNode;	
		this.elem.onmousedown = this._mouseDown.bind(this);			 
	},
	
	_mouseDown: function(e) {
		e = e || window.event;
		this.elem.onselectstart=function(){return false};
								
		this._event_docMouseMove = this._docMouseMove.bind(this);		
		this._event_docMouseUp = this._docMouseUp.bind(this);	
			
	    if (this.onstart) this.onstart();
		this.x = e.clientX||e.PageX;
		this.y = e.clientY||e.PageY;
		
		this.left = parseInt(getstyle(this.elem, "left"));
        this.top = parseInt(getstyle(this.elem, "top"));
        
        addEvent(document, 'mousemove', this._event_docMouseMove);	
 		addEvent(document, 'mouseup', this._event_docMouseUp);
        
        return false;	
    },
	_docMouseMove: function(e) {
	    
		this.setValuesClick(e);	   
		if (this.ondrag) this.ondrag();

	
	},

	_docMouseUp: function(e) {
		 removeEvent(document, 'mousemove', this._event_docMouseMove);
		if (this.onstop) this.onstop();

		removeEvent(document, 'mouseup', this._event_docMouseUp);
	                    
	},

	setValuesClick: function(e){ 
	        this.mouseX = e.clientX||e.PageX;
	        this.mouseY = e.clientY||e.pageY;		    
		    
		    this.Y = this.top + this.mouseY - this.y;
		    this.Y = limit(this.Y,this.limit.y[0],this.limit.y[1]);
		    this.elem.style.top = (this.Y) +"px";
		    
		    if (this.direction=="xy") {
			    this.X = this.left+ this.mouseX - this.x;	    
			   // this.X = limit(this.X,this.limit.x[0],this.limit.x[1]);	
			    this.elem.style.left = this.X+"px";
			    this.container.style.width = (this.X + 16) +"px";
			    this.container.style.height = (this.Y + 16) +"px";
		    }
		    else {		    
			    var drag=this.elem.getBoundingClientRect();//get the top position of the drag handle
				var elem = document.elementFromPoint((drag.left-5), (drag.top+5));//this will point the td element
			
				if(elem.nodeName==='TD'){

					var  elemBottom=elem.getBoundingClientRect();
					     tdBottom=elemBottom.bottom;

					     if(tdBottom == elemBottom.bottom){
					         	//this.container.style.height = ((this.Y+5)+elemBottom.height) +"px";
					         	 	 var he=this.container.style.height;
    							var a=(he.replace('px','')) || 0;
    							
					         	this.container.style.height = (a+elemBottom.height) +"px";
					     }
					

					     ///console.log(elemBottom.height, ' ', this.Y,' ', he.replace('px',''));
				}
			}		

			//console.log("DragElement Left: ",drag.left," dragElement-Top:  ", drag.top);
			//console.log(elementMouseIsOver.nodeName);
			//console.log(this.elem);
	}

}


function limit(val, mn, mx) {
		return Math.min(Math.max(val, Math.min(mn, mx)), Math.max(mn, mx));
}

function getstyle(elem, prop) {
		if(document.defaultView)
		{
			return document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop);
		}
		else if(elem.currentStyle)
		{
			var prop = prop.replace(/-(\w)/gi, function($0,$1)
			{
				//return $0.charAt($0.length - 1).toUpperCase();
				return $1.toUpperCase();
			});
			return elem.currentStyle[prop];
		}
		else return null;
}