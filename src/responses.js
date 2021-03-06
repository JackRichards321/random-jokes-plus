const underscoreHandler = require('underscore');
const query = require('querystring');
const url = require('url');

const jokes = [
  { q: 'What do you call a very small valentine?', a: 'A valen-tiny!' },
  { q: 'What did the dog say when he rubbed his tail on the sandpaper?', a: 'Ruff, Ruff!' },
  { q: "Why don't sharks like to eat clowns?", a: 'Because they taste funny!' },
  { q: 'What did the boy cat say to the girl cat?', a: "You're Purr-fect!" },
  { q: "What is a frog's favorite outdoor sport?", a: 'Fly Fishing!' },
  { q: 'I hate jokes about German sausages.', a: 'Theyre the wurst.' },
  { q: 'Did you hear about the cheese factory that exploded in France?', a: 'There was nothing left but de Brie.' },
  { q: 'Our wedding was so beautiful ', a: 'Even the cake was in tiers.' },
  { q: 'Is this pool safe for diving?', a: 'It deep ends.' },
  { q: 'Dad, can you put my shoes on?', a: 'I dont think theyll fit me.' },
  { q: 'Can February March?', a: 'No, but April May' },
  { q: 'What lies at the bottom of the ocean and twitches?', a: 'A nervous wreck.' },
  { q: 'Im reading a book on the history of glue.', a: 'I just cant seem to put it down.' },
  { q: 'Dad, can you put the cat out?', a: 'I didnt know it was on fire.' },
  { q: 'What did the ocean say to the sailboat?', a: 'Nothing, it just waved.' },
  { q: 'What do you get when you cross a snowman with a vampire?', a: 'Frostbite' },
];

// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

const getRandomJokeJSON = (limit = 1) => {
  const lim1 = Number(limit);
  const lim2 = !lim1 ? 1 : lim1;
  const lim3 = lim2 < 1 ? 1 : lim2;

  if (lim3 === 1) {
    const number = Math.floor(Math.random() * 16);

    const responseObj = {
      q: jokes[number].q,
      a: jokes[number].a,
    };

    return JSON.stringify(responseObj);
  }
  const shuffledJokes = underscoreHandler.shuffle(jokes); // npm underscore function!

  const responseObj = [];

  for (let i = 0; i < limit; i += 1) {
    responseObj.push(shuffledJokes[i]);
  }

  return JSON.stringify(responseObj);
};

const getJokeXML = (limit = 1) => {
  const responseObj = [];

  const shuffledJokes = underscoreHandler.shuffle(jokes);

  for (let i = 0; i < limit; i += 1) {
    responseObj.push(
      `<joke>
        <q>${shuffledJokes[i].q}</q>
        <a>${shuffledJokes[i].a}</a>
        </joke>`,
    );
  }

  return (`<jokes>
            ${responseObj}    
        </jokes>`);
};

const getRandomJokeResponse = (request, response, acceptedTypes) => {
  if (acceptedTypes.includes('text/xml')) {
    response.writeHead(200, { 'Content-Type': 'text/xml' }); // send response headers
    response.write(getJokeXML()); // send content
    response.end(); // close connection
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json' }); // send response headers
    response.write(getRandomJokeJSON()); // send content
    response.end(); // close connection
  }
};
const getJokesResponse = (request, response, acceptedTypes) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  const { limit } = params;

  if (acceptedTypes.includes('text/xml')) {
    response.writeHead(200, { 'Content-Type': 'text/xml' }); // send response headers
    response.write(getJokeXML(limit)); // send content
    response.end(); // close connection
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json' }); // send response headers
    response.write(getRandomJokeJSON(limit)); // send content
    response.end(); // close connection
  }
};

const getJokeMeta = (request, response, acceptedTypes) => {
  if (acceptedTypes.includes('text/xml')) {
    response.writeHead(200, { 'Content-Type': 'text/xml', 'Content-Length': getBinarySize(getJokeXML()) }); // send response headers
    response.end(); // close connection
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': getBinarySize(getRandomJokeJSON()) }); // send response headers
    response.end(); // close connection
  }
};

const getJokesMeta = (request, response, acceptedTypes) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  const { limit } = params;

  if (acceptedTypes.includes('text/xml')) {
    response.writeHead(200, { 'Content-Type': 'text/xml', 'Content-Length': getBinarySize(getJokeXML(limit)) }); // send response headers
    response.end(); // close connection
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': getBinarySize(getRandomJokeJSON(limit)) }); // send response headers
    response.end(); // close connection
  }
};

module.exports.getRandomJokeResponse = getRandomJokeResponse;
module.exports.getJokesResponse = getJokesResponse;
module.exports.getJokeMeta = getJokeMeta;
module.exports.getJokesMeta = getJokesMeta;
