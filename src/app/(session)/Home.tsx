"use client";
import { Holder, Drop as DropType, User } from "@/graphql.types";
import { useQuery } from "@apollo/client";
import { GetHomePage } from "@/queries/home.graphql";
import Link from "next/link";
import { Session } from "next-auth";
import { shorten } from "@/modules/wallet";
import { CheckIcon } from "@heroicons/react/24/solid";
import { not } from "ramda";
import useMe from "@/hooks/useMe";

interface HomeProps {
  session?: Session | null;
}

interface GetHomePageData {
  drops: DropType[];
  me: User;
}

interface GetHomePageVars {
  drop: string;
}

export default function Home({ session }: HomeProps) {
  const homePageQuery = useQuery<GetHomePageData, GetHomePageVars>(GetHomePage);
  const me = useMe();

  const owns = homePageQuery.data?.drops.reduce((acc: string[], drop) => {
    const collectionId = drop?.collection?.id as string;

    const isOwner = homePageQuery.data?.me?.wallet?.mints?.find((mint: any) => {
      return mint.collectionId === collectionId;
    });

    if (isOwner) {
      return [...acc, collectionId];
    }

    return acc;
  }, []);

  return (
    <>
      <img src="/img/WTC_LOGO__MEETCHINATOWNFULLCOLOR.png" className="w-36 aspect-square object-cover" />
      <h1 className="text-2xl text-white mt-12 text-center">
        Collect [n] NFTs to be entered into our raffle for a [prize]!
      </h1>
      <p className="text-gray-300 my-6 text-center">
        [Rules for collecting NFTs]
      </p>
      <div className="w-full grid grid-cols-4 gap-4">
        {homePageQuery.loading ? (
          <>
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
          </>
        ) : (
          homePageQuery?.data?.drops.map((drop) => {
            const metadataJson = drop.collection.metadataJson;
            const isHolder = owns?.find((id) => id === drop.collection.id);

            return (
              <div
                key={drop.id}
                className="relative w-full aspect-square flex justify-center items-center"
              >
                {isHolder && (
                  <div className="z-10 absolute -top-2 -left-2 w-6 aspect-square bg-contrast rounded-full flex justify-center items-center">
                    <CheckIcon width={16} />
                  </div>
                )}
                {not(isHolder) && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-backdrop rounded-lg opacity-50 z-10" />
                )}
                <img
                  src={metadataJson?.image as string}
                  alt={metadataJson?.name as string}
                  className="object-fit"
                />
              </div>
            );
          })
        )}
      </div>
      <div className="bg-contrast w-full max-w-md rounded-lg p-6 flex justify-between mt-8 items-center mb-6">
        {homePageQuery.loading ? (
          <>
            <div className="flex flex-row gap-2 items-center">
              <div className="bg-backdrop w-14 aspect-square rounded-full animate-pulse" />
              <div className="flex flex-col gap-1 justify-between">
                <div className="h-4 w-24 rounded-full bg-backdrop animate-pulse" />
                <div className="h-6 w-16 rounded-full bg-backdrop animate-pulse" />
              </div>
            </div>
            <div className="font-bold rounded-full bg-cta text-contrast w-32 h-12 transition animate-pulse" />
          </>
        ) : session ? (
          <>
            <div className="flex flex-row items-center gap-2">
              <img
                className="w-14 h-14 rounded-full"
                src={me?.image as string}
              />

              <div className="flex flex-col gap-1 justify-between">
                <span className="text-gray-300 text-xs">Wallet connected</span>
                <Link href="/collectables" className="underline">
                  {shorten(me?.wallet?.address as string)}
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-gray-300 text-xs">NFTs</span>
              {owns?.length}
            </div>
          </>
        ) : (
          <>
            <span className="text-xs md:text-base text-gray-300">
              Sign up to claim your NFT
            </span>
            <Link
              href="/login"
              className="font-bold rounded-full bg-cta text-contrast py-3 px-6 transition hover:opacity-80"
            >
              Claim now
            </Link>
          </>
        )}
      </div>
    </>
  );
}
