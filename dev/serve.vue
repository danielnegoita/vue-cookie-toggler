<script>
import Vue from 'vue';
import VueCookieToggler from '@/vue-cookie-toggler.vue';

export default Vue.extend({
  name: 'ServeDev',

  components: {
    VueCookieToggler,
  },

  data() {
    return {
      cookiesGroups: [
        {
          category: 'essential',
          name: 'Essential website cookies',
          description:
            'Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.',
          active: true,
          required: true,
        },
        {
          category: 'analytics',
          name: 'Analytics and customization',
          description:
            'Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis.',
          active: false,
        },
        {
          category: 'social_networking',
          name: 'Social networking',
          description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
          active: false,
        },
      ],
    };
  },
});
</script>

<template>
  <div id="app">
    <vue-cookie-toggler
      :cookies-groups="cookiesGroups"
      title="Cookie policy title"
      settings-title="Cookie settings title"
      settings-label="Settings button label"
      accept-label="Accept button label"
      save-label="Save button label"
      cancel-label="Cancel button label"
    >
      Cookie policy message

      <template #settingsContent> Cookie settings message </template>

      <template #mainButtons="{ accept, settings }">
        <button class="vct__btn vct__btn--default" @click="settings">
          Customize settings
        </button>
        <button class="vct__btn vct__btn--primary" @click="accept">
          Accept all cookies
        </button>
      </template>

      <template #settingsButtons="{ accept, save }">
        <button class="vct__btn vct__btn--default" @click="accept">
          Accept all cookies
        </button>
        <button class="vct__btn vct__btn--primary" @click="save">
          Save settings
        </button>
      </template>
    </vue-cookie-toggler>

    <div class="flex justify-center align-center">
      <button data-cookie-toggler="settings">Open cookies settings</button>

      <iframe
        data-cookie
        data-category="analytics"
        data-placeholder="true"
        alt="Please accept the cookie policy to see the content"
        data-src="https://www.youtube.com/embed/azUbCdcAeFM"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
</style>
