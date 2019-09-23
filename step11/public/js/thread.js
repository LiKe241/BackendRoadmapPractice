

/* eslint-disable no-undef */
function postResponse(toReplace) {
  const threadID = toReplace.className;
  const $newDiv = $('<div>', { class: threadID });
  const $form = $('<form>', { method: 'post', action: threadID})
    .appendTo($newDiv);
  $('<textarea>', { name: 'content' }).appendTo($form);
  $('<button>', { text: 'post response' }).appendTo($form);
  $('<button>', {
    text: 'cancel response',
    click() { restoreToButton($newDiv, 'response'); }
  }).appendTo($newDiv);
  $(toReplace).replaceWith($newDiv);
}

function modify(toReplace) {
  // reads from form and put to threadID/
}

// replaces button to response element
function replaceToInput(toReplace, type) {
  const newDiv = document.createElement('DIV');
  newDiv.setAttribute('id', 'd' + toReplace.className);
  const form = document.createElement('FORM');
  form.setAttribute('method', 'post');
  form.setAttribute('action', '/' + type);
  const content = document.createElement('TEXTAREA');
  content.setAttribute('name', 'content');
  if (type === 'modification') {
    const originalContent = document.getElementById('p' + toReplace.className);
    content.innerText = originalContent.innerText;
  }
  form.appendChild(content);
  const submit = document.createElement('BUTTON');
  submit.setAttribute('type', 'submit');
  submit.innerText = 'post ' + type;
  form.appendChild(submit);
  const toUpdateID = document.createElement('INPUT');
  toUpdateID.setAttribute('name', 'toUpdateID');
  toUpdateID.setAttribute('value', toReplace.className);
  toUpdateID.style.visibility = 'hidden';
  form.appendChild(toUpdateID);
  const threadID = document.createElement('INPUT');
  threadID.setAttribute('name', 'threadID');
  threadID.setAttribute('value', window.location.href.split('=')[1]);
  threadID.style.visibility = 'hidden';
  form.appendChild(threadID);
  newDiv.appendChild(form);
  const cancel = document.createElement('BUTTON');
  cancel.setAttribute('type', 'button');
  cancel.setAttribute(
    'onclick',
    'restoreToButton("' + toReplace.className + '", "' + type + '")'
  );
  cancel.innerText = 'cancel ' + type;
  newDiv.appendChild(cancel);
  toReplace.parentNode.replaceChild(newDiv, toReplace);
}

// restores response elements back to button
function restoreToButton(toReplace, type) {
  // const newButton = document.createElement('BUTTON');
  // newButton.setAttribute('class', toReplace.className);
  // newButton.setAttribute('onclick', 'replaceToInput(this, "' + type + '")');
  // if (type === 'response') {
  //   newButton.innerText = 'post response';
  // } else if (type === 'modification') {
  //   newButton.innerText = 'modify';
  // }
  const $button = $('<button>', {
    class: toReplace.className,
    text: 'post response',
    click() { postResponse($button); }
  });
  $(toReplace).replaceWith($button);
}

// sends request to delete post
function deleteThread(toDelete) {
  const toDeleteID = toDelete.className;
  const xhttp = new XMLHttpRequest();
  const deletingText = document.createElement('P');
  deletingText.innerText = 'deleting...';
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        window.location.reload(false);
      } else {
        deletingText.innerText = 'deletion failed';
      }
    }
  };
  xhttp.open('DELETE', '/thread/' + toDelete.className, true);
  xhttp.send();
  toDelete.parentNode.replaceChild(deletingText, toDelete);
}
