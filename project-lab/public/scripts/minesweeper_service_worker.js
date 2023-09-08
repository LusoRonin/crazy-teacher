var APP_PREFIX = 'minesweeper'; // IDENTIFIER
var VERSION = 'v0.0.2'; // VERSION NUMBER
var CACHE_NAME = APP_PREFIX + VERSION; // CACHE NAME
var URLS = [
  '../minesweeper.html',
  './minesweeper.js',
  './twemoji.js',
]; // ADD URLS YOU WANT TO CACHE

// THE SERVICE WORKER IS USED TO CACHE FILES FOR OFFLINE USE AND TO SPEED UP LOADING TIMES: IN THE EVENT OF A NETWORK FAILURE, THE SERVICE WORKER WILL SERVE FILES FROM THE CACHE. IN THIS CASE, THE SERVICE WORKER IS USED TO CACHE THE MINESWEEPER GAME FILES AND THE TWEMOJI LIBRARY FILES.

// RESPOND WITH CACHED RESOURCES
self.addEventListener('fetch', function (e) { // FETCH EVENT LISTENER
  console.log('fetch request : ' + e.request.url); // LOGGING URL
  e.respondWith( // RESPONDING WITH
    caches.match(e.request).then(function (request) { // CHECKING CACHE FOR REQUEST RESPONSE
      if (request) { // IF REQUEST IS IN CACHE
        console.log('responding with cache : ' + e.request.url); // LOGGING CACHE URL
        return request; // RETURN CACHE
      } else { // IF REQUEST IS NOT IN CACHE
        console.log('file is not cached, fetching : ' + e.request.url); // LOGGING CACHE URL
        return fetch(e.request); // FETCH REQUEST
      } // END OF IF ELSE STATEMENT
    }) // END OF CACHES.MATCH PROMISE
  ) // END OF RESPOND WITH
}) // END OF FETCH EVENT LISTENER

// CHECKING CACHE ON INSTALL
self.addEventListener('install', function (e) { // INSTALL EVENT LISTENER
  e.waitUntil( // WAIT UNTIL
    caches.open(CACHE_NAME).then(function (cache) { // OPENING CACHE
      console.log('installing cache : ' + CACHE_NAME); // LOGGING CACHE NAME
      return cache.addAll(URLS); // ADDING FILES TO CACHE
    }) // END OF CACHES.OPEN PROMISE
  ) // END OF WAIT UNTIL
}) // END OF INSTALL EVENT LISTENER 

// DELETING OLD CACHES
self.addEventListener('activate', function (e) { // ACTIVATE EVENT LISTENER
  e.waitUntil( // WAIT UNTIL
    caches.keys().then(function (keyList) { // GETTING CACHE KEYS
      var cacheWhitelist = keyList.filter(function (key) { // FILTERING CACHE KEYS
        return key.indexOf(APP_PREFIX); // RETURNING CACHE KEYS THAT INCLUDE APP_PREFIX
      }) // END OF CACHEWHITELIST FILTER
      cacheWhitelist.push(CACHE_NAME); // PUSHING CACHE_NAME TO CACHEWHITELIST
      return Promise.all(keyList.map(function (key, i) { // RETURNING PROMISE
        if (cacheWhitelist.indexOf(key) === -1) { // IF CACHE KEY IS NOT IN CACHEWHITELIST
          console.log('deleting cache : ' + keyList[i]); // LOGGING CACHE KEY
          return caches.delete(keyList[i]); // DELETE CACHE KEY
        } // END OF IF STATEMENT
      })) // END OF PROMISE.ALL
    }) // END OF CACHES.KEYS PROMISE
  ) // END OF WAIT UNTIL
}) // END OF ACTIVATE EVENT LISTENER