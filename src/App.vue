<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import LogOut from '@/components/LogOut';
import jwt_decode from 'jwt-decode';
export default {
  name: 'App',
  components: {
    LogOut
  },
  data () {
    return {
      user: {
        username: '',
        email: ''
      },
      auth: false
    }
  },
  methods: {
    refresh_token: function() {
      if(localStorage.getItem('jwt_token')) {
        var decoded = jwt_decode(localStorage.getItem('jwt_token'));
        if(decoded.exp*1000 > Date.now()) {
          var ref_token = localStorage.getItem('refresh_token');
          var comp_date = Date.now();
          var diff = decoded.exp*1000 - comp_date;
          if(diff <= 300000) {
            $.ajax({
              url: "http://localhost:3000/api/refreshtoken",
              type: 'POST',
              headers: {"x-refresh-token": localStorage.getItem('jwt_token')},
              success: function(data) {
                localStorage.setItem('jwt_token', data.jwt_token);
              }
            });
          }
        }
      }
    },
    refresh_token_loop: function () {
      var self = this;
      setInterval(function () {
        self.refresh_token();
      }, 300000);
    }
  },
  created: function () {
        this.refresh_token();
        this.refresh_token_loop();
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
.text-danger {
  color: #f44336;
  font-weight: bold;
  letter-spacing: 0.3px;
}
@-webkit-keyframes autofill {
    to {
        color: #546e7a;
        background: transparent;
    }
}

input:-webkit-autofill {
    -webkit-animation-name: autofill;
    -webkit-animation-fill-mode: both;
}

.input-field > input[type]:focus + label {
  color: #546e7a;
}
</style>
