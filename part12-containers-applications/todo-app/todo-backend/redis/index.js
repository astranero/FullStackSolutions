
const { createClient } = require('redis');
const { promisify } = require('util')
const { REDIS_URL } = require('../util/config')

let getAsync
let setAsync

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log('No REDIS_URL set, Redis is disabled');
    return Promise.resolve( null);
  };
  getAsync = redisIsDisabled
  setAsync = redisIsDisabled
} else {
  const client = createClient({
    url: REDIS_URL
  });
  client.on('error', (err) => console.error('Redis Client Error', err));
  getAsync = promisify(client.get).bind(client)
  setAsync = promisify(client.set).bind(client)
}
module.exports = {
  getAsync,
  setAsync
};
