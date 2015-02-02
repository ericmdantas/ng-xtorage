"use strict";

describe('ng-xtorage-expiration', function()
{
    var _xtorage, _windowMock, _xtorageProvider, _intervalMock;
    var MAX_FLUSH = 9999 * 10;
    var EXPIRATION_KEY = '$xpiration';
    var EXPIRE_IN = 1000;

    beforeEach(module('emd.ng-xtorage', function($xtorageProvider)
    {
        $xtorageProvider.storageExpiration = EXPIRE_IN;

        _xtorageProvider = $xtorageProvider;
    }));

    beforeEach(inject(function($injector)
    {
        _windowMock = $injector.get('$window');
        _xtorage = $injector.get('$xtorage');
        _intervalMock = $injector.get('$interval');

        spyOn(_windowMock.localStorage, 'setItem').and.callThrough();
        spyOn(_windowMock.Date, 'now').and.returnValue(999);
    }));

    afterEach(function()
    {
        _windowMock.localStorage.clear();
        _windowMock.sessionStorage.clear();
    })

    describe('localstorage', function()
    {
        it('should expire the content - no arguments passed', function()
        {
            var _key = 'a';
            var _info = true;

            _xtorage.save(_key, _info);

            expect(_xtorage.get(_key)).toBe(true);
            expect(typeof _xtorage.get(_key)).toBe('boolean');

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_key)).toBeNull();
        })

        it('should save the expiration object to the storage', function()
        {
            var _key = 'a';
            var _info = true;

            _xtorage.save(_key, _info);

            expect(_xtorage.get(_key)).toBe(true);
            expect(typeof _xtorage.get(_key)).toBe('boolean');
            expect(_windowMock.localStorage.getItem(EXPIRATION_KEY)).toBeDefined();

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_key)).toBeNull();
            expect(_windowMock.localStorage.getItem(EXPIRATION_KEY)).toBeDefined();
        })

        it('should expire the content - complex array', function()
        {
            var _keys = [];
            var _infos = [];

            var ARRAY_SIZE = 100;

            for (var i = 0; i < ARRAY_SIZE; i++)
            {
                _keys.push('a'+i);
                _infos.push({a: 'a'+i});
            }

            _xtorage.save(_keys, _infos);

            expect(_xtorage.get(_keys)).toEqual(_infos);
            expect(_xtorage.get(_keys[0])).toEqual(_infos[0]);

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys)).toBeNull();

        })

        it('should expire the content - passing expiration prop', function()
        {
            var _keys = [];
            var _infos = [];

            var ARRAY_SIZE = 10;

            for (var i = 0; i < ARRAY_SIZE; i++)
            {
                _keys.push('a'+i);
                _infos.push({a: 'a'+i});
            }

            _xtorage.save(_keys, _infos, {expiration: 12345});

            expect(_xtorage.get(_keys)).toEqual(_infos);
            expect(_xtorage.get(_keys[0])).toEqual(_infos[0]);

            _intervalMock.flush(1234);

            expect(_xtorage.get(_keys)).toEqual(_infos);

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys)).toBeNull();
        })
    })

    describe('sessionStorage', function()
    {
        it('should expire the content - no arguments passed', function()
        {
            var _key = 'a';
            var _info = true;

            _xtorage.save(_key, _info, {storage: 'sessionStorage'});

            expect(_xtorage.get(_key, {storage: 'sessionStorage'})).toBe(true);
            expect(typeof _xtorage.get(_key, {storage: 'sessionStorage'})).toBe('boolean');

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_key)).toBeNull();
        })

        it('should save the expiration object to the storage', function()
        {
            var _key = 'a';
            var _info = true;

            _xtorage.saveInSessionStorage(_key, _info);

            expect(_xtorage.getFromSessionStorage(_key)).toBe(true);
            expect(typeof _xtorage.getFromSessionStorage(_key)).toBe('boolean');
            expect(_windowMock.localStorage.getItem(EXPIRATION_KEY)).toBeDefined();

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.getFromSessionStorage(_key)).toBeNull();

            expect(_windowMock.localStorage.getItem(EXPIRATION_KEY)).toBeDefined();
        })

        it('should expire the content - complex array', function()
        {
            var _keys = [];
            var _infos = [];

            var ARRAY_SIZE = 100;

            for (var i = 0; i < ARRAY_SIZE; i++)
            {
                _keys.push('a'+i);
                _infos.push({a: 'a'+i});
            }

            _xtorage.save(_keys, _infos, {storage: 'sessionStorage'});

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
            expect(_xtorage.get(_keys[0], {storage: 'sessionStorage'})).toEqual(_infos[0]);

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toBeNull();

        })

        it('should expire the content - passing expiration prop', function()
        {
            var _keys = [];
            var _infos = [];

            var ARRAY_SIZE = 10;

            for (var i = 0; i < ARRAY_SIZE; i++)
            {
                _keys.push('a'+i);
                _infos.push({a: 'a'+i});
            }

            _xtorage.save(_keys, _infos, {expiration: 12345, storage: 'sessionStorage'});

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
            expect(_xtorage.get(_keys[0], {storage: 'sessionStorage'})).toEqual(_infos[0]);

            _intervalMock.flush(1234);

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);

            _intervalMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toBeNull();
        })
    })
})