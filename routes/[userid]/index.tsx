import { Head } from "$fresh/runtime.ts";

import { Handlers, PageProps } from "$fresh/server.ts";
import { Watch } from "../../components/icons/Watch.tsx";
import { Calendar } from "../../components/icons/Calendar.tsx";
import { Clock } from "../../components/icons/Clock.tsx";

import {
  EmbyMovieListEntry,
  EmbyShowListEntry,
  getEmbyActivity,
  getEmbyHourly,
  getEmbyMovieList,
  getEmbyShowList,
} from "../../helper/EmbyData.ts";

interface RefinedData {
  mostWatched: {
    movies: EmbyMovieListEntry[];
    shows: EmbyShowListEntry[];
  };
  favoriteHour: { hour: string; count: number };
  favoriteDays: { day: string; count: number }[];
  totalWatchedMovies: number;
  totalWatchedShows: number;
}

export const handler: Handlers<RefinedData | null> = {
  async GET(_, { render, params }) {
    const userid = params.userid;

    const movies = await getEmbyMovieList(userid);
    const shows = await getEmbyShowList(userid);
    const hourly = await getEmbyHourly(userid);
    const activity = await getEmbyActivity();

    if ((!movies || movies.length === 0) && (!shows || shows.length === 0)) {
      return render(null);
    }

    const userActivity = activity.filter((item) => item.user_id === userid)[0];

    const hour = Object.entries(hourly).sort((a, b) => b[1] - a[1])[0];
    const days = Object.entries(userActivity.user_usage).sort((a, b) =>
      b[1] - a[1]
    ).slice(0, 3);

    const refinedData = {
      mostWatched: {
        movies: movies.sort((a, b) => b.time - a.time).slice(0, 8),
        shows: shows.sort((a, b) => b.time - a.time).slice(0, 8),
      },
      favoriteHour: { hour: hour[0], count: hour[1] },
      favoriteDays: days.map((day) => ({ day: day[0], count: day[1] })),
      totalWatchedMovies: movies.reduce((acc, cur) => acc + cur.time, 0),
      totalWatchedShows: shows.reduce((acc, cur) => acc + cur.time, 0),
    };
    return render(refinedData);
  },
};

// Duration is in seconds
function locateDurationString(duration: number, hoursOnly = false) {
  const remaining = duration;
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining - (days * 86400)) / 3600);
  const minutes = Math.floor(
    (remaining - (days * 86400) - (hours * 3600)) / 60,
  );

  if (hoursOnly && hours !== 0) {
    return `${hours} hours`;
  }

  if (days !== 0 && hours !== 0 && minutes !== 0) {
    return `${days} days ${hours} hours ${minutes} minutes`;
  }

  if (hours !== 0 && minutes !== 0) {
    return `${hours} hours ${minutes} minutes`;
  }

  if (days !== 0 && hours !== 0) {
    return `${days} days ${hours} hours`;
  }

  if (days !== 0) {
    return `${days} days`;
  }

  if (hours !== 0) {
    return `${hours} hours`;
  }

  if (minutes !== 0) {
    return `${minutes} minutes`;
  }

  return `${duration} seconds`;
}

function getWeekday(day: number) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[day];
}

export default function Home({ data }: PageProps<RefinedData | null>) {
  if (!data) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <Head>
        <title>Fresh App</title>
        <link rel="stylesheet" href="/app.css" />
      </Head>
      <div class="p-4 mx-auto max-w-screen-xl text-white">
        <section class="my-32 flex items-center">
          <div class="mr-8 hidden md:block">
            <Watch size={128} />
          </div>
          <div class="flex-grow">
            <h1 class="text-7xl font-bold">Your favorite time</h1>
            <p class="mt-4 text-3xl">
              You regularly watch on{" "}
              {getWeekday(+data.favoriteHour.hour.split("-")[0])} at{" "}
              {data.favoriteHour.hour.split("-")[1]}:00.
            </p>
          </div>
        </section>
        <section class="my-32 flex items-center">
          <div class="flex-grow text-right">
            <h1 class="text-6xl font-bold">Your biggest watch streaks</h1>
            <ul class="flex flex-col pt-4 md:flex-row">
              {data.favoriteDays.map((day, index) => (
                <li
                  class={`bg-white bg-opacity-20 p-5 text-black font-bold flex flex-row flex-wrap flex-grow ${
                    index == 0 ? "md:ml-0" : "md:ml-5"
                  } `}
                >
                  <div class="mr-auto">
                    <Clock size={64} index={index} />
                  </div>
                  <div>
                    <h2 class="text-2xl text-white">
                      {locateDurationString(day.count, true)}
                    </h2>
                    <span class="text-sm">
                      {new Date(day.day).toLocaleDateString("en-US", {
                        dateStyle: "full",
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div class="ml-8 hidden md:block">
            <Calendar size={164} />
          </div>
        </section>
        <section class="my-32">
          <h2 class="text-xl font-bold">Most Watched Movies</h2>
          <ul class="mt-4 flex flex-row">
            {data.mostWatched.movies.map((movie) => (
              <li class="p-2 w-48">
                <img
                  src="https://radarr.hedium.nl/MediaCover/667/poster-250.jpg?lastWrite=638038030427014794"
                  alt="Movie IMG"
                  class="w-48"
                />
                <span class="mr-2 block">{movie.label}</span>
                <span class="text-sm text-gray-500">
                  {locateDurationString(movie.time)}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section class="my-32">
          <h2 class="text-xl font-bold">Most Watched Shows</h2>
          <ul class="mt-4 flex flex-row">
            {data.mostWatched.shows.map((show) => (
              <li class="p-2 flex-grow w-48">
                <img
                  src="https://sonarr.hedium.nl/MediaCover/39/poster-500.jpg?lastWrite=637853028501906896"
                  alt="Show IMG"
                  class="w-48"
                />
                <span class="mr-2 block">{show.label}</span>
                <span class="text-sm text-gray-500">
                  {locateDurationString(show.time)}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section class="my-32">
          <h2 class="text-xl font-bold">Total Watched</h2>
          <ul>
            <li class="mt-4">
              <span class="mr-2 block font-bold">Movies</span>
              <span class="text-sm text-gray-500">
                {locateDurationString(data.totalWatchedMovies)}
              </span>
            </li>
            <li class="mt-4">
              <span class="mr-2 block font-bold">Shows</span>
              <span class="text-sm text-gray-500">
                {locateDurationString(data.totalWatchedShows)}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
