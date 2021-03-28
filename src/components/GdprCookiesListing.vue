<template>
    <div class="cookies-consent_list" id="cookiesConsentList" role="tablist" aria-multiselectable="true">
        <v-collapse-group :onlyOneActive="true">
            <v-collapse-wrapper
                    v-for="cookieGroup in cookiesGroups"
                    :key="cookieGroup.name"
                    @onStatusChange="toggleActiveClass"
            >
                <div class="cookie-item">
                    <div class="cookie-item__heading" role="tab" :id="`cookieHeading_${cookieGroup.name}`">
                        <h4 v-collapse-toggle class="cookie-item__title">
                            <img class="cookie-item__title-img" src="data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' width='10' height='10' xmlns='http://www.w3.org/2000/svg'><g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='7A8990'/></g></svg>"/>
                            {{ cookieGroup.title }}
                        </h4>
                        <switches :emit-on-mount="false"
                                  :value="cookieGroup.allowed"
                                  @input="toggleCookieGroupConsent(cookieGroup)"
                                  theme="custom"
                                  color="blue"
                                  :disabled="cookieGroup.disabled"
                        ></switches>
                    </div>
                    <div v-collapse-content class="cookie-item__body">
                        <div class="cookie-item__description" v-html="cookieGroup.description"></div>
                    </div>
                </div>
            </v-collapse-wrapper>
        </v-collapse-group>
    </div>
</template>

<script>
    import Switches from 'vue-switches';
    // import VueCollapse from 'vue2-collapse';

    export default {
        name: 'GdprCookiesListing',

        components: {
            Switches,
            // VueCollapse
        },

        props: {
            cookiesGroups: {
                type: Array,
                default: []
            }
        },

        methods: {
            toggleCookieGroupConsent(cookieGroup) {
                this.$emit('tooggle-cookie-group-consent', cookieGroup);
            },

            toggleActiveClass(e) {
                if(true === e.status) {
                    return e.vm.nodes.toggle.className = "cookie-item__title cookie-item__active";
                }
                return e.vm.nodes.toggle.className = "cookie-item__title";
            }
        }
    }
</script>

<style scoped>
    .v-collapse-content {
        max-height: 0;
        overflow: hidden;
        padding: 0;
        transition: all 150ms ease;
    }

    .v-collapse-content-end {
        max-height: 500px;
        transition: all 150ms ease;
    }

    .cookie-item__active .cookie-item__title-img {
        transform: rotate(180deg);
        transition: transform 150ms ease-out;
    }

    .cookies-consent_list {
        margin-top: 30px;
        margin-bottom: 10px;
    }
    .cookie-item {
        border-radius: 3px;
        background-color: #F8F8F8;
        margin-bottom: 10px;
    }
    .cookie-item__heading {
        border: none;
        padding: 0 15px;
        border-radius: 3px;
        background-color: #F8F8F8;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .cookie-item__title {
        color: #142F47;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
    }
    .cookie-item__title-img {
        margin-right: 5px;
    }

    .cookie-item__body {
        border: 2px solid #F8F8F8 !important;
        border-top: 0 !important;
        background-color: #ffffff;
        -webkit-border-bottom-right-radius: 3px;
        -webkit-border-bottom-left-radius: 3px;
        -moz-border-radius-bottomright: 3px;
        -moz-border-radius-bottomleft: 3px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    .cookie-item__description {
        padding: 16px;
        color: #7A8990;
        font-family: sans-serif;
        font-size: 12px;
        line-height: 20px;
    }
    label.vue-switcher {
        margin-bottom: 0 !important;
    }
    .cookie-item__heading >>> .vue-switcher-theme--custom.vue-switcher-color--blue div {
        background-color: rgba(36,130,217,0.38);
    }
    .cookie-item__heading >>> .vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div {
        background-color: rgba(0,0,0,0.38);
    }
    .cookie-item__heading >>> .vue-switcher-theme--custom.vue-switcher-color--blue div:after {
        background-color: #2482D9;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2);
    }
    .cookie-item__heading >>> .vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div:after {
        background-color: #ffffff;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2);
    }
</style>