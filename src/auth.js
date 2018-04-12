import jwt_decode from 'jwt-decode';
import router from './router/index';

export default {
  number: 1,
  user: {
    username: 'k',
    email: '',
    isAuthenticated: false,
    isVerified: false,
    social: false,
    banned: false,
    user_id: '',
    role: '',
    pictureURL: undefined
  },
  login(user) {
    $.post("https://cryptic-savannah-75374.herokuapp.com/api/login", user, function(result){
      localStorage.setItem('jwt_token', result.jwt_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      this.user.username = jwt_decode(localStorage.getItem('jwt_token')).username;
      this.user.email = jwt_decode(localStorage.getItem('jwt_token')).email;
      this.user.isVerified = jwt_decode(localStorage.getItem('jwt_token')).isVerified;
      this.user.user_id = jwt_decode(localStorage.getItem('jwt_token')).user_id;
      this.user.role = jwt_decode(localStorage.getItem('jwt_token')).role;
      this.user.banned = jwt_decode(localStorage.getItem('jwt_token')).banned;
      this.user.isAuthenticated = true;
      router.push('/profile');
    }).fail(function(jqXHR, textStatus, errorThrown) {
        if(jqXHR.status == 401) {
          Materialize.toast('Wrong Password',4000);
        } else if(jqXHR.status == 404) {
          Materialize.toast('User with this username does not exist.',4000);
        } else {
          Materialize.toast('Something went wrong. Please try again.',4000);
        }
    });
  },
  logout() {
    this.user.isAuthenticated = false;
  },
  register() {
            this.user.username = jwt_decode(localStorage.getItem('jwt_token')).username;
  },
  checkToken() {
    var token = localStorage.getItem('jwt_token');
    if(token) {
      var decoded = jwt_decode(token);
      if(decoded.exp*1000 > Date.now()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  changenumber() {
    this.number = 5;
  }
}
