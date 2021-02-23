import generateTests from './copyable-tests';
import setupMirage from '../helpers/setup-mirage';
import { module } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Copyable | async', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    return setupMirage(this, { async: true });
  });

  hooks.afterEach(function() {
   this.server.shutdown();
 });

  generateTests({ async: true });
});
