// utils/generateCollectionJson.js

export const generateCollectionJson = ({
    requestType,
    url,
    pathParams,
    queryParams,
    headers,
    requestBody,
    authToken,
    basicAuth,
    preRequestScript,
    testScript,
  }) => {
    return {
      method: requestType,
      url: url,
      pathParams: pathParams.map((param) => ({
        key: param.key,
        value: param.value,
        description: param.description,
      })),
      queryParams: queryParams.map((param) => ({
        key: param.key,
        value: param.value,
        description: param.description,
      })),
      headers: headers,
      requestBody: requestBody,
      auth: {
        type: authToken ? "Bearer" : "Basic",
        token: authToken,
        basicAuth: {
          username: basicAuth.username,
          password: basicAuth.password,
        },
      },
      preRequestScript: preRequestScript,
      testScript: testScript,
    };
  };
  