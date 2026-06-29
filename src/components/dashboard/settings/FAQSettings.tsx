'use client';

import React, { useState } from 'react';
import { FAQItemData, mockFAQs } from '@/data/faqs';

export const FAQSettings: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItemData[]>(mockFAQs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const handleAddFaq = () => {
    const newId = (faqs.length + 1).toString();
    const newFaq: FAQItemData = {
      id: newId,
      question: 'New Question Title',
      answer: 'Type the helpful answer description here.',
    };
    setFaqs([...faqs, newFaq]);
    handleStartEdit(newFaq);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const handleStartEdit = (faq: FAQItemData) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleSaveEdit = (id: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, question: editQuestion, answer: editAnswer } : faq
      )
    );
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex flex-col gap-6">
      
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-50 pb-4 mb-2 select-none">
        <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none">
          FAQS
        </h3>
        
        {/* Purple Add New Faq Button */}
        <button
          onClick={handleAddFaq}
          className="h-10 px-6 bg-[#6312E1] hover:bg-[#520cbd] text-white text-[13px] font-bold rounded-xl transition-colors select-none shadow-sm shadow-[#6312E1]/10"
        >
          Add New Faq
        </button>
      </div>

      {/* FAQ Items Stack */}
      <div className="flex flex-col gap-6">
        {faqs.map((faq) => {
          const isEditing = editingId === faq.id;
          return (
            <div
              key={faq.id}
              className="border border-neutral-200/70 rounded-2xl p-6 flex flex-col gap-3 hover:border-neutral-300 transition-colors bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
            >
              {isEditing ? (
                /* Editable Inputs Form State */
                <div className="flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    className="border border-neutral-200 rounded-lg p-2.5 font-bold text-neutral-900 text-sm focus:outline-none focus:border-[#6312E1]"
                  />
                  <textarea
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    rows={3}
                    className="border border-neutral-100/80 rounded-lg p-2.5 text-sm text-neutral-600 font-medium focus:outline-none focus:border-[#6312E1]"
                  />
                  <div className="flex gap-2.5 mt-1">
                    <button
                      onClick={() => handleSaveEdit(idx)}
                      className="px-4 py-1.5 bg-[#BEF2CB] text-[#168E33] font-bold text-xs rounded-lg hover:bg-[#a6f0b8] transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="px-4 py-1.5 bg-neutral-100 text-neutral-700 font-bold text-xs rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Render Static Attributes */
                <>
                  <h4 className="text-base font-bold text-neutral-900">
                    {faq.question}
                  </h4>
                  <p className="text-sm font-medium text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                  
                  {/* Actions links alignment */}
                  <div className="flex items-center gap-4 mt-2 text-sm font-bold select-none">
                    <button
                      onClick={() => handleStartEdit(faq)}
                      className="text-[#6312E1] hover:text-[#520cbd] transition-colors focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="text-[#D82F2F] hover:text-[#b41e1e] transition-colors focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {faqs.length === 0 && (
          <div className="w-full text-center py-12 text-neutral-500 text-sm font-medium border border-dashed border-neutral-200 rounded-2xl select-none">
            No FAQs available. Click &apos;Add New Faq&apos; above to create one.
          </div>
        )}
      </div>

    </div>
  );
};