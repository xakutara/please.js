please.init(window);

asyncTest('Basic communication with child frame', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).call('sayHello').then(function (messageFromChild) {
		equal('Hello from child!', messageFromChild, 'Hello world handshake test passed');
		start();
	});
});

module('please.defaults')
asyncTest('Overring defaults', function () {
	var childFrame = $('#child-frame').get(0);
	var timeout = setTimeout(function () {
		ok(0, "Timeout occured.");
		start();
	}, 2000);
	
	please.defaults({
		targetWindow: childFrame.contentWindow
	});
	ok(1, "Sent a request");
	please.call('sayHello').then(function (messageFromChild) {
		clearTimeout(timeout);
		ok(1, "Received a response");
		equal('Hello from child!', messageFromChild, 'please.defaults.contentWindow configuration works');
		start();
		// reset / teardown
		please.defaults({targetWindow: window});
	});
});

module('please.get');
asyncTest('Getting a variable\'s value from child', function () {
	var childFrame = $('#child-frame').get(0);
	
	please(childFrame.contentWindow).get('testVariable').then(function (value) {
		equal('test', value, 'testVariable in child equals "test"');
		start();
	});
});

asyncTest('Getting an object\'s property from child', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).get('testObject.property').then(function (value) {
		equal('test', value, 'testObject.property in child equals "test"');
		start();
	});
});

asyncTest('Getting an undefined variable from child', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).get('undefinedVariable').then(function (value) {
		equal(value, undefined, 'undefinedVariable in child equals undefined');
		start();
	}, function (error) {
		ok(0, "Error occured while accessing an undefined variable");
		start();
	});
});

asyncTest('Getting an undefined object\'s property from child', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).get('undefinedObject.property').then(function () {
		ok(0, "No error occured.");
	}, function (error) {
		ok(error instanceof please.Error, "Error occured while accessing an undefined object's property");
		equal(error.name, 'TypeError', 'Error is a TypeError');
		equal(error.message, "Cannot read property 'property' of undefined", "Message is: Cannot read property 'property' of undefined");
		start();
	});
});

module('please.set');
asyncTest('Setting a global variable in child', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).set('someVariable', 'someValue').then(function () {
		ok(1, "Variable set in child");
		return please(childFrame.contentWindow).get('someVariable');
	}).then(function (value) {
		equal(value, 'someValue', 'Verifying: "someVariable" in child set to "someValue"');
		start();
	});
})

asyncTest('Setting an object\'s property in child', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).set('testObject.someProperty', 'someValue').then(function () {
		ok(1, "testObject's property set in child");
		return please(childFrame.contentWindow).get('testObject.someProperty');
	}).then(function (value) {
		equal(value, 'someValue', 'Verifying: "testObject.someProperty" in child set to "someValue"');
		start();
	})
});

asyncTest('Setting a property on an undefined object', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).set('undefinedObject.property', 'someValue').then(function () {
		ok(0, "No error occured.");
	}, function (error) {
		ok(error instanceof please.Error, "Error occured while accessing an undefined object's property");
		equal(error.name, 'TypeError', 'Error is a TypeError');
		equal(error.message, "Cannot set property 'property' of undefined", "Message is: Cannot read property 'property' of undefined");
		start();
	});
});

module('please.call');
asyncTest('Calling a function in child', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).call('giveMeAnApple').then(function (apple) {
		equal(apple, 'apple', 'Called function "giveMeAnApple" in child returned value "apple"');
		start();
	});
});

asyncTest('Calling a function with a parameter', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).call('giveMeApples', 5).then(function (apples) {
		console.log('reached here');
		deepEquals(apples, {apples: 5}, 'Called function giveMeApples with param N in child returned value {apple: N}');
		start();
	});
});

asyncTest('Calling a method on an object', function () {
	var childFrame = $('#child-frame').get(0);

	please(childFrame.contentWindow).call('testObject.method').then(function (value) {
		deepEqual(value, 'test', 'Calling testObject.method returned "test"');
		start();
	});
})

asyncTest()

$(document).ready(function () {
	$('#child-frame').load(function () {
		QUnit.start();
	});
});