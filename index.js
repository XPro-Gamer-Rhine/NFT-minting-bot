var arr = [
  {
    height: Math.floor(Math.random() * 101),
  },
  {
    width: Math.floor(Math.random() * 101),
  },
  {
    breed: Math.floor(Math.random() * 101),
  },
  {
    speed: Math.floor(Math.random() * 101),
  },
  {
    stamina: Math.floor(Math.random() * 101),
  },
];

function a() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(arr);
      resolve();
    }, 5000);
  });
}

function b() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log('b');
      resolve();
    }, 250);
  });
}

a()
  .then(b)
  .then(function () {
    /* do something else */
  });
