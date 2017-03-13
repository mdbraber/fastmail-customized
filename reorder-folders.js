console.log("Userscript loaded: Reorder searches")
arguments.callee.done = false;

// Dean Edwards/Matthias Miller/John Resig

function init() {

  // quit if this function has already been called
  if (!document.getElementById('v26') || arguments.callee.done) return;

  // flag this function so we don't do the same thing twice
  arguments.callee.done = true;

  // kill the timer
  if (_timer) clearInterval(_timer);

  console.log("Called init handler")

    var folders=document.getElementById("v26").children;

    for(f=3;f<folders.length-2;f++) {
        pos=folders[f].style.transform;
        var regex=/translate3d\((\d+)px, (\d+)px, (\d+)px\)/;
        var height=pos.replace(regex,"$2");
            var regexh= new RegExp(height);
            console.log(height + ": " + pos.replace(regexh,parseInt(height)+50));
            folders[f].style.transform = pos.replace(regexh,parseInt(height)+50)
    };
    
    for(f=folders.length-2;f<folders.length;f++) {
        pos=folders[f].style.transform;
        var regex=/translate3d\((\d+)px, (\d+)px, (\d+)px\)/;
        var height=pos.replace(regex,"$2");
            var regexh= new RegExp(height);
            console.log(height + ": " + pos.replace(regexh,parseInt(height)-150));
            folders[f].style.transform = pos.replace(regexh,parseInt(height)-150)
    };

};

var _timer = setInterval(function() {
  if (/loaded|complete/.test(document.readyState)) {
    init(); // call the onload handler
  }
}, 500);
