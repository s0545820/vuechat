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
      }
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

          //CHECK IF TOKEN VALID AND SET AUTH TO TRUE
          //This way every time the app is opened it gets checked if user is logged in
          //if token not valid set auth to false. auth is a prop
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
</style>
