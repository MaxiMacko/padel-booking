-- Add missing indexes for performance optimization

-- User indexes
CREATE INDEX "User_email_idx" ON "User"("email");

-- TrainerSchedule indexes
CREATE INDEX "TrainerSchedule_trainerId_startTime_idx" ON "TrainerSchedule"("trainerId", "startTime");
CREATE INDEX "TrainerSchedule_isAvailable_deletedAt_idx" ON "TrainerSchedule"("isAvailable", "deletedAt");
CREATE INDEX "TrainerSchedule_startTime_endTime_idx" ON "TrainerSchedule"("startTime", "endTime");

-- Booking indexes
CREATE INDEX "Booking_clientId_idx" ON "Booking"("clientId");
CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");
CREATE INDEX "Booking_trainerScheduleId_idx" ON "Booking"("trainerScheduleId");

-- Session indexes
CREATE INDEX "Session_expiresAt_revokedAt_idx" ON "Session"("expiresAt", "revokedAt");
