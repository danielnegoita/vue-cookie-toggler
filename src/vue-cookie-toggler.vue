<template>
  <div>
    <gdpr-modal v-if="!isSettings" :toggle-modal="toggleModal">
      <template #header> {{ title }} </template>

      <slot />

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
            class="vct__btn vct__btn--default"
            @click="showSettings"
          >
            {{ settingsLabel }}
          </button>

          <button
            type="button"
            class="vct__btn vct__btn--primary"
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

      <slot name="settingsContent" />

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
            class="vct__btn vct__btn--default"
            @click="allowAll"
          >
            {{ acceptLabel }}
          </button>
          <button
            type="button"
            class="vct__btn vct__btn--primary"
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
            has(group, 'category') &&
            has(group, 'name') &&
            has(group, 'description') &&
            has(group, 'active')
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
    this.blockCookies();

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
        cookie.active = true;
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
      cookieGroup.active = !cookieGroup.active;
    },

    blockCookies() {
      parsers.init();
      this.initListeners();
    },

    enableCookies() {
      parsers.enable(this.getActiveCategories());
    },

    updateCookies() {
      parsers.update(this.getActiveCategories());
      this.initListeners();
    },

    getActiveCategories() {
      let activeCategories = [];

      forEach(this.getConsent(), (cookie) => {
        if (cookie.active) {
          activeCategories.push(cookie.category);
        }
      });

      return activeCategories;
    },

    /**
     * Add data-cookie-toggler="settings" to any element on the page to show the Cookie Settings modal
     * ex: <a href="#" data-cookie-toggler"settings">Cookie settings</a>
     */
    initListeners() {
      let elements = Array.from(
        document.querySelectorAll('[data-cookie-toggler="settings"]')
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
