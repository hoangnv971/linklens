const statusEl = document.querySelector('[name="app_status"]');
const app = {};
chrome.storage.sync.get('app', function(data) {
    if (data.app.status) {
        statusEl.checked = true;
    } else {
        statusEl.checked = false;
    }
});

statusEl.addEventListener('change', function(){
    app.status = this.checked;
    chrome.storage.sync.set({'app': app})
})
