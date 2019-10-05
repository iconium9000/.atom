// Generated by Haxe 4.0.0-preview.4
(function ($hx_exports) { "use strict";
var $hxEnums = {};
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}var Clock = function() { };
Clock.__name__ = true;
Clock.activate = $hx_exports["activate"] = function(state) {
	console.log("src/Clock.hx:25:","Atom-clock " + Std.string(state));
	Clock.disposables = new atom_CompositeDisposable();
	Clock.view = new DigitalClockView();
	if(state == null || state.enabled == null || state.enabled) {
		Clock.enable();
	} else {
		Clock.disable();
	}
};
Clock.serialize = $hx_exports["serialize"] = function() {
	return { enabled : Clock.enabled};
};
Clock.deactivate = $hx_exports["deactivate"] = function() {
	window.cancelAnimationFrame(Clock.animationFrameId);
	Clock.view.destroy();
	Clock.disposables.dispose();
};
Clock.enable = function() {
	if(Clock.enabled) {
		return;
	}
	Clock.enabled = true;
	if(Clock.commandEnable != null) {
		Clock.commandEnable.dispose();
	}
	Clock.disposables.add(Clock.commandDisable = atom.commands.add("atom-workspace","clock:hide",function(_) {
		Clock.disable();
	}));
	Clock.animationFrameId = window.requestAnimationFrame(Clock.update);
	Clock.view.show();
};
Clock.disable = function() {
	if(!Clock.enabled) {
		return;
	}
	Clock.enabled = false;
	window.cancelAnimationFrame(Clock.animationFrameId);
	if(Clock.commandDisable != null) {
		Clock.commandDisable.dispose();
	}
	Clock.disposables.add(Clock.commandEnable = atom.commands.add("atom-workspace","clock:show",function(_) {
		Clock.enable();
	}));
	Clock.view.hide();
};
Clock.update = function(time) {
	Clock.animationFrameId = window.requestAnimationFrame(Clock.update);
	Clock.view.setTime();
};
Clock.consumeStatusBar = $hx_exports["consumeStatusBar"] = function(bar) {
	bar.addRightTile({ item : Clock.view.element, priority : -100});
};
var ClockView = function() {
	this.element = window.document.createElement("time");
	this.element.classList.add("status-bar-clock","inline-block");
	this.showSeconds = atom.config.get("clock.seconds");
	this.configChangeListener = atom.config.onDidChange("clock",{ },$bind(this,this.handleConfigChange));
};
ClockView.__name__ = true;
ClockView.prototype = {
	show: function() {
		this.element.style.display = "inline-block";
	}
	,hide: function() {
		this.element.style.display = "none";
	}
	,destroy: function() {
		this.configChangeListener.dispose();
		this.element.remove();
	}
	,setTime: function(time) {
	}
	,handleConfigChange: function(e) {
	}
};
var DateTools = function() { };
DateTools.__name__ = true;
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "A":
		return DateTools.DAY_NAMES[d.getDay()];
	case "B":
		return DateTools.MONTH_NAMES[d.getMonth()];
	case "C":
		return StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "F":
		return DateTools.__format(d,"%Y-%m-%d");
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0 ? 12 : hour),e == "I" ? "0" : " ",2);
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "Y":
		return Std.string(d.getFullYear());
	case "a":
		return DateTools.DAY_SHORT_NAMES[d.getDay()];
	case "b":case "h":
		return DateTools.MONTH_SHORT_NAMES[d.getMonth()];
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "e":
		return Std.string(d.getDate());
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H" ? "0" : " ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) {
			return "PM";
		} else {
			return "AM";
		}
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "s":
		return Std.string(d.getTime() / 1000 | 0);
	case "t":
		return "\t";
	case "u":
		var t = d.getDay();
		if(t == 0) {
			return "7";
		} else if(t == null) {
			return "null";
		} else {
			return "" + t;
		}
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	default:
		throw new js__$Boot_HaxeError("Date.format %" + e + "- not implemented yet.");
	}
};
DateTools.__format = function(d,f) {
	var r_b = "";
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) {
			break;
		}
		var len = np - p;
		r_b += len == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len);
		r_b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	var len1 = f.length - p;
	r_b += len1 == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len1);
	return r_b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
var DigitalClockView = function() {
	ClockView.call(this);
	this.showSeconds = atom.config.get("clock.seconds");
	this.format24 = atom.config.get("clock.format");
	this.amPmSuffix = atom.config.get("clock.am_pm_suffix");
	this.setShowIcon(atom.config.get("clock.icon"));
	this.element.addEventListener("mouseover",$bind(this,this.handleMouseOver),false);
	this.element.addEventListener("mouseout",$bind(this,this.handleMouseOut),false);
	this.contextMenu = atom.contextMenu.add({ ".status-bar-clock" : [{ label : "Hide", command : "clock:hide"}]});
};
DigitalClockView.__name__ = true;
DigitalClockView.__super__ = ClockView;
DigitalClockView.prototype = $extend(ClockView.prototype,{
	formatTimeString: function(time) {
		var strf = "";
		var str = "";
		if(this.format24) {
			strf = "%H:%M";
			if(this.showSeconds) {
				strf += ":%S";
			}
		} else {
			strf = "%I:%M";
			if(this.showSeconds) {
				strf += ":%S";
			}
			if(this.amPmSuffix) {
				strf += " %p";
			}
		}
		try {
			str = DateTools.format(time,strf);
		} catch( e ) {
			return (e instanceof js__$Boot_HaxeError) ? e.val : e;
		}
		return str;
	}
	,setTime: function(time) {
		if(time == null) {
			time = new Date();
		}
		var dateTime = HxOverrides.dateStr(time);
		this.element.dateTime = dateTime;
		this.element.textContent = this.formatTimeString(time);
	}
	,destroy: function() {
		ClockView.prototype.destroy.call(this);
		this.element.removeEventListener("mouseover",$bind(this,this.handleMouseOver));
		this.element.removeEventListener("mouseout",$bind(this,this.handleMouseOut));
		if(this.tooltip != null) {
			this.tooltip.dispose();
		}
		this.contextMenu.dispose();
	}
	,setShowIcon: function(show) {
		if(show) {
			this.element.classList.add("icon-clock");
		} else {
			this.element.classList.remove("icon-clock");
		}
	}
	,handleConfigChange: function(e) {
		var nv = e.newValue;
		this.showSeconds = nv.seconds;
		this.format24 = nv.format;
		this.amPmSuffix = nv.am_pm_suffix;
		this.setShowIcon(nv.icon);
		this.setTime();
	}
	,handleMouseOver: function(e) {
		if(this.tooltip != null) {
			this.tooltip.dispose();
		}
		var now = new Date();
		var str = DateTools.format(now,"%A %Y-%m-%d");
		var html = "<div>" + str + "</div>";
		this.tooltip = atom.tooltips.add(this.element,{ title : "<div>" + html + "</div>", delay : 250, html : true});
	}
	,handleMouseOut: function(e) {
		this.tooltip.dispose();
	}
});
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d["setTime"](0);
		d["setUTCHours"](k[0]);
		d["setUTCMinutes"](k[1]);
		d["setUTCSeconds"](k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	while(s.length < l) s = c + s;
	return s;
};
var atom_CompositeDisposable = require("atom").CompositeDisposable;
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var n = e.__constructs__[o._hx_index];
			var con = e[n];
			if(con.__params__) {
				s += "\t";
				var tmp = n + "(";
				var _g = [];
				var _g1 = 0;
				var _g2 = con.__params__;
				while(_g1 < _g2.length) {
					var p = _g2[_g1];
					++_g1;
					_g.push(js_Boot.__string_rec(o[p],s));
				}
				return tmp + _g.join(",") + ")";
			} else {
				return n;
			}
		}
		if((o instanceof Array)) {
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g11 = 0;
			var _g3 = l;
			while(_g11 < _g3) {
				var i1 = _g11++;
				str += (i1 > 0 ? "," : "") + js_Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e1 ) {
			var e2 = (e1 instanceof js__$Boot_HaxeError) ? e1.val : e1;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str1 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str1.length != 2) {
			str1 += ", \n";
		}
		str1 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str1 += "\n" + s + "}";
		return str1;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = "Date";
Object.defineProperty(js__$Boot_HaxeError.prototype,"message",{ get : function() {
	return String(this.val);
}});
DateTools.DAY_SHORT_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
DateTools.DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
DateTools.MONTH_SHORT_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
DateTools.MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this);
