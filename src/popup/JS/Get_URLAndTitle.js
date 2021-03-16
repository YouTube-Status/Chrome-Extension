const run = () => {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
        let url = tabs[0].url;
        document.querySelector('#url').value = url;

    });
}


//ページはが読み込まれたら実行する(はずたぶんおそらくきっと)
window.addEventListener('load', () => {
    run();
})