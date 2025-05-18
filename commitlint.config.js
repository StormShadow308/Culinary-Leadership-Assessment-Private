import { RuleConfigSeverity } from '@commitlint/types';

/** @type {import('@commitlint/types').UserConfig} */
export default {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   */
  extends: ['@commitlint/config-conventional'],
  /*
   * Custom defined rules to override default rules from @commitlint/config-conventional
   */
  rules: {
    /*
     * Custom rule to extend the default body-max-length rule
     * to allow a maximum of 200 characters in the body of the commit message.
     * This is useful for longer commit messages that need to
     * provide more context or explanation.
     */
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 200],
  },
};
