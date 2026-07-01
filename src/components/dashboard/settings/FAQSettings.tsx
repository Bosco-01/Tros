'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import type { FAQItem } from '@/types/admin';

export const FAQSettings: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const faqKey = (faq: FAQItem) => faq.faq_id || faq.id || '';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listFAQs();
      setFaqs(unwrapList(res) as FAQItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAddFaq = async () => {
    setSavingId('new');
    setError('');
    try {
      await adminService.createFAQ({
        question: 'New Question Title',
        answer: 'Type the helpful answer description here.',
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add FAQ');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setSavingId(id);
    setError('');
    try {
      await adminService.deleteFAQ(id);
      setFaqs((prev) => prev.filter((f) => faqKey(f) !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete FAQ');
    } finally {
      setSavingId(null);
    }
  };

  const handleStartEdit = (faq: FAQItem) => {
    setEditingId(faqKey(faq));
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleSaveEdit = async (id: string) => {
    setSavingId(id);
    setError('');
    try {
      await adminService.updateFAQ(id, {
        question: editQuestion,
        answer: editAnswer,
        is_active: true,
      });
      setFaqs((prev) =>
        prev.map((f) => (faqKey(f) === id ? { ...f, question: editQuestion, answer: editAnswer } : f)),
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save FAQ');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-50 pb-4 mb-2 select-none">
        <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none">FAQS</h3>
        <button
          onClick={handleAddFaq}
          disabled={savingId === 'new'}
          className="h-10 px-6 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-60 text-white text-[13px] font-bold rounded-xl transition-colors select-none shadow-sm shadow-[#6312E1]/10"
        >
          {savingId === 'new' ? 'Adding...' : 'Add New Faq'}
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold self-start">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <svg className="animate-spin h-8 w-8 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : faqs.length === 0 ? (
        <p className="text-sm text-neutral-500 py-8 text-center">No FAQs yet. Add one to get started.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {faqs.map((faq) => {
            const id = faqKey(faq);
            const isEditing = editingId === id;
            return (
              <div
                key={id}
                className="border border-neutral-200/70 rounded-2xl p-6 flex flex-col gap-3 hover:border-neutral-300 transition-colors bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                {isEditing ? (
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
                      className="border border-neutral-200 rounded-lg p-2.5 text-neutral-700 text-sm focus:outline-none focus:border-[#6312E1] resize-none"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSaveEdit(id)}
                        disabled={savingId === id}
                        className="h-9 px-5 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-60 text-white text-[13px] font-bold rounded-lg transition-colors"
                      >
                        {savingId === id ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="h-9 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-[15px] font-bold text-neutral-900">{faq.question}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(faq)}
                          className="text-[13px] font-semibold text-[#6312E1] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={savingId === id}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                          aria-label="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
