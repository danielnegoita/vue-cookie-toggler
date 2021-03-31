import Vue from 'vue';
import VModal from 'vue-js-modal';
import GdprModal from './GdprModal';
import VueCollapse from 'vue2-collapse';
import GdprCookiesListing from './GdprCookiesListing.vue';
import EnableCookiesAlert from './EnableCookiesAlert.vue';

Vue.use(VueCollapse);
Vue.use(VModal, { componentName: 'vue-cookie-toggler-modal' });

export { GdprModal, GdprCookiesListing, EnableCookiesAlert };
