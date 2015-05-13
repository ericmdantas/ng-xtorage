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

            this.storage = LOCAL_STORAGE;
            this.unique = false;

            this.$get = ['$window', function($window)
            {
                 var DEFAULT_STORAGE = self.storage;
                 var DEFAULT_UNIQUE = self.unique;

                 /* API */

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



                function _tryParseToObject(str, isNumber) {
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

                function _isItANumber(str) {
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

                function _isArrayFilled(arr) {
                    return ng.isArray(arr) && arr.length;
                };

                function _extractStorageType(options) {
                    var _options = ng.isObject(options) ? options : {};

                    return _options.storage || DEFAULT_STORAGE;
                };

                function _extractUnique(options) {
                    var _options = ng.isObject(options) ? options : {};

                    return _options.unique || DEFAULT_UNIQUE;
                };

                function _save(key, info, storage) {
                    ng.isObject(info) ? $window[storage].setItem(key, ng.toJson(info))
                                      : $window[storage].setItem(key, info);
                };

                function _isUnique(array, info) {
                    for (var i = 0; i < array.length; i++)
                    {
                        if (ng.equals(array[i], info))
                            return false;
                    }

                    return true;
                };

                function _addIntoHelper(key, array, info, method, storage) { // used for arrays only (push / unshift)
                    array[method](info);
                    this.save(key, array, {storage: storage});
                };

                function _addInto(key, info, options, method) { // used for arrays only (push / unshift)
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

                function _removeFrom(key, options, method) { // used for arrays only (pop / shift)
                    var _storage = _extractStorageType(options);

                    var _infoFromStorage = this.get(key, {storage: _storage});

                    _infoFromStorage[method]();

                    this.save(key, _infoFromStorage, {storage: _storage});
                };

                function _removeFromArray(key, index, options) {
                    var _storage = _extractStorageType(options);

                    var _array = this.get(key, {storage: _storage}) || [];

                    _array.splice(index, 1);

                    this.save(key, _array, {storage: _storage});
                }

                function _saveInStorage(key, info, options) {
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

                function _pushInto(key, info, options) {
                    _addInto.call(this, key, info, options, "push");
                };

                function _unshiftInto(key, info, options) {
                    _addInto.call(this, key, info, options, "unshift");
                };

                function _popFrom(key, options) {
                    _removeFrom.call(this, key, options, "pop");
                };

                function _shiftFrom(key, options) {
                    _removeFrom.call(this, key, options, "shift");
                };

                function _getFromStorage(key, options) {
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

                function _removeFromStorage(key, options) {
                    var _storage = _extractStorageType(options);

                    if (_isArrayFilled(key))
                    {
                        for (var i = 0; i < key.length; i++)
                            $window[_storage].removeItem(key[i]);
                    }
                    else
                        $window[_storage].removeItem(key);
                };

                function _clearStorage(options) {
                    var _storage = _extractStorageType(options);

                    $window[_storage].clear();
                };



                /*          PROXIES           */

                function _getFromSessionStorageProxy(key) {
                    return this.get(key, SESSION_STORAGE_OBJECT);
                };

                function _getFromLocalStorageProxy(key) {
                    return this.get(key, LOCAL_STORAGE_OBJECT);
                };

                function _saveInSessionStorageProxy(key, info) {
                    this.save(key, info, SESSION_STORAGE_OBJECT);
                };

                function _saveInLocalStorageProxy(key, info) {
                    this.save(key, info, LOCAL_STORAGE_OBJECT);
                };

                function _pushIntoSessionStorageProxy(key, info) {
                    _pushInto.call(this, key, info, SESSION_STORAGE_OBJECT);
                };

                function _pushIntoLocalStorageProxy(key, info) {
                    _pushInto.call(this, key, info, LOCAL_STORAGE_OBJECT);
                };

                function _unshiftIntoSessionStorageProxy(key, info) {
                    _unshiftInto.call(this, key, info, SESSION_STORAGE_OBJECT);
                };

                function _unshiftIntoLocalStorageProxy(key, info) {
                    _unshiftInto.call(this, key, info, LOCAL_STORAGE_OBJECT);
                };

                function _removeFromSessionStorageProxy(key) {
                    this.remove(key, SESSION_STORAGE_OBJECT);
                };

                function _removeFromLocalStorageProxy(key) {
                    this.remove(key, LOCAL_STORAGE_OBJECT);
                };

                function _removeFromArrayLocalStorageProxy(key, index) {
                    this.removeFromArray(key, index, LOCAL_STORAGE_OBJECT);
                };

                function _removeFromArraySessionStorageProxy(key, index) {
                    this.removeFromArray(key, index, SESSION_STORAGE_OBJECT);
                };

                function _clearSessionStorageProxy(key) {
                    this.clear(key, SESSION_STORAGE_OBJECT);
                };

                function _clearLocalStorageProxy(key) {
                    this.clear(key, LOCAL_STORAGE_OBJECT);
                };

                function _popFromLocalStorageProxy(key) {
                    this.popFrom(key, LOCAL_STORAGE_OBJECT);
                };

                function _popFromSessionStorageProxy(key) {
                    this.popFrom(key, SESSION_STORAGE_OBJECT);
                };

                function _shiftFromLocalStorageProxy(key) {
                    this.shiftFrom(key, LOCAL_STORAGE_OBJECT);
                };

                function _shiftFromSessionStorageProxy(key) {
                    this.shiftFrom(key, SESSION_STORAGE_OBJECT);
                };
            }];
        });
}(angular));