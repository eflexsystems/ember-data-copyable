import setupMirage from '../helpers/setup-mirage';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Copyable | options', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    return setupMirage(this);
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  test('it overwrites attributes', function (assert) {
    assert.expect(3);

    let model = this.store.peekRecord('bar', 1);
    let copy = model.copy(true, {
      overwrite: {
        property: null,
        unknownProp: '_bar_',
        foo: this.store.createRecord('foo', { property: '_foo_' }),
      },
    });

    assert.equal(copy.property, null);
    assert.equal(copy.unknownProp, '_bar_');
    assert.equal(copy.foo.property, '_foo_');
  });

  test('it ignores attributes', function (assert) {
    assert.expect(2);

    let model = this.store.peekRecord('bar', 1);
    let copy = model.copy(true, {
      ignoreAttributes: ['property', 'foo'],
    });

    assert.notOk(copy.property);
    assert.notOk(copy.foo);
  });

  test('it copes other attributes', function (assert) {
    assert.expect(2);

    let model = this.store.peekRecord('bar', 1);

    model.setProperties({
      one: 1,
      two: 2,
    });

    let copy = model.copy(true, {
      otherAttributes: ['one', 'two'],
    });

    assert.equal(copy.one, 1);
    assert.equal(copy.two, 2);
  });

  test('it copies with nested options', function (assert) {
    assert.expect(1);

    let model = this.store.peekRecord('bar', 1);
    let copy = model.copy(true, {
      relationships: {
        foo: {
          ignoreAttributes: ['property'],
        },
      },
    });

    assert.notOk(copy.foo.property);
  });

  test('it handles relational deep copy overrides', function (assert) {
    assert.expect(1);

    let model = this.store.peekRecord('baz', 1);
    let copy = model.copy(true, {
      relationships: {
        bar: { deep: false },
      },
    });

    assert.equal(copy.bar.foo.id, 1);
  });

  test('it can override the property used for copyable options', function (assert) {
    assert.expect(2);

    let model = this.store.peekRecord('override-options-parent', 1);
    let copy = model.copy(true, {
      optionsPropertyName: 'otherOptions',
    });

    assert.equal(copy.property, 'derp');
    assert.equal(copy.overrideOptionsChilden.firstObject.property, 'herp');
  });
});
