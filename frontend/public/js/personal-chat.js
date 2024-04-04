document.getElementById('message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/send-message', new FormData(e.target), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.data;
        if(data.success)
            setLastMessage(data);
    } catch (error) {
        console.log(error);
    }
});

const setLastMessage = (data)=>{
    let html = `<div class="message d-flex flex-column">
    <span class="fs-user">Anand</span>
    <span>${data.message}</span>
  </div>`;

  document.getElementById('message-box').innerHTML += html;
  let chatBox = document.getElementById('chat-box');
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener('DOMContentLoaded', async (e)=>{
    getMessages();
});

const getMessages = async ()=>{
    try {
        const response = await axios.get('/get-messages');
        const data = response.data;
        if(data.success)
        {
            setChatMessages(data.messages);
        }
    } catch (error) {
        console.log(error);
    }
}

const setChatMessages = (messages)=>{
    let html = '';
    messages.forEach((message, index)=>{
        if(parseInt(index%2)===0)
        {
            html += `<div class="message d-flex flex-column">
            <span class="fs-user">Anand</span>
            <span>${message.message}</span>
          </div>`
        }
        else
        {
            html += `<div class="message d-flex flex-column">
            <span class="fs-user">Stanley</span>
            <span>${message.message}</span>
          </div>`
        }
    });

    document.getElementById('message-box').innerHTML = html;
}