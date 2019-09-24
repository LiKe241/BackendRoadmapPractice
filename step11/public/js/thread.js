/* eslint-disable no-undef */
// replaces toReplace with interface of posting response
function displayResponseForm(toReplace) {
  const threadID = $(toReplace).attr('class');
  const $newDiv = $('<div>', { class: threadID });
  const $form = $('<form>', { method: 'post', action: threadID})
    .appendTo($newDiv);
  $('<textarea>', { name: 'content' }).appendTo($form);
  $('<button>', { text: 'post response' }).appendTo($form);
  $('<button>', {
    text: 'cancel response',
    click: () => restoreToButton($newDiv, 'response')
  }).appendTo($newDiv);
  $(toReplace).replaceWith($newDiv);
}

// replaces toReplace with interface of posting modification
function displayModificationForm(toReplace) {
  const threadID = $(toReplace).attr('class');
  const $newDiv = $('<div>', { class: threadID });
  const $content = $('<textarea>', {
    name: 'content',
    text: $('#p' + threadID).text()
  }).appendTo($newDiv);
  $('<button>', {
    text: 'post modification',
    click: () => postModification($newDiv, $content, threadID)
  }).appendTo($newDiv);
  $('<button>', {
    text: 'cancel modification',
    click: () => restoreToButton($newDiv, 'modification')
  }).appendTo($newDiv);
  $(toReplace).replaceWith($newDiv);
}

// uploads content via HTTP PUT to server
// replaces $toReplace with response text
function postModification($toReplace, $content, threadID) {
  const $postingText = $('<p>').text('posting modification...');
  $.ajax({
    url: threadID,
    type: 'PUT',
    data: 'content=' + $content.val(),
    error: (res) => {
      $postingText.replaceWith($('<p>').text(
        'error ' + res.status + ': ' + res.statusText
      ));
    },
    success: (res) => {
      location.reload();
    }
  });
  $toReplace.replaceWith($postingText);
}

// restores response elements back to button
function restoreToButton(toReplace, type) {
  const $button = $('<button>', { class: toReplace.attr('class') });
  if (type === 'response') {
    $button.text('post response');
    $button.click(() => displayResponseForm($button));
  } else if (type === 'modification') {
    $button.text('modify');
    $button.click(() => displayModificationForm($button));
  }
  $(toReplace).replaceWith($button);
}

// sends request to delete post
function deleteThread(toDelete) {
  const $deletingText = $('<p>').text('deleting...');
  $.ajax({
    url: toDelete.className,
    type: 'DELETE',
    error: (res) => {
      $deletingText.replaceWith($('<p>').text(
        'error ' + res.status + ': ' + res.statusText
      ));
    },
    success: () => location.reload()
  });
  $(toDelete).replaceWith($deletingText);
}
