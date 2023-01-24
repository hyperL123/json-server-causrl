const courses = document.querySelector('#course');

const url =
  'https://jsonserverjevaej-2tkw--3000.local-credentialless.webcontainer.io/api/v1/courses';

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((course) => {
      const option = document.createElement('option');
      option.value = course.id;
      option.text = course.display;
      courses.appendChild(option);
    });
  })
  .catch((error) => console.log(error));

const courseSelect = document.querySelector('#course');
const uvuIdInput = document.querySelector('#uvuId');

courseSelect.addEventListener('change', () => {
  if (courseSelect.value !== '') {
    uvuIdInput.style.display = 'block';
  } else {
    uvuIdInput.style.display = 'none';
  }
});

const regex = /^[0-9]{8}$/;

uvuIdInput.addEventListener('change', (event) => {
  const course = document.querySelector('#course').value;
  const uvuId = document.querySelector('#uvuId').value;
  if (regex.test(event.target.value)) {
    // call your fetch API here
    console.log('success');
    event.target.style.outline = 'none';
    fetch(
      `https://jsonserverjevaej-2tkw--3000.local-credentialless.webcontainer.io/api/v1/logs?courseId=${course}&uvuId=${uvuId}`
    )
      //+ event.target.value
      .then((response) => {
        if (response.status === 200 || response.status === 304) {
          return response.json();
        } else {
          // remove the elements
          const uvuIdDisplay = document.querySelector('#uvuIdDisplay');
          const logsContainer = document.querySelector('#logs');
          uvuIdDisplay.textContent = '';
          logsContainer.innerHTML = '';
          throw new Error('API call failed');
        }
      })
      .then((data) => {
        const uvuIdDisplay = document.querySelector('#uvuIdDisplay');
        const logsContainer = document.querySelector('#logs');
        let uvuId = data[0].uvuId;
        uvuIdDisplay.textContent = `Studnet Logs for ${uvuId}`;
        data.forEach((log) => {
          const logItem = document.createElement('li');
          const date = document.createElement('div');
          const logText = document.createElement('pre');
          date.innerHTML = `<small>${log.date}</small>`;
          logText.innerHTML = `<p>${log.text}</p><br/>`;
          logItem.appendChild(date);
          logItem.appendChild(logText);
          logsContainer.appendChild(logItem);
          logItem.addEventListener('click', (event) => {
            logText.classList.toggle('hidden');
          });
        });
      });
  } else {
    console.log('not success');
    event.target.style.outline = '1px solid red';
  }
});

document
  .getElementById('add_log_btn')
  .addEventListener('click', function (event) {
    console.log('hello world');
    event.preventDefault();
    const course = document.querySelector('#course').value;
    const uvuId = document.querySelector('#uvuId').value;
    const log_textarea = document.querySelector('#log_textarea').value;
    const currentTime = new Date().toLocaleString();
    fetch(
      'https://jsonserverjevaej-2tkw--3000.local-credentialless.webcontainer.io/api/v1/logs',
      {
        method: 'POST',
        body: JSON.stringify({
          courseId: course,
          uvuId: uvuId,
          date: currentTime,
          text: log_textarea,
          id: currentTime + generateRandomId(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  });

function generateRandomId() {
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var text = '';
  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const logTextarea = document.getElementById('log_textarea');
const addLogBtn = document.getElementById('add_log_btn');

addLogBtn.disabled = true; // initially disabled

logTextarea.addEventListener('change', () => {
  if (logTextarea.value !== '') {
    addLogBtn.disabled = false;
  } else {
    addLogBtn.disabled = true;
  }
});
