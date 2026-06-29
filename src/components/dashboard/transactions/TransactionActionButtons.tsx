import React from 'react';
import Link from 'next/link';
import { Printer, FileText, FileSpreadsheet } from 'lucide-react';

export const TransactionActionButtons: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-[1100px] border-t border-neutral-200/80 pt-8 mt-4">
      
      {/* Left Print & Download Action Group */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Print Button */}
        <button className="h-12 px-6 bg-[#F4ECFF] hover:bg-[#ebdfff] text-[#6312E1] font-bold text-sm rounded-xl flex items-center gap-2.5 transition-colors select-none">
          <Printer className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span>Print</span>
        </button>

        {/* Download PDF Button */}
        <button className="h-12 px-6 bg-[#C6F7D0] hover:bg-[#b3f2be] text-[#168E33] font-bold text-sm rounded-xl flex items-center gap-2.5 transition-colors select-none">
          <FileText className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span>Download PDF</span>
        </button>

        {/* Download CSV Button */}
        <button className="h-12 px-6 bg-[#C6F7D0] hover:bg-[#b3f2be] text-[#168E33] font-bold text-sm rounded-xl flex items-center gap-2.5 transition-colors select-none">
          <FileSpreadsheet className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span>Download CSV</span>
        </button>
      </div>

      {/* Right Close Navigation Group */}
      <Link href="/dashboard/transactions">
        <button className="w-full md:w-auto h-12 px-8 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-sm rounded-xl transition-colors select-none">
          Close
        </button>
      </Link>
      
    </div>
  );
};