export default defineEventHandler(async (event) => {
  const f = await fetch('https://wtfismyip.com/json', {

  });
  return f.json();
});