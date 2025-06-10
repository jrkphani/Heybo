import { z } from 'zod'
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const appRouter = t.router({
  // Placeholder API routes for HeyBo chatbot
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello ${input.name}!` }
    }),
})

export type AppRouter = typeof appRouter
