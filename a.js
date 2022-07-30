const task3 = async (_fn) => {
  setTimeout(function () {
    console.log('task3');
  }, 600);
};

const task1 = async (_fn) => {
  console.log('task1:started');
  setTimeout(function () {
    console.log('task1:finished');
    _fn();
  }, 3000);
};

const task2 = async (_fn) => {
  console.log('task2:started');
  setTimeout(function () {
    console.log('task2:finished');
    _fn();
  }, 1000);
};

function init(tasks, _fn) {
  if (!tasks.length) {
    return _fn();
  }

  let index = 0;

  function run() {
    var task = tasks[index++];
    console.log('running task:', task.name, index);
    task(index === tasks.length ? _fn : run);
  }

  run();
}

init([task1, task2, task3], function () {
  console.log('tasks done!');
});
