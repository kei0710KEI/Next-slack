import { Info, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const router = useRouter();

  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [searchQuery, setSearchQuery] = useState(""); // 検索キーワードの状態
  const [open, setOpen] = useState(false); // モーダルの表示状態

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  // 検索フィルタリングロジック
  const filteredChannels = channels?.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMembers = members?.filter((member) =>
    member._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>

      {/* モーダル検索バー */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="bg-white w-full max-w-lg p-4 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Search className="mr-2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search channels or members..."
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => setOpen(false)}
                className="ml-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* 検索結果 */}
            {searchQuery && (filteredChannels?.length || filteredMembers?.length) ? (
              <div className="max-h-60 overflow-y-auto">
                <ul>
                  {filteredChannels?.map((channel) => (
                    <li
                      key={channel._id}
                      onClick={() => onChannelClick(channel._id)}
                      className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Search className="mr-2 text-gray-500" />
                      <span>{channel.name}</span>
                    </li>
                  ))}
                  {filteredMembers?.map((member) => (
                    <li
                      key={member._id}
                      onClick={() => onMemberClick(member._id)}
                      className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Search className="mr-2 text-gray-500" />
                      <span>{member.user.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No results found.</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};



