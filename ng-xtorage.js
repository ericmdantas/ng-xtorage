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

            this.$get = ['$window', function($window)
            {
                var DEFAULT_STORAGE = self.storage;

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
                }

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
                }

                var _isArrayFilled = function (arr) {
                    return ng.isArray(arr) && arr.length;
                }

                var _getStorageType = function (options) {
                    var _options = ng.isObject(options) ? options : {};

                    return _options.storage || DEFAULT_STORAGE;
                };

                var _save = function(key, info, storage)
                {
                    ng.isObject(info) ? $window[storage].setItem(key, ng.toJson(info))
                                      : $window[storage].setItem(key, info);
                }

                var _saveInStorage = function (key, info, options)
                {
                    var _storage = _getStorageType(options);

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

                var _getFromStorage = function (key, options) {
                    var _storage = _getStorageType(options);
                    var _fromStorage = $window[_storage].getItem(key);
                    var _info = [];

                    if (_isArrayFilled(key))
                    {
                        for (var i = 0; i < key.length; i++)
                        {
                            var _arrayFromStorage = $window[_storage].getItem(key[i]);

                            if (_arrayFromStorage) // only push the info from the storage if it's defined
                                _info.push(_tryParseToObject(_arrayFromStorage));
                        }

                        if (!_isArrayFilled(_info))
                            _info = null;
                    }
                    else
                        _info = _tryParseToObject(_fromStorage, _isItANumber(_fromStorage));

                    return _info;
                };

                var _removeFromStorage = function (key, options)
                {
                    var _storage = _getStorageType(options);

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
                    var _storage = _getStorageType(options);

                    $window[_storage].clear();
                };



                /*          PROXIES           */

                var _getFromSessionStorageProxy = function(key)
                {
                    return this.get(key, SESSION_STORAGE_OBJECT);
                }

                var _getFromLocalStorageProxy = function(key)
                {
                    return this.get(key, LOCAL_STORAGE_OBJECT);
                }

                var _saveInSessionStorageProxy = function(key, info)
                {
                    this.save(key, info, SESSION_STORAGE_OBJECT);
                }

                var _saveInLocalStorageProxy = function(key, info)
                {
                    this.save(key, info, LOCAL_STORAGE_OBJECT);
                }

                var _removeFromSessionStorageProxy = function(key)
                {
                    this.remove(key, SESSION_STORAGE_OBJECT);
                }

                var _removeFromLocalStorageProxy = function(key)
                {
                    this.remove(key, LOCAL_STORAGE_OBJECT);
                }

                var _clearSessionStorageProxy = function(key)
                {
                    this.clear(key, SESSION_STORAGE_OBJECT);
                }

                var _clearLocalStorageProxy = function(key)
                {
                    this.clear(key, LOCAL_STORAGE_OBJECT);
                }


                /*          API          */

                return {
                    get: _getFromStorage,
                    save: _saveInStorage,
                    remove: _removeFromStorage,
                    clear: _clearStorage,

                    getFromSessionStorage: _getFromSessionStorageProxy,
                    getFromLocalStorage: _getFromLocalStorageProxy,

                    saveInSessionStorage: _saveInSessionStorageProxy,
                    saveInLocalStorage: _saveInLocalStorageProxy,

                    removeFromSessionStorage: _removeFromSessionStorageProxy,
                    removeFromLocalStorage: _removeFromLocalStorageProxy,

                    clearSessionStorage: _clearSessionStorageProxy,
                    clearLocalStorage: _clearLocalStorageProxy
                };
            }];
        });
}(angular))