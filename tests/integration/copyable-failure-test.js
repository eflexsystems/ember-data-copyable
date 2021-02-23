import setupMirage from '../helpers/setup-mirage';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Integration | Copyable | failure', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    return setupMirage(this, { async: true });
  });

  hooks.afterEach(function() {
   this.server.shutdown();
 });

  test('it handles async failures', async function(assert) {
    assert.expect(2);

    this.server.get('/foos/1', { errors: ['There was an error'] }, 500);

    let model;

    await run(async () => {
      model = await this.store.findRecord('bar', 1);
    });

    await run(async () => {
      try {
        await model.copy(true);
      } catch (e) {
        let models = this.store.peekAll('bar');

        assert.ok(e);
        assert.equal(models.get('length'), 1, 'All created copies were cleaned up');
      }
    });
  });

  test('it handles task cancellation', async function(assert) {
    assert.expect(2);

    let model;

    await run(async () => {
      model = await this.store.findRecord('bar', 1);
    });

    await run(async () => {
      try {
        let taskInstance = model.copy(true);
        taskInstance.cancel();

        await taskInstance;
      } catch (e) {
        let models = this.store.peekAll('bar');

        assert.ok(e);
        assert.equal(models.get('length'), 1, 'All created copies were cleaned up');
      }
    });
  });
});
