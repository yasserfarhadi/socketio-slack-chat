function biuldMessageElement(messageObj) {
  const messageLi = document.createElement('li');
  const imageContainer = document.createElement('div');
  imageContainer.className = 'user-image';
  const imageEl = document.createElement('img');
  imageEl.src = messageObj.avatar;
  imageContainer.append(imageEl);
  const messageContainer = document.createElement('div');
  messageContainer.className = 'user-message';
  const userName_time = document.createElement('div');
  userName_time.className = 'user-name-time';
  userName_time.innerText = messageObj.username;
  const timeSpan = document.createElement('span');
  timeSpan.innerText = new Date(messageObj.date).toLocaleTimeString();
  timeSpan.className = 'message-time-span';
  userName_time.append(timeSpan);
  const messageEl = document.createElement('div');
  messageEl.className = 'message-text';
  messageEl.innerText = messageObj.message;
  messageContainer.append(userName_time);
  messageContainer.append(messageEl);
  messageLi.append(imageContainer);
  messageLi.append(messageContainer);
  return messageLi;
}
