document.getElementById('form-create-group').addEventListener('submit', async (e)=>{
    e.preventDefault();
    try {
        const formData = new FormData(e.target);
        formData.append("isGroup", true);
        await axios.post('/create-chat', formData, {
            headers : {
                'Content-Type' : 'application/json'
            }
        });
        localStorage.setItem('fetch', 'true');
        window.location.href='/';
    } catch (error) {
        alert("Internal server error");
        console.log(error);
    }
});