"use client";

import { ActionTooltip } from "@/components/ui/action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo } from "react";

export const ChatVideoButton = () => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = useMemo(() => searchParams?.get("video"), [searchParams]);

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End Video Chat" : "Start Video chat";

  const onClick = useCallback(() => {
    const url = qs.stringifyUrl(
      {
        url: pathName || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );

    router.push(url);
  }, [isVideo, pathName, router]);

  return (
    <ActionTooltip side={"bottom"} label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
