"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/toast";

export function LogoutToastWatcher({ userExists }: { userExists: boolean }) {
  const prevUserExists = useRef(userExists);

  useEffect(() => {
    // If they were logged in before, but now they are not, they just logged out!
    if (prevUserExists.current && !userExists) {
      toast({
        type: "success",
        title: "Logged out",
        description: "You have been securely signed out.",
      });
    }
    prevUserExists.current = userExists;
  }, [userExists]);

  return null;
}
