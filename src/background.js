const repeat_milliseconds = 5000;
const host_name = "youtube_status"

function ready() {
    // 接続
    try {
        port = chrome.runtime.connectNative(host_name);
        port.postMessage("Hello host");

        // テスト用　受信
        port.onMessage.addListener(function(message) {
            alert(message);
        });

        // 切断
        port.onDisconnect.addListener(function() {
            // 再接続
            port = chrome.runtime.connectNative(host_name);
            console.log("切断")
        });

    } catch(e) {
        // pass
    };

    setInterval(YouTube_Status, repeat_milliseconds);
};

function active_tab() {
    chrome.tabs.query({"active": true, "lastFocusedWindow": true}, tab => {
        if (tab.length != 1) {
            return;
        };

        url = tab[0].url;
        title = tab[0].title;
        
        if (url.startsWith("https://www.youtube.com/watch")) {
            title = title.replace(/^\([0-9]+\)/, "").replace(/(- YouTube)$/, "").replace(/^\s+|\s+$/g, "");
            console.log(url, title)
        };
    });
};

function all_tabs() {
    chrome.tabs.getAllInWindow(null, function(tabs) {
        console.log(tabs)

        for (let i = 0; i < tabs.length; i++) {
            let url = tabs[i].url;
            let title = tabs[i].title;

            if (url.startsWith("https://www.youtube.com/watch")) {
                if (tabs[i].active) {
                    title = title.replace(/^\([0-9]+\)/, "").replace(/(- YouTube)$/, "").replace(/^\s+|\s+$/g, "");
                };
            };
        };
    });
};

async function YouTube_Status() {
    let invalid = false;

    // 実行確認
    await chrome.storage.local.get("status", function(result) {
        let status = result.status;
        
        if (status == undefined) {
            chrome.storage.local.set({"status": true});
        };

        if (status == false) {
            invalid = true;
        };
    });

    // タブ確認
    await chrome.storage.local.get("all_tabs", function(result) {

        if (invalid) {
            return;
        };

        let all_tabs_status = result.all_tabs;

        if (all_tabs_status == undefined) {
            chrome.storage.local.set({"all_tabs": true});
        }

        if (all_tabs_status == true) {
            all_tabs();
        } else if (all_tabs_status == false) {
            active_tab();
        } else {
            chrome.storage.local.set({"all_tabs": true});
        };
    });
};

// OSチェック
chrome.runtime.getPlatformInfo(function(info){
    if (info.os == "win") {
        ready();
    };
});

// ウィンドウ終了
chrome.windows.onRemoved.addListener(function() {
    // Win以外でのエラー防止
    try {
        port.postMessage("disconnect");
    } catch (e) {
        // pass
    };
});