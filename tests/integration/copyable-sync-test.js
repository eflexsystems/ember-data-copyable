import generateTests from './copyable-tests';
import setupMirage from '../helpers/setup-mirage';
import { module } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Copyable | sync', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    return setupMirage(this, { async: false });
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  generateTests({ async: false });
});
