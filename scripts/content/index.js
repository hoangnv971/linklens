const WINDOW_STYLE = {
    position: 'fixed',
    zIndex: '9999999',
    border: '2px solid #ccc',
    width: '300px',
    height: '200px',
    background: '#fff'
};

let popup = null;

document.addEventListener('mouseover', function(event) {
	const target = event.target;
    chrome.storage.sync.get("app", (data) => {
        if (!data.app.status) return;
        if (!isValidUrl(target.href)) return;
				
        if (target.tagName === 'A' && target.hasAttribute('href')) {
            createOrUpdatePopup(target);
            document.addEventListener('mousemove', positionPopup);
        } else if (popup && !popup.contains(target)) {
            removePopup();
        }
    });
});

function createOrUpdatePopup(target) {
    if (!popup) {
        popup = document.createElement('iframe');
        Object.entries(WINDOW_STYLE).forEach(([prop, value]) => {
            popup.style[prop] = value;
        });
        document.body.appendChild(popup);
    }
    popup.src = target.href;
}

function removePopup() {
    document.removeEventListener('mousemove', positionPopup);
    popup.remove();
    popup = null;
}

function isValidUrl(url) {
    try {
        const parsedUrl = new URL(url); 
        
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return false;
        }

        if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') {
            return false;
        }

        if (url.startsWith('javascript:') || url === 'javascript:void(0);') {
            return false;
        }

        return true;
    } catch (e) {
        return false;  
    }
}
function positionPopup(event) {
    if (!popup) return;

    const rect = event.target.getBoundingClientRect();
    popup.style.top = `${rect.top - 5}px`;
    popup.style.left = `${rect.right - 30}px`;
}
