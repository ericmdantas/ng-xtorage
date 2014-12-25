"use strict";

describe('angular-xtorage', function()
{
    var _xtorage, _windowMock, _XTORAGE_DEFAULT_TYPE;

    beforeEach(module('emd.ng-xtorage'));

    beforeEach(inject(function($injector)
    {
        _windowMock = $injector.get('$window');

        _xtorage = $injector.get('$xtorage');
        _XTORAGE_DEFAULT_TYPE = $injector.get('XTORAGE_DEFAULT_TYPE');
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
            expect(_XTORAGE_DEFAULT_TYPE).toEqual('localStorage');
        })
    })

    describe('get', function()
    {
        describe('localStorage', function()
        {
            describe('single', function()
            {
                it('should retrieve an string from the storage', function()
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
            })

            describe('array', function()
            {
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

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _xtorage.save(_keys, _info);
                    }

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

                    for (var i = 0; i < _keys.length; i++)
                    {
                        _xtorage.save(_keys, _info);
                    }

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
})