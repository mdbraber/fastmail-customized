var ready = false;

function init() {

    // quit if this function has already been called
    if (!document.getElementById("mail") || !document.getElementById("selectAll") || ready) { return; }

    // flag this function so we don't do the same thing twice
    ready = true;

    // kill the timer
    if (_timer) { clearInterval(_timer); }

    O.require( 'base', function () {
        // order SavedSearch on top (directly below Inbox)
        FastMail.SavedSearch.implement({ precedence: 1 }, true );

        // remap the 'e' key in threadView to 'y'
        FastMail.mail.threadViewController.keys.y = FastMail.mail.threadViewController.keys.e;

        // remove the 'e' shortcut in threadView (we need that to attach the archive shortcut,
        // otherwise it will attach it again when switching views
        // this way it seems also 'e' gets remapped to 'y' in thread view
        delete FastMail.mail.threadViewController.keys.e;
        
        // Add the filter to the reading pane message list
        FastMail.views.mailbox.childViews[0].registerConfig("short",{left: ["selectAll","filter","pin"]});
       
        // register observer to update the mailboxName
        FastMail.mail.screenController.addObserverForKey("mailboxTitle",window,"switchMailbox");

        // Save the 'e' shortcut object 
        window._e = FastMail.keyboardShortcuts._shortcuts.e;
    });

    if (FastMail.keyboardShortcuts._shortcuts.y != undefined) {
         
        // save the object of 'y'-shortcut as the archiveKey
        var archiveKey = FastMail.keyboardShortcuts._shortcuts.y;
        // adjust the shortcut key for archive
        archiveKey[0][0].shortcut = "e";
        // save the object of 'e'-shortcut as the expandKey
        //var expandKey = FastMail.keyboardShortcuts._shortcuts.e;
        // adjust the shortcut key for expand
        //expandKey[0][0].shortcut = "y";
        
        // deregister the 'y'=shortcut
        FastMail.keyboardShortcuts.deregister("y",FastMail.keyboardShortcuts._shortcuts.y[0][0],FastMail.keyboardShortcuts._shortcuts.y[0][1]);
        // if 'e'-shortcut is already defined, remove it
        if(FastMail.keyboardShortcuts._shortcuts.e != undefined) {
            FastMail.keyboardShortcuts.deregister("e",FastMail.keyboardShortcuts._shortcuts.e[0][0],FastMail.keyboardShortcuts._shortcuts.e[0][1]);
        }
        // register the new archive shortcut
        FastMail.keyboardShortcuts.register("e",archiveKey[0][0],archiveKey[0][1]);
        // register the new expand shortcut
        //FastMail.keyboardShortcuts.register("y",expandKey[0][0],expandKey[0][1]);
        
        // Prevent external links from opening another window (Fastmail users a script to check for MSIE bug?)
        O.WindowController.openExternal = function(i){open(i,"_blank");}
        
    }

    // only display "All mail" and "Unread" in the filter selector
    // (I'm using different folders for Mailinglists and Notifications)
    FastMail.views.mailbox.childViews[0].redraw();

    // Insert the mailbox name after the "selectAll" button (because we're not showing the sidebar)
    document.getElementById("selectAll").insertAdjacentHTML('afterend','<span id="mailboxName">'+document.querySelector('.app-source.app-source--depth0.is-selected span').innerText+'</span>');

    // Remove the placeholder in search (it overlaps w/ saved searches when we quick-switch)
    document.querySelector("#v6 input").placeholder = ""
    
    // skip - we do this in CSS
    //if (document.getElementById("FilterSelector") != undefined) {
    //    var filterElements = document.getElementById("FilterSelector").getElementsByClassName("v-PushSelect-option");
    //    for (i = filterElements.length - 1 ; i > 1; i--) {
    //        console.log(i + " " + filterElements[i]);
    //        elem = filterElements[i];
    //        elem.remove();
    //    }
    //}


};

window.switchMailbox = function updateMailboxName(obj,key,oldValue,newValue) {

    console.log(oldValue + "/" + newValue);

    regex = /\((\d*)\) (.*)/;
    document.getElementById("mailboxName").innerHTML = newValue.replace(regex, "$2 ($1)");

    if(!window._e) {
        window._e = FastMail.keyboardShortcuts._shortcuts.e;
    }

    if(newValue.contains("Inbox")) {
        document.querySelector("#v12").style.display="";
        document.querySelector("#v12 + span").style.display="";
        //if(FastMail.keyboardShortcuts._shortcuts.e != undefined) {
            console.log("register e");
            FastMail.keyboardShortcuts.register("e",window._e[0][0],window._e[0][1]);
        //}
    } else {
        document.querySelector("#v12").style.display="none";
        document.querySelector("#v12 + span").style.display="none";
        //if(FastMail.keyboardShortcuts._shortcuts.e == undefined) {
            console.log("deregister e");
            FastMail.keyboardShortcuts.deregister("e",window._e[0][0],window._e[0][1]);
        //}
    }

}

// there is no good domloaded support in Fluid so we need a timer until ready
var _timer = setInterval(function() {
  if (/loaded|complete/.test(document.readyState)) {
    init(); // call the onload handler
  }
}, 500);
