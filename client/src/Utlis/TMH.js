// tmh.js
const TMH = {
    response: {
      json: function (response) {
        try {
          // Check if response is a string and parse it if necessary
          return (typeof response === 'string' ? JSON.parse(response) : response);
        } catch (error) {
          console.error("Failed to parse response as JSON", error);
          return null; // Return null if parsing fails
        }
      },
      status: function (responseStatus) {
        return responseStatus; // Return the status
      },
    },
    assert: {
      equals: function (actual, expected, message) {
        if (actual === expected) {
          console.log("Assertion passed:", message);
          alert("Assertion passed: " + message);
        } else {
          console.error("Assertion failed:", message);
          alert("Assertion failed: " + message);
        }
      },
      notEquals: function (actual, expected, message) {
        if (actual !== expected) {
          console.log("Assertion passed:", message);
          alert("Assertion passed: " + message);
        } else {
          console.error("Assertion failed:", message);
          alert("Assertion failed: " + message);
        }
      },
    },
  };
  
  // Export the TMH object
  export default TMH;
  