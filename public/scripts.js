const username = 'Bbk';
const password = '123321';
const clientOptions = {
  query: { username, password },
  auth: { username, password },
};

const socket = io('http://localhost:9000', clientOptions);

socket.on('connect', () => {
  console.log('Connected');
});
socket.emit('clientConnect');

const namespaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};
let activeNSID = 0;

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const newMessage = document.querySelector('#user-message');
  const val = newMessage.value;
  console.log({ val, activeNSID });
  namespaceSockets[activeNSID].emit('new-message-to-room', {
    message: val,
    date: Date.now(),
    avatar: 'https://via.placeholder.com/30',
    username,
    activeNSID,
  });
  newMessage.value = '';
});

const addListeners = (nsID) => {
  if (!listeners.nsChange[nsID]) {
    namespaceSockets[nsID].on('ns-change', (data) => {
      console.log('NS CHANGED - ', data);
    });
    listeners.nsChange[nsID] = true;
  }
  if (!listeners.messageToRoom[nsID]) {
    namespaceSockets[nsID].on('message-to-room', (messageObj) => {
      const messageLi = biuldMessageElement(messageObj);
      document.querySelector('#messages').append(messageLi);
    });
    listeners.messageToRoom[nsID] === true;
  }
};

socket.on('nsList', (nsData) => {
  const namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  const lastNS = localStorage.getItem('lastNS');
  nsData.forEach(({ endpoint, image, rooms, id }, index) => {
    const namespaceEl = document.createElement('div');
    namespaceEl.className = 'namespace';
    namespaceEl.setAttribute('ns', endpoint);
    const namespaceImage = document.createElement('img');
    namespaceImage.src = image;
    namespaceEl.appendChild(namespaceImage);
    namespacesDiv.appendChild(namespaceEl);

    if (!namespaceSockets[id]) {
      namespaceSockets[id] = io(`http://localhost:9000${endpoint}`);
    }
    addListeners(id);
    namespaceEl.addEventListener('click', () => {
      joinNs(rooms, endpoint, id);
    });
    if (lastNS === endpoint) {
      joinNs(rooms, endpoint, id);
    }
    if (index === 0 && !lastNS) {
      joinNs(rooms, endpoint, id);
    }
  });
});
