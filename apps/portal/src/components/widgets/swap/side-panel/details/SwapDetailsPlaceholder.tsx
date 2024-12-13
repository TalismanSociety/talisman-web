export const SwapDetailsPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-[8px] rounded-[8px] border border-gray-800 p-[16px] py-[12px]">
    <div className="bg-primary/5 flex h-[124px] w-[124px] items-center justify-center rounded-full">
      <div className="relative">
        <svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="0.818359" width="47.2911" height="44.8021" rx="7.74211" fill="#D5FF5C" />
          <path
            d="M12.4453 23.2143V19.9638C12.4453 17.2914 14.6117 15.125 17.2841 15.125H33.6018"
            stroke="black"
            strokeWidth="1.93553"
            strokeLinecap="round"
          />
          <path
            d="M29.2461 9.52344L34.162 14.4394C34.54 14.8173 34.54 15.4301 34.162 15.808L29.2461 20.724"
            stroke="black"
            strokeWidth="1.93553"
            strokeLinecap="round"
          />
          <path
            d="M34.8467 24.4537V27.7041C34.8467 30.3766 32.6803 32.543 30.0079 32.543H13.6901"
            stroke="black"
            strokeWidth="1.93553"
            strokeLinecap="round"
          />
          <path
            d="M18.0459 38.1445L13.13 33.2286C12.752 32.8506 12.752 32.2379 13.13 31.86L18.0459 26.944"
            stroke="black"
            strokeWidth="1.93553"
            strokeLinecap="round"
          />
        </svg>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-[90%] top-0 -translate-y-[65%]"
        >
          <path
            d="M6.23701 -0.000172048L6.99138 3.41277C7.16865 4.21479 7.79502 4.84117 8.59704 5.01844L12.01 5.7728L8.59704 6.52716C7.79502 6.70443 7.16864 7.33081 6.99138 8.13283L6.23701 11.5458L5.48265 8.13283C5.30538 7.33081 4.679 6.70443 3.87699 6.52716L0.464039 5.7728L3.87699 5.01844C4.679 4.84117 5.30538 4.21479 5.48265 3.41277L6.23701 -0.000172048Z"
            fill="#D5FF5C"
          />
        </svg>
      </div>
    </div>
    <div>
      <h4 className="text-center text-[14px] font-bold">Seamless cross-chain swaps</h4>
      <p className="text-center text-[14px] text-gray-400">
        Swap assets effortlessly across different chains and enjoy the convenience of comparing providers.
      </p>
    </div>
  </div>
)
