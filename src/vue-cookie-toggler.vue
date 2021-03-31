<template>
  <div>
    <gdpr-modal v-if="!showMoreInfoTab" :toggle-modal="toggleModal">
      <template #header> Review our cookie policy </template>

      <p>
        Use cookies that are essential to the operation of our websites. These
        cookies are strictly necessary to provide you with services available on
        our websites and to use some of its features.
      </p>

      <enable-cookies-alert />

      <template #footer>
        <button
          type="button"
          class="cookie-consent_modal__button cookie-consent_modal__button-default"
          @click="showMoreInfoTab = true"
        >
          More information
        </button>
        <button
          type="button"
          class="cookie-consent_modal__button cookie-consent_modal__button-primary"
          @click="allowAll"
        >
          Accept cookies
        </button>
      </template>
    </gdpr-modal>

    <gdpr-modal v-else :toggle-modal="toggleModal">
      <template #header> Your privacy options </template>

      <p>
        Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae
        luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing,
        commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit
        tortor. Sed semper lorem at felis.
      </p>

      <enable-cookies-alert />

      <gdpr-cookies-listing
        :cookies-groups="cookies"
        @tooggle-cookie-group-consent="updateCookieGroupConsent"
      />

      <template #footer>
        <button
          type="button"
          class="cookie-consent_modal__button cookie-consent_modal__button-default"
          @click="allowAll"
        >
          Allow all
        </button>
        <button
          type="button"
          class="cookie-consent_modal__button cookie-consent_modal__button-primary"
          @click="saveConsent"
        >
          Save settings
        </button>
      </template>
    </gdpr-modal>
  </div>
</template>

<script>
import parsers from '@/parsers';
import gdprService from '@/services/gdprService';
import {
  GdprModal,
  GdprCookiesListing,
  EnableCookiesAlert,
} from '@/components';
import {
  has,
  forEach,
  isNull,
  isUndefined,
  isObject,
  chain,
  split,
  trim,
  find,
} from 'lodash';

export default {
  name: 'VueCookieToggler',

  components: {
    GdprModal,
    GdprCookiesListing,
    EnableCookiesAlert,
  },

  props: {
    cookiesGroups: {
      type: Array,
      required: true,
      validator: (groups) => {
        return groups.every((group) => {
          return (
            isObject(group) &&
            has(group, 'name') &&
            has(group, 'title') &&
            has(group, 'description') &&
            has(group, 'allowed') &&
            has(group, 'disabled')
          );
        });
      },
    },

    /**
     * comma separated routes
     * ex: <vue-cookie-toggler exclude-pages="/terms, /privacy-policy"></vue-cookie-toggler>
     **/
    excludePages: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      toggleModal: false,
      showMoreInfoTab: false,
      cookies: this.hasConsent() ? this.getConsent() : this.cookiesGroups,
    };
  },

  mounted() {
    // this.blockCookies();

    this.init();
  },

  methods: {
    init() {
      if (this.isCurrentPageExcluded()) {
        return;
      }

      if (!this.hasConsent()) {
        this.toggleModal = true;
        return;
      }

      this.enableCookies();
    },

    isCurrentPageExcluded() {
      if (isNull(this.excludePages)) {
        return false;
      }

      return this.isPageExcluded(this.getCurrentPageUrl());
    },

    getCurrentPageUrl() {
      return window.location.pathname;
    },

    isPageExcluded(page) {
      return !chain(this.excludePages)
        .split(',')
        .find((exPage) => {
          return trim(exPage) === page;
        })
        .isUndefined() // we have to return the chain() negated result
        .value();
    },

    hasConsent() {
      return gdprService.hasConsent();
    },

    allowAll() {
      forEach(this.cookies, (cookie) => {
        cookie.allowed = true;
      });
      this.saveConsent();
    },

    saveConsent() {
      gdprService.saveConsent(this.cookies);

      this.toggleModal = false;

      this.updateCookies();
    },

    getConsent() {
      return gdprService.getConsent();
    },

    updateCookieGroupConsent(cookieGroup) {
      cookieGroup.allowed = !cookieGroup.allowed;
    },

    blockCookies() {
      parsers.init();
      this.initListeners();
    },

    enableCookies() {
      parsers.enable(this.getAllowedCategories());
    },

    updateCookies() {
      parsers.update(this.getAllowedCategories());
      this.initListeners();
    },

    getAllowedCategories() {
      let allowedCategories = [];

      forEach(this.getConsent(), (cookie) => {
        if (cookie.allowed) {
          allowedCategories.push(cookie.name);
        }
      });

      return allowedCategories;
    },

    /**
     * Add data-gdpr-action="showOptions" to any element on the page to show Privacy Options popup
     * ex: <a href="#" data-gdpr-action="showOptions">Enable Cookies</a>
     */
    initListeners() {
      let elements = Array.from(
        document.querySelectorAll('[data-gdpr-action="showOptions"]')
      );

      forEach(elements, (elem) => {
        elem.addEventListener('click', () => {
          this.showMoreInfoTab = true;
          this.toggleModal = true;
        });
      });
    },
  },
};
</script>
