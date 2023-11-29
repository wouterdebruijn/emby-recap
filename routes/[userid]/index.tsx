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
  getEmbyWatchList,
} from "../../helper/EmbyData.ts";

interface RefinedData {
  mostWatched: {
    movies: EmbyMovieListEntry[];
    shows: EmbyShowListEntry[];
  };
  favoriteHour: { hour: string; count: number };
  favoriteDays: { day: string; count: number }[];
  totalWatchTimeMovies: number;
  totalWatchTimeShows: number;
  totalMovies: number;
  totalShows: number;
  movieTier: number;
  showTier: number;
  username: string;
  totalTime: number;
  firstDay: { day: string; count: number };
}

export const handler: Handlers<RefinedData | null> = {
  async GET({ url }, { render, params }) {
    const userid = params.userid;
    const username = new URL(url).searchParams.get("name") ?? "Someone";

    const [
      movies,
      shows,
    ] = await Promise.all([
      getEmbyMovieList(userid),
      getEmbyShowList(userid),
    ]);

    if ((!movies || movies.length === 0) && (!shows || shows.length === 0)) {
      return render(null);
    }

    const [
      hourly,
      activity,
      totalWatchListMovie,
      totalWatchListShow,
    ] = await Promise.all([
      getEmbyHourly(userid),
      getEmbyActivity(),
      getEmbyWatchList("Movie"),
      getEmbyWatchList("Episode"),
    ]);

    const userActivity = activity.filter((item) => item.user_id === userid)[0];

    const hour = Object.entries(hourly).sort((a, b) => b[1] - a[1])[0];
    const days = Object.entries(userActivity.user_usage).sort((a, b) =>
      b[1] - a[1]
    ).slice(0, 3);

    const refinedData = {
      mostWatched: {
        movies: movies.sort((a, b) => b.time - a.time).slice(0, 9),
        shows: shows.sort((a, b) => b.time - a.time).slice(0, 9),
      },
      favoriteHour: { hour: hour[0], count: hour[1] },
      favoriteDays: days.map((day) => ({ day: day[0], count: day[1] })),
      totalWatchTimeMovies: movies.reduce((acc, cur) => acc + cur.time, 0),
      totalWatchTimeShows: shows.reduce((acc, cur) => acc + cur.time, 0),
      totalMovies: movies.filter((movie) => movie.time > 600).length,
      totalShows: shows.filter((movie) => movie.time > 600).length,
      movieTier:
        totalWatchListMovie.findIndex((item) => item.UserId === userid) + 1,
      showTier: totalWatchListShow.findIndex((item) => item.UserId === userid) +
        1,
      username,
      totalTime: movies.reduce((acc, cur) => acc + cur.time, 0) +
        shows.reduce((acc, cur) => acc + cur.time, 0),
      firstDay:
        Object.entries(userActivity.user_usage).filter((item) =>
          item[1] > 0
        )[0],
    };
    return render(refinedData);
  },
};

// Duration is in seconds
function locateDurationString(
  duration: number,
  hoursOnly = false,
  daysOnly = false,
) {
  const remaining = duration;
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining - (days * 86400)) / 3600);
  const minutes = Math.floor(
    (remaining - (days * 86400) - (hours * 3600)) / 60,
  );

  if (hoursOnly && hours !== 0) {
    return hours === 1 ? `${hours} hour` : `${hours} hours`;
  }

  if (daysOnly && days !== 0) {
    return days === 1 ? `${days} day` : `${days} days`;
  }

  if (days !== 0 && hours !== 0 && minutes !== 0) {
    return `${days} days, ${hours} hours and ${minutes} minutes`;
  }

  if (hours !== 0 && minutes !== 0) {
    return `${hours} hours and ${minutes} minutes`;
  }

  if (days !== 0 && hours !== 0) {
    return `${days} days and ${hours} hours`;
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

function getPlace(place: number) {
  switch (place) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${place}th`;
  }
}

/**
 * @returns {JSX.Element} A JSX element containing a message if it's the new year
 */
function NewYearMessage() {
  const now = new Date();
  if (now.getMonth() === 11 && now.getDate() > 25) {
    return <h1 class="text-6xl">Happy {now.getFullYear() + 1}!</h1>;
  }
  if (now.getMonth() === 0 && now.getDate() < 5) {
    return <h1 class="text-6xl">Happy {now.getFullYear()}</h1>;
  }
  return <></>;
}

export default function Home({ data }: PageProps<RefinedData | null>) {
  if (!data) {
    return (
      <h1>This user doesn't have enough activity to provide statistics.</h1>
    );
  }

  return (
    <>
      <Head>
        <title>{data.username}'s Statistics</title>
        <link rel="stylesheet" href="/app.css" />
      </Head>
      <div class="mx-auto max-w-screen-xl text-white min-h-screen flex flex-col p-8 py-48">
        <section class="flex items-center flex-grow my-20">
          <div class="mr-8 hidden md:block">
            <Watch size={128} />
          </div>
          <div class="flex-grow">
            <h1 class="text-7xl font-bold">
              <span class="font-bold">
                {`${Math.ceil(data.totalTime / 60)} `} minutes.
              </span>
            </h1>
            <p class="mt-4 text-3xl">
              Your total watch time since{" "}
              {new Date(data.firstDay[0]).toLocaleDateString("en-US", {
                dateStyle: "long",
              })}. That is{" "}
              {` ${locateDurationString(data.totalTime, false, true)}`}!
            </p>
          </div>
        </section>

        <section class="flex items-center flex-grow flex-row-reverse my-12">
          <div class="ml-8 hidden md:block">
            <Calendar size={164} />
          </div>
          <div class="text-right w-full">
            <div class="pb-8">
              <h1 class="text-7xl font-bold">Your favorite time</h1>
              <p class="mt-4 text-3xl">
                You regularly watch on{" "}
                {getWeekday(+data.favoriteHour.hour.split("-")[0])} at{" "}
                {data.favoriteHour.hour.split("-")[1]}:00
                <br />Here are some of your biggest streaks
              </p>
              <ul class="flex flex-col pt-4 xl:flex-row w-full">
                {data.favoriteDays.map((day, index) => (
                  <li
                    class={`bg-white bg-opacity-20 p-5 text-black font-bold flex flex-row flex-grow shadow rounded justify-between ${
                      index == 0 ? "xl:ml-0" : "xl:ml-5"
                    } `}
                  >
                    <div>
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
          </div>
        </section>
      </div>
      <div class="mx-auto max-w-screen-xl text-white min-h-screen flex flex-col p-8 py-48">
        <section class="my-32">
          <div class="flex flex-col">
            <h2 class="text-6xl font-bold pt-2">
              You watched {data.totalMovies} movies this year!
            </h2>
            <span class="text-3xl pt-1">
              That places you on {getPlace(data.movieTier)} place
            </span>
          </div>
          <div>
            <ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {data.mostWatched.movies.map((movie) => (
                <li class="bg-white p-5 bg-opacity-20 shadow rounded">
                  <span class="block text-xl truncate">{movie.label}</span>
                  <span>
                    {locateDurationString(movie.time)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div class="w-full text-center mt-2 bg-white p-5 bg-opacity-20 shadow rounded">
            <span class="text-3xl">
              You spent a total of{" "}
              <span class="font-bold">
                {locateDurationString(data.totalWatchTimeMovies)}
              </span>{" "}
              watching movies
            </span>
          </div>
        </section>
        <section class="my-32">
          <div class="flex flex-col">
            <h2 class="text-6xl font-bold pt-2">
              You watched {data.totalShows} shows this year!
            </h2>
            <span class="text-3xl pt-1">
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
            <span class="text-3xl">
              You spent a total of{" "}
              <span class="font-bold">
                {locateDurationString(data.totalWatchTimeShows)}
              </span>{" "}
              watching movies
            </span>
          </div>
        </section>
        <section class="text-center pb-32 font-thin">
          <NewYearMessage />
        </section>
      </div>
      <p class="text-white p-2">
        Created by{" "}
        <a href="https://github.com/wouterdebruijn/">Wouter de Bruijn</a>{" "}
        - MIT License
      </p>
    </>
  );
}
