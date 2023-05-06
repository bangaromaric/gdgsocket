'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
const chart = document.getElementById('myChart');
var dashContainer = document.querySelector('#dash-container');

var stompClient = null;
var username = null;
var myChart =null ;
var labelUtilisateurs = [];
var listNbrMesg = [];
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function majLabel(chats) {
    // var nom = chats.slice(-1)[0];
    console.log("chat ",chats);
    labelUtilisateurs =[];
    for (let i = 0; i < chats.length; i++) {
        console.log(chats[i].sender);
        labelUtilisateurs.push(chats[i].sender);
    }
    // labelUtilisateurs.push(nom.sender);


    console.log(labelUtilisateurs);
    myChart.data.labels = labelUtilisateurs;
    myChart.update();
}

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        dashContainer.classList.remove('hidden');

        var socket = new SockJS('/websocket');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();


}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    myChart =  new Chart(chart, {
        type: 'bar',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: labelUtilisateurs,
            datasets: [
                {
                    label: '# nombre de messages',
                    data: [],
                    borderWidth: 1,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)', // couleur de fond de la première barre
                        'rgba(54, 162, 235, 0.2)', // couleur de fond de la deuxième barre
                        'rgba(255, 206, 86, 0.2)', // couleur de fond de la troisième barre
                        'rgba(75, 192, 192, 0.2)', // couleur de fond de la quatrième barre
                        'rgba(153, 102, 255, 0.2)', // couleur de fond de la cinquième barre
                        'rgba(255, 159, 64, 0.2)' // couleur de fond de la sixième barre
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', // couleur de bordure de la première barre
                        'rgba(54, 162, 235, 1)', // couleur de bordure de la deuxième barre
                        'rgba(255, 206, 86, 1)', // couleur de bordure de la troisième barre
                        'rgba(75, 192, 192, 1)', // couleur de bordure de la quatrième barre
                        'rgba(153, 102, 255, 1)', // couleur de bordure de la cinquième barre
                        'rgba(255, 159, 64, 1)' // couleur de bordure de la sixième barre
                    ],
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Tell your username to the server
    stompClient.send("/app/chat.register",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )


    connectingElement.classList.add('hidden');


}


function onError(error) {
    connectingElement.textContent = 'Impossible de se connecter à WebSocket ! Veuillez actualiser la page et réessayer ou contacter votre administrateur.';
    connectingElement.style.color = 'red';
}


function send(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);


    // console.log("----", message)
    var derniereMessage = null;

    if (Array.isArray(message)) {
        derniereMessage = message.slice(-1)[0];
    } else {
        derniereMessage = message;
    }

    var messageElement = document.createElement('li');

    // console.log(derniereMessage.type)


    if(derniereMessage.type === 'JOIN') {
        messageElement.classList.add('event-message');
        derniereMessage.content = derniereMessage.sender + ' a rejoint le chat!';

        majLabel(message);
    } else if (derniereMessage.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        derniereMessage.content = derniereMessage.sender + ' left!';
    } else {

        messageElement.classList.add('chat-message');
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(derniereMessage.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(derniereMessage.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(derniereMessage.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

        //init chart

        // Récupérer les valeurs uniques de la propriété 'sender'
        let valeursUniques = message.filter((v, i, a) => a.findIndex(t => (t.sender === v.sender)) === i);
        // console.log("-------2",valeursUniques)

        listNbrMesg = [];
        for (let i = 0; i < valeursUniques.length; i++) {
            console.log(valeursUniques[i].nbrMsg);
            listNbrMesg.push(valeursUniques[i].nbrMsg);
        }

        myChart.data.datasets[0].data = listNbrMesg;
        myChart.update();

    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(derniereMessage.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', send, true)




