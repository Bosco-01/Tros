export interface EventUserCardData {
  id: string;
  name: string;
  ticketQty: string;
  dateTime: string;
  avatarUrl: string;
}

export const mockEventUsers: EventUserCardData[] = Array(10).fill({
  name: 'Salome Dang',
  id: '#47364729495',
  ticketQty: '1 ticket',
  dateTime: 'Feb. 10th at 6:25pm',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop', // Hijab headshot placeholder matching Figma
});