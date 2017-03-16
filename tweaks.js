// It's hacky-to-the-max but works in Fluid!
console.log("Running Fastmail Tweaks");
var ready = false;

function init() {

  // quit if this function has already been called
  if (!document.getElementById("mail") || ready) return;

  // flag this function so we don't do the same thing twice
  ready = true;

  // kill the timer
  if (_timer) clearInterval(_timer);

  console.log("Called init handler")

  console.log("e" + FastMail.keyboardShortcuts._shortcuts.e)
  O.require( 'base', function () {
    FastMail.SavedSearch.implement({ precedence: 1 }, true );
  });

  setTimeout(function(){ FastMail.keyboardShortcuts._shortcuts.e=FastMail.keyboardShortcuts._shortcuts.y }, 2000);
  document.getElementById("v12").accessKey = "e";

};

var _timer = setInterval(function() {
  if (/loaded|complete/.test(document.readyState)) {
    init(); // call the onload handler
  }
}, 500);
