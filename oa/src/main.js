/**
 * Created by H5 on 2017.04.14.
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import iView from 'iview';
import axios from 'axios';
import 'iview/dist/styles/iview.css';
import  store  from './store';

Vue.use(iView);
Vue.prototype.$ajax = axios;

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});