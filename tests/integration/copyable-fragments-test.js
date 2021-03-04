import setupMirage from '../helpers/setup-mirage';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Copyable | fragments', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    return setupMirage(this);
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  test('it copies with null fragments', function (assert) {
    assert.expect(1);

    let model = this.store.createRecord('foo-fragment-holder');
    let copied = model.copy(true);

    assert.ok(copied);
  });

  test('it copies single framents', function (assert) {
    assert.expect(1);

    let model = this.store.createRecord('foo-fragment-holder', {
      bar: { name: 'foo' },
    });
    let copied = model.copy(true);

    assert.equal(copied.bar.name, 'foo');
  });

  test('it copies fragment arrays', function (assert) {
    assert.expect(1);

    let model = this.store.createRecord('foo-fragment-holder', {
      foos: [{ name: 'foo' }],
    });
    let copied = model.copy(true);

    assert.equal(copied.foos.firstObject.name, 'foo');
  });
});
