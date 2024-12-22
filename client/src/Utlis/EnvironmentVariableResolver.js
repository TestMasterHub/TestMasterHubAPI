// src/Utlis/EnvironmentVariableResolver.js

export const resolveEnvironmentVariables = (value, environments) => {
  // If no value or no environments, return the original value
  if (!value || !environments || environments.length === 0) {
    return value;
  }

  // Use the first environment (as in the current implementation)
  const activeEnvironment = environments[0];

  // Regex to match variables in format {{variableName}}
  const variableRegex = /\{\{(.*?)\}\}/g;

  // Replace all occurrences of environment variables
  return value.replace(variableRegex, (match, variableName) => {
    // Find the variable in the environment
    const environmentVariable = activeEnvironment.values.find(
      (env) => env.key.trim() === variableName.trim() && env.enabled
    );

    // Return the variable value if found, otherwise return the original match
    return environmentVariable ? environmentVariable.value : match;
  });
};

export const resolveAllEnvironmentVariables = (data, environments) => {
  // Deep clone the data to avoid mutating the original
  const resolvedData = JSON.parse(JSON.stringify(data));

  // Resolve environment variables in different parts of the request
  if (resolvedData.url) {
    resolvedData.url = resolveEnvironmentVariables(
      resolvedData.url,
      environments
    );
  }

  if (resolvedData.headers) {
    Object.keys(resolvedData.headers).forEach((key) => {
      resolvedData.headers[key] = resolveEnvironmentVariables(
        resolvedData.headers[key],
        environments
      );
    });
  }

  if (resolvedData.data) {
    // For request body, handle both string and object types
    if (typeof resolvedData.data === "string") {
      resolvedData.data = resolveEnvironmentVariables(
        resolvedData.data,
        environments
      );
    } else if (typeof resolvedData.data === "object") {
      Object.keys(resolvedData.data).forEach((key) => {
        resolvedData.data[key] = resolveEnvironmentVariables(
          resolvedData.data[key],
          environments
        );
      });
    }
  }

  // Resolve path and query params
  if (resolvedData.pathParams) {
    resolvedData.pathParams = resolvedData.pathParams.map((param) => ({
      ...param,
      value: resolveEnvironmentVariables(param.value, environments),
    }));
  }

  if (resolvedData.queryParams) {
    resolvedData.queryParams = resolvedData.queryParams.map((param) => ({
      ...param,
      value: resolveEnvironmentVariables(param.value, environments),
    }));
  }

  // Resolve auth-related variables
  if (resolvedData.authToken) {
    resolvedData.authToken = resolveEnvironmentVariables(
      resolvedData.authToken,
      environments
    );
  }

  if (resolvedData.basicAuth) {
    resolvedData.basicAuth = {
      username: resolveEnvironmentVariables(
        resolvedData.basicAuth.username,
        environments
      ),
      password: resolveEnvironmentVariables(
        resolvedData.basicAuth.password,
        environments
      ),
    };
  }

  return resolvedData;
};
