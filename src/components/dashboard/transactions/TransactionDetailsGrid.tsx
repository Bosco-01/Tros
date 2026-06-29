import React from 'react';
import { TransactionDetailsData } from '@/data/transaction-details';

interface TransactionDetailsGridProps {
  data: TransactionDetailsData;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[15px] font-medium text-neutral-500">{label}</label>
    <div className="bg-white rounded-xl px-5 py-4 text-[16px] font-bold text-neutral-900 w-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/45">
      {value}
    </div>
  </div>
);

export const TransactionDetailsGrid: React.FC<TransactionDetailsGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 w-full max-w-[1100px]">
      <Field label="Transaction ID" value={`#${data.id}`} />
      <Field label="Customer Name" value={data.customerName} />
      <Field label="Event Category" value={data.eventCategory} />
      <Field label="Event Title" value={data.eventTitle} />
      <Field label="Amount" value={data.amount} />
      <Field label="Date" value={data.date} />
      <Field label="Payment Type" value={data.paymentType} />
      <Field label="Payment Status" value={data.paymentStatus} />
    </div>
  );
};