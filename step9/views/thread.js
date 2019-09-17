// replaces button to response element
function replaceToInput(toReplace, type) {
  const newDiv = document.createElement('DIV');
  newDiv.setAttribute('id', 'd' + toReplace.id);
  const form = document.createElement('FORM');
  form.setAttribute('method', 'post');
  form.setAttribute('action', '/' + type);
  const content = document.createElement('TEXTAREA');
  content.setAttribute('name', 'content');
  if (type === 'modification') {
    const originalContent = document.getElementById('p' + toReplace.id);
    content.innerText = originalContent.innerText;
  }
  form.appendChild(content);
  const submit = document.createElement('BUTTON');
  submit.setAttribute('type', 'submit');
  submit.innerText = 'post ' + type;
  form.appendChild(submit);
  const toUpdateID = document.createElement('INPUT');
  toUpdateID.setAttribute('name', 'toUpdateID');
  toUpdateID.setAttribute('value', toReplace.id);
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
    'restoreToButton(' + toReplace.id + ', "' + type + '")'
  );
  cancel.innerText = 'cancel ' + type;
  newDiv.appendChild(cancel);
  toReplace.parentNode.replaceChild(newDiv, toReplace);
}

// restores response elements back to button
function restoreToButton(id, type) {
  const toReplace = document.getElementById('d' + id);
  const newButton = document.createElement('BUTTON');
  newButton.setAttribute('id', id);
  newButton.setAttribute('onclick', 'replaceToInput(this, "' + type + '")');
  if (type === 'response') {
    newButton.innerText = 'post response';
  } else if (type === 'modification') {
    newButton.innerText = 'modify';
  }
  toReplace.parentNode.replaceChild(newButton, toReplace);
}
