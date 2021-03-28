import { has } from 'lodash';

const EXPIRATION_DAYS = 30;
const ITEM_NAME = 'vue-cookie-toggler-consent';

export default {
    hasConsent() {
        if(! this.isStorageSupported()) {
            return false;
        }

        let consent = localStorage.getItem(ITEM_NAME);
        if(! consent) {
            return false;
        }

        let item = JSON.parse(consent);
        if(! has(item, 'expires')) {
            this.clearConsent();
            return false;
        }

        let today = new Date();
        if(today.getTime() >= item.expires) {
            this.clearConsent();
            return false;
        }

        return true;
    },

    getConsent() {
        if(! this.isStorageSupported()) {
            return [];
        }

        let consent = localStorage.getItem(ITEM_NAME);
        if(! consent) {
            return [];
        }

        let item = JSON.parse(consent);
        if(! has(item, 'data')) {
            this.clearConsent();
            return [];
        }

        return item.data;
    },

    saveConsent(cookiesGroups) {
        if(! this.isStorageSupported()) {
            return;
        }

        let date = new Date();
        let item = {
            data: cookiesGroups,
            expires: date.setTime(date.getTime() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000))
        };
        localStorage.setItem(ITEM_NAME, JSON.stringify(item));
    },

    clearConsent() {
        if(! this.isStorageSupported()) {
            return;
        }

        localStorage.removeItem(ITEM_NAME);
    },

    isStorageSupported() {
        try {
            const key = "gdpr_local_storage_test_key";
            localStorage.setItem(key, key);
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }
}