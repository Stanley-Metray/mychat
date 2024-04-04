document.getElementById('message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/send-message', new FormData(e.target), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.data;
        console.log(data);
    } catch (error) {
        console.log(error);
        alert(error.response.data.error);
    }
});