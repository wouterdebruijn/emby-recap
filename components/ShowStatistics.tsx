import { getPlace, locateDurationString } from "../util/DateTime.ts";

interface ShowStatisticsData {
  totalShows: number;
  totalWatchTimeShows: number;
  showTier: number;
  mostWatched: {
    shows: {
      label: string;
      time: number;
    }[];
  };
}

export function ShowStatistics({ data }: { data: ShowStatisticsData }) {
  return (
    <section class="mt-16">
      <div class="flex flex-col">
        <h2 class="text-4xl md:text-6xl font-bold pt-2">
          You watched {data.totalShows} shows this year!
        </h2>
        <span class="text-xl md:text-3xl pt-1">
          That places you on {getPlace(data.showTier)} place
        </span>
      </div>
      <div>
        <ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {data.mostWatched.shows.map((show) => (
            <li class="bg-white p-5 bg-opacity-20 shadow rounded">
              <span class="block text-xl truncate">{show.label}</span>
              <span>
                {locateDurationString(show.time)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div class="w-full text-center mt-2 bg-white p-5 bg-opacity-20 shadow rounded">
        <span class="text-xl md:text-3xl">
          You spent a total of{" "}
          <span class="font-bold">
            {locateDurationString(data.totalWatchTimeShows)}
          </span>{" "}
          watching movies
        </span>
      </div>
    </section>
  );
}
