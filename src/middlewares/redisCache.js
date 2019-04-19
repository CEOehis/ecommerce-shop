import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = redis.createClient(process.env.REDIS_URL);

const redisCache = (req, res, next) => {
  const key = `__express__${req.originalUrl}` || req.url;
  client.get(key, (err, reply) => {
    if (reply) {
      res.set({
        'Content-Type': 'application/json',
      });
      res.send(JSON.parse(reply));
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        client.set(key, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  });
};

export default redisCache;
