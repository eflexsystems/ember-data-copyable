import setupMirage from '../helpers/setup-mirage';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop'

module('Integration | Copyable | fragments', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    return setupMirage(this, { async: true });
  });

  hooks.afterEach(function() {
   this.server.shutdown();
 });

  test('it copies with null fragments', async function(assert) {
    assert.expect(1);

    let model = this.store.createRecord('foo-fragment-holder');
    let copied;

    await run(async () => {
      copied = await model.copy(true);
    });

    assert.ok(copied);
  });

  test('it copies single framents', async function(assert) {
    assert.expect(1);

    let model = this.store.createRecord('foo-fragment-holder', {
      bar: { name: 'foo' }
    });

    let copied;

    await run(async () => {
      copied = await model.copy(true);
    });

    assert.equal(copied.get('bar.name'), 'foo')
  });

  test('it copies fragment arrays', async function(assert) {
    assert.expect(1);

    let model = this.store.createRecord('foo-fragment-holder', {
      foos: [{ name: 'foo' }]
    });

    let copied;

    await run(async () => {
      copied = await model.copy(true);
    });

    assert.equal(copied.get('foos.firstObject.name'), 'foo')
  });
});
