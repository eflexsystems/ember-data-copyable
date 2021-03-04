import setupMirage from '../helpers/setup-mirage';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Copyable | transforms', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    return setupMirage(this);
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  test('it handles object transform', function (assert) {
    assert.expect(3);

    let model = this.store.peekRecord('foo-transform', 1);
    let copy = model.copy(true);

    assert.equal(model.object.foo, 'bar');
    assert.equal(copy.object.foo, 'bar');
    assert.notEqual(copy.object, model.object.foo);
  });
});
