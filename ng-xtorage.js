"use strict";

angular
    .module('emd.ng-xtorage', [])
    .constant('XTORAGE_DEFAULT_TYPE', 'localStorage')
    .service('$xtorage', ['$window', 'XTORAGE_DEFAULT_TYPE', function($window, XTORAGE_DEFAULT_TYPE)
    {
        var DEFAULT_STORAGE = XTORAGE_DEFAULT_TYPE;

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

            for (var i = 0; i < str.length; i++)
            {
                if (!NUMBER_PATTERN.test(str[i]))
                    return false;
            }

            return true;
        }

        var _isStringFilled = function(str)
        {
            return (angular.isString(str) && str.length);
        };

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
                    _info.push(_tryParseToObject($window[_storage].getItem(key[i])));
                }
            }
            else
            {
                _info = _tryParseToObject(_fromStorage, _isItANumber(_fromStorage));
            }

            return _info;
        };

        var _removeFromStorage = function(key, options)
        {
            var _storage = _getStorageType(options);

            if (_isArrayFilled(key))
            {
                for (var i = 0; i < key.length; i++)
                {
                    $window[_storage].removeItem(key[i]);
                }
            }
            else
            {
                $window[_storage].removeItem(key);
            }
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
