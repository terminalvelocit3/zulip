global.stub_out_jquery();

add_dependencies({
    util: 'js/util.js',
});

var util = global.util;
var _ = global._;

(function test_CachedValue() {
    var x = 5;

    var cv = new util.CachedValue({
        compute_value: function () {
            return x * 2;
        },
    });

    assert.equal(cv.get(), 10);

    x = 6;
    assert.equal(cv.get(), 10);
    cv.reset();
    assert.equal(cv.get(), 12);

}());

(function test_extract_pm_recipients() {
    assert.equal(util.extract_pm_recipients('bob@foo.com, alice@foo.com').length, 2);
    assert.equal(util.extract_pm_recipients('bob@foo.com, ').length, 1);
}());

(function test_lower_bound() {
    var arr = [10, 20, 30, 40, 50];
    assert.equal(util.lower_bound(arr, 5), 0);
    assert.equal(util.lower_bound(arr, 10), 0);
    assert.equal(util.lower_bound(arr, 15), 1);
    assert.equal(util.lower_bound(arr, 50), 4);
    assert.equal(util.lower_bound(arr, 55), 5);
    assert.equal(util.lower_bound(arr, 2, 4, 31), 3);

    arr = [{x: 10}, {x: 20}, {x:30}];

    function compare(a, b) {
        return a.x < b;
    }

    assert.equal(util.lower_bound(arr, 5, compare), 0);
    assert.equal(util.lower_bound(arr, 10, compare), 0);
    assert.equal(util.lower_bound(arr, 15, compare), 1);

}());

(function test_same_recipient() {
    _.each([util.same_recipient, util.same_major_recipient], function (same) {
        assert(same(
            {type: 'stream', stream: 'Foo', subject: 'Bar'},
            {type: 'stream', stream: 'fOO', subject: 'bar'}));

        assert(!same(
            {type: 'stream', stream: 'Foo', subject: 'Bar'},
            {type: 'stream', stream: 'yo', subject: 'whatever'}));

        assert(same(
            {type: 'private', reply_to: 'fred@zulip.com,melissa@zulip.com'},
            {type: 'private', reply_to: 'fred@zulip.com,melissa@zulip.com'}));

        assert(same(
            {type: 'private', reply_to: 'fred@zulip.com'},
            {type: 'private', reply_to: 'Fred@zulip.com'}));

        assert(!same(
            {type: 'stream', stream: 'Foo', subject: 'Bar'},
            {type: 'private', reply_to: 'Fred@zulip.com'}));
    });

    assert(util.same_major_recipient(
        {type: 'stream', stream: 'Foo', subject: 'sub1'},
        {type: 'stream', stream: 'fOO', subject: 'sub2'}));

    assert(!util.same_recipient(
        {type: 'stream', stream: 'Foo', subject: 'sub1'},
        {type: 'stream', stream: 'fOO', subject: 'sub2'}));

}());

(function test_robust_uri_decode() {
    assert.equal(util.robust_uri_decode('xxx%3Ayyy'), 'xxx:yyy');
    assert.equal(util.robust_uri_decode('xxx%3'), 'xxx');
}());


(function test_array_compare() {
    assert(util.array_compare([], []));
    assert(util.array_compare([1,2,3], [1,2,3]));
    assert(!util.array_compare([1,2], [1,2,3]));
    assert(!util.array_compare([1,2,3], [1,2]));
    assert(!util.array_compare([1,2,3,4], [1,2,3,5]));
}());

(function test_normalize_recipients() {
    assert.equal(
        util.normalize_recipients('ZOE@foo.com, bob@foo.com, alice@foo.com, AARON@foo.com '),
        'aaron@foo.com,alice@foo.com,bob@foo.com,zoe@foo.com');
}());

(function test_random_int() {
    var min = 0;
    var max = 100;

    _.times(500, function () {
        var val = util.random_int(min, max);
        assert(min <= val);
        assert(val <= max);
        assert.equal(val, Math.floor(val));
    });
}());

(function test_all_and_everyone_mentions_regexp() {
    var messages_with_all_mentions = [
      '@all',
      'some text before @all some text after',
      '@all some text after only',
      'some text before only @all',
      '@**all**',
      'some text before @**all** some text after',
      '@**all** some text after only',
      'some text before only @**all**',
    ];

    var messages_with_everyone_mentions = [
      '@everyone',
      'some text before @everyone some text after',
      '@everyone some text after only',
      'some text before only @everyone',
      '@**everyone**',
      'some text before @**everyone** some text after',
      '@**everyone** some text after only',
      'some text before only @**everyone**',
    ];

    var messages_without_all_mentions = [
      '`@everyone`',
      'some_email@everyone.com',
      '`@**everyone**`',
      'some_email@**everyone**.com',
    ];

    var messages_without_everyone_mentions = [
      '`@everyone`',
      'some_email@everyone.com',
      '`@**everyone**`',
      'some_email@**everyone**.com',
    ];
    var i;
    for (i=0; i<messages_with_all_mentions.length; i += 1) {
        assert(util.is_all_or_everyone_mentioned(messages_with_all_mentions[i]));
    }

    for (i=0; i<messages_with_everyone_mentions.length; i += 1) {
        assert(util.is_all_or_everyone_mentioned(messages_with_everyone_mentions[i]));
    }

    for (i=0; i<messages_without_all_mentions.length; i += 1) {
        assert(!util.is_all_or_everyone_mentioned(messages_without_everyone_mentions[i]));
    }

    for (i=0; i<messages_without_everyone_mentions.length; i += 1) {
        assert(!util.is_all_or_everyone_mentioned(messages_without_everyone_mentions[i]));
    }
}());
