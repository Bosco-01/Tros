'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/services/apiClient';
import { FAQItemData } from '@/data/faqs';

export const FAQSettings: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchFAQs = async () => {
    try {
      // 1. Calls GET /admin/faqs
      const response = await apiFetch<{ faqs?: FAQItemData[] }>('/admin/faqs');
      if (response.faqs && response.faqs.length > 0) {
        setFaqs(response.faqs);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      console.warn('Backend /admin/faqs unreachable.');
      setFaqs([]);
      setError('Failed to load FAQs from the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleAddFaq = async () => {
    setError('');
    setSuccess('');
    setActionLoading('add');

    try {
      const payload = {
        question: 'New Question Title',
        answer: 'Type the helpful answer description here.',
        sort_order: faqs.length + 1,
      };

      // 2. Calls POST /admin/faqs to register a new FAQ in database
      const response = await apiFetch<any>('/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const newFaqId = response?.faq_id || (faqs.length + 1).toString();
      const newFaq: FAQItemData = {
        id: newFaqId,
        question: payload.question,
        answer: payload.answer,
      };

      setFaqs([...faqs, newFaq]);
      handleStartEdit(newFaq);
      setSuccess('FAQ template created! You can now edit its text below.');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to create FAQ entry on the backend.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartEdit = (faq: FAQItemData) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleSaveEdit = async (id: string) => {
    setError('');
    setSuccess('');
    setActionLoading(id);

    const cleanId = id.replace('#', '').trim();

    try {
      // 3. Calls PATCH /admin/faqs/{faqId} to edit the FAQ details
      await apiFetch(`/admin/faqs/${cleanId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          question: editQuestion,
          answer: editAnswer,
          sort_order: 1,
          is_active: true,
        }),
      });

      setFaqs(
        faqs.map((faq) =>
          faq.id === id ? { ...faq, question: editQuestion, answer: editAnswer } : faq
        )
      );
      setEditingId(null);
      setSuccess('FAQ entry saved successfully!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to update FAQ entry.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ entry?')) return;
    setError('');
    setSuccess('');
    setActionLoading(id);

    const cleanId = id.replace('#', '').trim();

    try {
      // 4. Calls DELETE /admin/faqs/{faqId} to remove the FAQ from database
      await apiFetch(`/admin/faqs/${cleanId}`, {
        method: 'DELETE',
      });

      setFaqs(faqs.filter((faq) => faq.id !== id));
      setSuccess('FAQ entry deleted successfully!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to delete FAQ entry.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex items-center justify-center h-64 select-none">
        <svg className="animate-spin h-8 w-8 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex flex-col gap-6">
      
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-50 pb-4 mb-2 select-none">
        <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none">
          FAQS
        </h3>
        
        {/* Create FAQ Trigger Button */}
        <button
          onClick={handleAddFaq}
          disabled={actionLoading === 'add'}
          className="h-10 px-6 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-50 text-white text-[13px] font-bold rounded-xl transition-colors select-none shadow-sm shadow-[#6312E1]/10 flex items-center justify-center min-w-[120px]"
        >
          {actionLoading === 'add' ? 'Creating...' : 'Add New Faq'}
        </button>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold transition-all">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all">
          {error}
        </div>
      )}

      {/* FAQ Items Stack */}
      <div className="flex flex-col gap-6">
        {faqs.map((faq) => {
          const isEditing = editingId === faq.id;
          const isProcessing = actionLoading === faq.id;
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
                    className="border border-neutral-200 rounded-lg p-2.5 font-bold text-neutral-900 text-sm focus:outline-none focus:border-[#6312E1] w-full"
                  />
                  <textarea
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    rows={3}
                    className="border border-neutral-200 rounded-lg p-2.5 text-sm text-neutral-600 font-medium focus:outline-none focus:border-[#6312E1] w-full resize-none"
                  />
                  <div className="flex gap-2.5 mt-1 select-none">
                    <button
                      onClick={() => handleSaveEdit(faq.id)}
                      disabled={isProcessing}
                      className="px-4 py-1.5 bg-[#BEF2CB] text-[#168E33] font-bold text-xs rounded-lg hover:bg-[#a6f0b8] transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Saving...' : 'Apply'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1.5 bg-neutral-100 text-neutral-700 font-bold text-xs rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Static Details State */
                <>
                  <h4 className="text-base font-bold text-neutral-900">
                    {faq.question}
                  </h4>
                  <p className="text-sm font-medium text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                  
                  {/* Actions Link Controls */}
                  <div className="flex items-center gap-4 mt-2 text-sm font-bold select-none">
                    <button
                      onClick={() => handleStartEdit(faq)}
                      disabled={isProcessing}
                      className="text-[#6312E1] hover:text-[#520cbd] transition-colors focus:outline-none disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      disabled={isProcessing}
                      className="text-[#D82F2F] hover:text-[#b41e1e] transition-colors focus:outline-none disabled:opacity-50"
                    >
                      {isProcessing ? 'Deleting...' : 'Delete'}
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