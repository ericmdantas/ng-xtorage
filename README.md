# ng-xtorage

Web Storage made simple (sessionStorage & localStorage).

# what?

This angular service is meant to be an easy-to-use API that interacts with the web storage.

It saves, retrieves and removes info from the web storage respecting the type of info being passed around.

And not only that, it **extends** some of web storages behaviors. For example, **you couldn't save, retrieve and remove things using arrays, now you can**;

I mean, it'll do all the annoying work for you. 

**If you save an object, you'll get an object back.**

**If you save a number, you'll get a number back.**

**If you save an array of stuff, you might get back an array of stuff.**

**If you save an array of stuff, you might remove an array of stuff.**


# why?

Because it sucks to keep doing the same workarounds every project to: save, retrieve and remove info from the web storage.

Not to mention the headache of stringifying objects when saving and parsing them back to objects when retrieving them from the storage. Similar problems happen when saving numbers.

# how?

The main service ```$xtorage``` exposes four simple methods:

- get;
- save;
- remove;
- clear.

## get

```$xtorage.get``` might take two parameters, but only the first one is obligatory - the second one is optional.  

The first parameter is the key, as in ```window.localStorage.getItem(**keyGoesHere**)```;

The second parameter is the options object. For now it checks the existance of the property ```storage```, if it exists, it'll take its value and make it the object to use as storage (sessionStorage and localStorage are the ones available);

#### usage:

  ```javascript
  angular
      .module("testeApp", ["emd.ng-xtorage"])
      .run(["$xtorage", function($xtorage)
      {
        var _fromLocal = $xtorage.get("someKeyHere"); // gets info from localStorage
        var _fromSession = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"}); // gets info from sessionStorage
        
        console.log(_fromLocal);
        console.log(_fromSession);
      }]);
  ```    
  

## save

```$xtorage.save``` might take three parameters, but only the first two are obligatory - the third one is optional.

The first parameter is the key, as in ```window.localStorage.setItem(**keyGoesHere**)```;

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
        var _fromLocal = $xtorage.get("someOtherKeyHere", {storage: "sessionStorage"});
        
        console.log(_fromLocal); // display the object saved previously, not a string
        console.log(_fromSession); // displays the object saved previously, not a string
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
