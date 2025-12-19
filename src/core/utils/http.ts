export function formatJSON(response: any): string | undefined {
  if (!response) return undefined;

  if (typeof response === 'string') {
    try {
      const parsed = JSON.parse(response);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return response;
    }
  } else if (typeof response === 'object') {
    return JSON.stringify(response, null, 2);
  } else if (typeof response === 'number' || typeof response === 'boolean') {
    return String(response);
  }

  return response;
}

export function parseBodyData(bodyData: any): any {
  if (bodyData instanceof FormData) {
    const formDataObj: Record<string, string> = {};
    bodyData.forEach((value, key) => {
      formDataObj[key] = value.toString();
    });
    return formDataObj;
  } else if (bodyData instanceof URLSearchParams) {
    const urlSearchParamsObj: Record<string, string> = {};
    bodyData.forEach((value, key) => {
      urlSearchParamsObj[key] = value.toString();
    });
    return urlSearchParamsObj;
  }
  return bodyData;
}