// replaces button to response element
/* eslint-disable no-unused-vars, no-undef */
function replaceToInput(toReplace, type) {
  const newDiv = document.createElement('DIV');
  newDiv.setAttribute('id', 'd' + toReplace.name);
  const form = document.createElement('FORM');
  form.setAttribute('method', 'post');
  form.setAttribute('action', '/' + type);
  const content = document.createElement('TEXTAREA');
  content.setAttribute('name', 'content');
  if (type === 'modification') {
    const originalContent = document.getElementById('p' + toReplace.name);
    content.innerText = originalContent.innerText;
  }
  form.appendChild(content);
  const submit = document.createElement('BUTTON');
  submit.setAttribute('type', 'submit');
  submit.innerText = 'post ' + type;
  form.appendChild(submit);
  const toUpdateID = document.createElement('INPUT');
  toUpdateID.setAttribute('name', 'toUpdateID');
  toUpdateID.setAttribute('value', toReplace.name);
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
    'restoreToButton(' + toReplace.name + ', "' + type + '")'
  );
  cancel.innerText = 'cancel ' + type;
  newDiv.appendChild(cancel);
  toReplace.parentNode.replaceChild(newDiv, toReplace);
}

// restores response elements back to button
function restoreToButton(id, type) {
  const toReplace = document.getElementById('d' + id);
  const newButton = document.createElement('BUTTON');
  newButton.setAttribute('name', id);
  newButton.setAttribute('onclick', 'replaceToInput(this, "' + type + '")');
  if (type === 'response') {
    newButton.innerText = 'post response';
  } else if (type === 'modification') {
    newButton.innerText = 'modify';
  }
  toReplace.parentNode.replaceChild(newButton, toReplace);
}

// sends request to delete post
function deleteThread(toDelete) {
  const toDeleteID = toDelete.name;
  const xhttp = new XMLHttpRequest();
  const deletingText = document.createElement('P');
  deletingText.innerText = 'deleting...';
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        window.location.reload(false);
      } else if (this.status === 403) {
        deletingText.innerText = 'deletion failed';
      }
    }
  };
  xhttp.open('GET', '/delete?id=' + toDelete.name, true);
  xhttp.send();
  toDelete.parentNode.replaceChild(deletingText, toDelete);
}
