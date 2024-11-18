// src/lib/actions/trades.ts
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { 
  type TradeFormData,
  validateTradeForm,
  type ValidationError,
  formatValidationErrors,
  type TradeResponse
} from '@/lib/validations/trade-schemas';

export type ActionError = {
  type: 'validation' | 'auth' | 'database' | 'unknown';
  message: string;
  errors?: ValidationError[];
};

export type ActionResult<T> = {
  data?: T;
  error?: ActionError;
};

function handleActionError(error: unknown): ActionError {
  console.error('Action error:', error);

  if (error instanceof z.ZodError) {
    return {
      type: 'validation',
      message: 'Validation failed',
      errors: formatValidationErrors(error),
    };
  }

  if (error instanceof Error) {
    if (error.message.includes('Prisma')) {
      return {
        type: 'database',
        message: 'Database operation failed',
      };
    }
    return {
      type: 'unknown',
      message: error.message,
    };
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred',
  };
}

export async function updateTrade(
  id: string,
  formData: TradeFormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        error: {
          type: 'auth',
          message: 'You must be logged in to update a trade',
        },
      };
    }

    try {
      const validatedData = validateTradeForm(formData);

      // Check trade ownership
      const existingTrade = await prisma.trade.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingTrade) {
        return {
          error: {
            type: 'database',
            message: 'Trade not found',
          },
        };
      }

      if (existingTrade.userId !== userId) {
        return {
          error: {
            type: 'auth',
            message: 'You do not have permission to update this trade',
          },
        };
      }

      const trade = await prisma.trade.update({
        where: { id },
        data: {
          symbol: validatedData.symbol,
          type: validatedData.type,
          price: validatedData.price,
          amount: validatedData.amount,
          stopLoss: validatedData.stopLoss,
          takeProfit: validatedData.takeProfit,
          status: validatedData.status,
          notes: validatedData.notes ?? null,
          strategyName: validatedData.strategyName ?? null,
          timeframe: validatedData.timeframe ?? null,
          exitPrice: validatedData.exitPrice ?? null,
          exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
        },
      });

      // Revalidate both the trades list and individual trade
      revalidatePath('/trades');
      revalidatePath(`/trades/${trade.id}`);

      return { data: { id: trade.id } };
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return {
          error: {
            type: 'validation',
            message: 'Trade validation failed',
            errors: formatValidationErrors(validationError),
          },
        };
      }
      throw validationError;
    }
  } catch (error) {
    return { error: handleActionError(error) };
  }
}

export async function createTrade(
  formData: TradeFormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        error: {
          type: 'auth',
          message: 'You must be logged in to create a trade',
        },
      };
    }

    // Validate form data
    try {
      const validatedData = validateTradeForm(formData);

      // Create trade in database
      const trade = await prisma.trade.create({
        data: {
          userId,
          symbol: validatedData.symbol,
          type: validatedData.type,
          price: validatedData.price,
          amount: validatedData.amount,
          stopLoss: validatedData.stopLoss,
          takeProfit: validatedData.takeProfit,
          status: validatedData.status,
          notes: validatedData.notes ?? null,
          strategyName: validatedData.strategyName ?? null,
          timeframe: validatedData.timeframe ?? null,
          exitPrice: validatedData.exitPrice ?? null,
          exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
        },
      });

      // Revalidate both the trades list and individual trade
      revalidatePath('/trades');
      revalidatePath(`/trades/${trade.id}`);

      return { data: { id: trade.id } };
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return {
          error: {
            type: 'validation',
            message: 'Trade validation failed',
            errors: formatValidationErrors(validationError),
          },
        };
      }
      throw validationError;
    }
  } catch (error) {
    return { error: handleActionError(error) };
  }
}

export async function deleteTrade(
  id: string
): Promise<ActionResult<{ success: boolean }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        error: {
          type: 'auth',
          message: 'You must be logged in to delete a trade',
        },
      };
    }

    // Check trade ownership
    const trade = await prisma.trade.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trade) {
      return {
        error: {
          type: 'database',
          message: 'Trade not found',
        },
      };
    }

    if (trade.userId !== userId) {
      return {
        error: {
          type: 'auth',
          message: 'You do not have permission to delete this trade',
        },
      };
    }

    await prisma.trade.delete({
      where: { id },
    });

    // Revalidate the trades list
    revalidatePath('/trades');

    return { data: { success: true } };
  } catch (error) {
    return { error: handleActionError(error) };
  }
}