export const SwapDetailsPlaceholder: React.FC = () => (
  <div className="flex items-center justify-center gap-[8px] flex-col border-gray-800 border rounded-[8px] p-[16px] py-[12px]">
    <svg width="97" height="96" viewBox="0 0 97 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="48.5" cy="48" r="48" fill="url(#paint0_linear_3285_23038)" fillOpacity="0.04" />
      <path
        d="M26 38L34 30M34 30L42 38M34 30V58C34 60.1217 34.8429 62.1566 36.3431 63.6569C37.8434 65.1571 39.8783 66 42 66H46M70 58L62 66M62 66L54 58M62 66V38C62 35.8783 61.1571 33.8434 59.6569 32.3431C58.1566 30.8429 56.1217 30 54 30H50"
        stroke="url(#paint1_linear_3285_23038)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3285_23038"
          x1="82.3182"
          y1="-10.6667"
          x2="0.418275"
          y2="80.193"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF519F" />
          <stop offset="1" stopColor="#47DC94" />
        </linearGradient>
        <linearGradient id="paint1_linear_3285_23038" x1="63.5" y1="26" x2="34" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF519F" />
          <stop offset="1" stopColor="#47DC94" />
        </linearGradient>
      </defs>
    </svg>
    <div>
      <h4 className="font-bold text-[14px] text-center">Seamless native cross-chain swaps</h4>
      <p className="text-gray-400 text-[14px] text-center">
        Swap assets effortlessly across different chains and enjoy the convenience of fire-and-forget transactions.
      </p>
    </div>
  </div>
)
