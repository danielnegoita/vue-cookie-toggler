import iframes from './iframes';
import scripts from './scripts';

export default {
  init() {
    scripts.init();
    iframes.init();
  },

  /**
   * @param categories - array | string
   */
  enable(categories) {
    scripts.enable(categories);
    iframes.enable(categories);
  },

  /**
   * @param categories - array | string
   */
  update(categories) {
    scripts.update(categories);
    iframes.update(categories);
  },
};
