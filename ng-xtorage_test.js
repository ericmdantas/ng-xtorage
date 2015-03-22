"use strict";

describe('ng-xtorage', function()
{
    var _xtorage, _windowMock, _xtorageProvider, _timeoutMock;

    beforeEach(module('emd.ng-xtorage', function($xtorageProvider)
    {
        _xtorageProvider = $xtorageProvider;
    }));

    beforeEach(inject(function($injector)
    {
        _windowMock = $injector.get('$window');
        _xtorage = $injector.get('$xtorage');
        _timeoutMock = $injector.get('$timeout');
    }));

    afterEach(function()
    {
        _windowMock.localStorage.clear();
        _windowMock.sessionStorage.clear();
    })

    describe('creation', function()
    {
        it('should have the service created', function()
        {
            expect(_xtorage).toBeDefined();
            expect(typeof _xtorage).toBe('object');

            expect(_xtorage.get).toBeDefined();
            expect(_xtorage.save).toBeDefined();
            expect(_xtorage.remove).toBeDefined();
            expect(_xtorage.clear).toBeDefined();
        })

        it('should have the right constant value for the type', function()
        {
            expect(_xtorageProvider).toBeDefined();
            expect(_xtorageProvider.storage).toEqual('localStorage');
            expect(_xtorageProvider.unique).toBe(false);
        })
    })

    describe('get', function()
    {
        describe('localStorage', function()
        {
            describe('single', function()
            {
                it('should return null when there\'s nothing in the storage', function()
                {
                    var _key = 'a';

                    expect(_xtorage.get(_key)).toBeNull();
                })

                it('should retrieve a string from the storage', function()
                {
                    var _key = 'a';
                    var _info = 'b';

                    _windowMock.localStorage.setItem(_key, _info);

                    expect(_xtorage.get(_key)).toEqual(_info);
                })

                it('should retrieve a string from the storage', function()
                {
                    var _key = 'a';
                    var _info = '564a5s4as14a23s1a23s1a23s15a4s56a4s56a4s56a4sa1s23a123s1a23s1a32s1a3s1a32s13a2s==';

                    _windowMock.localStorage.setItem(_key, _info);

                    expect(_xtorage.get(_key)).toEqual(_info);
                    expect(typeof _xtorage.get(_key)).toBe('string');

                })

                it('should retrieve an object from the storage', function()
                {
                    var _key = 'a';
                    var _infoObj = {info: 'asasasas5a4s654a6s54a65s4a65s4a65s4as'};
                    var _infoStringified = angular.toJson(_infoObj);

                    _windowMock.localStorage.setItem(_key, _infoStringified);

                    expect(_xtorage.get(_key)).toEqual(_infoObj);
                    expect(typeof _xtorage.get(_key)).toBe('object');
                })

                it('should retrieve a number from the storage', function()
                {
                    var _key = 'a';
                    var _info = 12345645432131456789;

                    _windowMock.localStorage.setItem(_key, _info);

                    expect(_xtorage.get(_key)).toEqual(_info);
                    expect(typeof _xtorage.get(_key)).toBe('number');
                })

                it('should retrieve a boolean from the storage', function()
                {
                    var _key = 'a';
                    var _info = true;

                    _windowMock.localStorage.setItem(_key, _info);

                    expect(_xtorage.get(_key)).toBe(true);
                    expect(typeof _xtorage.get(_key)).toBe('boolean');
                });
            })

            describe('array', function()
            {
                it('should return null when there\'s nothing in the storage', function()
                {
                    var _key = ['a', 'b'];

                    expect(_xtorage.get(_key)).toBeNull();
                })

                it('should get an array of items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _windowMock.localStorage.setItem(_keys[i], _info[i]);
                    }

                    expect(_xtorage.get(_keys)).toEqual(_info);
                })

                it('should get an array of mixed items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = [{hey: 'I\'m a string!', cool: {heh: true}}, 'hehe', 42];

                    _xtorage.save(_keys, _info);

                    expect(_xtorage.get(_keys)).toEqual(_info);
                })
            })
        })

        describe('sessionStorage', function()
        {
            describe('single', function()
            {
                it('should return null when there\'s nothing in the storage', function()
                {
                    var _key = 'a';

                    expect(_xtorage.get(_key)).toBeNull();
                })

                it('should retrieve a string from the storage', function()
                {
                    var _key = 'a';
                    var _info = 'b';

                    _windowMock.sessionStorage.setItem(_key, _info);

                    expect(_xtorage.get(_key, {storage: 'sessionStorage'})).toEqual(_info);
                })

                it('should retrieve a string from the storage', function()
                {
                    var _key = 'a';
                    var _info = '564a5s4as14a23s1a23s1a23s15a4s56a4s56a4s56a4sa1s23a123s1a23s1a32s1a3s1a32s13a2s==';

                    _windowMock.sessionStorage.setItem(_key, _info);

                    expect(_xtorage.get(_key, {storage: 'sessionStorage'})).toEqual(_info);
                    expect(typeof _xtorage.get(_key, {storage: 'sessionStorage'})).toBe('string');

                })

                it('should retrieve an object from the storage', function()
                {
                    var _key = 'a';
                    var _infoObj = {info: 'asasasas5a4s654a6s54a65s4a65s4a65s4as'};
                    var _infoStringified = angular.toJson(_infoObj);

                    _windowMock.sessionStorage.setItem(_key, _infoStringified);

                    expect(_xtorage.get(_key, {storage: 'sessionStorage'})).toEqual(_infoObj);
                    expect(typeof _xtorage.get(_key, {storage: 'sessionStorage'})).toBe('object');
                })

                it('should retrieve a number from the storage', function()
                {
                    var _key = 'a';
                    var _info = 12345645432131456789;

                    _windowMock.sessionStorage.setItem(_key, _info);

                    expect(_xtorage.get(_key, {storage: 'sessionStorage'})).toEqual(_info);
                    expect(typeof _xtorage.get(_key, {storage: 'sessionStorage'})).toBe('number');
                })
            })

            describe('array', function()
            {
                it('should return null when there\'s nothing in the storage', function()
                {
                    var _key = ['a', 'b'];

                    expect(_xtorage.get(_key)).toBeNull();
                })

                it('should get an array of items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _windowMock.sessionStorage.setItem(_keys[i], _info[i]);
                    }

                    expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_info);
                })

                it('should get an array of mixed items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = [{hey: 'I\'m a string!', cool: {heh: true}}, 'hehe', 42];

                    _xtorage.save(_keys, _info, {storage: 'sessionStorage'});

                    expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_info);
                })
            })
        })
    })

    describe('save', function()
    {
        describe('localStorage', function()
        {
            describe('single', function()
            {
                it('should save a simple string correctly', function()
                {
                    var _key = 'a';
                    var _info = 'b';

                    _xtorage.save(_key, _info);

                    expect(_windowMock.localStorage.getItem(_key)).toEqual(_info);
                })

                it('should save a object stringified', function()
                {
                    var _key = 'a';
                    var _info = {info: '123123123123132'};
                    var _infoStringified = angular.toJson(_info);

                    _xtorage.save(_key, _info);

                    expect(typeof _windowMock.localStorage.getItem(_key)).toBe('string');
                    expect(_windowMock.localStorage.getItem(_key)).toEqual(_infoStringified);
                })
            })

            describe('array', function()
            {
                it('should save an array of information correctly - strings', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    _xtorage.save(_keys, _info);

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(_windowMock.localStorage.getItem(_keys[j])).toEqual(_info[j]);
                    }
                })

                it('should save an array of information correctly - all info are objects', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = [{info: 'b1'}, {info: 'b2'}, {info: 'b3'}];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _xtorage.save(_keys, _info);
                    }

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(typeof _windowMock.localStorage.getItem(_keys[j])).toBe('string');
                        expect(_windowMock.localStorage.getItem(_keys[j])).toEqual(JSON.stringify(_info[j]));

                        expect(_xtorage.get(_keys)).toEqual(_info);
                    }
                })

                it('should save an array of information correctly - mixed', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = [{info: 'b1'}, 2, 'b3'];

                    _xtorage.save(_keys, _info);

                    expect(typeof _windowMock.localStorage.getItem(_keys[0])).toBe('string');
                    expect(typeof _windowMock.localStorage.getItem(_keys[1])).toBe('string');
                    expect(typeof _windowMock.localStorage.getItem(_keys[2])).toBe('string');

                    expect(typeof _xtorage.get(_keys)[0]).toEqual('object');
                    expect(_xtorage.get(_keys)[0]).toEqual(_info[0]);

                    expect(typeof _xtorage.get(_keys)[1]).toEqual('number');
                    expect(_xtorage.get(_keys)[1]).toEqual(_info[1]);

                    expect(typeof _xtorage.get(_keys)[2]).toEqual('string');
                    expect(_xtorage.get(_keys)[2]).toEqual(_info[2]);
                })
            })
        })

        describe('sessionStorage', function()
        {
            describe('single', function()
            {
                it('should save a simple string correctly', function()
                {
                    var _key = 'a';
                    var _info = 'b';

                    _xtorage.save(_key, _info, {storage: 'sessionStorage'});

                    expect(_windowMock.sessionStorage.getItem(_key)).toEqual(_info);
                })

                it('should save a object stringified', function()
                {
                    var _key = 'a';
                    var _info = {info: '123123123123132'};
                    var _infoStringified = angular.toJson(_info);

                    _xtorage.save(_key, _info, {storage: 'sessionStorage'});

                    expect(typeof _windowMock.sessionStorage.getItem(_key)).toBe('string');
                    expect(_windowMock.sessionStorage.getItem(_key)).toEqual(_infoStringified);
                })
            })

            describe('array', function()
            {
                it('should save an array of information correctly - strings', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    _xtorage.save(_keys, _info, {storage: 'sessionStorage'});

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(_windowMock.sessionStorage.getItem(_keys[j])).toEqual(_info[j]);
                    }
                })

                it('should save an array of information correctly - all info are objects', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = [{info: 'b1'}, {info: 'b2'}, {info: 'b3'}];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _xtorage.save(_keys, _info, {storage: 'sessionStorage'});
                    }

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(typeof _windowMock.sessionStorage.getItem(_keys[j])).toBe('string');
                        expect(_windowMock.sessionStorage.getItem(_keys[j])).toEqual(JSON.stringify(_info[j]));

                        expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_info);
                    }
                })

                it('should save an array of information correctly - mixed', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = [{info: 'b1'}, 2, 'b3'];

                    _xtorage.save(_keys, _info, {storage: 'sessionStorage'});

                    expect(typeof _windowMock.sessionStorage.getItem(_keys[0])).toBe('string');
                    expect(typeof _windowMock.sessionStorage.getItem(_keys[1])).toBe('string');
                    expect(typeof _windowMock.sessionStorage.getItem(_keys[2])).toBe('string');

                    expect(typeof _xtorage.get(_keys, {storage: 'sessionStorage'})[0]).toEqual('object');
                    expect(_xtorage.get(_keys, {storage: 'sessionStorage'})[0]).toEqual(_info[0]);

                    expect(typeof _xtorage.get(_keys, {storage: 'sessionStorage'})[1]).toEqual('number');
                    expect(_xtorage.get(_keys, {storage: 'sessionStorage'})[1]).toEqual(_info[1]);

                    expect(typeof _xtorage.get(_keys, {storage: 'sessionStorage'})[2]).toEqual('string');
                    expect(_xtorage.get(_keys, {storage: 'sessionStorage'})[2]).toEqual(_info[2]);
                })
            })
        })
    })

    describe('remove', function()
    {
        describe('localStorage', function()
        {
            describe('single', function()
            {
                it('should remove the specific item', function()
                {
                    var _key1 = 'a';
                    var _key2 = 'a2';

                    var _info1 = 'b';
                    var _info2 = 'b2';

                    _windowMock.localStorage.setItem(_key1, _info1);
                    _windowMock.localStorage.setItem(_key2, _info2);

                    expect(_windowMock.localStorage.getItem(_key1)).toEqual(_info1);
                    expect(_windowMock.localStorage.getItem(_key2)).toEqual(_info2);

                    _xtorage.remove(_key1);

                    expect(_windowMock.localStorage.getItem(_key1)).toBeNull();
                    expect(_windowMock.localStorage.getItem(_key2)).toEqual(_info2);
                })
            })

            describe('array', function()
            {
                it('should remove an array of items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _windowMock.localStorage.setItem(_keys[i], _info[i]);
                    }

                    _xtorage.remove(_keys);

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(_windowMock.localStorage.getItem(_keys[j])).toBeNull();
                    }
                })

                it('should remove just the right part of the items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    var _removeOnly = ['a1', 'a3'];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _windowMock.localStorage.setItem(_keys[i], _info[i]);
                    }

                    _xtorage.remove(_removeOnly);

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(_windowMock.localStorage.getItem(_removeOnly[j])).toBeNull();
                    }

                    expect(_windowMock.localStorage.getItem('a2')).toEqual('b2');
                })
            })
        })

        describe('sessionStorage', function()
        {
            describe('single', function()
            {
                it('should remove the specific item', function()
                {
                    var _key1 = 'a';
                    var _key2 = 'a2';

                    var _info1 = 'b';
                    var _info2 = 'b2';

                    _windowMock.sessionStorage.setItem(_key1, _info1);
                    _windowMock.sessionStorage.setItem(_key2, _info2);

                    expect(_windowMock.sessionStorage.getItem(_key1)).toEqual(_info1);
                    expect(_windowMock.sessionStorage.getItem(_key2)).toEqual(_info2);

                    _xtorage.remove(_key1, {storage: 'sessionStorage'});

                    expect(_windowMock.sessionStorage.getItem(_key1)).toBeNull();
                    expect(_windowMock.sessionStorage.getItem(_key2)).toEqual(_info2);
                })
            })

            describe('array', function()
            {
                it('should remove an array of items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _windowMock.sessionStorage.setItem(_keys[i], _info[i]);
                    }

                    _xtorage.remove(_keys, {storage: 'sessionStorage'});

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(_windowMock.sessionStorage.getItem(_keys[j])).toBeNull();
                    }
                })

                it('should remove just the right part of the items', function()
                {
                    var _keys = ['a1', 'a2', 'a3'];
                    var _info = ['b1', 'b2', 'b3'];

                    var _removeOnly = ['a1', 'a3'];

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _windowMock.sessionStorage.setItem(_keys[i], _info[i]);
                    }

                    _xtorage.remove(_removeOnly, {storage: 'sessionStorage'});

                    for (var j = 0; j < _keys.length; j++)
                    {
                        expect(_windowMock.sessionStorage.getItem(_removeOnly[j])).toBeNull();
                    }

                    expect(_windowMock.sessionStorage.getItem('a2')).toEqual('b2');
                })
            })
        })
    })

    describe('clear', function()
    {
        describe('localStorage', function()
        {
            it('should clean the whole local storage', function()
            {
                for (var i = 0; i < 10; i++)
                {
                    _windowMock.localStorage.setItem('a'+i, 'b'+i);
                }

                _xtorage.clear();

                for (var i = 0; i < 10; i++)
                {
                    expect(_windowMock.localStorage.getItem('a'+i)).toBeNull();
                }
            })
        })

        describe('sessionStorage', function()
        {
            it('should clean the whole session storage', function()
            {
                for (var i = 0; i < 10; i++)
                {
                    _windowMock.sessionStorage.setItem('a'+i, 'b'+i);
                }

                _xtorage.clear({storage: 'sessionStorage'});

                for (var i = 0; i < 10; i++)
                {
                    expect(_windowMock.sessionStorage.getItem('a'+i)).toBeNull();
                }
            })
        })
    })

    describe('all together', function()
    {
        describe('localStorage', function()
        {
            it('should save an object to the storage', function()
            {
                var _keys = ['a', '1'];
                var _infos = [{z: 'z'}, 42];

                _xtorage.save(_keys, _infos);

                expect(_xtorage.get(_keys)).toEqual(_infos);
            })

            it('should save a deep object to the storage', function()
            {
                var _keys = ['a', '1'];
                var _infos = [{a: {b: true, c: {d: {e: 'f', g: [1,2, 3]}}}}, 42];

                _xtorage.save(_keys, _infos);

                expect(_xtorage.get(_keys)).toEqual(_infos);
            })

            it('should save an array correctly to the storage', function()
            {
                var _keys = ['a', '1'];
                var _infos = [[{a: 1}], {somethingElse: 'here'}];

                _xtorage.save(_keys, _infos);

                expect(_xtorage.get(_keys)).toEqual(_infos);
                expect(_xtorage.get(_keys[0])).toEqual(_infos[0]);
            })

            it('should save a HUGE array correctly to the storage', function()
            {
                var _keys = [];
                var _infos = [];

                var ARRAY_SIZE = 10000;

                for (var i = 0; i < ARRAY_SIZE; i++)
                {
                    _keys.push('a'+i);
                    _infos.push({a: 'a'+i});
                }

                _xtorage.save(_keys, _infos);

                expect(_xtorage.get(_keys)).toEqual(_infos);
                expect(_xtorage.get(_keys[0])).toEqual(_infos[0]);
            })

            it('should save a boolean to the storage - true', function()
            {
                var _key = 'a';
                var _info = true;

                _xtorage.save(_key, _info);

                expect(_xtorage.get(_key)).toBe(true);
                expect(typeof _xtorage.get(_key)).toBe('boolean');
            })

            it('should save a boolean to the storage - false', function()
            {
                var _key = 'a';
                var _info = false;

                _xtorage.save(_key, _info);

                expect(_xtorage.get(_key)).toBe(false);
                expect(typeof _xtorage.get(_key)).toBe('boolean');
            })

            it('should remove an array from the storage - get should be null', function()
            {
                var _keys = ['a', '1'];
                var _infos = [{z: 'z'}, 42];

                _xtorage.save(_keys, _infos);

                expect(_xtorage.get(_keys)).toEqual(_infos);

                _xtorage.remove(_keys);

                expect(_xtorage.get(_keys)).toBeNull();
            })

            it('should remove an array from the storage - get should be only the last item', function()
            {
                var _keys = ['a', '1', '3'];
                var _keysExceptLast = ['a', '1'];

                var _infos = [{z: 'z'}, 42, 'aeHOOOOOOOOOOO'];
                var _infosExceptLast = [{z: 'z'}, 42, 'aeHOOOOOOOOOOO'];

                _xtorage.save(_keys, _infos);

                expect(_xtorage.get(_keys)).toEqual(_infosExceptLast);

                _xtorage.remove(_keysExceptLast);

                expect(_xtorage.get(_keysExceptLast)).toBeNull();

                expect(_xtorage.get(_keys[2])).toEqual(_infos[2]);
            })

            it('should remove all the items', function()
            {
                var _keys = ['a', '1', '3'];

                var _infos = [{z: 'z'}, 42, 'aeHOOOOOOOOOOO'];

                _xtorage.save(_keys, _infos);

                expect(_xtorage.get(_keys)).toEqual(_infos);

                _xtorage.clear();

                expect(_xtorage.get(_keys)).toBeNull();
            })
        })

        describe('sessionStorage', function()
        {
            it('should save an object to the storage', function()
            {
                var _keys = ['a', '1'];
                var _infos = [{z: 'z'}, 42];

                _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
            })

            it('should save a deep object to the storage', function()
            {
                var _keys = ['a', '1'];
                var _infos = [{a: {b: true, c: {d: {e: 'f', g: [1,2, 3]}}}}, 42];

                _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
            })

            it('should save an array correctly to the storage', function()
            {
                var _keys = ['a', '1'];
                var _infos = [[{a: 1}], {somethingElse: 'here'}];

                _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
                expect(_xtorage.get(_keys[0], {storage: 'sessionStorage'})).toEqual(_infos[0]);
            })

            it('should save a HUGE array correctly to the storage', function()
            {
                var _keys = [];
                var _infos = [];

                var ARRAY_SIZE = 10000;

                for (var i = 0; i < ARRAY_SIZE; i++)
                {
                    _keys.push('a'+i);
                    _infos.push({a: 'a'+i});
                }

                _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
                expect(_xtorage.get(_keys[0], {storage: 'sessionStorage'})).toEqual(_infos[0]);
            })

            it('should save a boolean to the storage - true', function()
            {
                var _key = 'a';
                var _info = true;

                _xtorage.save(_key, _info, {storage: 'sessionStorage'});

                expect(_xtorage.get(_key, {storage: 'sessionStorage'})).toBe(true);
                expect(typeof _xtorage.get(_key, {storage: 'sessionStorage'})).toBe('boolean');
            })

            it('should save a boolean to the storage - false', function()
            {
                var _key = 'a';
                var _info = false;

                _xtorage.save(_key, _info, {storage: 'sessionStorage'});

                expect(_xtorage.get(_key, {storage: 'sessionStorage'})).toBe(false);
                expect(typeof _xtorage.get(_key, {storage: 'sessionStorage'})).toBe('boolean');
            })

            it('should remove an array from the storage - get should be null', function()
            {
                var _keys = ['a', '1'];
                var _infos = [{z: 'z'}, 42];

                _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);

                _xtorage.remove(_keys, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toBeNull();
            })

            it('should remove an array from the storage - get should be only the last item', function()
            {
                var _keys = ['a', '1', '3'];
                var _keysExceptLast = ['a', '1'];

                var _infos = [{z: 'z'}, 42, 'aeHOOOOOOOOOOO'];
                var _infosExceptLast = [{z: 'z'}, 42, 'aeHOOOOOOOOOOO'];

                _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infosExceptLast);

                _xtorage.remove(_keysExceptLast, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keysExceptLast, {storage: 'sessionStorage'})).toBeNull();

                expect(_xtorage.get(_keys[2], {storage: 'sessionStorage'})).toEqual(_infos[2]);
            })

            it('should remove all the items', function()
            {
                var _keys = ['a', '1', '3'];

                var _infos = [{z: 'z'}, 42, 'aeHOOOOOOOOOOO'];

                _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);

                _xtorage.clear({storage: 'sessionStorage'});

                expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toBeNull();
            })
        })
    })

    describe('proxies', function()
    {
        var _calledWithSessionStorage = {storage: 'sessionStorage'};
        var _calledWithLocalStorage = {storage: 'localStorage'};

        beforeEach(function()
        {
            spyOn(_xtorage, 'get').and.callFake(angular.noop);
            spyOn(_xtorage, 'save').and.callFake(angular.noop);
            spyOn(_xtorage, 'remove').and.callFake(angular.noop);
            spyOn(_xtorage, 'clear').and.callFake(angular.noop);
        })

        describe('getFrom[Session|Local]Storage', function()
        {
            describe('sessionStorage', function()
            {
                it('should call the $xtorage.get passing the storage as sessionStorage', function()
                {
                    var _key = ['a', 'b'];

                    _xtorage.getFromSessionStorage(_key);

                    expect(_xtorage.get).toHaveBeenCalledWith(_key, _calledWithSessionStorage);
                })
            })

            describe('localStorage', function()
            {
                it('should call the $xtorage.get passing the storage as localStorage', function()
                {
                    var _key = 'a';

                    _xtorage.getFromLocalStorage(_key);

                    expect(_xtorage.get).toHaveBeenCalledWith(_key, _calledWithLocalStorage);
                })
            })
        })

        describe('removeFrom[Session|Local]Storage', function()
        {
            describe('sessionStorage', function()
            {
                it('should call the $xtorage.remove passing the storage as the sessionStorage', function()
                {
                    var _key = 'ahjsakjs';

                    _xtorage.removeFromSessionStorage(_key);

                    expect(_xtorage.remove).toHaveBeenCalledWith(_key, _calledWithSessionStorage);
                })
            })

            describe('localStorage', function()
            {
                it('should call the $xtorage.remove passing the storage as the sessionStorage', function()
                {
                    var _key = 'ahjsakjs';

                    _xtorage.removeFromLocalStorage(_key);

                    expect(_xtorage.remove).toHaveBeenCalledWith(_key, _calledWithLocalStorage);
                })
            })
        })

        describe('saveIn[Session|Local]Storage', function()
        {
            describe('sessionStorage', function()
            {
                it('should call the $xtorage.save passing the storage as the sessionStorage', function()
                {
                    var _key = 'ahjsakjs';
                    var _info = ['a', true, 1]

                    _xtorage.saveInSessionStorage(_key, _info);

                    expect(_xtorage.save).toHaveBeenCalledWith(_key, _info, _calledWithSessionStorage);
                })
            })

            describe('localStorage', function()
            {
                it('should call the $xtorage.save passing the storage as the localStorage', function()
                {
                    var _key = 'ahjsakjs';
                    var _info = ['a', true, 1]

                    _xtorage.saveInLocalStorage(_key, _info);

                    expect(_xtorage.save).toHaveBeenCalledWith(_key, _info, _calledWithLocalStorage);
                })
            })
        })

        describe('clear[Session|Local]Storage', function()
        {
            describe('sessionStorage', function()
            {
                it('should call the $xtorage.save passing the storage as sessionStorage', function()
                {
                    var _key = 'ahjsakjs';

                    _xtorage.clearSessionStorage(_key);

                    expect(_xtorage.clear).toHaveBeenCalledWith(_key, _calledWithSessionStorage);
                })
            })

            describe('localStorage', function()
            {
                it('should call the $xtorage.save passing the storage as localStorage', function()
                {
                    var _key = 'ahjsakjs';

                    _xtorage.clearLocalStorage(_key);

                    expect(_xtorage.clear).toHaveBeenCalledWith(_key, _calledWithLocalStorage);
                })
            })
        })
    })

    describe('pushInto', function()
    {
        describe('localStorage', function()
        {
            it('should push info into the array nothing in the storage', function()
            {
                var _newInfo = "b";
                var _result = ["b"];
                var _key = "k";

                _xtorage.pushInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - string', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = "b";
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - number', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = 42;
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - object', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = {a: {b: 42}};
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - array', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo);

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - array - nothing repeated', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'localStorage', unique: true});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should NOT push info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'localStorage', unique: true});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", [{a: {b: 42}}], _newInfo];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'localStorage', unique: false});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })
        })

        describe('sessionStorage', function()
        {
            it('should push info into the array nothing in the storage', function()
            {
                var _newInfo = "b";
                var _result = ["b"];
                var _key = "k";

                _xtorage.pushInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - string', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = "b";
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - number', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = 42;
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - object', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = {a: {b: 42}};
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - array', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushIntoSessionStorage(_key, _newInfo);

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - array - nothing repeated', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", _newInfo];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'sessionStorage', unique: true});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should NOT push info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'sessionStorage', unique: true});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should push info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", [{a: {b: 42}}], _newInfo];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.pushInto(_key, _newInfo, {storage: 'sessionStorage', unique: false});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })
        })
    })

    describe('unshiftInto', function()
    {
        describe('localStorage', function()
        {
            it('should unshift info into the array nothing in the storage', function()
            {
                var _newInfo = "b";
                var _result = ["b"];
                var _key = "k";

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - string', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = "b";
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - number', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = 42;
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - object', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = {a: {b: 42}};
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - array', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo);

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - array - nothing repeated', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage', unique: true});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should NOT unshift info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage', unique: true});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [_newInfo, {a:1}, true, "a", [{a: {b: 42}}]];
                var _key = "k";

                _xtorage.saveInLocalStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'localStorage', unique: false});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })
        })

        describe('sessionStorage', function()
        {
            it('should push info into the array nothing in the storage', function()
            {
                var _newInfo = "b";
                var _result = ["b"];
                var _key = "k";

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - string', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = "b";
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - number', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = 42;
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - object', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = {a: {b: 42}};
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - array', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftIntoSessionStorage(_key, _newInfo);

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - array - nothing repeated', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a"];
                var _newInfo = [{a: {b: 42}}];
                var _result = [_newInfo, {a:1}, true, "a"];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage', unique: true});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should NOT unshift info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage', unique: true});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })

            it('should unshift info into the array - repeated value', function()
            {
                var _infoAlreadyInTheStorage = [{a:1}, true, "a", [{a: {b: 42}}]];
                var _newInfo = [{a: {b: 42}}];
                var _result = [_newInfo, {a:1}, true, "a", [{a: {b: 42}}]];
                var _key = "k";

                _xtorage.saveInSessionStorage(_key, _infoAlreadyInTheStorage);

                _xtorage.unshiftInto(_key, _newInfo, {storage: 'sessionStorage', unique: false});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })
        })
    })

    describe('removeFromArray', function()
    {
        describe('localStorage', function()
        {
            it('should remove from the first position of the array', function()
            {
                var _wasInStorage = [1, 2, 3];
                var _goesToStorage = [2, 3];

                spyOn(_xtorage, 'get').and.returnValue(_wasInStorage);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.removeFromArray('a', 0, {storage: 'localStorage'});

                expect(_xtorage.save).toHaveBeenCalledWith('a', _goesToStorage, {storage: 'localStorage'});
            })

            it('should remove from the second position of the array', function()
            {
                var _wasInStorage = [1, 2, 3];
                var _goesToStorage = [1, 3];

                spyOn(_xtorage, 'get').and.returnValue(_wasInStorage);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.removeFromArray('a', 1, {storage: 'localStorage'});

                expect(_xtorage.save).toHaveBeenCalledWith('a', _goesToStorage, {storage: 'localStorage'});
            })
        })

        describe('sessionStorage', function()
        {
            it('should remove from the first position of the array', function()
            {
                var _wasInStorage = [1, 2, 3];
                var _goesToStorage = [2, 3];

                spyOn(_xtorage, 'get').and.returnValue(_wasInStorage);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.removeFromArray('a', 0, {storage: 'sessionStorage'});

                expect(_xtorage.save).toHaveBeenCalledWith('a', _goesToStorage, {storage: 'sessionStorage'});
            })

            it('should remove from the second position of the array', function()
            {
                var _wasInStorage = [1, 2, 3];
                var _goesToStorage = [1, 3];

                spyOn(_xtorage, 'get').and.returnValue(_wasInStorage);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.removeFromArray('a', 1, {storage: 'sessionStorage'});

                expect(_xtorage.save).toHaveBeenCalledWith('a', _goesToStorage, {storage: 'sessionStorage'});
            })
        })
    })

    describe('pushIntoProxies', function()
    {
        describe('localStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";
                var _info = "b";

                spyOn(_xtorage, 'get').and.returnValue([]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.pushIntoLocalStorage(_key, _info);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, [_info], {storage: 'localStorage'});
            })
        })

        describe('sessionStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";
                var _info = "b";

                spyOn(_xtorage, 'get').and.returnValue([]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.pushIntoSessionStorage(_key, _info);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, [_info], {storage: 'sessionStorage'});
            })
        })
    })

    describe('unshiftIntoProxies', function()
    {
        describe('localStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";
                var _info = "b";

                spyOn(_xtorage, 'get').and.returnValue([]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.unshiftIntoLocalStorage(_key, _info);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, [_info], {storage: 'localStorage'});
            })
        })

        describe('sessionStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";
                var _info = "b";

                spyOn(_xtorage, 'get').and.returnValue([]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.unshiftIntoSessionStorage(_key, _info);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, [_info], {storage: 'sessionStorage'});
            })
        })
    })

    describe('popFrom', function()
    {
        describe('localStorage', function()
        {
            it('should remove the last element correctly', function()
            {
                var _infoInStorage = [{a: 1}, "b", 1, true];
                var _key = "k";
                var _result = [{a: 1}, "b", 1];

                _xtorage.saveInLocalStorage(_key, _infoInStorage, {storage: 'localStorage'});

                _xtorage.popFrom(_key, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })
        })

        describe('sessionStorage', function()
        {
            it('should remove the last element correctly', function()
            {
                var _infoInStorage = [{a: 1}, "b", 1, true];
                var _key = "k";
                var _result = [{a: 1}, "b", 1];

                _xtorage.saveInSessionStorage(_key, _infoInStorage, {storage: 'sessionStorage'});

                _xtorage.popFrom(_key, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })
        })
    })

    describe('shiftFrom', function()
    {
        describe('localStorage', function()
        {
            it('should remove the last element correctly', function()
            {
                var _infoInStorage = [{a: 1}, "b", 1, true];
                var _key = "k";
                var _result = ["b", 1, true];

                _xtorage.saveInLocalStorage(_key, _infoInStorage, {storage: 'localStorage'});

                _xtorage.shiftFrom(_key, {storage: 'localStorage'});

                expect(_xtorage.getFromLocalStorage(_key)).toEqual(_result);
            })
        })

        describe('sessionStorage', function()
        {
            it('should remove the last element correctly', function()
            {
                var _infoInStorage = [{a: 1}, "b", 1, true];
                var _key = "k";
                var _result = ["b", 1, true];

                _xtorage.saveInSessionStorage(_key, _infoInStorage, {storage: 'sessionStorage'});

                _xtorage.shiftFrom(_key, {storage: 'sessionStorage'});

                expect(_xtorage.getFromSessionStorage(_key)).toEqual(_result);
            })
        })
    })

    describe('popFromProxies', function()
    {
        describe('localStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";

                spyOn(_xtorage, 'get').and.returnValue([1, "b"]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.popFromLocalStorage(_key);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, [1], {storage: 'localStorage'});
            })
        })

        describe('sessionStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";

                spyOn(_xtorage, 'get').and.returnValue([1, "b"]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.popFromSessionStorage(_key);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, [1], {storage: 'sessionStorage'});
            })
        })
    })

    describe('shiftFromProxies', function()
    {
        describe('localStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";

                spyOn(_xtorage, 'get').and.returnValue([1, "b"]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.shiftFromLocalStorage(_key);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, ["b"], {storage: 'localStorage'});
            })
        })

        describe('sessionStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";

                spyOn(_xtorage, 'get').and.returnValue([{a: 1}, "b"]);
                spyOn(_xtorage, 'save').and.callFake(angular.noop);

                _xtorage.shiftFromSessionStorage(_key);

                expect(_xtorage.get).toHaveBeenCalled();
                expect(_xtorage.save).toHaveBeenCalledWith(_key, ["b"], {storage: 'sessionStorage'});
            })
        })
    })

    describe('removeFromArrayProxies', function()
    {
        describe('localStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";
                var _index = 1;

                spyOn(_xtorage, 'removeFromArray').and.callFake(angular.noop);

                _xtorage.removeFromArrayLocalStorage(_key, _index);

                expect(_xtorage.removeFromArray).toHaveBeenCalledWith(_key, _index, {storage: 'localStorage'});
            })
        })

        describe('sessionStorage', function()
        {
            it('should call the right method', function()
            {
                var _key = "a";
                var _index = 1;

                spyOn(_xtorage, 'removeFromArray').and.callFake(angular.noop);

                _xtorage.removeFromArraySessionStorage(_key, _index);

                expect(_xtorage.removeFromArray).toHaveBeenCalledWith(_key, _index, {storage: 'sessionStorage'});
            })
        })
    })
})