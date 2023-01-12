export class APIError extends Error {
  help: string;

  constructor(message: string) {
    super(message);
    this.name = "APIError";
    this.help = "Please check your Emby URL and API Key";
  }
}

const end_date = "2022-12-31";
const days = "365";

/**
 * Get the baseURL provided by the Environment variables. Falls back to localhost.
 *
 * @returns BaseURL for Emby without any slashes
 */
function getBaseURL() {
  if (!Deno.env.get("EMBY_URL")) {
    console.error("Warning: No Emby URL provided. Falling back to localhost");
  }
  const baseurl = Deno.env.get("EMBY_URL") || "http://localhost:8096";
  return baseurl.replace(/\/+$/, "");
}

async function apiRequest(
  url: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${getBaseURL()}${url}`, {
    ...options,
    headers: {
      "X-Emby-Token": Deno.env.get("EMBY_API_KEY") || "",
      ...options.headers,
    },
  }).catch((e) => {
    console.error("Unable to connect to Emby", e.message);
    throw new APIError("Unable to connect to Emby");
  });

  return response;
}

export async function get<T extends unknown>(url: string) {
  const response = await apiRequest(url);
  if (!response.ok) {
    console.error("Emby returned unexpected response: ", await response.text());
    throw new APIError("Emby returned unexpected response");
  }
  return response.json() as Promise<T>;
}

export async function post<T extends unknown>(url: string, body: unknown) {
  const response = await apiRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error("Emby returned unexpected response: ", await response.text());
    throw new APIError("Emby returned unexpected response");
  }
  return response.json() as Promise<T>;
}

interface EmbyCustomQueryResponse<T extends unknown> {
  colums: string[];
  results: T[];
  message: string;
}

export interface EmbyUserListEntry {
  name: string;
  id: string;
  in_list: boolean;
}

export type EmbyUserList = EmbyUserListEntry[];

export async function getEmbyUserList(): Promise<EmbyUserList> {
  const response = await get<EmbyUserList>(`/emby/user_usage_stats/user_list`);
  return response;
}

export interface EmbyMovieListEntry {
  label: string;
  count: number;
  time: number;
}

export type EmbyMovieList = EmbyMovieListEntry[];

export async function getEmbyMovieList(userid: string): Promise<EmbyMovieList> {
  const response = await get<EmbyMovieList>(
    `/emby/user_usage_stats/MoviesReport?user_id=${userid}&days=${days}&end_date=${end_date}`,
  );
  return response;
}

export interface EmbyShowListEntry {
  label: string;
  count: number;
  time: number;
}

export type EmbyShowList = EmbyShowListEntry[];

export async function getEmbyShowList(userid: string): Promise<EmbyShowList> {
  const response = await get<EmbyShowList>(
    `/emby/user_usage_stats/TvShowsReport?user_id=${userid}&days=${days}&end_date=${end_date}`,
  );
  return response;
}

export interface EmbyHourly {
  [key: string]: number;
}

export async function getEmbyHourly(userid: string): Promise<EmbyHourly> {
  const response = await get<EmbyHourly>(
    `/emby/user_usage_stats/HourlyReport?user_id=${userid}&days=${days}&end_date=${end_date}&filter=Episode,Movie`,
  );
  return response;
}

export interface EmbyActivity {
  user_id: string;
  user_name: string;
  user_usage: {
    [key: string]: number;
  };
}

export type EmbyActivityList = EmbyActivity[];

export async function getEmbyActivity(): Promise<EmbyActivityList> {
  const response = await get<EmbyActivityList>(
    `/emby/user_usage_stats/PlayActivity?days=${days}&end_date=${end_date}&data_type=time&filter=Episode,Movie`,
  );
  return response;
}

export async function getEmbyUserPicture(id: string): Promise<string> {
  const response = await apiRequest(`/emby/Users/${id}/Images/Primary`);

  if (!response.ok) {
    if (response.status === 404) {
      return "";
    }
    console.log(response);
    throw new APIError("Unable to connect to Emby");
  }

  // Return image as base64
  const blob = await response.blob();

  const reader = new FileReader();
  reader.readAsDataURL(blob);
  const base64 = await new Promise<string>((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });

  return base64;
}
interface EmbyWatchListEntry {
  UserId: string;
  Total: number;
}

export async function getEmbyWatchList(
  type: "Movie" | "Episode",
): Promise<EmbyWatchListEntry[]> {
  const list = await post<EmbyCustomQueryResponse<[string, string]>>(
    `/emby/user_usage_stats/submit_custom_query`,
    {
      CustomQueryString:
        `SELECT UserId, SUM(PlayDuration) as Total FROM PlaybackActivity WHERE ItemType = '${type}' GROUP BY UserId`,
      ReplaceUserId: false,
    },
  );

  return list.results.map((row: [string, string]) => {
    return {
      UserId: row[0],
      Total: +row[1],
    };
  });
}
