/*
TODO: maybe improve the way the scripts are updated -@see update() method

Usage:

Example 1:
<script type="text/plain" data-cookie="true" data-category="analytics" src="/path/to/file.js"></script>

Example 2:
<script type="text/plain" data-cookie="true" data-category="essential">
    // .. you're awesome code here
</script>

Params:
@param  data-cookie="true" (required) - the script will be consider a cookie.
@param  data-category (required) - in which category to put the cookie (ex: analytics)
@param  type="text/plain" (required) - will prevent the browser from executing the script. Latter on it will be changed into type="text/javascript"
 */

import postscribe from 'postscribe';
import {
  forEach,
  has,
  isEmpty,
  isNull,
  isString,
  isArray,
  flatMap,
  flatten,
} from 'lodash';

const OPTIONS = {
  querySelector: 'script[data-cookie="true"]',
  typeSelector: 'text/plain',
  categorySelector: 'data-category',
  validation: {
    // for developers
    wrongType:
      'Missing / Wrong script type tag! Make sure you have type="text/plain" defined on the script tag.',
    missingCategory: 'Missing iframe <strong>data-category</strong> attribute.',
    categoryRequired:
      'Attribute <strong>data-category</strong> has no value specified.',
  },
};

const scriptsByCategories = {};

export default {
  init() {
    let scripts = Array.from(document.querySelectorAll(OPTIONS.querySelector));

    forEach(scripts, (script) => {
      // validate - check if typeSelector is present and set right
      if (script.type !== OPTIONS.typeSelector) {
        console.error(OPTIONS.validation.wrongType);
        return;
      }

      // validate - check if categorySelector is defined
      if (!script.hasAttribute(OPTIONS.categorySelector)) {
        console.error(OPTIONS.validation.missingCategory);
        return;
      }

      // validate - check if categorySelector value is set
      if (isEmpty(script.getAttribute(OPTIONS.categorySelector))) {
        console.error(OPTIONS.validation.categoryRequired);
        return;
      }

      let category = script.getAttribute(OPTIONS.categorySelector);
      if (!has(scriptsByCategories, category)) {
        scriptsByCategories[category] = [];
      }

      scriptsByCategories[category].push(script);
    });
  },

  /**
   * @param categories - array | string
   */
  enable(categories) {
    // null | empty array - no category will be enabled
    if (isEmpty(categories)) {
      return;
    }

    let scripts = this.getByCategories(categories);
    if (isEmpty(scripts)) {
      return;
    }

    const documentFragment = document.createDocumentFragment();

    forEach(scripts, (script) => {
      this.addScriptToDOM(script, documentFragment);
    });

    document.body.appendChild(documentFragment);
  },

  /**
   * Target the script tags added in enable() -> addScriptToDOM() and remove them
   *
   * data-gdpr-target - attribute is added in addScriptToDOM to target the script tag and remove it
   */
  disable() {
    document.querySelectorAll('script[data-gdpr-target]').forEach((script) => {
      script.remove();
    });
  },

  /**
   *  How the update process works:
   *  1. the scripts are remove from the DOM - @see disable() method
   *  2. the scripts are added again to the DOM and executed again (which could be an issue) !!! - @see enable() method
   *
   * @param categories - array | string
   */
  update(categories) {
    this.disable();
    this.enable(categories);
  },

  /**
   * @deprecated
   */
  getAll() {
    if (isEmpty(scriptsByCategories)) {
      return null;
    }

    return flatMap(scriptsByCategories, (script) => {
      return script;
    });
  },

  getByCategories(categories) {
    if (isString(categories)) {
      return this.getByCategory(categories);
    }

    if (!isArray(categories)) {
      return null;
    }

    let result = [];
    forEach(categories, (category) => {
      let items = this.getByCategory(category);
      if (!isNull(items)) {
        result.push(items);
      }
    });

    return flatten(result);
  },

  getByCategory(category) {
    if (!has(scriptsByCategories, category)) {
      return null;
    }

    return scriptsByCategories[category];
  },

  /**
   * Note:
   * data-gdpr-target - attribute is added to later target the script tag and remove it - @see disable() function
   *
   * @param script
   * @param documentFragment
   */
  addScriptToDOM(script, documentFragment) {
    // if it has 'src' them use postscribe - @see https://www.npmjs.com/package/postscribe
    if (script.hasAttribute('src')) {
      postscribe(
        script.parentNode,
        '<script data-gdpr-target="' +
          script.getAttribute(OPTIONS.categorySelector) +
          '" src="' +
          script.getAttribute('src') +
          '"></script>'
      );
      return;
    }

    // create the script tag
    let node = document.createElement('script');
    node.type = 'text/javascript';

    forEach(script.attributes, (attrib) => {
      if (attrib.specified) {
        if (attrib.name !== 'type' && attrib.name !== 'class') {
          node.setAttribute(attrib.name, attrib.value);
        }
      }
    });
    // data-gdpr-target - attribute is added to later target the script tag and remove it - @see disable() function
    node.setAttribute(
      'data-gdpr-target',
      script.getAttribute(OPTIONS.categorySelector)
    );

    node.innerHTML = script.innerHTML;
    documentFragment.appendChild(node);
  },
};
