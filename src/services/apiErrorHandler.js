// apiErrorHandler.js

export const handleApiError = (error) => {
  if (error.response) {
    // The request was made, but the server responded with an error status code

    const { status, data } = error.response;

    // Customize the error handling based on the status code
    switch (status) {
      case 400:
        // Bad Request
        console.error("Bad Request:", data);
        // Handle the error appropriately
        break;
      case 401:
        // Unauthorized
        console.error("Unauthorized:", data);
        // Handle the error appropriately
        break;
      case 404:
        // Not Found
        console.error("Not Found:", data);
        // Handle the error appropriately
        break;
      case 500:
        // Internal Server Error
        console.error("Internal Server Error:", data);
        // Handle the error appropriately
        break;
      default:
        // Handle other status codes here if needed
        console.error("Unhandled Status Code:", status);
        break;
    }
  } else if (error.request) {
    // The request was made, but no response was received
    console.error("No response received:", error.request);
    // Handle the error appropriately
  } else {
    // Something happened while setting up the request
    console.error("Error setting up the request:", error.message);
    // Handle the error appropriately
  }

  // Throw the error again to propagate it to the calling code if needed
  throw error;
};
