
const API_VERSION = "v1";

const route = (path) => `/api/${API_VERSION}/${path.join("/")}`;

let requests = [] as Array<Response>;

export async function apiRequest(root:string, opts:apiRequestOpts) {
    //opts.path = opts.path || "";
    // @ts-ignore
    let uri = [root];
    if (opts.path instanceof Array)
        [].push.apply(uri, opts.path);
    if (typeof opts.path === "string")
        uri.push(opts.path);

    let url = route(uri);


    let response = await fetch(url, {
        method: opts.method || "GET",
        headers: opts.headers || {},
        body: opts.body,
    });

    // -- TODO Add request limiting based on time between requests
    // -- TODO Currently have a list of requests based on URL. If url exists in list of responses, we overwrite.
    // -- TODO Needs to be if request exists and timeout is > n, we make request, or if we know data has changed.

    let existsIdx = requests.findIndex(({url}) => url === response.url )
    if (existsIdx === -1)
        requests.push(response);
    else
        requests.splice(existsIdx, 1, response)

    return response;
}

interface apiRequestOpts {
    path?:string|Array<string>;
    method?:string;
    headers?:any;
    body?:any;
}