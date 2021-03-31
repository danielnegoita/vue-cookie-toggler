<template>
  <div>
    <gdpr-modal v-if="!isSettings" :toggle-modal="toggleModal">
      <template #header> {{ title }} </template>

      <div>
        <slot />
      </div>

      <enable-cookies-alert />

      <template #footer>
        <slot
          name="mainButtons"
          :settings="showSettings"
          :accept="allowAll"
          :save="saveSettings"
          :cancel="closeModal"
        >
          <button
            type="button"
            class="cookie-consent_modal__button cookie-consent_modal__button-default"
            @click="showSettings"
          >
            {{ settingsLabel }}
          </button>

          <button
            type="button"
            class="cookie-consent_modal__button cookie-consent_modal__button-primary"
            @click="allowAll"
          >
            {{ acceptLabel }}
          </button>
        </slot>
      </template>
    </gdpr-modal>

    <gdpr-modal v-else :toggle-modal="toggleModal">
      <template #header>
        <template v-if="settingsTitle">{{ settingsTitle }}</template>
        <template v-else>{{ title }}</template>
      </template>

      <div>
        <slot name="settingsContent" />
      </div>

      <enable-cookies-alert />

      <gdpr-cookies-listing
        :cookies-groups="cookies"
        @tooggle-cookie-group-consent="updateCookieGroupConsent"
      />

      <template #footer>
        <slot
          name="settingsButtons"
          :settings="showSettings"
          :accept="allowAll"
          :save="saveSettings"
          :cancel="closeModal"
        >
          <button
            type="button"
            class="cookie-consent_modal__button cookie-consent_modal__button-default"
            @click="allowAll"
          >
            {{ acceptLabel }}
          </button>
          <button
            type="button"
            class="cookie-consent_modal__button cookie-consent_modal__button-primary"
            @click="saveSettings"
          >
            {{ saveLabel }}
          </button>
        </slot>
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

    title: {
      type: String,
      required: true,
    },

    settingsTitle: {
      type: String,
      required: false,
      default: null,
    },

    settingsLabel: {
      type: String,
      required: false,
      default: 'Customize settings',
    },

    acceptLabel: {
      type: String,
      required: false,
      default: 'Accept all cookies',
    },

    saveLabel: {
      type: String,
      required: false,
      default: 'Save settings',
    },

    cancelLabel: {
      type: String,
      required: false,
      default: 'Cancel',
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
      isSettings: false,
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

    closeModal() {
      this.toggleModal = !this.toggleModal;
    },

    showSettings() {
      this.isSettings = true;
    },

    allowAll() {
      forEach(this.cookies, (cookie) => {
        cookie.allowed = true;
      });
      this.saveSettings();
    },

    saveSettings() {
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
          this.isSettings = true;
          this.toggleModal = true;
        });
      });
    },
  },
};
</script>
