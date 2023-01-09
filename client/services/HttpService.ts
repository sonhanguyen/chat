export default class HttpService {
  constructor(readonly config = {} as {
    getAuthToken?: () => string | void,
    baseUrl?: string
  }) {}

  fetch = <T>(url: string, { ...options }: Omit<RequestInit, 'body'> & {
    body?: RequestInit['body'] | object
  } = {}): Promise<T> => {
    const { body, headers } = options

    const CONTENT_TYPE = { 'Content-Type': 'application/json'}
    const [ ContentType , contentType ] = Object
      .entries({ ...headers, ...CONTENT_TYPE })
      .find(([ header ]) =>
        RegExp(`^${Object.keys(CONTENT_TYPE)}$`, 'i').test(header))!

    if (contentType?.endsWith('/json') && typeof body != 'string') {
      options.body = JSON.stringify(body)
    }

    if (!url.includes('://')) {
      const { baseUrl, getAuthToken } = this.config
      
      if (baseUrl) url = baseUrl + url 
      var Authorization = getAuthToken?.() 
    }

    options.headers = {
      ...Authorization && { Authorization },
      ...headers,
      [ContentType]: contentType
    }

    return fetch(url, options as RequestInit)
      .then(res => res.ok ? res.json() : Promise.reject(res)) as any
  }
}
