// Fastmail app icon: http://than.to/1iMcu
setInterval(updateDockBadge, 3000);

function updateDockBadge() {
	var count = document.getElementsByClassName('v-FolderSource-badge')[0].textContent;
	if ( count === '0' ) {
        window.fluid.dockBadge = '';
	} else {
        window.fluid.dockBadge = count;	
	}
}
