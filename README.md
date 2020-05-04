# Tiny Error handler

Tiny and plugeable error handler with zero dependencies.

## Quick usage

```javascript
const { ApplicationError } = require('meseeks');

class DatabaseError extends ApplicationError {
    constructor(message, status, code) {
        super(message, status, code);
    }
}

const dbError = new DatabaseError('Critical error.', 500, 3500);

// Console output
// { date: 'Mon, 04 May 2020 17:04:50 GMT',
//  http_status: 200,
//  message: 'Critical error.',
//  code: 500,
//  stack:
//   'Error\n at DatabaseError.ApplicationError ...' }
```

## Base class

The package contains a base class named `ApplicationError` with the follow properties and methods:

|Property | Type  | Description   |  
|---|--- |---|
|`_message` | private  | Custom error message.  | 
| `_code`  | private |Application specific error code.  | 
| `_status` | private | HTTP status code.  | 
|`_debug` | private | Debug flag. Default `true`|
|`_error`| private | Error in JSON format with properties: **name**, **message**, **status** and **code**.|| `toJSON()` | public | Returns a JSON object with properties: **status** and **data** |
|`getError()`| public | Returns the `_error` object.  |

## API 

The base class contains a couple of static methods to make it plugeable.

### `$config`

This static method allows change, for now, the **debug** flag.

```javascript
 ApplicationError.$config({ debug: false });
```

### `$addEvent`

The base class contains an events stack that executes when a instance occur. You can add custom events for all the subclasses or for a specific subclass, and the method can access to the private properties and methods shown in the previous table.

For all subclasses:

``` javascript
const { ApplicationError } = require('meseeks');

function customLog() {
    console.log(`My HTTP status is: ${this._status}`);
}

ApplicationError.$addEvent(customLog);

class DatabaseError extends ApplicationError {
    constructor(message, status, code) {
        super(message, status, code);
    }
}

const dbError = new DatabaseError('Critical error.', 500, 3500);

// Console output
// { date: 'Mon, 04 May 2020 17:04:50 GMT',
//  http_status: 200,
//  message: 'Critical error.',
//  code: 500,
//  stack:
//   'Error\n at DatabaseError.ApplicationError ...' }
// My HTTP status is 500
```

For a specific subclass:

``` javascript
const { ApplicationError } = require('meseeks');

function customLog() {
    console.log(`My HTTP status is: ${this._status}`);
}

class DatabaseError extends ApplicationError {
    constructor(message, status, code) {
        super(message, status, code);
    }
}

class DatabaseError2 extends ApplicationError {
    constructor(message, status, code) {
        super(message, status, code);
    }
}

DatabaseError.$addEvent(customLog);

const dbError = new DatabaseError('Critical error.', 500, 3500);
const dbError2 = new DatabaseError('Critical error 2.', 509, 3100);

// Console output
// { date: 'Mon, 04 May 2020 17:04:50 GMT',
//  http_status: 500,
//  message: 'Critical error.',
//  code: 3500,
//  stack:
//   'Error\n at DatabaseError.ApplicationError ...' }
// My HTTP status is 500
// { date: 'Mon, 04 May 2020 17:04:50 GMT',
//  http_status: 509,
//  message: 'Critical error.',
//  code: 3100,
//  stack:
//   'Error\n at DatabaseError2.ApplicationError ...' }
```