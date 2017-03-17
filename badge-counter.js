// Fastmail app icon: http://than.to/1iMcu
setInterval(updateDockBadge, 3000);

function updateDockBadge() {
    	var count = document.querySelector('.v-FolderSource--inbox > .v-FolderSource-badge').textContent
    	if ( count === '0' ) {
            window.fluid.dockBadge = '';
    	} else {
            window.fluid.dockBadge = count;	
    	}
}
