import app from './app';

const port = process.env.PORT || 4242;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});