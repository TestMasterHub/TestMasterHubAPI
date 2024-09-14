import axios from "axios";
import TMH from '../Utlis/TMH';

window.TMH = TMH;

async function executePreRequestScript(preRequestScript, requestData) {
  try {
    if (preRequestScript) {
      if (preRequestScript === "logRequestData") {
        console.log("Request Data:", requestData);
      } else {
        console.warn("Unknown pre-request script:", preRequestScript);
      }
    }
  } catch (error) {
    console.error("Error executing pre-request script:", error);
  }
}

async function executeTestScript(testScript, responseData) {
  try {
    if (testScript) {
      const scriptFunctions = {
        checkJsonData: () => {
          const JsonData = TMH.response.json(responseData);
          alert(JsonData.products[0].id);
          alert(JsonData.products.length);
          TMH.assert.equals(JsonData.products[0].id, 1, "Checks id === 1");
        }
      };

      if (typeof scriptFunctions[testScript] === 'function') {
        scriptFunctions[testScript]();
      } else {
        const sanitizedScript = `try { ${testScript} } catch (e) { console.error("Error in test script:", e); }`;
        const testFn = new Function("TMH", "responseData", sanitizedScript);
        testFn(TMH, responseData);
      }
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
    console.log(requestData)
    if (requestType === "Bearer" && authToken) {
      requestData.headers = {
        ...requestData.headers,
        Authorization: `Bearer ${authToken}`,
      };
    } else if (requestType === "Basic") {
      const base64Credentials = btoa(`${basicAuth.username}:${basicAuth.password}`);
      requestData.headers = {
        ...requestData.headers,
        Authorization: `Basic ${base64Credentials}`,
      };
    }
    console.log(requestData.headers)
    const response = await axios.post("http://localhost:5000/api/proxy", {
      method: requestData.method,
      url: requestData.url,
      headers: requestData.headers,
      data: requestData.data,
    });

    await executeTestScript(testScript, response.data);

    return {
      apiResponse: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("API request error:", error);  // Log the full error for debugging
    return {
      apiResponse: error.response ? error.response.data : { error: "Unknown error" },
      status: error.response ? error.response.status : "Error",
    };
  }
}
