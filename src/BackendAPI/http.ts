// Wrapper class of fetch, for convenient request to the backend.

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
  private beforeFuncs: ((
    request: Request,
  ) => Request | Promise<Request>)[] = [];
  private afterFuncs: ((
    response: Response,
  ) => Response | Promise<Response>)[] = [];

  constructor(secure: boolean, domain: string, port: number) {
    this.schema = secure ? 'https' : 'http';
    this.domain = domain;
    this.port = port.toString();
  }

  public beforeRequest(func: (request: Request) => Request | Promise<Request>) {
    this.beforeFuncs.push(func);
  }

  public afterResponse(
    func: (response: Response) => Response | Promise<Response>,
  ) {
    this.afterFuncs.push(func);
  }

  private baseURL() {
    return `${this.schema}://${this.domain}${this.port ? ':' + this.port : ''}`;
  }

  private defaultHeaders(): Headers {
    return {
      'X-Comusic-Client': 'Web',
    };
  }

  private async requestResp(
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
    const request = new Request(pathStr, {
      method: method,
      headers: { ...this.defaultHeaders(), ...headers },
      body: body,
    });
    // Apply beforeFuncs to modify request and do any other stuff.
    // Funcs could be either sync and async; if sync, await is just ignored.
    let reducedReq = request;
    for (const f of this.beforeFuncs) {
      reducedReq = await f(reducedReq);
    }

    // Actually send request.
    const resp = await fetch(reducedReq);

    // Apply afterFuncs.
    let reducedResp = resp;
    for (const f of this.afterFuncs) {
      reducedResp = await f(reducedResp);
    }
    return reducedResp;
  }

  private async requestContent(
    method: HttpMethod,
    path: Path,
    headers: Headers = {},
    body?: string | JSONBody | FormData,
  ) {
    const resp = await this.requestResp(method, path, headers, body);
    // Convert to json if content-type is matched, else create object with
    // `data` property whose value is plain string.
    if (resp.headers.get(CONTENT_TYPE)?.split(';')[0] === APPLICATION_JSON) {
      return resp.json();
    } else {
      const data = await resp.text();
      return { data };
    }
  }

  public get(path: Path, headers: Headers = {}) {
    return this.requestContent(HttpMethod.GET, path, headers);
  }

  public post(
    path: Path,
    body: JSONBody | FormData = {},
    headers: Headers = {},
  ) {
    return this.requestContent(HttpMethod.POST, path, headers, body);
  }

  public put(
    path: Path,
    body: JSONBody | FormData = {},
    headers: Headers = {},
  ) {
    return this.requestContent(HttpMethod.PUT, path, headers, body);
  }

  public patch(
    path: Path,
    body: JSONBody | FormData = {},
    headers: Headers = {},
  ) {
    return this.requestContent(HttpMethod.PATCH, path, headers, body);
  }

  public delete(path: Path, headers: Headers = {}) {
    return this.requestContent(HttpMethod.DELETE, path, headers);
  }
}
