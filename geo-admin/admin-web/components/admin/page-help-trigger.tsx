"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHelpDrawer } from "@/components/admin/page-help-drawer";

type PageHelpTriggerProps = {
  helpPath: string;
};

export function PageHelpTrigger({ helpPath }: PageHelpTriggerProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("帮助说明");
  const [content, setContent] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(false);

  async function openHelp() {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const { pageHelpContent } = await import("./page-help-content");
      const help = pageHelpContent[helpPath];
      if (!help) {
        return;
      }
      setTitle(help.title);
      setContent(help.content);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button disabled={loading} type="button" variant="outline" onClick={() => void openHelp()}>
        <CircleHelp className="mr-2 h-4 w-4" />
        {loading ? "加载中..." : "帮助"}
      </Button>
      {content ? (
        <PageHelpDrawer content={content} open={open} title={title} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
