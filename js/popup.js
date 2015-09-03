var bg;

function renderList() {
    var $listItemTemp = $('<li>').append($('<a>').addClass('item-title')
                                                .attr('href', '#'))
                                .append($('<a>').addClass('item-delete-btn')
                                                .attr('href', '#')
                                                .data('split-icon', 'true')
                                                .addClass('ui-icon-delete'));
    var $listview = $('#kaomojiList');
    $listview.html('');
    for(var i=0; i<bg.kaomojies.length; ++i) {
        (function() { //closure
            var $listItem = $listItemTemp.clone();
            var index = i;
            $listItem.find('.item-title').append($('<span>').addClass('item-title-name').text(bg.kaomojies[i].name))
                                        .append($('<span>').addClass('item-title-cont').text(bg.kaomojies[i].cont))
                                        .click(function() { bg.insertKaomoji(index); });
            $listItem.find('.item-delete-btn').click(function() {
                var $this = $(this);
                if(!$this.data('checked')) {
                    $this.data('checked', true).addClass('btn-danger');
                }
                else {
                    bg.deleteKaomoji(index);
                    renderList();
                }
            }).on('mouseleave focusout', function() {
                $(this).removeData('checked').removeClass('btn-danger');
            });
            $listview.append($listItem);
        })();
    }
    $listview.listview("refresh");
}

$(function() {
    bg = chrome.extension.getBackgroundPage();
    renderList();
    $('#addForm').submit(function(event) {
        event.preventDefault();
        bg.addKaomoji($('#newName').val(), $('#newCont').val());
        $('#newName').val('');
        $('#newCont').val('');
        renderList();
        $.mobile.back();
    });
});
