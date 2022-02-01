const listElement = document.querySelector('.posts');
const postSection = document.querySelector('#single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

function sendHTTPRequest(method, url, data) {
  // const promise = new Promise((resolve, reject) => {

  //     const xhr = new XMLHttpRequest()
  //     xhr.open(method, url)
  //     xhr.responseType = 'json'
  //     xhr.onload = function(){
  //         // xhr.response
  //         if(xhr.status >= 200 && xhr.status < 300){
  //             resolve(xhr.response)
  //         }else{
  //             reject(new Error('Something went wrong'))
  //         }
  //     }
  //     xhr.onerror = function(){
  //         console.log(xhr.response)
  //         console.log(xhr.status)
  //     }
  //     xhr.send(JSON.stringify(data))
  // })

  // return promise

  // return fetch(url)
  // return axios(url)

  const response = fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(result => {
    if (method === 'DELETE' && result.status === 200) {
      console.log('deleted');
    }
    return result.json();
  });

  return response;
}

async function fetchPosts() {
  try {
    const responseData = await sendHTTPRequest(
      'GET',
      'https://jsonplaceholder.typicode.com/posts'
    );

    for (const post of responseData) {
      const postElClone = document.importNode(postSection.content, true);
      postElClone.querySelector('h2').textContent = post.title;
      postElClone.querySelector('p').textContent = post.body;
      postElClone.querySelector('li').id = post.id;

      postElClone.querySelector('li button').addEventListener('click', e => {
        deletePost(post.id);
        listElement.removeChild(e.target.parentElement);
      });

      listElement.appendChild(postElClone);
    }
  } catch (error) {
    console.log(error);
  }
}

async function createPost(title, content) {
  const post = {
    userId: Math.random(),
    title,
    content,
  };
  const result = await sendHTTPRequest(
    'POST',
    'https://jsonplaceholder.typicode.com/posts',
    post
  );
  console.log(result);
}

async function deletePost(id) {
  await sendHTTPRequest(
    'DELETE',
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
}

fetchButton.addEventListener('click', fetchPosts);

form.addEventListener('submit', e => {
  e.preventDefault();
  const enteredTitle = e.currentTarget.querySelector('#title').value;
  const enteredContent = e.currentTarget.querySelector('#content').value;

  createPost(enteredTitle, enteredContent);
});
