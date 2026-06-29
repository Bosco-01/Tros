export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

export const mockFAQs: FAQItemData[] = [
  {
    id: '1',
    question: 'How do I register for an event?',
    answer: "To register for an event, browse our events page, select the event you're interested in, and click the \"Register\" or \"Book Now\" button.",
  },
  {
    id: '2',
    question: 'What is the refund policy?',
    answer: 'Refunds are available up to 48 hours before the event start time. Contact support for assistance.',
  },
];