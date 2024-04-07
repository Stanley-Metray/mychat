function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}

const user = getCookie('user');
const token = getCookie('token');




// document.getElementById('btn-hide-sidebar').addEventListener('click', (e) => {
//   document.getElementById('chat-body').style.display = 'block';
//   document.getElementById('sidebar').style.display = 'none';
//   document.getElementById('controlls').style.display = 'none';
// });


const getChats = async () => {
  const fetch = localStorage.getItem('fetch');
  if (fetch === 'false')
    return;
  try {
    const response = await axios.get('/get-chats');
    const data = await response.data;
    if (data.success) {
      localStorage.setItem('chats', JSON.stringify(data));
      localStorage.setItem('fetch', 'false');
      setChats();
    } else {
      document.getElementById('chats-list').innerHTML = `<div class="alert alert-primary" role="alert">
            <i class="bi bi-ban"></i> Nothing to show
          </div>`;
    }
  } catch (error) {
    console.log(error);
  }
}

function setChats() {
  const chats = JSON.parse(localStorage.getItem('chats')).chats;

  let html = '';
  chats.forEach((chat) => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-start" id=${chat.id}>
                    <div class="ms-2 me-auto">
                        <div class="fw-bold truncate">${chat.group_name}</div>
                        <p class='truncate'><small>${chat.group_description}</small></p>
                    </div>
                    <span class="badge text-bg-primary rounded-pill">${chat.total_members}</span>
                </li>`;
  });

  document.getElementById('chats-list').innerHTML = html;
  document.getElementById('chats-list').addEventListener('click', showChat);
}

async function showChat(e) {
  if (e.target.tagName === 'LI') {
    try {

      const chatId = e.target.id;
      const chats = JSON.parse(localStorage.getItem('chats')).chats;
      let chat = chats.filter((chat) => {
        return chat.id === chatId;
      });

      setChat(chat[0]);
      if (window.screen.width < 768) {
        document.getElementById('chat-body').style.display = 'block';
        document.getElementById('sidebar').style.display = 'none';
        document.getElementById('controlls').style.display = 'none';
      }

    } catch (error) {
      alert('Something went wrong');
      console.log(error);
    }
  }
}


document.addEventListener('DOMContentLoaded', async (e) => {
  getChats();
  setChats();
});

const chatBody = document.getElementById('chat-body');
chatBody.style.visibility = 'hidden';

function setChat(chat) {
  localStorage.setItem('ci', chat.id);
  const html = `<div class="row">
    <div class="col" id="chat">
      <div class="template text-white" id="template">
        <div class="chat-box mb-3" id="chat-box">
          <div class="chat-head bg-dark p-2 ps-3 d-flex gap-2">
            <div class="group-icon text-white fs-2">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="group-status d-flex flex-column">
              <p class="m-0 p-0">${chat.group_name}</p>
              <p class="m-0 p-0"><small>${chat.group_description}</small></p>
            </div>
            <div>
              <i class="bi bi-sliders" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="groupControlls(event)"></i>

            </div>
            <i class="bi bi-x text-danger fs-4 d-none " id="btn-show-sidebar" onclick="showSideBar(event)"></i>
          </div>
          <div class="chat">
            <div id="message-box" class="message-box d-flex flex-column align-items-start p-3 gap-3">

            </div>
          </div>
        </div>
        <form id="message-form" onsubmit="sendMessage(event)">
          <div class="input-group w-100 mb-3 px-3">
            <input type="text" name="message" id="message" autocomplete="off" class="form-control"
              placeholder="Type Message" aria-label="Recipient's username" aria-describedby="button-addon2">
            <button class="btn btn-primary" type="submit" id="button-addon2"><strong><i class="bi bi-send"></i>
                Send</strong></button>
          </div>
        </form>
      </div>
    </div>
  </div>`;



  let messages = ``;

  chat.messages.forEach((msg) => {
    messages += `<div class="message d-flex flex-column">
    <span class="fs-user">${msg.sender}</span>
    <span>${msg.content}</span>
    </div>`;
  });

  chatBody.innerHTML = html;
  document.getElementById('message-box').innerHTML = messages;
  chatBody.style.visibility = 'visible';
}

const showSideBar = (e) => {
  document.getElementById('chat-body').style.display = 'none';
  document.getElementById('sidebar').style.display = 'block';
  document.getElementById('controlls').style.display = 'flex';
};

const groupControlls = async (event) => {
  try {
    const chatId = localStorage.getItem('ci');
    const response = await axios.get(`/get-chat/${chatId}`);
    const data = response.data;
    const chat = data.chat;
    const members = data.members;
    let memberHtml = '';
    members.forEach((member, index) => {
      memberHtml += `<li class="list-group-item bg-light text-dark"><strong>${index+1}</strong>. ${member.user_name}</li>`;
    });

    if (data.success) {
      let html = `<div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="staticBackdropLabel">${chat.group_name}</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
    <p><strong>Description:<br/> </strong>${chat.group_description}</p>
    <p><strong>Share Join Link:<br/> </strong><a href="#" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${data.joinLink}</a></p>
    </div>
    <h5 class='p-2'><strong>Members</strong></h5>
    <ul class="list-group bg-light text-dark p-2">${memberHtml}</ul>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  </div>`;

      document.getElementById('modal-dialog').innerHTML = html;
    }
    else alert("Something went wrong");
  } catch (error) {
    console.log(error);
    alert("Internal server error");
  }
}

async function sendMessage(e) {
  e.preventDefault();
  try {
    const formData = {
      content: document.getElementById('message').value,
      sender: user,
      chatId: localStorage.getItem('ci')
    }

    const response = await axios.post('/send-message', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.data;
    if (data.success)
      setLastMessage(data);
  } catch (error) {
    console.log(error);
  }
}

const setLastMessage = (data) => {
  const allChats = JSON.parse(localStorage.getItem('chats'));

  allChats.chats.forEach((chat) => {
    if (chat.id === localStorage.getItem('ci'))
      chat.messages.push(data.message);
  });

  localStorage.setItem('chats', JSON.stringify(allChats));
  let html = `<div class="message d-flex flex-column">
  <span class="fs-user">${data.message.sender}</span>
  <span>${data.message.content}</span>
</div>`;

  document.getElementById('message-box').innerHTML += html;
  let chatBox = document.getElementById('chat-box');
  chatBox.scrollTop = chatBox.scrollHeight;
}