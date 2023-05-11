const emailForm = (formState) => {
  const endpoint =
    "https://x9ku3ihf2i.execute-api.us-east-1.amazonaws.com/default/martin-email";

  const body = JSON.stringify(formState);

  const requestOptions = {
    method: "POST",
    body
  };

  //console.log(body)

  fetch(endpoint, requestOptions)
    .then((response) => {
      console.log(response)
      if (!response.ok) throw new Error("Error in fetch");
    })
}

export {emailForm}