# ng-xtorage

[![Build Status](https://travis-ci.org/ericmdantas/ng-xtorage.svg?branch=master)](https://travis-ci.org/ericmdantas/ng-xtorage)
[![Coverage Status](https://coveralls.io/repos/ericmdantas/ng-xtorage/badge.svg?branch=master)](https://coveralls.io/r/ericmdantas/ng-xtorage?branch=master)


Web Storage made simple and more powerful (sessionStorage & localStorage).


# installation

```

$ bower install ng-xtorage --save

```


# what?

This angular service is meant to be a **tiny**, yet **powerful** and **easy-to-use** API that interacts with the web storage.

It saves, retrieves and removes info from the web storage respecting not only the type of info being passed around, but also its life time.


# why?

Because it sucks to keep doing the same workarounds every project to: save, retrieve and remove info from the web storage.
Stringify this, parse that.. loop through this.. enough is enough.


# how?

The main service ```$xtorage``` exposes:

Nine simple methods:

- get;
- save;
- pushInto;
- unshiftInto;
- remove;
- clear;
- popFrom;
- shiftFrom;
- removeFromArray.


Eighteen proxies (will wrap ```get```, ```save```, ```remove``` and ```clear``` with the {storage: nameOfTheMethodHere}):

- getFromSessionStorage;
- getFromLocalStorage;

- saveInSessionStorage;
- saveInLocalStorage;

- pushIntoSessionStorage;
- pushIntoLocalStorage;

- unshiftIntoSessionStorage;
- unshiftIntoLocalStorage;

- removeFromSessionStorage;
- removeFromLocalStorage;
 
- removeFromArraySessionStorage;
- removeFromArraySessionStorage;

- shiftFromSessionStorage;
- shiftFromLocalStorage;

- popFromSessionStorage;
- popFromLocalStorage;

- clearSessionStorage;
- clearLocalStorage;


And two configurable properties (provider):

- storage; ```defaults to 'localStorage', can be changed in config time to 'sessionStorage'```
- unique; ```defaults to false, can be changed in config time to true```


## $xtorage.get(key, options)


### where:

- ```key``` is a **String**
- ```options``` is an optional **Object: storage**


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
  
  

## $xtorage.save(key, infoToBeSaved, options)


### where:

- ```key``` is a **String**
- ```infoToBeSaved``` can be **any type**
- ```options``` is an optional object **Object: storage**

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
      }]);
  ```    


## $xtorage.pushInto(key, infoToBePushededIntoTheArray, options)


### where:

- ```key``` is a **String**
- ```infoToBePushededIntoTheArray``` can be **any type**
- ```options``` is an optional object **Object: storage, unique**

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        $xtorage.save("someKeyHere", [1]); // save in localStorage
        $xtorage.save("someOtherKeyHere", [2], {storage: "sessionStorage"}); // saves in sessionStorage

        var _fromLocal = $xtorage.get("someKeyHere"); // [1]
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"}); // [2]

        $xtorage.pushInto("someKeyHere", "a"); // now you have ["a"] in the LocalStorage, with the key 'someKeyHere'
        $xtorage.pushInto("someKeyHere", "b", {storage: 'sessionStorage'); // now you have ["b"] in the SessionStorage, with the key 'someKeyHere'
        $xtorage.pushInto("someKeyHere", "b", {storage: 'sessionStorage', unique: true); // nothing will happen, since "b" already exists in the array

        var _fromLocal2 = $xtorage.get("someKeyHere"); // [1, "a"]
        var _fromSession2 = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"}); // [2, "b"]
      }]);
  ```






## $xtorage.unshiftInto(key, infoToBeUnshiftedIntoTheArray, options)


### where:

- ```key``` is a **String**
- ```infoToBeUnshiftedIntoTheArray``` can be **any type**
- ```options``` is an optional object **Object: storage, unique**

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        $xtorage.save("someKeyHere", [1]); // save in localStorage
        $xtorage.save("someOtherKeyHere", [2], {storage: "sessionStorage"}); // saves in sessionStorage

        var _fromLocal = $xtorage.get("someKeyHere"); // [1]
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"}); // [2]

        $xtorage.unshiftInto("someKeyHere", "a"); // now you have ["a"] in the LocalStorage, with the key 'someKeyHere'
        $xtorage.unshiftInto("someKeyHere", "b", {storage: 'sessionStorage'); // now you have ["b"] in the SessionStorage, with the key 'someKeyHere'
        $xtorage.unshiftInto("someKeyHere", "b", {storage: 'sessionStorage', unique: true); // nothing will happen, since "b" already exists in the array

        var _fromLocal2 = $xtorage.get("someKeyHere"); // ["a", 1]
        var _fromSession2 = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"}); // ["b", 2]
      }]);
  ```



## $xtorage.remove(key, options)


### where

- ```key``` is a **String**
- ```options``` is an optional object **Object: storage**

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
        $xtorage.remove("someOtherKeyHere", {storage: 'sessionStorage'});
        
        var _localInfoAfterRemoval = $xtorage.get("someKeyHere");
        var _sessionInfoAfterRemoval = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_localInfoAfterRemoval); // null
        console.log(_sessionInfoAfterRemoval); // null
      }]);
  ```    


## $xtorage.pop(key, options)


### where

- ```key``` is a **String**
- ```options``` is an optional object **Object: storage**

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _info = [{infoGoesHere: 'somethingsomething'}, true, {otherThing: {a: true}}];
      
        $xtorage.save("someKeyHere", _info); // save in localStorage
        $xtorage.save("someOtherKeyHere", _info, {storage: "sessionStorage"}); // saves in sessionStorage
        
        var _fromLocal = $xtorage.get("someKeyHere");
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_fromLocal); // display the object saved previously, not a string
        console.log(_fromSession); // displays the object saved previously, not a string
        
        $xtorage.pop("someKeyHere"); // removes the LAST item in the array and saves it back to the storage
        $xtorage.pop("someOtherKeyHere", {storage: 'sessionStorage'}); // removes the LAST item in the array and saves it back to the storage
        
        var _localInfoAfterRemoval = $xtorage.get("someKeyHere");
        var _sessionInfoAfterRemoval = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_localInfoAfterRemoval); // [{infoGoesHere: 'somethingsomething'}, true}]
        console.log(_sessionInfoAfterRemoval); // [{infoGoesHere: 'somethingsomething'}, true}]
      }]);
  ```    


## $xtorage.shift(key, options)


### where

- ```key``` is a **String**
- ```options``` is an optional object **Object: storage**

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _info = [{infoGoesHere: 'somethingsomething'}, true, {otherThing: {a: true}}];
      
        $xtorage.save("someKeyHere", _info); // save in localStorage
        $xtorage.save("someOtherKeyHere", _info, {storage: "sessionStorage"}); // saves in sessionStorage
        
        var _fromLocal = $xtorage.get("someKeyHere");
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_fromLocal); // display the object saved previously, not a string
        console.log(_fromSession); // displays the object saved previously, not a string
        
        $xtorage.shift("someKeyHere"); // removes the FIRST item in the array and saves it back to the storage
        $xtorage.shift("someOtherKeyHere", {storage: 'sessionStorage'}); // removes the FIRST item in the array and saves it back to the storage
        
        var _localInfoAfterRemoval = $xtorage.get("someKeyHere");
        var _sessionInfoAfterRemoval = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_localInfoAfterRemoval); // [true, {otherThing: {a: true}}]
        console.log(_sessionInfoAfterRemoval); // [true, {otherThing: {a: true}}]
      }]);
  ```    


## $xtorage.removeFromArray(key, index, options)


### where

- ```key``` is a **String**
- ```index``` is a **Number**
- ```options``` is an optional object **Object: storage**

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _info = [{infoGoesHere: 'somethingsomething'}, true, {otherThing: {a: true}}];
      
        $xtorage.save("someKeyHere", _info); // save in localStorage
        $xtorage.save("someOtherKeyHere", _info, {storage: "sessionStorage"}); // saves in sessionStorage
        
        var _fromLocal = $xtorage.get("someKeyHere");
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_fromLocal); // display the object saved previously, not a string
        console.log(_fromSession); // displays the object saved previously, not a string
        
        $xtorage.removeFromArray("someKeyHere", 1); // removes the SECOND item in the array and saves it back to the storage
        $xtorage.removeFromArray("someOtherKeyHere", 0, {storage: 'sessionStorage'}); // removes the FIRST item in the array and saves it back to the storage
        
        var _localInfoAfterRemoval = $xtorage.get("someKeyHere");
        var _sessionInfoAfterRemoval = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_localInfoAfterRemoval); // [{infoGoesHere: 'somethingsomething'}, {otherThing: {a: true}}]
        console.log(_sessionInfoAfterRemoval); // [true, {otherThing: {a: true}}]
      }]);
  ```    


## $xtorage.clear(options)


### where:


- ```options``` is an optional **Object: storage**


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

### saving

  ```javascript
  
    var _keys = ['key1', 'key2', 'key3'];
    var _info = [{hey: 'I\'m an object!'}, 'and I\'m a string :D', 42];
  
    $xtorage.save(_keys, _info); // will save info in the localStorage
  ```
  
### retrieving

  ```javascript
  
    var _keys = ['key1', 'key2', 'key3'];
    
    var _info = $xtorage.get(_keys); // will get info from the localStorage
    
    console.log(_info); // [{hey: 'I\'m an object!'}, 'and I\'m a string :D', 42]
  ```
  
### removing

  ```javascript
  
    var _keys = ['key1', 'key2', 'key3'];
    
    $xtorage.remove(_keys); // will remove info from the localStorage
    
    var _info = $xtorage.get(_keys);
    
    console.log(_info); // null
  ```


# form

[Moved to its own module](https://github.com/ericmdantas/ng-xtorage-form)


# configurable

Defaults:

- Storage is ```localStorage```;


Configuring:

```javascript

  angular
    .module('myAwesomeModule', ['emd.ng-xtorage'])
    .config(['$xtorageProvider', function($xtorageProvider)
    {
      $xtorageProvider.storage = 'sessionStorage'; // defaults to localStorage
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
        $xtorage.save('hey', 'savings will go to localStorage now, awesome, right?', {storage: 'localStorage'); //saves in the localStorage

        var _fromSession = $xtorage.get('hey'); //get from the localStorage

        console.log(_fromSession); // 'savings will go to localStorage now, awesome, right?'

        $xtorage.remove('hey'); // removes from localStorage

        // and on and on
    }])
```

#LICENSE

MIT
