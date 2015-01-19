(function()
{
    "use strict";

    angular
        .module('emd.ng-xtorage', [])
        .provider('$xtorage', function()
        {
            var self = this;

            var INFINITY = 'infinity';

            self.storage = 'localStorage';
            self.storageExpiration = INFINITY;

            this.$get = ['$window', '$timeout', function($window, $timeout)
            {
                var DEFAULT_STORAGE = self.storage;
                var DEFAULT_EXPIRATION = self.storageExpiration;

                var _tryParseToObject = function (str, isNumber)
                {
                    var _info = null;

                    try
                    {
                        _info = angular.fromJson(str);
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

                    if (!angular.isString(str) || !str.length)
                        return null;

                    for (var i = 0; i < str.length; i++)
                    {
                        if (!NUMBER_PATTERN.test(str[i]))
                            return false;
                    }

                    return true;
                }

                var _isArrayFilled = function (arr) {
                    return angular.isArray(arr) && arr.length;
                }

                var _getStorageType = function (options) {
                    var _options = angular.isObject(options) ? options : {};

                    return _options.storage || DEFAULT_STORAGE;
                };

                var _getExpiration = function(options)
                {
                    var _options = angular.isObject(options) ? options : {};

                    return _options.expiration || DEFAULT_EXPIRATION;
                }

                var _registerExpiration = function(key, storage, expiration)
                {
                    $timeout(function()
                    {
                        $window[storage].removeItem(key);
                    }, expiration);
                }

                var _saveInStorage = function (key, info, options)
                {
                    var _storage = _getStorageType(options);
                    var _expiration = _getExpiration(options);

                    if (_isArrayFilled(key))
                    {
                        for (var i = 0; i < key.length; i++)
                        {
                            angular.isObject(info[i]) ? $window[_storage].setItem(key[i], angular.toJson(info[i]))
                                                      : $window[_storage].setItem(key[i], info[i]);

                            if (DEFAULT_EXPIRATION !== INFINITY)
                                _registerExpiration(key[i], _storage, _expiration);
                        }
                    }
                    else
                    {
                        angular.isObject(info) ? $window[_storage].setItem(key, angular.toJson(info))
                                               : $window[_storage].setItem(key, info);

                        if (DEFAULT_EXPIRATION !== INFINITY)
                            _registerExpiration(key, _storage, _expiration);
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

                            if (_arrayFromStorage) // only push the response if it's defined
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


                /*        API          */

                return {
                    get: _getFromStorage,
                    save: _saveInStorage,
                    remove: _removeFromStorage,
                    clear: _clearStorage
                };
            }];
        });
}())