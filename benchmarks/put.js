/**
 * @fileOverview Cost to put the `nth` entry into a hash of size `n - 1`.
 */
var Benchmark = require('benchmark');

var ht = require('hashtrie');
var hamt = require('hamt');
var hamt_plus = require('hamt_plus');
var p = require('persistent-hash-trie');
var mori = require('mori');
var immutable = require('immutable');

var words = require('./words').words;
var api = require('./shared');

var nativeObjectPut = function(keys) {
  var h = api.nativeObjectFrom(keys.slice(1));
  var key = keys[0];
  return function() {
    var newKey = {};
    newKey[key] = 0;
    Object.assign({}, h, newKey);
  };
};

var nativeMapPut = function(keys) {
  var h = api.nativeMapFrom(keys.slice(1));
  var key = keys[0];
  return function() {
    c = new Map(h);
    c.set(key, 0);
  };
};

var hashtriePut = function(keys) {
    var h = api.hashtrieFrom(keys.slice(1));
    var key = keys[0];
    return function() {
        ht.set(0, key, h);
    };
};

var hamtPut = function(keys) {
    var h = api.hamtFrom(keys.slice(1));
    var key = keys[0];
    return function() {
        hamt.set(key, 0, h);
    };
};

var hamtPlusPut = function(keys) {
    var h = api.hamtPlusFrom(keys.slice(1));
    var key = keys[0];
    return function() {
        hamt_plus.set(key, 0, h);
    };
};

var pHashtriePut = function(keys) {
    var h = api.pHashtrieFrom(keys.slice(1));
    var key = keys[0];
    return function() {
        p.assoc(h, key, 0);
    };
};

var moriPut = function(keys) {
    var h = api.moriFrom(keys.slice(1));
    var key = keys[0];
    return function() {
        mori.assoc(h, key, 0);
    };
};

var immutablePut = function(keys) {
    var h = api.immutableFrom(keys.slice(1));
    var key = keys[0];
    return function() {
        h.set(key, 0);
    };
};


module.exports = function(sizes) {
    return sizes.reduce(function(b,size) {
        var keys = words(size, 10);
        return b
            .add('nativeObject(' + size + ')',
                nativeObjectPut(keys))

            .add('nativeMap(' + size + ')',
                nativeMapPut(keys))

            .add('hashtrie(' + size + ')',
                hashtriePut(keys))

            .add('hamt(' + size + ')',
                hamtPut(keys))

            .add('hamt_plus(' + size + ')',
                hamtPlusPut(keys))

            .add('persistent-hash-trie(' + size + ')',
                pHashtriePut(keys))

            .add('mori hash_map(' + size + ')',
                moriPut(keys))

            .add('immutable(' + size + ')',
                immutablePut(keys));

    }, new Benchmark.Suite('put nth'));
};
