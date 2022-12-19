export default class HttpService {
  constructor(
    private getAuthToken: () => string | void,
  ) {}

  fetch = <T>(url: string, options: RequestInit = {}): Promise<T> => {
    if (!url.startsWith('http')) {
      const Authorization = this.getAuthToken()

      if (Authorization) options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization
      }
    }

    return fetch(url, options)
      .then(res => res.ok ? res.json() : Promise.reject(res)) as any
  }
}