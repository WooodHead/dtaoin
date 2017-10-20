function filterJSON(res) {
  return res.json();
}

const server = {
  // todo 获取数据未携带cookie
  get(url) {
    return fetch(url).then(filterJSON);
  },

  post(url, data) {
    const fd = new FormData();
    for (const propName in data) {
      fd.append([propName], data[propName]);
    }

    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      body: fd,
    }).then(filterJSON);
  },
};

export default server;
