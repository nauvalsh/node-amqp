import amqp from 'amqplib/callback_api';
import dayjs from 'dayjs';

const exchange = 'delay-exchange';
const offlinePubQueue = [];

let amqpConn = null;
let pubChannel = null;

const start = (): void => {
  amqp.connect(
    {
      protocol: 'amqp',
      hostname: 'rabbitmq',
      port: 5672,
      username: 'nauval',
      password: 'nauval',
      vhost: '/',
    },
    function (err, conn) {
      if (err) {
        console.error('[AMQP]', err.message);
        return setTimeout(start, 1000);
      }

      conn.on('error', function (err) {
        if (err.message !== 'Connection closing') {
          console.error('[AMQP] conn error', err.message);
        }
      });

      conn.on('close', function () {
        console.error('[AMQP] reconnecting');
        return setTimeout(start, 1000);
      });

      console.log('[AMQP] connected');
      amqpConn = conn;
      whenConnected();
    },
  );
};

const whenConnected = (): void => {
  startPublisher();
  startWorker();
};

const startPublisher = (): void => {
  amqpConn.createConfirmChannel(function (err, ch) {
    if (closeOnErr(err)) return;
    ch.on('error', function (err) {
      console.error('[AMQP] channel error', err.message);
    });
    ch.on('close', function () {
      console.log('[AMQP] channel closed');
    });
    pubChannel = ch;
    //assert the exchange: 'my-delay-exchange' to be a x-delayed-message,
    pubChannel.assertExchange(exchange, 'x-delayed-message', {
      autoDelete: false,
      durable: true,
      passive: true,
      arguments: { 'x-delayed-type': 'direct' },
    });
    //Bind the queue: "jobs" to the exchnage: "my-delay-exchange" with the binding key "jobs"
    pubChannel.bindQueue('jobs', exchange, 'jobs');

    while (true) {
      const m = offlinePubQueue.shift();
      if (!m) break;
      publish(m[0], m[1], m[2]);
    }
  });
};

const publish = (routingKey: string, content: Buffer, delay: number): void => {
  try {
    pubChannel.publish(exchange, routingKey, content, { headers: { 'x-delay': delay } }, function (err) {
      if (err) {
        console.error('[AMQP] publish', err);
        offlinePubQueue.push([exchange, routingKey, content]);
        pubChannel.connection.close();
      }
    });
  } catch (e) {
    console.error('[AMQP] failed', e.message);
    offlinePubQueue.push([routingKey, content, delay]);
  }
};

// A worker that acks messages only if processed succesfully
const startWorker = (): void => {
  amqpConn.createChannel(function (err, ch) {
    if (closeOnErr(err)) return;
    ch.on('error', function (err) {
      console.error('[AMQP] channel error', err.message);
    });
    ch.on('close', function () {
      console.log('[AMQP] channel closed');
    });

    ch.prefetch(10);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ch.assertQueue('jobs', { durable: true }, function (err, _ok) {
      if (closeOnErr(err)) return;
      // consume message
      ch.consume('jobs', processMsg, { noAck: false });
      console.log('Worker is started');
    });

    // process consumed message
    function processMsg(msg) {
      work(msg, function (ok) {
        try {
          if (ok) ch.ack(msg);
          else ch.reject(msg, true);
        } catch (e) {
          closeOnErr(e);
        }
      });
    }

    // get consumed message if not error
    function work(msg, cb) {
      console.log(msg.content.toString() + ' --- received: ' + current_time());
      cb(true);
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const closeOnErr = (err): boolean => {
  if (!err) return false;
  console.error('[AMQP] error', err);
  amqpConn.close();
  return true;
};

const current_time = (): string => {
  return dayjs(new Date()).format('DD-MM-YYYY HH:mm:ss');
};

// const consume = (routingKey: string): string => {
//   return "[AMQP] Can't consume anything";
// };

const Rabbitmq = {
  start,
  publish,
};

export default Rabbitmq;
