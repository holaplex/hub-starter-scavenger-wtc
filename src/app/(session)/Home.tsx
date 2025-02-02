"use client";
import { Holder, Drop as DropType, User } from "@/graphql.types";
import { useQuery } from "@apollo/client";
import { GetHomePage } from "@/queries/home.graphql";
import Link from "next/link";
import { Session } from "next-auth";
import { shorten } from "@/modules/wallet";
import { CheckIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { not } from "ramda";
import useMe from "@/hooks/useMe";
import { Disclosure } from "@headlessui/react";

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
      <h1 className="text-2xl text-white mt-12 text-left">
        It&apos;s back! MEET CHINATOWN Fall Fest edition is taking place October 28 - 29 from 11A to 6P. It&apos;s easy to sign up and play!
      </h1>
      <br></br><br></br>
      <div className="w-full">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-[#e4c42f] px-4 py-2 text-left text-sm font-medium text-[#1b2a40] hover:bg-[#e4c42f] focus:outline-none focus-visible:ring ">
                <span>How to Play</span>
                <ChevronUpIcon
                  className={`${open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-[#1b2a40]`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-300 my-6 text-left">
                <ul>
                  <li>1. Create your wallet to get started.</li>
                  <li>2. Review the list of actions and participating businesses. Not sure where things are located? Review our MEET CHINATOWN digital directory at the bottom of this page.</li>
                  <li>3. Complete the actions around Chinatown. Make sure to scan each QR code and collect the badge as proof you&apos;ve completed the action. Once you&apos;ve collected a badge, it&apos;ll be lit up in your wallet.</li>
                  <li>4. Done playing? Visit our Hub (at 115 Bowery) during Fall Fest hours (11A to 6P) to redeem prizes from our MEET CHINATOWN marketplace.</li>
                </ul>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      <img src="/img/info.png" className="aspect-square object-cover" />
      <div className="w-full">
        <p className="text-gray-300 my-6 text-left">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-[#e4c42f] px-4 py-2 text-left text-sm font-medium text-[#1b2a40] hover:bg-[#e4c42f] focus:outline-none focus-visible:ring ">
                  <span>Rules</span>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-[#1b2a40]`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  <ul>
                    <li>- You can only play October 28 - 29, 2023 from 11:00 AM to 6:00 PM EST</li>
                    <li>- By participating, you agree to Welcome to Chinatown&apos;s Privacy Policy</li>
                    <li>- One play per person throughout the duration of Fall Fest</li>
                    <li>- Regardless of how many points earned, each person can only redeem two prizes in total at our MEET CHINATOWN marketplace</li>
                    <li>- Points and badges earned in this scavenger hunt game hold no monetary value. They are purely for the purpose of competition, fun, and recognition within the game. Participants should not expect any form of financial compensation or rewards in exchange for their points or badges.</li>
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </p>
      </div>
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
              Log in to view your badges
            </span>
            <Link
              href="/login"
              className="font-bold rounded-full bg-cta text-contrast py-3 px-6 transition hover:opacity-80"
            >
              Log in
            </Link>
          </>
        )}
      </div>
      <iframe width="100%" src="https://viewer.mapme.com/welcome-to-chinatown" className="w-full aspect-video"></iframe>
    </>
  );
}
