# ng-xtorage

[![Build Status](https://travis-ci.org/ericmdantas/ng-xtorage.svg?branch=master)](https://travis-ci.org/ericmdantas/ng-xtorage)
[![Coverage Status](https://coveralls.io/repos/ericmdantas/ng-xtorage/badge.svg?branch=master)](https://coveralls.io/r/ericmdantas/ng-xtorage?branch=master)

Web Storage made simple and more powerful (sessionStorage & localStorage).

Forget about stringifying and parsing JSON.

Forget about loops to save/retrieve stuff in and from the Web Storage.

Forget about depeding on your user to 'expire' your Web Storage.

Forget about manually saving that big form to the storage.

It's all in your hands now.

# installation

```bower install ng-xtorage --save```

# what?

This angular service is meant to be a **tiny**, yet **powerful** and **easy-to-use** API that interacts with the web storage.

It saves, retrieves and removes info from the web storage respecting not only the type of info being passed around, but also its life time.

For example:
- You couldn't save, retrieve and remove things using arrays, right?
- You also couldn't make info from the Web Storage expire, right?
- Saving a form to the storage, you had to do it manually, right?
- Well, now you can! ```$xtorage``` got you covered.


[Make the Web Storage simpler!](#how)

[Make it more powerful!](#arrays)

[You choose who lives and who dies! >:D](#expiration)

[Cache that big form, just in case](#form)

[Make it your own!](#configurable)


# why?

Because it sucks to keep doing the same workarounds every project to: save, retrieve, remove and expire info from the web storage.
Stringify this, parse that.. loop through this.. enough is enough.


# more power

Usually, when working with localStorage and sessionStorage, no matter what you have, you'll have to save as a string and you'll always get back a string. Which sucks, because all the parsing is up to us.

When using ```$xtorage```, you will save something and you'll get that thing back. It doesn't matter if it's a number, object, string or even a boolean! No parsing needed.


# how?

The main service ```$xtorage``` exposes:

A directive ```$xtorageFormCache``` with two attributes:

- storage-key;
- info-to-be-saved;


Four simple methods:

- get;
- save;
- remove;
- clear.


Eight proxies (will wrap ```get```, ```save```, ```remove``` and ```clear``` with the {storage: nameOfTheMethodHere}):

- getFromSessionStorage;
- getFromLocalStorage;

- saveInSessionStorage;
- saveInLocalStorage;

- removeFromSessionStorage;
- removeLocalSessionStorage;

- clearSessionStorage;
- clearLocalStorage;

And two configurable properties (provider):

- storage; // defaults to 'localStorage', can be changed in config time to 'sessionStorage'
- storageExpiration. // defaults to 'infinity', can be changed to any number (milliseconds)


## get

```$xtorage.get``` might take two parameters, but only the first one is obligatory - the second one is optional.  

The first parameter is the key, as in ```window.localStorage.getItem(**keyGoesHere**)```;

The second parameter is the options object.
It checks the existance of the property ```storage```, if it exists, it'll take its value and make it the object to use as storage (sessionStorage and localStorage are the ones available);

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _fromLocal = $xtorage.get("someKeyHere"); // gets info from localStorage
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"}); // gets info from sessionStorage
        
        console.log(_fromLocal); // whatever was held with that key in localStorage
        console.log(_fromSession); // whatever was held with that key in sessionStorage
      }]);
  ```    
  

## save

```$xtorage.save``` might take three parameters, but only the first two are obligatory - the third one is optional.

The first parameter is the key, as in ```window.localStorage.setItem(**keyGoesHere**)```;

The second parameter is the info itself. It might be a string like in ```$xtorage.save('key', 'info')```, an object like in ```$xtorage.save('key', {info: 'here'})``` or even an number ```$xtorage.save('key', 42)```.

The third parameter is the options object.
It checks the existance of the property ```storage```, if it exists, it'll take its value and make it the object to use as storage (sessionStorage and localStorage are the ones available);
It also checks the existance of the property ```expiration```, if it exists, it'll take its value **(must be a number/milliseconds)** and register the expiration of the saved info;

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _info = {infoGoesHere: 'somethingsomething', otherThing: {a: true}};
      
        $xtorage.save("someKeyHere", _info); // save in localStorage
        $xtorage.save("someOtherKeyHere", _info, {storage: "sessionStorage"}); // saves in sessionStorage
        $xtorage.save("someOtherKeyHereExpiration", _info, {storage: "sessionStorage", expiration: 10000}); // saves in sessionStorage, will expire in 10 seconds
        
        var _fromLocal = $xtorage.get("someKeyHere");
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        var _fromSessionExpiration = $xtorage.get("someOtherKeyHereExpiration", {storage: "sessionStorage"});
        
        console.log(_fromLocal); // display the object saved previously, not a string
        console.log(_fromSession); // displays the object saved previously, not a string
        console.log(_fromSessionExpiration); // displays the object saved previously, not a string

        // 11 seconds later...

        _fromSessionExpiration = $xtorage.get("someOtherKeyHereExpiration", {storage: "sessionStorage"});

        console.log(_fromSessionExpiration); // null
      }]);
  ```    

## remove

```$xtorage.remove``` might take two parameters, but only the first one is obligatory - the second one is optional.

The first parameter is the key, as in ```window.localStorage.removeItem(**keyGoesHere**)```;

The second parameter is the options object. For now it checks the existance of the property ```storage```, if it exists, it'll take its value and make it the object to use as storage (sessionStorage and localStorage are the ones available);

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _info = {infoGoesHere: 'somethingsomething', otherThing: {a: true}};
      
        $xtorage.save("someKeyHere", _info); // save in localStorage
        $xtorage.save("someOtherKeyHere", _info, {storage: "sessionStorage"}); // saves in sessionStorage
        
        var _fromLocal = $xtorage.get("someKeyHere");
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_fromLocal); // display the object saved previously, not a string
        console.log(_fromSession); // displays the object saved previously, not a string
        
        $xtorage.remove("someKeyHere");
        $xtorage.remove("someOtherKeyHere");
        
        var _localInfoAfterRemoval = $xtorage.get("someKeyHere");
        var _sessionInfoAfterRemoval = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_localInfoAfterRemoval); // null
        console.log(_sessionInfoAfterRemoval); // null
      }]);
  ```    

## clear

```$xtorage.clear``` might take one parameter and it's optional.

The only parameter is the options object. For now it checks the existance of the property ```storage```, if it exists, it'll take its value and make it the object to use as storage (sessionStorage and localStorage are the ones available);

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _info = {infoGoesHere: 'somethingsomething', otherThing: {a: true}};
      
        $xtorage.save("someKeyHere", _info); // save in localStorage
        $xtorage.save("someOtherKeyHere", _info, {storage: "sessionStorage"}); // saves in sessionStorage
        
        var _fromLocal = $xtorage.get("someKeyHere");
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_fromLocal); // display the object saved previously, not a string
        console.log(_fromSession); // displays the object saved previously, not a string
        
        $xtorage.clear(); // clears everything from the localStorage - no need for keys
        $xtorage.clear({storage: 'sessionStorage'}); // clears everything from sessionStorage 
        
        var _localInfoAfterRemoval = $xtorage.get("someKeyHere");
        var _sessionInfoAfterRemoval = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_localInfoAfterRemoval); // null
        console.log(_sessionInfoAfterRemoval); // null
      }]);
  ```

# arrays

All the methods above will work when having arrays as parameters too.

### usage:

#### saving

  ```javascript
  
    var _keys = ['key1', 'key2', 'key3'];
    var _info = [{hey: 'I\'m an object!'}, 'and I\'m a string :D', 42];
  
    $xtorage.save(_keys, _info); // will save info in the localStorage
  ```
  
#### retrieving

  ```javascript
  
    var _keys = ['key1', 'key2', 'key3'];
    
    var _info = $xtorage.get(_keys); // will get info from the localStorage
    
    console.log(_info); // [{hey: 'I\'m an object!'}, 'and I\'m a string :D', 42]
  ```
  
#### removing

  ```javascript
  
    var _keys = ['key1', 'key2', 'key3'];
    
    $xtorage.remove(_keys); // will remove info from the localStorage
    
    var _info = $xtorage.get(_keys);
    
    console.log(_info); // null
  ```

# expiration

Expiring something saved to the storage is piece of cake.

### configuring at config time

```javascript

    angular
        .module('myAwesomeModule', ['emd.ng-xtorage'])
        .config(['$xtorageProvider', function($xtorageProvider)
        {
            $xtorageProvider.storageExpiration = 10000; // will expire everything saved to the store in 10 seconds
        }])
        .run(function($xtorage)
        {
            $xtorage.save('key', 'info');

            var _fromStorage = $xtorage.get('key');

            console.log(_fromStorage); // info

            // 11 seconds later

            _fromStorage = $xtorage.get('key');

            console.log(_fromStorage); // null
        })
```

### on every save

```javascript

    angular
        .module('myAwesomeModule', ['emd.ng-xtorage'])
        .run(function($xtorage)
        {
            $xtorage.save('key', 'info', {expiration: 10000});

            var _fromStorage = $xtorage.get('key');

            console.log(_fromStorage); // info

            // 11 seconds later

            _fromStorage = $xtorage.get('key');

            console.log(_fromStorage); // null
        })
```


# configurable

Defaults:

- Storage is ```localStorage```;
- Expiration is ```infinity```;


Configuring:

```javascript

  angular
    .module('myAwesomeModule', ['emd.ng-xtorage'])
    .config(['$xtorageProvider', function($xtorageProvider)
    {
      $xtorageProvider.storage = 'sessionStorage'; // defaults to localStorage
      $xtorageProvider.storageExpiration = 10000; // defaults to 'infinity'
    }])
    .run(['$xtorage', function($xtorage)
    {
        $xtorage.save('hey', 'savings will go to sessionStorage now, awesome, right?'); //saves in the sessionStorage

        var _fromSession = $xtorage.get('hey'); //get from the sessionStorage

        console.log(_fromSession); // 'savings will go to sessionStorage now, awesome, right?'

        $xtorage.remove('hey'); // removes from sessionStorage

        // and on and on
    }])
```

So, now to save in the localStorage you'll have the inform the options param:


```javascript

  angular
    .module('myAwesomeModule', ['emd.ng-xtorage'])
    .config(['$xtorageProvider', function($xtorageProvider)
    {
      $xtorageProvider.storage = 'sessionStorage';
    }])
    .run(['$xtorage', function($xtorage)
    {
        $xtorage.save('hey', 'savings will go to localStorage now, awesome, right?', {storage: 'localStorage'); //saves in the localStorage, and will expire in 10 seconds :D

        var _fromSession = $xtorage.get('hey'); //get from the localStorage

        console.log(_fromSession); // 'savings will go to localStorage now, awesome, right?'

        $xtorage.remove('hey'); // removes from localStorage

        // and on and on
    }])
```

#LICENSE

The MIT License (MIT)

Copyright (c) 2014 Eric Mendes Dantas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
