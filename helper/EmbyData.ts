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

export async function get<T extends unknown>(url: string) {
  const baseurl = Deno.env.get("EMBY_URL") || "http://localhost:8096";

  const response = await fetch(baseurl + url, {
    headers: {
      "X-Emby-Token": Deno.env.get("EMBY_API_KEY") || "",
    },
  });

  if (!response.ok) {
    console.log(response);
    throw new APIError("Unable to connect to Emby");
  }

  return response.json() as Promise<T>;
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

export async function getEmbyUserPicture(id: string) {
  const baseurl = Deno.env.get("EMBY_URL") || "http://localhost:8096";

  const response = await fetch(`${baseurl}/emby/Users/${id}/Images/Primary`, {
    headers: {
      "X-Emby-Token": Deno.env.get("EMBY_API_KEY") || "",
    },
  });

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

export async function getEmbyWatchList(type: "Movie" | "Episode") {
  const baseurl = Deno.env.get("EMBY_URL") || "http://localhost:8096";

  const response = await fetch(`${baseurl}/emby/user_usage_stats/submit_custom_query`, {
    method: "POST",
    headers: {
      "X-Emby-Token": Deno.env.get("EMBY_API_KEY") || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CustomQueryString: `SELECT UserId, SUM(PlayDuration) as Total FROM PlaybackActivity WHERE ItemType = '${type}' GROUP BY UserId`,
      ReplaceUserId: false,
    }),
  })

  if (!response.ok) {
    console.log(response);
    throw new APIError("Unable to connect to Emby");
  }

  const json = await response.json();

  return json.results.map((row: [string, number]) => {
    return {
      UserId: row[0],
      Total: row[1],
    } as EmbyWatchListEntry;
  }) as EmbyWatchListEntry[];
}
