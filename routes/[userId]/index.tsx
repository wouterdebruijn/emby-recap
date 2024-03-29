import { Head } from "$fresh/runtime.ts";

import { Handlers, PageProps } from "$fresh/server.ts";
import { Calendar } from "../../components/icons/Calendar.tsx";
import { Watch } from "../../components/icons/Watch.tsx";

import { BlockStatistic } from "../../components/BlockStatistic.tsx";
import { NewYearMessage } from "../../components/NewYearMessage.tsx";
import {
  getPlace,
  getWeekday,
  locateDurationString,
} from "../../util/DateTime.ts";
import {
  EmbyMovieListEntry,
  EmbyShowListEntry,
  getEmbyActivity,
  getEmbyHourly,
  getEmbyMovieList,
  getEmbyShowList,
  getEmbyWatchList,
} from "../../util/EmbyData.ts";
import { MovieStatistics } from "../../components/MovieStatistics.tsx";
import { ShowStatistics } from "../../components/ShowStatistics.tsx";

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
  firstDay: [string, number];
}

export const handler: Handlers<RefinedData | null> = {
  async GET({ url }, { render, params, state }) {
    const userId = params.userId;
    const username = new URL(url).searchParams.get("name") ?? "Someone";

    const [
      movies,
      shows,
    ] = await Promise.all([
      getEmbyMovieList(userId),
      getEmbyShowList(userId),
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
      getEmbyHourly(userId),
      getEmbyActivity(),
      getEmbyWatchList("Movie"),
      getEmbyWatchList("Episode"),
    ]);

    const userActivity = activity.filter((item) => item.user_id === userId)[0];

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
        totalWatchListMovie.findIndex((item) => item.UserId === userId) + 1,
      showTier: totalWatchListShow.findIndex((item) => item.UserId === userId) +
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

      <div class="px-4">
        {/* One full screen view */}
        <div class="mx-auto max-w-screen-xl text-white min-h-screen flex flex-col justify-evenly">
          <BlockStatistic
            title={`${Math.ceil(data.totalTime / 60)} minutes.`}
            text={`Your total watch time since ${
              new Date(data.firstDay[0]).toLocaleDateString("en-US", {
                dateStyle: "short",
              })
            }. That is ${locateDurationString(data.totalTime, false, true)}!`}
            icon={<Watch />}
          />

          <BlockStatistic
            title="Your favorite time"
            text={`You regularly watch on ${
              getWeekday(+data.favoriteHour.hour.split("-")[0])
            } at ${data.favoriteHour.hour.split("-")[1]}:00`}
            icon={<Calendar />}
            direction="right"
          />
        </div>

        {/* Scroll content */}
        <div class="mx-auto max-w-screen-xl text-white min-h-screen flex flex-col px-4">
          <MovieStatistics data={data} />

          <ShowStatistics data={data} />

          <NewYearMessage />

          <p class="text-white pt-8 pb-8 text-center">
            🧑🏻‍💻 Created by{" "}
            <a href="https://github.com/wouterdebruijn/emby-recap">
              Wouter de Bruijn
            </a>{" "}
            -{" "}
            <a href="https://github.com/wouterdebruijn/emby-recap/blob/main/LICENSE">
              MIT License
            </a>{" "}
            ❤️
          </p>
        </div>
      </div>
    </>
  );
}
