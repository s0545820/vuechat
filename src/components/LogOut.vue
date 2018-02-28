<template>
  <div id="logout">
    <button class="btn red" v-on:click="logOut">Logout</button>
  </div>
</template>

<script>
import router from '../router/index'
export default {
  name: 'logout',
  data () {
    return {
    }
  },
  methods: {
    logOut: function(e) {
      e.preventDefault();
      localStorage.deleteItem('jwt_token');
      localStorage.deleteItem('refresh_token');
      Materialize.toast('You have been successfully logged out.', 4000);
      router.push('/');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#logout {
  position: fixed;
  top: 0;
  right: 20px;
  z-index: 100;
}



</style>
