import { Head } from "$fresh/runtime.ts";

import { Handlers, PageProps } from "$fresh/server.ts";
import { Minidenticon } from "../components/MinidenticonAvatar.tsx";

import {
  EmbyUserList,
  getEmbyUserList,
  getEmbyUserPicture,
} from "../util/EmbyData.ts";

type base64 = string;

export const handler: Handlers<
  { users: EmbyUserList; pictures: base64[] } | null
> = {
  async GET(_, ctx) {
    const users = await getEmbyUserList();

    const pictureList: string[] = [];

    for (const user of users) {
      const picture = await getEmbyUserPicture(user.id);
      pictureList.push(picture);
    }

    if (!users) {
      return ctx.render(null);
    }

    return ctx.render({ users, pictures: pictureList });
  },
};

export default function Home(
  { data }: PageProps<{ users: EmbyUserList; pictures: base64[] } | null>,
) {
  if (!data) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <Head>
        <title>Emby Recap</title>
        <link rel="stylesheet" href="/app.css" />
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <h1 class="text-2xl font-bold">Emby Users</h1>
        {/* Emby user display using a dummy profile picture. Displayed as glass cards */}
        <div class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-3 md:grid-cols-4">
          {data.users.map((user, index) => (
            <a href={`/${user.id}?name=${user.name}&self=1`}>
              <div class="flex flex-col items-center justify-center p-4 bg-white bg-opacity-30 rounded">
                <div class="h-24 w-24 rounded-full overflow-hidden">
                  {data.pictures[index]
                    ? (
                      <img
                        class="w-full h-full object-cover"
                        src={data.pictures[index] ?? ``}
                        alt="Profile Picture"
                      />
                    )
                    : <Minidenticon name={user.name} class="bg-gray-300" />}
                </div>
                <span class="mt-2 text-lg font-thin">{user.name}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
