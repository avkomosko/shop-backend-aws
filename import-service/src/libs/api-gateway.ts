export const formatJSONResponse = (statusCode: number, response: Record<string, unknown>) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode,
    body: JSON.stringify(response)
  }
}
