import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";

interface PageProps {
  params: Promise<{ stack: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Handler(props: PageProps) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
