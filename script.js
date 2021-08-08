getMessages();

function getMessages () {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    promise.then(printMessages);
}

function printMessages (messages) {
    const chat = document.querySelector(".chat");
    chat.innerHTML = "";
    for (let i = 0; i < messages.data.length; i++) {
        let from = messages.data[i].from;
        let to = messages.data[i].to;
        let text = messages.data[i].text;
        let time = messages.data[i].time;
        if (messages.data[i].type === "message") {
            chat.innerHTML += `
            <li class="message white">
                <span class="time">${time}</span> <span class="user">${from}</span> para <span class="user">${to}</span>: ${text}
            </li>`;
        }
        if (messages.data[i].type === "status") {
            chat.innerHTML += `
            <li class="message gray">
                <span class="time">${time}</span> <span class="user">${from}</span>: ${text}
            </li>`;
        }
        if (messages.data[i].type === "private_message") {
            if (to === userName) {
                chat.innerHTML += `
                <li class="message red">
                    <span class="time">${time}</span> <span class="user">${from}</span> reservadamente para <span class="user">${to}</span>: ${text}
                </li>`;
            }
        }

        
    }
}