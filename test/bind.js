var nano = require('..');
var test = require('tape');

test('map bind address eid for valid INPROC address', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');
  sock.bind('inproc://some_address');

  if (Array.isArray( sock.how['inproc://some_address'] )) {
    t.pass('valid INPROC bind');
  } else {
    t.pass('INPROC bind fail');
  }

  sock.close();
});

test('map bind address eid for valid IPC address', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');
  sock.bind('ipc://some_address');

  if (Array.isArray( sock.how['ipc://some_address'] )) {
    t.pass('valid IPC bind');
  } else {
    t.pass('IPC bind fail');
  }

  sock.close();
});

test('map bind address eid for valid TCP address', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');
  sock.bind('tcp://127.0.0.1:5555');

  if (Array.isArray( sock.how['tcp://127.0.0.1:5555'] )) {
    t.pass('valid TCP bind');
  } else {
    t.pass('TCP bind fail');
  }

  sock.close();
});

test('bind exception: invalid INPROC address', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');

  sock.on('error', function (err) {
    t.equal(err.message,
      'Invalid argument: pub bind@inproc:/missing_first_slash', err.message);
    sock.close();
  });

  sock.bind('inproc:/missing_first_slash');

});


test('bind exception: invalid INPROC address (too long)', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');

  sock.on('error', function (err) {
    t.equal(err.message,
      'File name too long: pub bind@inproc://' + addr, err.message);
    sock.close();
  });

  var addr = new Array(nano._bindings.NN_SOCKADDR_MAX + 1).join('a');
  sock.bind('inproc://' + addr);
});

test('bind exception: invalid TCP address (missing)', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');

  sock.on('error', function (err) {
    t.equal(err.message,
      'Invalid argument: pub bind@tcp://', err.message);
    sock.close();
  });

  sock.bind('tcp://');
});

test('bind exception: invalid TCP address (non-numeric port)', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');

  sock.on('error', function (err) {
    t.equal(err.message,
      'Invalid argument: pub bind@tcp://127.0.0.1:port', err.message);
    sock.close();
  });

  sock.bind('tcp://127.0.0.1:port');
});

test('bind exception: invalid TCP address (port out of range)', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');

  sock.on('error', function (err) {
    t.equal(err.message,
      'Invalid argument: pub bind@tcp://127.0.0.1:65536', err.message);
    sock.close();
  });

  sock.bind('tcp://127.0.0.1:65536');
});

test('bind exception: unsupported transport', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');

  sock.on('error', function (err) {
    t.equal(err.message,
      'Protocol not supported: pub bind@zmq://127.0.0.1:6000', err.message);
    sock.close();
  });

  sock.bind('zmq://127.0.0.1:6000');
});

test('bind exception: TCP on non-existent device', function (t) {
  t.plan(1);

  var sock = nano.socket('pub');

  sock.on('error', function (err) {
    t.ok(err, 'Operation not supported by device: tcp://eth99:555');
    sock.close();
  });

  sock.bind('tcp://eth99:555');
});
