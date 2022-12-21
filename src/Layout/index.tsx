import { ChannelType, ChannelsType } from "@/types/channels";
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
} from "react";
import { addChannel, deleteChannel } from "@/lib/Store";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import TrashIcon from "@/icons/TrashIcon";
import { User } from "@supabase/supabase-js";
import UserContext from "@/lib/UserContext";
import { UserType } from "@/types/users";
import { userRolesType } from "@/types/user_roles";

interface Props {
  channels?: ChannelsType;
  activeChannelId?: string;
  children: JSX.Element[] | JSX.Element;
  username?: string;
  time?: string;
}

export default function Layout({
  channels,
  activeChannelId,
  children,
  username,
  time,
}: Props) {
  const { signOut, user, userRoles } = useContext(UserContext);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  const newChannel = async () => {
    const slug = prompt("Please enter your name");
    if (slug && user) {
      addChannel(slugify(slug), user.id);
    }
  };

  return (
    <main className="main flex h-screen w-screen overflow-hidden">
      <Navbar username={username} time={time} />
      {/* Sidebar */}
      {channels && activeChannelId && (
        <nav
          className="w-64 bg-gray-900 text-gray-100 overflow-scroll "
          style={{ maxWidth: "20%", minWidth: 150, maxHeight: "100vh" }}
        >
          <div className="p-2 ">
            <div className="p-2">
              <button
                className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
                onClick={() => newChannel()}
              >
                New Channel
              </button>
            </div>
            <hr className="m-2" />
            <div className="p-2 flex flex-col space-y-2">
              <h6 className="text-xs">{user?.email}</h6>
              <button
                className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
                onClick={() => signOut()}
              >
                Log out
              </button>
            </div>
            <hr className="m-2" />
            <h4 className="font-bold">Channels</h4>
            <ul className="channel-list">
              {channels.map((x) => (
                <SidebarItem
                  channel={x}
                  key={x.id}
                  isActiveChannel={`${x.id}` === activeChannelId}
                  user={user}
                  userRoles={userRoles}
                />
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Messages */}
      <div className="flex-1 bg-gray-800 h-screen">{children}</div>
    </main>
  );
}

interface SidebarItemProps {
  channel: ChannelType;
  isActiveChannel: boolean;
  user?: User | null;
  userRoles?: userRolesType;
}

const SidebarItem = ({
  channel,
  isActiveChannel,
  user,
  userRoles,
}: SidebarItemProps) => (
  <>
    <li className="flex items-center justify-between">
      <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
        <a className={isActiveChannel ? "font-bold" : ""}>{channel.slug}</a>
      </Link>
      {channel.id !== 1 &&
        (channel.created_by === user?.id || userRoles?.includes("admin")) && (
          <button onClick={() => deleteChannel(`${channel.id}`)}>
            <TrashIcon />
          </button>
        )}
    </li>
  </>
);
