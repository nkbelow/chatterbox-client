const app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  init: () => {
  },
  send: (data) => {
    const {username, text, roomname} = data
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: (resp) => {
        var sanitizeSend = sanitizeResponse({
          text: text,
          username: username,
          roomname: roomname,
          createdAt: resp.createdAt,
          objectId: resp.objectId
        });
        app.renderMessage(sanitizeSend);
        console.log(`Message Id: ${resp.objectId}, Created at: ${resp.createdAt}`);
      },
      error: (err) => {
        console.error('chatterbox: Failed to send message', err);
      }
    })
  },
  fetch: () => {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: (data) => {
        for (let i = data.results.length - 1; i >= 0; i--) {
          var x = data.results[i]
          var sanitized = sanitizeResponse(x)
          app.renderMessage(sanitized)
        }
        console.log('chatterbox: Message sent');
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message:', data);
      }
    })
  },
  clearMessages: () => {
    $('#chats').html([])
  },
  renderMessage: ({username, text, roomname, createdAt}) => {
    const timeAgo = $.timeago(createdAt);
    let $msg = $(`
      <div class="username">
        <img src="images/egg.png" class="avatar">
        <div>
          <div>
            <span class="usersName">${capitalizeName(username)}</span>
            <span class="small">${timeAgo}</span>
            <span class="small"> in ${roomname} room</span>
          </div>
          <div class="message">${text}</div>
        </div>
      </div>
      `);
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
    const message = $('#message').val() || ''
    const username = getSearchParam('username')
    const room = $('#roomselect option:selected').text() || getSearchParam('rooms')
    app.send({
      text: message,
      username: username,
      roomname: room
    })
  }
}

const sanitizeResponse = (data) => {
  for(let key in data) {
    var value = data[key]
    data[key] = String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/`/g, '&quot;');
  }
  return data
}

const capitalizeName = (name = 'anonymous') => {
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
  $("#send .submit").on("click", app.handleSubmit)
  $("time.timeago").timeago()
  app.fetch()
})
