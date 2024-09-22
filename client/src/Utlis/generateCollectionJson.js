// utils/generateCollectionJson.js

export const generateCollectionJson = ({
  requestType = 'get', // Default to 'get'
  url = '',
  pathParams = [], // Default to empty array
  queryParams = [], // Default to empty array
  headers = {}, // Default to empty object
  requestBody = '',
  authToken = '',
  basicAuth = { username: '', password: '' }, // Default to empty credentials
  preRequestScript = '',
  testScript = '', // Default test script
}) => {
  return {
    method: requestType,
    url: url,
    pathParams: pathParams.map((param) => ({
      key: param.key || '',
      value: param.value || '',
      description: param.description || '',
    })),
    queryParams: queryParams.map((param) => ({
      key: param.key || '',
      value: param.value || '',
      description: param.description || '',
    })),
    headers: headers,
    requestBody: requestBody,
    auth: {
      type: authToken ? 'Bearer' : 'Basic',
      token: authToken || '',
      basicAuth: {
        username: basicAuth.username || '',
        password: basicAuth.password || '',
      },
    },
    preRequestScript: preRequestScript,
    testScript: testScript,
  };
};
