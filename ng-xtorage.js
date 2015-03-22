;(function(ng)
{
    "use strict";

    ng
        .module('emd.ng-xtorage', [])
        .provider('$xtorage', function()
        {
            var self = this;

            var SESSION_STORAGE = 'sessionStorage';
            var LOCAL_STORAGE = 'localStorage';

            var SESSION_STORAGE_OBJECT = {storage: SESSION_STORAGE};
            var LOCAL_STORAGE_OBJECT = {storage: LOCAL_STORAGE};

            self.storage = LOCAL_STORAGE;
            self.unique = false;

            this.$get = ['$window', function($window)
            {
                var DEFAULT_STORAGE = self.storage;
                var DEFAULT_UNIQUE = self.unique;

                var _tryParseToObject = function (str, isNumber)
                {
                    var _info = null;

                    try
                    {
                        _info = ng.fromJson(str);
                    }
                    catch(e)
                    {
                        _info = (isNumber) ? parseInt(str) : str;
                    }

                    return _info;
                };

                var _isItANumber = function (str)
                {
                    var NUMBER_PATTERN = /[0-9]/;

                    if (!ng.isString(str) || !str.length)
                        return null;

                    for (var i = 0; i < str.length; i++)
                    {
                        if (!NUMBER_PATTERN.test(str[i]))
                            return false;
                    }

                    return true;
                };

                var _isArrayFilled = function (arr) {
                    return ng.isArray(arr) && arr.length;
                };

                var _extractStorageType = function (options) {
                    var _options = ng.isObject(options) ? options : {};

                    return _options.storage || DEFAULT_STORAGE;
                };

                var _extractUnique = function(options)
                {
                    var _options = ng.isObject(options) ? options : {};

                    return _options.unique || DEFAULT_UNIQUE;
                };

                var _save = function(key, info, storage)
                {
                    ng.isObject(info) ? $window[storage].setItem(key, ng.toJson(info))
                                      : $window[storage].setItem(key, info);
                };

                var _isUnique = function(array, info)
                {
                    for (var i = 0; i < array.length; i++)
                    {
                        if (ng.equals(array[i], info))
                            return false;
                    }

                    return true;
                };

                var _addIntoHelper = function(key, array, info, method, storage) // used for arrays only (push / unshift)
                {
                    array[method](info);
                    this.save(key, array, {storage: storage});
                };

                var _addInto = function(key, info, options, method) // used for arrays only (push / unshift)
                {
                    var _storage = _extractStorageType(options);
                    var _uniqueOpt = _extractUnique(options);

                    var _infoFromStorage = this.get(key, {storage: _storage}) || [];

                    if (_uniqueOpt)
                    {
                        if (_isUnique(_infoFromStorage, info))
                        {
                            _addIntoHelper.call(this, key, _infoFromStorage, info, method, _storage);
                        }
                    }
                    else
                    {
                        _addIntoHelper.call(this, key, _infoFromStorage, info, method, _storage);
                    };
                };

                var _removeFrom = function(key, options, method) // used for arrays only (pop / shift)
                {
                    var _storage = _extractStorageType(options);

                    var _infoFromStorage = this.get(key, {storage: _storage});

                    _infoFromStorage[method]();

                    this.save(key, _infoFromStorage, {storage: _storage});
                };

                var _removeFromArray = function(key, index, options)
                {
                    var _storage = _extractStorageType(options);

                    var _array = this.get(key, {storage: _storage}) || [];

                    _array.splice(index, 1);

                    this.save(key, _array, {storage: _storage});
                }

                var _saveInStorage = function (key, info, options)
                {
                    var _storage = _extractStorageType(options);

                    if (_isArrayFilled(key))
                    {
                        for (var i = 0; i < key.length; i++)
                        {
                            _save(key[i], info[i], _storage);
                        }
                    }
                    else
                    {
                        _save(key, info, _storage);
                    }
                };

                var _pushInto = function(key, info, options)
                {
                    _addInto.call(this, key, info, options, "push");
                };

                var _unshiftInto = function(key, info, options)
                {
                    _addInto.call(this, key, info, options, "unshift");
                };

                var _popFrom = function(key, options)
                {
                    _removeFrom.call(this, key, options, "pop");
                };

                var _shiftFrom = function(key, options)
                {
                    _removeFrom.call(this, key, options, "shift");
                };

                var _getFromStorage = function (key, options) {
                    var _storage = _extractStorageType(options);
                    var _fromStorage = $window[_storage].getItem(key);
                    var _info = [];

                    if (_isArrayFilled(key))
                    {
                        for (var i = 0; i < key.length; i++)
                        {
                            var _arrayFromStorage = $window[_storage].getItem(key[i]);

                            if (_arrayFromStorage) // only push the info from the storage if it's defined
                            {
                                _info.push(_tryParseToObject(_arrayFromStorage));
                            }
                        }

                        if (!_isArrayFilled(_info))
                        {
                            _info = null;
                        }
                    }
                    else
                    {
                        _info = _tryParseToObject(_fromStorage, _isItANumber(_fromStorage));
                    }

                    return _info;
                };

                var _removeFromStorage = function (key, options)
                {
                    var _storage = _extractStorageType(options);

                    if (_isArrayFilled(key))
                    {
                        for (var i = 0; i < key.length; i++)
                            $window[_storage].removeItem(key[i]);
                    }
                    else
                        $window[_storage].removeItem(key);
                };

                var _clearStorage = function (options)
                {
                    var _storage = _extractStorageType(options);

                    $window[_storage].clear();
                };



                /*          PROXIES           */

                var _getFromSessionStorageProxy = function(key)
                {
                    return this.get(key, SESSION_STORAGE_OBJECT);
                };

                var _getFromLocalStorageProxy = function(key)
                {
                    return this.get(key, LOCAL_STORAGE_OBJECT);
                };

                var _saveInSessionStorageProxy = function(key, info)
                {
                    this.save(key, info, SESSION_STORAGE_OBJECT);
                };

                var _saveInLocalStorageProxy = function(key, info)
                {
                    this.save(key, info, LOCAL_STORAGE_OBJECT);
                };

                var _pushIntoSessionStorageProxy = function(key, info)
                {
                    _pushInto.call(this, key, info, SESSION_STORAGE_OBJECT);
                };

                var _pushIntoLocalStorageProxy = function(key, info)
                {
                    _pushInto.call(this, key, info, LOCAL_STORAGE_OBJECT);
                };

                var _unshiftIntoSessionStorageProxy = function(key, info)
                {
                    _unshiftInto.call(this, key, info, SESSION_STORAGE_OBJECT);
                };

                var _unshiftIntoLocalStorageProxy = function(key, info)
                {
                    _unshiftInto.call(this, key, info, LOCAL_STORAGE_OBJECT);
                };

                var _removeFromSessionStorageProxy = function(key)
                {
                    this.remove(key, SESSION_STORAGE_OBJECT);
                };

                var _removeFromLocalStorageProxy = function(key)
                {
                    this.remove(key, LOCAL_STORAGE_OBJECT);
                };

                var _removeFromArrayLocalStorageProxy = function(key, index)
                {
                    this.removeFromArray(key, index, LOCAL_STORAGE_OBJECT);
                };

                var _removeFromArraySessionStorageProxy = function(key, index)
                {
                    this.removeFromArray(key, index, SESSION_STORAGE_OBJECT);
                };

                var _clearSessionStorageProxy = function(key)
                {
                    this.clear(key, SESSION_STORAGE_OBJECT);
                };

                var _clearLocalStorageProxy = function(key)
                {
                    this.clear(key, LOCAL_STORAGE_OBJECT);
                };

                var _popFromLocalStorageProxy = function(key)
                {
                    this.popFrom(key, LOCAL_STORAGE_OBJECT);
                };

                var _popFromSessionStorageProxy = function(key)
                {
                    this.popFrom(key, SESSION_STORAGE_OBJECT);
                };

                var _shiftFromLocalStorageProxy = function(key)
                {
                    this.shiftFrom(key, LOCAL_STORAGE_OBJECT);
                };

                var _shiftFromSessionStorageProxy = function(key)
                {
                    this.shiftFrom(key, SESSION_STORAGE_OBJECT);
                };

                /*          API          */

                return {
                    get: _getFromStorage,
                    save: _saveInStorage,
                    remove: _removeFromStorage,
                    clear: _clearStorage,



                    pushInto: _pushInto,
                    unshiftInto: _unshiftInto,



                    popFrom: _popFrom,
                    shiftFrom: _shiftFrom,
                    removeFromArray: _removeFromArray,



                    getFromSessionStorage: _getFromSessionStorageProxy,
                    getFromLocalStorage: _getFromLocalStorageProxy,

                    saveInSessionStorage: _saveInSessionStorageProxy,
                    saveInLocalStorage: _saveInLocalStorageProxy,

                    pushIntoSessionStorage: _pushIntoSessionStorageProxy,
                    pushIntoLocalStorage: _pushIntoLocalStorageProxy,

                    unshiftIntoSessionStorage: _unshiftIntoSessionStorageProxy,
                    unshiftIntoLocalStorage: _unshiftIntoLocalStorageProxy,

                    removeFromSessionStorage: _removeFromSessionStorageProxy,
                    removeFromLocalStorage: _removeFromLocalStorageProxy,

                    removeFromArrayLocalStorage: _removeFromArrayLocalStorageProxy,
                    removeFromArraySessionStorage: _removeFromArraySessionStorageProxy,

                    popFromSessionStorage: _popFromSessionStorageProxy,
                    popFromLocalStorage: _popFromLocalStorageProxy,

                    shiftFromSessionStorage: _shiftFromSessionStorageProxy,
                    shiftFromLocalStorage: _shiftFromLocalStorageProxy,

                    clearSessionStorage: _clearSessionStorageProxy,
                    clearLocalStorage: _clearLocalStorageProxy
                };
            }];
        });
}(angular));