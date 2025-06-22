import { Router } from 'express';

const router = Router();

let count = 0;

// /api/test/test1
router.get('/test1', async (req, res) => {
  console.log('req.originalUrl', req.originalUrl);

  const newData = {
    tag: '#1',
    path: req.path,
    timestamp: Date.now(),
  };

  console.log('newData', newData);

  res.json(newData);
  return;
});

// /api/test/test2
router.get('/test2', async (req, res) => {
  console.log('req.originalUrl', req.originalUrl);

  const newData = {
    tag: '#2',
    path: req.path,
    timestamp: Date.now(),
  };

  console.log('newData', newData);

  res.json(newData);
  return;
});

// /api/test/test3
router.get('/test3', async (req, res) => {
  console.log('req.originalUrl', req.originalUrl);

  const newData = {
    tag: '#3',
    path: req.path,
    timestamp: Date.now(),
  };

  console.log('newData', newData);

  res.json(newData);
  return;
});

// /api/test/test4
router.get('/test4', async (req, res) => {
  console.log('req.originalUrl', req.originalUrl);

  const newData = {
    tag: '#4',
    path: req.path,
    timestamp: Date.now(),
  };

  console.log('newData', newData);

  res.json(newData);
  return;
});

// /api/test/count-error
router.get('/count-error', async (req, res) => {
  console.log('req.originalUrl', req.originalUrl);
  console.log('req.headers', req.headers);
  count++;

  if (count % 2 === 0) {
    res.status(403).json({
      name: 'count-error',
      message: 'count is less than 5',
      count,
    });
    return;
  }

  const newData = {
    tag: '#4',
    path: req.path,
    timestamp: Date.now(),
  };

  console.log('newData', newData);

  res.cookie('my-cookie', '123###', { maxAge: 900000, httpOnly: true });
  res.json(newData);
  return;
});

export const testRouter = router;
