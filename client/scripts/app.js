const app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  init: () => {
  },
  state: {
    messages: null,
    users: [],
    rooms: null,
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
        const cleaned = app.sanitizeCollection(data.results)
        app.state.messages = cleaned
        app.renderCollection(app.state.messages)
        console.log('chatterbox: Message sent');
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message:', data);
      }
    })
  },
  filterMessages: (isRoom) => {
    if (isRoom === "all") {
      app.renderCollection(app.state.messages)
    } else {
      app.state.messages.forEach((message) => {
        if (message.roomname === isRoom) {
          app.renderMessage(message);
        }
      })
  }
  },
  filterUser: (userName) => {
    app.state.messages.forEach((message) => {
      if (message.username === userName) {
        app.renderMessage(message);
      }
    })
  },
  sanitizeCollection: (collection) => {
    for (let i = collection.length - 1; i >= 0; i--) {
      var x = sanitizeResponse(collection[i])
      collection[i] = x
    }
    return collection
  },
  renderCollection: (collection) => {
    for (let i = collection.length - 1; i >= 0; i--) {
      var x = collection[i]
      app.renderMessage(x)
    }
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
            <span class="usersName">${username}</span>
            <span class="small">${timeAgo}</span>
            <span class="small"> in ${roomname} room</span>
          </div>
          <div class="message">${text}</div>
        </div>
        <div class="clear"></div>
      </div>
      `);
    $msg.find('span.usersName').on('click', app.handleUsernameClick);
    $('#chats').prepend($msg);
  },
  renderRoom: (room) => {
    $('#roomSelect').append(`<div>${room}</div>`);
  },
  handleUsernameClick: (event) => {
    const userName = event.currentTarget.childNodes['0'].textContent
    // clearMessages()
    // hide header layout
    // input user data
    // append all user's messages to feed
    app.clearMessages();
    $('#messageForm').hide();
    // create h1 with class user-header
    $('#main').append(`
      <div id='userHeader'>
       <h1 id='userHeaderName'>${userName}</h1>
       <a href="#" value=${userName}>Follow me!</a>
      </div>
    `)
    app.filterUser(userName);
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
      //.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/`/g, '&quot;');
  }
  return data
}

// const capitalizeName = (name = 'anonymous') => {
//   if (name === '') return
//   return name[0].toUpperCase() + name.slice(1)
// }

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
//
// const reformatUser = (obj) => {
//   let newObj = {}
//   newObj.username = obj.username
//   newObj.followers = []
//   newObj.following = []
//   newObj.messages = []
//   newObj.messages.push(obj)
//   return newObj
// }



$(document).ready(() => {
  $("#send .submit").on("click", app.handleSubmit)
  $('#roomselect').on('change', (e) => {
    app.clearMessages();
    let optionSelected = $(e.target).val()
    app.filterMessages(optionSelected);
  })
  $('#createRoomButton').on('click', () => {
    let value = $('#roomInput').val();
    $('#roomselect').append($('<option>', {
      value: value,
      text: value,
    }));
  })
  $('#header-image').on('click', () => {
    app.clearMessages()
    app.renderCollection(app.state.messages)
    $('#messageForm').show();
    $('#userHeader').remove();
    // hide user-header
  })
  $('#main').on('click', 'a', (e) => {
    alert(`You are now following the user`);
  })


  app.fetch()
})
