-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "bio" TEXT,
    "mostUsedLang" TEXT,
    "email" TEXT,
    "followersCount" INTEGER NOT NULL,
    "followingCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Repo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "stars" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "userUsername" TEXT,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Repo" ADD CONSTRAINT "Repo_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
