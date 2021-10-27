const keys = require("./keys");
const redis = require("redis");

//retry_strategy option => Tells Redis to attempt to re-connect once every second if connection fails.
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

//sub stands for subscription and give the worker a message everytime a new value shows up
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

//Everytime redis receives an index value, it will send a message to the subscriber (message as value). We can than perform actions via the call back, in this case, calculating the fib and update the key value pair back to redis.
sub.on("message", (channel, message) => {
  console.log(message);
  redisClient.hset("values", message, fib(parseInt(message)));
});

//This subscribes to redis to receive messages whenever a value is inserted into redis
sub.subscribe("insert");
