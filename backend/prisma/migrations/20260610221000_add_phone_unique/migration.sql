-- Add unique constraint on phone column for User
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
