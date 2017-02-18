const app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  init: () => {
    $("#send .submit").bind("submit", app.handleSubmit)
  },
  send: (message) => {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        // update UI with new data
        // use JSON.stringify(data)
        console.log('chatterbox: Message sent');
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
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        //const sanitized = sanitizeResponse(data)
        for (let i = 0; i < data.results.length; i++) {
          var x = data.results[i]
          //const parsedJSON = JSON.parse(x)
          var sanitized = sanitizeResponse(x)
          debugger
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
    let $msg = $(`<div class="username">${username}: ${text}</div>`);
    $msg.on('click', app.handleUsernameClick);
    $('#chats').append($msg);
  },
  renderRoom: (room) => {
    $('#roomSelect').append(`<div>${room}</div>`);
  },
  handleUsernameClick: () => {
    return true;
  },
  handleSubmit: (event) => {
    //app.send(e)
    console.log(event)
  }
}

const sanitizeResponse = (data) => {
  for(let key in data) {
    var value = data[key]
    data[key] = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  return data
}

$(document).ready(() => {
  //setInterval(app.fetch, 1000)
  app.fetch()
})
