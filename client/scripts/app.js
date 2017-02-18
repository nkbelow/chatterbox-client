const app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  init: () => {
    //$("#send .submit").bind("submit", app.handleSubmit)
  },
  send: (message) => {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        //app.renderMessage(data);
        console.log(`Message Id: ${data.objectId}, Created at: ${data.createdAt}`);
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message', data);
      }
    })
  },
  fetch: () => {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        for (let i = 0; i < data.results.length; i++) {
          var x = data.results[i]
          var sanitized = sanitizeResponse(x)
          app.renderMessage(sanitized)
        }
        console.log('chatterbox: Message sent');
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message', data);
      }
    })
  },
  clearMessages: () => {
    $('#chats').html([])
  },
  renderMessage: ({username, text}) => {
    let $msg = $(`<div class="username"><div class="usersName">${capitalizeName(username)}</div><div>${text}</div></div>`);
    $msg.on('click', app.handleUsernameClick);
    $('#chats').prepend($msg);
  },
  renderRoom: (room) => {
    $('#roomSelect').append(`<div>${room}</div>`);
  },
  handleUsernameClick: (event) => {
    const userName = event.currentTarget.childNodes['0'].textContent
    alert(`You are now following user ${capitalizeName(userName)}`)
  },
  handleSubmit: () => {
    const message = $('#message').val();
    const username = getSearchParam('username')
    const rooms = getSearchParam('rooms')
    app.send({
      message: message,
      username: username,
      rooms: rooms
    })
  }
}

const sanitizeResponse = (data) => {
  for(let key in data) {
    var value = data[key]
    data[key] = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  return data
}

const capitalizeName = (name) => {
  return name[0].toUpperCase() + name.slice(1)
}

const getSearchParam = (param) => {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&')
  var sParameterName

  for (var i = 0; i < sURLVariables.length; i++) {
     sParameterName = sURLVariables[i].split('=');

     if (sParameterName[0] === param) {
         return sParameterName[1] === undefined ? true : sParameterName[1];
     }
  }
}

$(document).ready(() => {
  $('#message').keypress((e) => {
    if (e.which === 13) {
      const message = $('#message').val();
      const username = getSearchParam('username')
      const rooms = getSearchParam('rooms')
      app.send({
        message: message,
        username: username,
        rooms: rooms
      })
      $('#message').val('')
    }
  })
  $("#send .submit").on("click", app.handleSubmit)
  app.fetch()
})
