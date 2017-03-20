//use strict;
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
        FastMail.mail.screenController.addObserverForKey("mailboxTitle",window,"updateMailbox");

    });

    if (FastMail.keyboardShortcuts._shortcuts.y !== undefined) {
         
        // save the object of 'y'-shortcut as the archiveKey
        window._archiveKey = FastMail.keyboardShortcuts._shortcuts.y;
        // adjust the shortcut key for archive
        window._archiveKey[0][0].shortcut = "e";
        // save the object of 'e'-shortcut as the expandKey
        //var expandKey = FastMail.keyboardShortcuts._shortcuts.e;
        // adjust the shortcut key for expand
        //expandKey[0][0].shortcut = "y";
        
        // deregister the 'y'=shortcut
        FastMail.keyboardShortcuts.deregister("y",FastMail.keyboardShortcuts._shortcuts.y[0][0],FastMail.keyboardShortcuts._shortcuts.y[0][1]);
        // if 'e'-shortcut is already defined, remove it
        if(FastMail.keyboardShortcuts._shortcuts.e !== undefined) {
            FastMail.keyboardShortcuts.deregister("e",FastMail.keyboardShortcuts._shortcuts.e[0][0],FastMail.keyboardShortcuts._shortcuts.e[0][1]);
        }
        // register the new archive shortcut
        FastMail.keyboardShortcuts.register("e",window._archiveKey[0][0],window._archiveKey[0][1]);
        // register the new expand shortcut
        //FastMail.keyboardShortcuts.register("y",expandKey[0][0],expandKey[0][1]);
        
        // Prevent external links from opening another window (Fastmail users a script to check for MSIE bug?)
        O.WindowController.openExternal = function(i){open(i,"_blank");}
        
    }

    // Insert the mailbox name after the "selectAll" button (because we're not showing the sidebar)
    document.getElementById("selectAll").insertAdjacentHTML('afterend','<span id="mailboxName">'+document.querySelector('.app-source.app-source--depth0.is-selected span').innerText+'</span>');

    // Remove the placeholder in search (it overlaps w/ saved searches when we quick-switch)
    document.querySelector("#v6 input").placeholder = ""

    // register observer for badge count changes
    // FIXME: this can probably also been done more nice on the Fastmail object?
    // folder: Inbox
    window.createObserver(document.querySelector(".v-FolderSource--inbox > .v-FolderSource-badge"));
    // folder: +Later
    window.createObserver(document.querySelector("#v104 span.v-FolderSource-badge"));
    // folder: +News
    window.createObserver(document.querySelector("#v105 span.v-FolderSource-badge"));
        
    // only display "All mail" and "Unread" in the filter selector
    // (I'm using different folders for Mailinglists and Notifications)
    FastMail.views.mailbox.childViews[0].redraw();

    // Update the mailbox title
    window.updateMailbox(null,null,FastMail.mail.screenController.mailboxTitle,FastMail.mail.screenController.mailboxTitle);

}

window.updateMailbox = function updateMailbox(obj,key,oldValue,newValue) {

    var totalUnread = 0;
    var totalUnreadString = "";
    // Get count for Inbox
    var inboxUnread = parseInt(document.querySelector('.v-FolderSource--inbox span.v-FolderSource-badge').textContent);
    //console.log("inboxUnread: "+inboxUnread);
    // Get count for others (+Later and +News)
    var otherUnread = parseInt(document.querySelector('#v104 span.v-FolderSource-badge').textContent) + parseInt(document.querySelector('#v105 span.v-FolderSource-badge').textContent);
    //console.log("otherUnread: "+otherUnread);
    // Use an asterisk when there are unread mails in other folders
    if(inboxUnread || otherUnread > 0) {
        totalUnread = inboxUnread + otherUnread;
        totalUnreadString = "*";
    }

    // Show the mailbox name first and then number of unread messages - like "Inbox (1)"
    var regex = /\((\d*)\)\s(.*)/;
    // Write the mailbox name and counts
    document.getElementById("mailboxName").innerHTML = newValue.replace(regex, "$2 ($1)");
    // Append totalUnreadString
    var thisUnread = parseInt(newValue.replace(regex, "$1")) || 0;
    //console.log("newValue: "+newValue+" / totalUnread: "+totalUnread+" / thisUnread:"+thisUnread);
    if(totalUnread > thisUnread) {
        document.getElementById("mailboxName").innerHTML += totalUnreadString;
    }

/*
    // Save the Archive-shortcut for reference when registering/dergistering
    if(window._e == undefined && FastMail.keyboardShortcuts._shortcuts.e !== undefined) {
        window._e = FastMail.keyboardShortcuts._shortcuts.e;
    } else {
        console.log("ERROR: lost the Archive-shortcut object");
        console.log("window._e: "+window._e.toString());
        console.log("FastMail.keyboardShortcuts._shortcuts.e: "+FastMail.keyboardShortcuts._shortcuts.e);
    }
*/

    if(newValue.contains("Inbox")) {
        // Show the Archive-button
        document.querySelector("#v12").style.display="";
        document.querySelector("#v12 + span").style.display="";
        // Register the Archive-shortcut
        FastMail.keyboardShortcuts.register("e",window._archiveKey[0][0],window._archiveKey[0][1]);
    } else {
        // Hide the Archive-button
        document.querySelector("#v12").style.display="none";
        document.querySelector("#v12 + span").style.display="none";
        // Deregister the Archive-shortcut
        FastMail.keyboardShortcuts.deregister("e",window._archiveKey[0][0],window._archiveKey[0][1]);
    }

};

// mutation observer
window.createObserver = function createObserver(t) {
    var observer = new MutationObserver(function(mutations) {
        //mutations.forEach(function(mutation) { 
            //console.log("observed / "+t.toString());
            window.updateMailbox(null,null,FastMail.mail.screenController.mailboxTitle,FastMail.mail.screenController.mailboxTitle);
        //});
    });    
    observer.observe(t, {attributes: false, childList: true, characterData: true});
};


// there is no good domloaded support in Fluid so we need a timer until ready
var _timer = setInterval(function() {
  if (/loaded|complete/.test(document.readyState)) {
    init(); // call the onload handler
  }
}, 500);
