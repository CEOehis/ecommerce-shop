import express from 'express';

const app = express();

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'ecommerce shop api',
  });
});
const port =
  parseInt(process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT, 10) ||
  5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🚀🚀🚀`);
});
