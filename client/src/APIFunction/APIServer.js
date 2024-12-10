import axios from "axios";
// eslint-disable-next-line
import TMH from "../Utlis/TMH"; // Ensure this path is correct
// eslint-disable-next-line
window.TMH = TMH;
// eslint-disable-next-line
async function executePreRequestScript(preRequestScript, requestData) {
  try {
    if (preRequestScript) {
      // Safely handle the pre-request script execution
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
      // Safely handle the test script execution
      const testFn = new Function("TMH", "responseData", `${testScript}`);
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
    console.log("Request Data:", requestData);
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
    return {
      apiResponse: error.response
        ? error.response.data
        : { error: "Unknown error" },
      status: error.response ? error.response.status : "Error",
    };
  }
}
