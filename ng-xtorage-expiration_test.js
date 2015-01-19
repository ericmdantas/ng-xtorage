describe('ng-xtorage-expiration', function()
{
    var _xtorage, _windowMock, _xtorageProvider, _timeoutMock;
    var MAX_FLUSH = 9999;

    beforeEach(module('emd.ng-xtorage', function($xtorageProvider)
    {
        $xtorageProvider.storageExpiration = 1000;

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

    describe('localstorage', function()
    {
        it('should expire the content - no arguments passed', function()
        {
            var _key = 'a';
            var _info = true;

            _xtorage.save(_key, _info);

            expect(_xtorage.get(_key)).toBe(true);
            expect(typeof _xtorage.get(_key)).toBe('boolean');

            _timeoutMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_key)).toBeNull();
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

            _timeoutMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys)).toBeNull();

        })

        it('should expire the content - passing expiration prop', function()
        {
            var _keys = [];
            var _infos = [];

            var ARRAY_SIZE = 1000;

            for (var i = 0; i < ARRAY_SIZE; i++)
            {
                _keys.push('a'+i);
                _infos.push({a: 'a'+i});
            }

            _xtorage.save(_keys, _infos, {expiration: 12345});

            expect(_xtorage.get(_keys)).toEqual(_infos);
            expect(_xtorage.get(_keys[0])).toEqual(_infos[0]);

            _timeoutMock.flush(1234);

            expect(_xtorage.get(_keys)).toEqual(_infos);

            _timeoutMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys)).toEqual(_infos);
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

            _timeoutMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_key)).toBeNull();
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

            _timeoutMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toBeNull();

        })

        it('should expire the content - passing expiration prop', function()
        {
            var _keys = [];
            var _infos = [];

            var ARRAY_SIZE = 1000;

            for (var i = 0; i < ARRAY_SIZE; i++)
            {
                _keys.push('a'+i);
                _infos.push({a: 'a'+i});
            }

            _xtorage.save(_keys, _infos, {expiration: 12345, storage: 'sessionStorage'});

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
            expect(_xtorage.get(_keys[0], {storage: 'sessionStorage'})).toEqual(_infos[0]);

            _timeoutMock.flush(1234);

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);

            _timeoutMock.flush(MAX_FLUSH);

            expect(_xtorage.get(_keys, {storage: 'sessionStorage'})).toEqual(_infos);
        })
    })
})