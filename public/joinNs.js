function joinNs(rooms, endpoint, id) {
  activeNSID = id;
  const roomList = document.querySelector('.room-list');
  roomList.innerHTML = '';
  rooms.forEach((room) => {
    const liEl = document.createElement('li');
    const span = document.createElement('span');
    span.className = `fa-solid fa-${room.privateRoom ? 'lock' : 'globe'}`;
    liEl.innerText = room.roomTitle;
    liEl.prepend(span);
    liEl.addEventListener('click', () => {
      joinRoom(room.roomTitle, id);
    });
    roomList.append(liEl);
  });
  joinRoom(rooms[0].roomTitle, id);
  localStorage.setItem('lastNS', endpoint);
}
