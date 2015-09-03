var __syncFreq = 60*1000;
var kaomojies = [];
var dirty = false;

function updateKaomoji() {
    kaomojies.sort(function(a, b) {
        return b.timestamp - a.timestamp;
    });
    dirty = true;
}

function addKaomoji(name, cont) {
    var newOne = {name: name, cont: cont, timestamp:$.now()};
    for(var i=0; i<kaomojies.length; ++i) {
        if(kaomojies[i].name == name && kaomojies[i].cont == cont) {
            kaomojies.splice(i, 1);
            --i;
        }
    };
    kaomojies.push(newOne);
    updateKaomoji();
}

function deleteKaomoji(index) {
    kaomojies.splice(index, 1);
    updateKaomoji();
}

function insertKaomoji(index) {
    kaomojies[index].timestamp = $.now();
    var cont = kaomojies[index].cont;
    chrome.extension.getViews({type: "popup"})[0].window.close();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "insertKaomoji", kaomoji: cont});
    });
    updateKaomoji();
}

function syncDB() {
    if(dirty) {
        chrome.storage.sync.set({kaomojies: kaomojies}, function() {
            setTimeout(syncDB, __syncFreq);
        });
    }
    else {
        setTimeout(syncDB, __syncFreq);
    }
}

chrome.storage.sync.get('kaomojies', function(res) {
    kaomojies = res.kaomojies || [];
    dirty = false;
    syncDB();
});

chrome.runtime.onInstalled.addListener(function() {
    $.get(
        url = chrome.extension.getURL('json/default_kaomojies.json'),
        success = function(data) {
            var defaults = $.parseJSON(data);
            for(var i=0; i<defaults.length; ++i) {
                addKaomoji(defaults[i].name, defaults[i].cont);
            }
        });
});
