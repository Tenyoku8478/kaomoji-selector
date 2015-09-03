chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.command == "insertKaomoji") {
            var field = document.activeElement;
            var $field = $(field);
            if($field.val) {
                var begin = field.selectionStart;
                var end = field.selectionEnd;
                var text = $field.val();
                $field.val(text.substring(0, begin)+request.kaomoji+text.substring(end, text.length));
                field.selectionStart = field.selectionEnd = begin+request.kaomoji.length;
            }
        }
    });
