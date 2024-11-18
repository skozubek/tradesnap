// src/lib/trade-form-utils.ts
export const createFieldClassNames = (error?: string) => ({
    input: `flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
      ${error ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`,
    label: 'text-sm font-medium',
    error: 'text-sm text-red-500',
  });