"use strict";

angular
    .module('emd.ng-xtorage', [])
    .provider('$xtorageDefaultStorage', function()
    {
        this.$get = function()
        {
            return {storage: 'localStorage'}
        };
    })
    .service('$xtorage', ['$window', '$xtorageDefaultStorage', function($window, $xtorageDefaultStorage)
    {
        var DEFAULT_STORAGE = $xtorageDefaultStorage.storage;

        var _tryParseToObject = function(str, isNumber)
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

        var _isItANumber = function(str)
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

        var _isArrayFilled = function(arr)
        {
            return angular.isArray(arr) && arr.length;
        }

        var _getStorageType = function(options)
        {
            var _options = angular.isObject(options) ? options : {};

            return _options.storage || DEFAULT_STORAGE;
        };




        var _saveInStorage = function(key, info, options)
        {
            var _storage = _getStorageType(options);

            if (_isArrayFilled(key))
            {
                for (var i = 0; i < key.length; i++)
                {
                    angular.isObject(info[i]) ? $window[_storage].setItem(key[i], angular.toJson(info[i]))
                                              : $window[_storage].setItem(key[i], info[i]);
                }
            }
            else
            {
                angular.isObject(info) ? $window[_storage].setItem(key, angular.toJson(info))
                                       : $window[_storage].setItem(key, info);

            }
        };

        var _getFromStorage = function(key, options)
        {
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

        var _removeFromStorage = function(key, options)
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

        var _clearStorage = function(options)
        {
            var _storage = _getStorageType(options);

            $window[_storage].clear();
        };




        /*        API          */

        this.get = _getFromStorage;
        this.save = _saveInStorage;
        this.remove = _removeFromStorage;
        this.clear = _clearStorage;
    }]);
