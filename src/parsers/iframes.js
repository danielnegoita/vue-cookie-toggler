/*
Usage:
<iframe
    data-src="https://www.youtube.com"
    data-cookie="true"
    data-category="analytics"
    data-placeholder="true"
    alt="Please accept cookie policy first"
></iframe>

Params:
@param  data-cookie="true" (required) - the iframe will be consider a cookie.
@param  data-src (required) - iframe url. From this parameter the iframe "src" will be created.
@param  data-category (required) - in which category to put the cookie (ex: analytics)
@param data-placeholder (optional) - it will show an "alt" text while is blocked
@param alt (optional) - the text to show while the iframe us blocked. if is not specified a default one will be added. see "defaultText" below

Other:
Add data-gdpr-action="showOptions" to any element on the page to show Privacy Options popup
ex: <a href="#" data-gdpr-action="showOptions">Enable Cookies</a>
 */

import { forEach, has, isEmpty, isNull, isString, isArray, flatMap, flatten, isUndefined } from 'lodash';

const OPTIONS = {
    querySelector: 'iframe[data-cookie="true"]',
    srcSelector: 'data-src',
    categorySelector: 'data-category',
    placeholder: {
        selector: 'data-placeholder',
        className: 'gdpr_placeholder_text',
        textSelector: 'alt',
        defaultText: 'To view this content you need to <a href="#" data-gdpr-action="showOptions">Enable Cookies</a>'
    },
    validation: { // for developers
        missingSrc: 'Missing iframe <strong>data-src</strong> attribute.',
        srcRequired: 'Attribute <strong>data-src</strong> has no value specified.',
        missingCategory: 'Missing iframe <strong>data-category</strong> attribute.',
        categoryRequired: 'Attribute <strong>data-category</strong> has no value specified.',
    }
};

const iframesByCategories = {};

export default {
    init() {
        let iframes = Array.from(document.querySelectorAll(OPTIONS.querySelector));

        forEach(iframes, (iframe) => {
            // validate - check if srcSelector is defined
            if( ! iframe.hasAttribute(OPTIONS.srcSelector)) {
                this.addPlaceholder(iframe, OPTIONS.validation.missingSrc);
                return;
            }

            // validate - check if srcSelector values is set
            if( isEmpty(iframe.getAttribute(OPTIONS.srcSelector)) ) {
                this.addPlaceholder(iframe, OPTIONS.validation.srcRequired);
                return;
            }

            // validate - check if categorySelector is defined
            if( ! iframe.hasAttribute(OPTIONS.categorySelector) ) {
                this.addPlaceholder(iframe, OPTIONS.validation.missingCategory);
                return;
            }

            // validate - check if categorySelector value is set
            if( isEmpty(iframe.getAttribute(OPTIONS.categorySelector)) ) {
                this.addPlaceholder(iframe, OPTIONS.validation.categoryRequired);
                return;
            }

            iframe.style.display = 'none';
            this.addPlaceholder(iframe);

            let category = iframe.getAttribute(OPTIONS.categorySelector);
            if( ! has(iframesByCategories, category) ) {
                iframesByCategories[category] = [];
            }

            iframesByCategories[category].push(iframe);
        });
    },

    /**
     * @param categories - array | string
     */
    enable(categories = null) {
        // null | empty array - no category will be enabled
        if( isEmpty(categories) ) {
            return;
        }

        let iframes = this.getByCategories(categories);
        if( isEmpty(iframes) ) {
            return;
        }

        forEach(iframes, (iframe) => {
            this.enableIframe(iframe);
        })
    },

    disable() {
        let iframes = this.getAll();

        forEach(iframes,(iframe) => {
            this.disableIframe(iframe);
        });
    },

    /**
     *
     * @param categories - array | string
     */
    update(categories) {
        this.disable();
        this.enable(categories);
    },

    enableIframe(iframe) {
        iframe.src = iframe.getAttribute(OPTIONS.srcSelector);
        iframe.style.display = 'block';

        this.removePlaceholder(iframe);
    },

    disableIframe(iframe) {
        if("" === iframe.src) {
            return;
        }

        iframe.setAttribute(OPTIONS.srcSelector, iframe.src);
        iframe.style.display = 'none';
        iframe.removeAttribute('src');

        this.addPlaceholder(iframe);
    },

    getAll() {
        if( isEmpty(iframesByCategories) ) {
            return null;
        }

        return flatMap(iframesByCategories, (iframe) => {
            return iframe;
        })
    },

    getByCategories(categories) {

        if(isString(categories)) {
            return this.getByCategory(categories);
        }

        if( ! isArray(categories) ) {
            return null;
        }

        let result = [];
        forEach(categories, (category) => {
            let items = this.getByCategory(category);
            if( ! isNull(items) ) {
                result.push(items);
            }
        });

        return flatten(result);
    },

    getByCategory(category) {
        if( ! has(iframesByCategories, category) ) {
            return null;
        }

        return iframesByCategories[category];
    },

    addPlaceholder(iframe, innerHTML = null) {
        if( ! iframe.hasAttribute(OPTIONS.placeholder.selector) ||
            ! JSON.parse(iframe.getAttribute(OPTIONS.placeholder.selector))
        ) {
            return;
        }

        let placeholderElement = document.createElement('div');
        placeholderElement.className = OPTIONS.placeholder.className;
        placeholderElement.setAttribute('data-id', iframe.getAttribute(OPTIONS.srcSelector));
        placeholderElement.innerHTML = OPTIONS.placeholder.defaultText;

        if( iframe.hasAttribute(OPTIONS.placeholder.textSelector) ) {
            placeholderElement.innerHTML = iframe.getAttribute(OPTIONS.placeholder.textSelector);
        }

        // overwrite previous set innerHTML
        if(null !== innerHTML) {
            placeholderElement.innerHTML = innerHTML;
        }

        iframe.parentNode.insertBefore(placeholderElement, iframe);
    },

    removePlaceholder(iframe) {
        const src = iframe.getAttribute(OPTIONS.srcSelector);
        const placeholderElement = document.querySelector(`div[data-id="${src}"]`);

        if(isNull(placeholderElement)) {
            return;
        }

        placeholderElement.remove();
    }
};