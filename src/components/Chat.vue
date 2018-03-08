<template>
    <div>
      <div id="chat" class="row">
        <div id="chat-messages" class="col s12 m12 l12 yellow">
          <ul id="messages">
            <li v-for="message in messages">
              {{message}}
            </li>
            <button v-on:click="disconnect">disconnect</button>
          </ul>
        </div>
        <span id="menuCollaps" v-on:click="showElement">&#9776;</span>
        <div id="users" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" v-on:click="closeElement">&times;</a>
            <ul>
              <li class="row useritem" v-for="user in users">
                  <span @click="selectPrivate(user)" class="btn small col s10 m10 l6 offset-l1 offset-s1 offset-m1">{{user.username}}</span>
              </li>
            </ul>
        </div>
      </div>
      <div class="row">
        <div v-if="!privatem" class="show-on-small col s12 msgTo">
          <span class="toWhom">To: All</span>
        </div>
        <div v-else class="show-on-small col s12 msgTo"><span class="toWhom">To: {{selected.username}}</span>
            <i @click="privatem = false" id="clear" class="tiny material-icons">close</i>
        </div>
      </div>
      <div id="input-chat" class="row valign-wrapper">
        <div v-if="!privatem" class="hide-on-small-only col m2 l2 msgTo">
          <span>To: All</span>
        </div>
        <div v-else class="hide-on-small-only col m2 l2 msgTo">To: {{selected.username}}
            <i @click="privatem = false" id="clear" class="tiny material-icons">close</i>
        </div>
        <input id="inp" type="text" name="chat" class="col s8 m8 l8" v-model="message">
        <div class="class col s4 m2 l2">
          <button @click="sendMessage" class="btn-large col s12 m10 l10 offset-l1 offset-m1">
            <i class="material-icons right col s12 m12 l12">send</i>
          </button>
        </div>
      </div>
    </div>
</template>
<script>

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import router from '../router/index';

export default {
  name: 'chat',
  data () {
    return {
      username: '',
      users: [],
      messages: [],
      message: '',
      selected: {
        socketid: '',
        username: ''
      },
      privatem: false
    }
  },
  sockets: {
    added: function(usr) {
      this.users.push(usr);
      Materialize.toast(usr.username + ' joined the chat!', 2000);
    },
    disconnected: function(id) {
      for(let i = 0; i < this.users.length; i++) {
        if(this.users[i].socketid === id) {
          Materialize.toast(this.users[i].username + ' disconnected', 2000);
          this.users.splice(i,1);
          break;
        }
      };
    },
    recieveMessage: function(msg) {
      this.messages.push(msg);
    },
    loadUsers: function(connected_users) {
      this.users = connected_users;
    }
  },
  methods: {
    selectPrivate: function(user) {
      this.selected.socketid = user.socketid;
      this.selected.username = user.username;
      this.privatem = true;
      //Left to the input make a div with "To: Username"
      this.closeElement();
    },
    disconnect: function() {
      this.$socket.disconnect();
      location.reload();
      router.push('/profile');
    },
    sendMessage: function() {
      if(this.privatem == true) {
        this.sendPrivateMessage();
      } else {
        var msg = this.username + ': ' + this.message;
        this.$socket.emit('chat message', msg);
        this.message = '';
      }
    },
    sendPrivateMessage: function() {
      var daten = {
        msg: this.username + ' > ' + this.selected.username + ': ' + this.message,
        socketid: this.selected.socketid
      }
      this.$socket.emit('private-message', daten);
      this.message = '';
    },
    logOut: function() {
      localStorage.clear();
      Materialize.toast('You have been successfully logged out.', 4000);
      router.push('/');
    },
    showElement: function() {
      $('#users').show();
    },
    closeElement: function() {
      $('#users').hide();
    },
    loadUsers: function() {
      var self = this;
      $.ajax({
        url: "http://localhost:3000/api/users",
        type: 'GET',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        success: function(data) {
          self.users = data.users;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //Materialize.toast('Something went wrong. Please try again.',4000);
        }
      });
    },
    setStatusAndSocket: function(status, id) {
      var daten = {
        status: status,
        socketid: id
      }
      $.ajax({
        url: "http://localhost:3000/api/users/status",
        type: 'PUT',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        data: daten,
        success: function(data) {
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //Materialize.toast('Could not change status. Please try again.',4000);
        }
      });
    }
  },
  created: function () {
    var self = this;
    var token = localStorage.getItem('jwt_token');
    if(token) {
      var decoded = jwt_decode(token);
      if(decoded.exp*1000 > Date.now()) {
        var user = JSON.parse(localStorage['user']);
        if(user.isVerified) {
          this.username = user.username;
          var joined_user = {
            username: user.username,
            user_id: user.user_id
          };
          this.$socket.emit('joined', joined_user);
          Materialize.toast('Welcome ' + user.username, 2000);
        } else {
          Materialize.toast('Please verify your account first',2000);
          router.push('/profile');
        }
      } else {
        alert('expired');
        router.push('/');
      }
    } else {
      router.push('/');
    }




    /*var decoded = jwt_decode(localStorage.getItem('jwt_token'));
    if(decoded.exp*1000 > Date.now()) {
      var user = JSON.parse(localStorage['user']);
      if(user.isVerified) {
        this.username = user.username;
        var joined_user = {
          username: user.username,
          user_id: user.user_id
        };
        this.$socket.emit('joined', joined_user);
        Materialize.toast('Welcome ' + user.username, 2000);
      } else {
        alert('expired');
        router.push('/profile');
      }
    } else {
      alert('not logged in');
      router.push('/');
    }*/
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#logout {
  position: fixed;
  top: 10px;
  right: 20px;
}
#chat {
  position: absolute;
  height:30%;
  width: 100%;
  margin-bottom: 0px;

}
#input-chat {
  position: fixed;
  bottom:0;
  height: 10%;
  width: 100%;
  background-color: red;
}

#inp {
  margin-bottom:0px;
}
.row {
  margin: 0px;
}
#menuCollaps {
  position:fixed;
  right:10px;
  top: 0px;
  font-size:30px;
  cursor:pointer
}
.sidenav {
    height: 90%;
    width: 300px;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    background-color: yellow;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 60px;
    display: none;
}
.sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
}
@media screen and (max-width: 991px) {
  .sidenav {
    width: 100%;
  }
  #menuCollaps {
    font-size:60px;
  }
}
.btn.small {
  height: 24px;
  line-height: 24px;
  padding: 0 0.5rem;
}
.useritem {
  margin-bottom: 10px;
}
#messages li:nth-child(even) {
  background:red;
}
#clear {
  cursor: pointer;
}
#clear:hover {
  color:#f44336;
}


</style>
