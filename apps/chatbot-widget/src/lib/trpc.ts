import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@heybo/api";

export const trpc = createTRPCReact<AppRouter>();
