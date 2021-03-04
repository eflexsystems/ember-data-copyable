import { module, test } from 'qunit';
import setupMirage from '../helpers/setup-mirage';
import { setupTest } from 'ember-qunit';

module('Integration | Copyable', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    return setupMirage(this);
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  test('it shallow copies attributes', function (assert) {
    assert.expect(2);

    let model = this.store.peekRecord('foo', 1);
    let copy = model.copy();

    assert.equal(model.property, copy.property);
    assert.notEqual(copy.id, 1);
  });

  test('it shallow copies relationships', function (assert) {
    assert.expect(2);

    let model = this.store.peekRecord('baz', 1);
    let copy = model.copy(false);

    assert.equal(model.bar.id, copy.bar.id);
    assert.deepEqual(model.foos.getEach('id'), copy.foos.getEach('id'));
  });

  test('it copies belongsTo relationship', function (assert) {
    assert.expect(4);

    let model = this.store.peekRecord('bar', 1);
    let copy = model.copy(true);

    assert.equal(model.foo.property, copy.foo.property);
    assert.notEqual(copy.id, 1);
    assert.notOk(copy.foo.id);
    assert.notEqual(model.foo, copy.foo);
  });

  test('it copies belongsTo relationship by reference', function (assert) {
    assert.expect(5);

    let model = this.store.peekRecord('bar', 1);
    let copy = model.copy(true, {
      copyByReference: ['foo'],
    });

    assert.equal(model.belongsTo('foo').id(), copy.belongsTo('foo').id());
    assert.equal(model.foo, copy.foo);
    assert.equal(model.foo.property, copy.foo.property);
    assert.notEqual(copy.id, 1);
    assert.ok(copy.foo.id);
  });

  test('it copies empty belongsTo relationship', function (assert) {
    assert.expect(3);

    let model = this.store.peekRecord('fooEmpty', 1);
    let copy = model.copy(true);

    assert.equal(model.property, copy.property);
    assert.notEqual(copy.id, 1);

    assert.notOk(copy.foo);
  });

  test('it copies hasMany relationship', function (assert) {
    assert.expect(3);

    let model = this.store.peekRecord('baz', 1);
    let copy = model.copy(true);

    assert.notEqual(model.foos, copy.foos);
    assert.equal(model.foos.length, copy.foos.length);
    assert.deepEqual(
      model.foos.getEach('property'),
      copy.foos.getEach('property')
    );
  });

  test('it copies hasMany relationship by reference', function (assert) {
    assert.expect(3);

    let model = this.store.peekRecord('baz', 1);
    let copy = model.copy(true, {
      copyByReference: ['foos'],
    });

    assert.deepEqual(model.hasMany('foos').ids(), copy.hasMany('foos').ids());
    assert.equal(model.foos.length, copy.foos.length);
    assert.deepEqual(model.foos.getEach('id'), copy.foos.getEach('id'));
  });

  test('it copies complex objects', function (assert) {
    assert.expect(6);

    let model = this.store.peekRecord('multi', 1);
    let copy = model.copy(true);

    assert.notEqual(copy.bars.firstObject.id, 1);
    assert.notEqual(copy.bars.firstObject.foo.id, 1);
    assert.equal(copy.bars.firstObject.foo.property, 'prop1');
    assert.notEqual(copy.baz.id, 1);
    assert.notEqual(copy.baz.foos.lastObject.id, 2);
    assert.equal(copy.baz.foos.lastObject.property, 'prop2');
  });

  test('it copies empty objects', function (assert) {
    assert.expect(3);

    let model = this.store.peekRecord('multi', 2);
    let copy = model.copy(true);

    assert.notEqual(copy.id, 2);
    assert.equal(copy.bars.length, 0);
    assert.equal(copy.baz.foos.firstObject.property, 'prop1');
  });

  test('it copies cyclical relationship', function (assert) {
    assert.expect(6);

    let model = this.store.peekRecord('fooCycle', 1);
    let copy = model.copy(true);

    assert.equal(copy.property, '1');
    assert.equal(copy.fooCycle.property, '1');
    assert.notEqual(model.fooCycle.id, copy.fooCycle.id);
    assert.equal(copy.fooCycles.firstObject.property, '1');
    assert.equal(copy.fooCycles.lastObject.property, '2');
    assert.equal(copy.fooCycles.firstObject, copy.fooCycle);
  });
});
