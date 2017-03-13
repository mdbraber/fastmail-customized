console.log("Userscript loaded: Reorder searches")

document.addEventListener('load', function(e) {
  /* Filter out load events not related to the document */
  //if(['style','script'].indexOf(e.target.tagName.toLowerCase()) < 0) {
  //  console.log(e.target + ' / document loaded'); // DOES NOT HAPPEN
  //  console.log('Document loaded'); // DOES NOT HAPPEN

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

//}

}, true);
