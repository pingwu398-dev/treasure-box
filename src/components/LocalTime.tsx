"use client";

import { useEffect, useState } from "react";

export function LocalTime({ date }: { date: string }) {
  const [str, setStr] = useState("");

  useEffect(() => {
    setStr(new Date(date).toLocaleString("zh-CN"));
  }, [date]);

  return <span>{str || "-"}</span>;
}
