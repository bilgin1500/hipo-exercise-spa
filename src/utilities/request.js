function handleStatus(response) {
  if (response.status === 200) return response.json();
  throw new Error('Status ' + response.status);
}

/*
  
  HANDLE THIS:
  
  {
    meta: {
      code: 400,
      errorType: "failed_geocode",
      errorDetail: "Couldn't geocode param near: bursass",
      requestId: "5aad3988dd579766568ab429"
    },
    response: { }
  }  

 */

export default urlString => {
  return new Promise((resolve, reject) => {
    fetch(urlString)
      .then(handleStatus)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};
