$(function() {

    // OSチェック
    chrome.runtime.getPlatformInfo(function(info){
        if (info.os != "win") {
            $(".checkbox").hide();
            $("#os_error").show();
        };
    });

    chrome.storage.local.get("status", function(result) {
        let status = result.status;

        if (status) {
            $("#status").prop("checked", true);
            chrome.storage.local.set({"status": true});
        };
    });

    chrome.storage.local.get("all_tabs", function(result) {
        let all_tabs_status = result.all_tabs;

        if (all_tabs_status) {
            $("#all_tabs").prop("checked", true);
            chrome.storage.local.set({"all_tabs": true});
        };
    });

});

$(document).on("change", "#status", function() {
    let status = $(this).prop("checked");

    if (status) {
        chrome.storage.local.set({"status": true});
    } else {
        chrome.storage.local.set({"status": false});
    };
});

$(document).on("change", "#all_tabs", function() {
    let status = $(this).prop("checked");

    if (status) {
        chrome.storage.local.set({"all_tabs": true});
    } else {
        chrome.storage.local.set({"all_tabs": false});
    };
});