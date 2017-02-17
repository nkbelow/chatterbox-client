const app = {
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
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
        console.log('chatterbox: Message sent');
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message', data);
      }
    })
  },
  fetch: (message) => {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        // update UI with new data
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
  handleSubmit: () => {
  }

}
