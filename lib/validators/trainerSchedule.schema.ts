
import { z } from "zod";

export const createTrainerScheduleSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
});
