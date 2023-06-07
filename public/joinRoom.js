const joinRoom = async (roomTitle, nsID) => {
  const ackRes = await namespaceSockets[nsID].emitWithAck('join-room', {
    roomTitle,
    nsID,
  });

  document.querySelector('.num-users').innerText = ackRes.numUsers;
  document.querySelector('.curr-room-text').innerText = roomTitle;
  const messagesList = document.querySelector('#messages');
  messagesList.innerHTML = '';
  ackRes.roomHistory.forEach((message) => {
    const msgLi = biuldMessageElement(message);
    messagesList.append(msgLi);
  });
};
