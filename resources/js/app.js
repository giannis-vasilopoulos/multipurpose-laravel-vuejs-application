
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import moment from 'moment';

import { Form, HasError, AlertError } from 'vform'

import swal from 'sweetalert2/dist/sweetalert2.js'
window.swal = swal;

import 'sweetalert2/src/sweetalert2.scss'
const toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
window.toast = toast;

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

window.Fire = new Vue(); // Assign it to window make it accessible from every file

import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue') },
    { path: '/profile', component: require('./components/Profile.vue') },
    { path: '/developer', component: require('./components/Developer.vue') },
    { path: '/users', component: require('./components/Users.vue') }

  ]
  
 const router = new VueRouter({
    routes // short for `routes: routes`
 })


/* Vue Filters */
 Vue.filter('uptext', function(text){
    return text.charAt(0).toUpperCase() + text.slice(1)
 });
 Vue.filter('myDate', function(created){
    return moment(created).format("Do MMM YYYY");  
 });

import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '16px'
})

Vue.component(
  'passport-clients',
  require('./components/passport/Clients.vue')
);

Vue.component(
  'passport-authorized-clients',
  require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
  'passport-personal-access-tokens',
  require('./components/passport/PersonalAccessTokens.vue')
);
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

const app = new Vue({
    el: '#app',
    router
});
