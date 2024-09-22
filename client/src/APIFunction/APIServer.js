import axios from "axios";
import TMH from '../Utils/TMH'; // Ensure this path is correct
window.TMH = TMH;

async function executePreRequestScript(preRequestScript, requestData) {
  try {
    if (preRequestScript) {
      const preRequestFn = new Function("requestData", preRequestScript);
      preRequestFn(requestData);
    }
  } catch (error) {
    console.error("Error executing pre-request script:", error);
  }
}

async function executeTestScript(testScript, responseData) {
  try {
    if (testScript) {
      const testFn = new Function("TMH", "responseData", testScript);
      testFn(TMH, responseData);
    }
  } catch (error) {
    console.error("Error executing test script:", error);
  }
}

export default async function APIServer({
  requestData,
  authToken,
  requestType,
  basicAuth,
  preRequestScript,
  testScript,
}) {
  try {
    await executePreRequestScript(preRequestScript, requestData);

    // Add appropriate Authorization header based on requestType
    if (requestType === "Bearer") {
      requestData.headers = {
        ...requestData.headers,
        Authorization: `Bearer ${authToken}`,
      };
    } else if (requestType === "Basic") {
      const base64Credentials = btoa(
        `${basicAuth.username}:${basicAuth.password}`
      );
      requestData.headers = {
        ...requestData.headers,
        Authorization: `Basic ${base64Credentials}`,
      };
    }

    // Send the request to the proxy server
    const response = await axios.post("http://localhost:5000/api/proxy", {
      method: requestData.method,
      url: requestData.url,
      headers: requestData.headers,
      data: requestData.data,
    });

    await executeTestScript(testScript, response.data);
    console.log(response.status);

    return {
      apiResponse: response.data,
      status: response.status,
    };
  } catch (error) {
    const status = error.response?.status || "Error";
    const data = error.response?.data || { error: "Unknown error" };

    return {
      apiResponse: data,
      status: status,
    };
  }
}
