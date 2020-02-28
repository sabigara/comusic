enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

const CONTENT_TYPE = 'Content-Type' as const;
const APPLICATION_JSON = 'application/json' as const;

type QueryParams = {
  [key: string]: string;
};

type Path = {
  path: string;
  params?: string[];
  queries?: QueryParams;
};

type Headers = {
  [key: string]: string;
};

type JSONBody = {
  [key: string]: string;
};

function isFormData(arg?: JSONBody | FormData): arg is FormData {
  return arg?.append !== undefined;
}

function constructPath(path: Path): string {
  path.params?.map((param) => {
    path.path = path.path.replace(/(?<=\/):.[^/]/g, param);
  });
  const url = new URL(path.path);
  url.search = new URLSearchParams(path.queries).toString();
  return url.toString();
}

export default class Http {
  private schema: string;
  private domain: string;
  private port: string;

  constructor(secure: boolean, domain: string, port: number) {
    this.schema = secure ? 'https' : 'http';
    this.domain = domain;
    this.port = port.toString();
  }

  private baseURL() {
    return `${this.schema}://${this.domain}${this.port ? ':' + this.port : ''}`;
  }

  private defaultHeaders(): Headers {
    return {
      'X-Comusic-Client': 'Web',
    };
  }

  private async request(
    method: HttpMethod,
    path: Path,
    headers: Headers = {},
    body?: string | JSONBody | FormData,
  ) {
    path.path = this.baseURL() + '/' + path.path;
    const pathStr = constructPath(path);
    if (typeof body !== 'string' && !isFormData(body)) {
      body = JSON.stringify(body);
      headers[CONTENT_TYPE] = APPLICATION_JSON;
    }
    const resp = await fetch(pathStr, {
      method: method,
      headers: { ...this.defaultHeaders(), ...headers },
      body: body,
    });
    if (!resp.ok) {
      const respBody = await resp.text();
      throw new Error(`Non 2xx response for request: ${method} ${pathStr}\n
response: ${resp.status} ${respBody}`);
    }
    if (resp.headers.get(CONTENT_TYPE)?.split(';')[0] === APPLICATION_JSON) {
      return resp.json();
    }
  }

  public get(path: Path, headers: Headers = {}) {
    return this.request(HttpMethod.GET, path, headers);
  }

  public post(
    path: Path,
    body: JSONBody | FormData = {},
    headers: Headers = {},
  ) {
    return this.request(HttpMethod.POST, path, headers, body);
  }

  public put(
    path: Path,
    body: JSONBody | FormData = {},
    headers: Headers = {},
  ) {
    return this.request(HttpMethod.PUT, path, headers, body);
  }

  public patch(
    path: Path,
    body: JSONBody | FormData = {},
    headers: Headers = {},
  ) {
    return this.request(HttpMethod.PATCH, path, headers, body);
  }

  public delete(path: Path, headers: Headers = {}) {
    return this.request(HttpMethod.DELETE, path, headers);
  }
}
