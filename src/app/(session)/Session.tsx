'use client';

import Image from 'next/image';
import Link from 'next/link';
import useMe from '@/hooks/useMe';
import { usePathname } from 'next/navigation';
import { User } from '../../graphql.types';
import { PopoverBox } from '../../components/Popover';
import { Icon } from '../../components/Icon';
import { shorten } from '../../modules/wallet';
import Copy from '../../components/Copy';
import { signOut } from 'next-auth/react';

interface GetMeData {
  me: User | undefined;
}

export default function Session({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const me = useMe();

  return (
    <>
      <header className='flex w-full justify-between items-center py-4'>
        <Link href='/'>
          <Image src='/img/WTC_LOGOMAIN.png' alt='site logo' width={200} height={79} />
        </Link>
        {me ? (
          <PopoverBox
            triggerButton={
              <button className='text-cta font-bold border-2 rounded-full border-cta py-3 px-6 flex gap-2 items-center'>
                <img
                  className='w-6 h-6 rounded-full'
                  src={me?.image as string}
                />
                <span>{me?.name}</span>
                <Icon.ChevronDown className='stroke-cta' />
              </button>
            }
          >
            <div className='rounded-lg bg-contrast p-6 flex flex-col items-center mt-4'>
              <span className='text-xs text-gray-300'>
                Solana wallet address
              </span>
              <div className='flex gap-2 mt-1'>
                <span className='text-xs'>
                  {shorten(me.wallet?.address as string)}
                </span>
                <Copy copyString={me.wallet?.address as string} />
              </div>
              <button
                onClick={() => signOut()}
                className='text-cta font-medium md:font-bold md:border-2 md:rounded-full md:border-cta md:py-3 md:px-6 mt-10'
              >
                Log out
              </button>
            </div>
          </PopoverBox>
        ) : (
          <>
            <div className='flex gap-1 md:gap-4 items-center'>
              <Link
                href={`/login?return_to=${pathname}`}
                className='text-cta font-medium md:font-bold md:border-2 md:rounded-full md:border-cta md:py-3 md:px-6'
              >
                Log in
              </Link>
              <span className='text-gray-300 font-medium md:hidden'>or</span>
              <Link
                href={`/login?return_to=${pathname}`}
                className='text-cta font-medium md:text-backdrop md:bg-cta md:rounded-full md:font-bold md:py-3 md:px-6'
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </header>
      {children}
    </>
  );
}
