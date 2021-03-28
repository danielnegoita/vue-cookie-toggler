<template>
    <vue-cookie-toggler-modal name="gdpr-modal" :maxWidth="505" :adaptive="true" height="auto" :scrollable="true" :clickToClose="false" :pivotY="0.3">
        <div class="cookie-consent_modal" id="cookieConsentModal" tabindex="-1" role="dialog" aria-labelledby="cookieConsentModalLabel">
            <div class="cookieConsent-modal__content">
                <div class="cookie-consent_modal__header">
                    <h4 class="cookie-consent_modal__header-title" id="cookieConsentModalLabel">
                        <slot name="header"></slot>
                    </h4>
                    <hr>
                </div>
                <div class="cookieConsent-modal__body">
                    <slot></slot>
                </div>
                <div class="cookie-consent_modal__footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </vue-cookie-toggler-modal>
</template>

<script>
    export default {
        name: 'GdprModal',

        props: {
            toggleModal: {
                type: Boolean,
                default: false
            }
        },

        watch: {
            toggleModal(toggle) {
                if(toggle) {
                    this.$modal.show('gdpr-modal');
                    return;
                }

                this.$modal.hide('gdpr-modal');
            }
        }
    }
</script>

<style lang="scss">
    $font-family: sans-serif;
    $color-gray: #7a8990;
    $button-default: #e1e7ec;
    $button-primary: #288EDE;
    $boder-radius: 5px;

    .cookie-consent_modal {
        padding: 30px;
        font-family: $font-family;
        line-height: 20px;
        color: $color-gray;

        &:focus {
            outline: none;
        }

        .cookie-consent_modal__header {
            .cookie-consent_modal__header-title {
                margin: 0 0 20px 0;
                font-size: 16px;
                font-weight: bold;
                color: #142F47;
            }

            hr {
                height: 1px;
                width: 100%;
                border: 0;
                background: #eee;
            }
        }

        .cookieConsent-modal__body {
            margin-top: 20px;
        }

        .cookie-consent_modal__footer {
            border: 0;
            margin-top: 25px;
            text-align: right;
        }

        .cookie-consent_modal__button {
            padding: 12px 24px;
            margin-right: 10px;
            border-radius: $boder-radius;
            border: 1px solid transparent;
            line-height: 14px;
            font-size: 14px;
            font-family: $font-family;
            white-space: nowrap;
            vertical-align: middle;
            cursor: pointer;

            &:nth-last-child(1) {
                margin-right: 0;
            }

            &:focus {
                outline: none;
            }
        }

        .cookie-consent_modal__button-default {
            background: none;
            border: 2px solid $button-default;
            color: #142F47;

            &:hover {
                background-color: $button-default;
            }
        }

        .cookie-consent_modal__button-primary {
            background-color: $button-primary;
            color: #ffffff;

            &:hover {
                background-color: darken($button-primary, 10%);
            }
        }
    }
</style>