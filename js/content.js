function processOnTmpArea(func) {
    var $focused = $(document.activeElement);
    console.log($focused);
    var $tmpArea = $('<textarea>')
        .css('position', 'fixed')
        .css('left', '50%')
        .css('top', '50%')
        .appendTo($('body'));
    $tmpArea.focus();
    var res = func($tmpArea);
    $tmpArea.remove();
    $focused.focus();
    return res;
}

function getClipboard() {
    return processOnTmpArea(function($tmpArea) {
        document.execCommand('paste');
        return $tmpArea.val();
    });
}
function setClipboard(text) {
    processOnTmpArea(function($tmpArea) {
        $tmpArea.val(text).select();
        document.execCommand('copy');
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.command == "insertKaomoji") {
            var prevClipboard = getClipboard();
            setClipboard(request.kaomoji);
            document.execCommand('paste');
            setClipboard(prevClipboard);
        }
    });
