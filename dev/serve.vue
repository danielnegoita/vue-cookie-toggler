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
          name: 'essential',
          title: 'Essential website cookies',
          description:
            'Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.',
          allowed: true,
          disabled: true,
        },
        {
          name: 'performance',
          title: 'Performance and functionality',
          description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
          allowed: false,
          disabled: false,
        },
        {
          name: 'analytics',
          title: 'Analytics and customisation',
          description:
            'Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis.',
          allowed: false,
          disabled: false,
        },
      ],
    };
  },
});
</script>

<template>
  <div id="app">
    <vue-cookie-toggler :cookies-groups="cookiesGroups" />
  </div>
</template>
