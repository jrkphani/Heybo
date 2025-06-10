import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@heybo/api";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req }) => ({
      req,
      // Add HeyBo-specific context
      brand: req.headers.get('x-heybo-brand') || 'heybo',
      userAgent: req.headers.get('user-agent'),
    }),
  });

export { handler as GET, handler as POST };
