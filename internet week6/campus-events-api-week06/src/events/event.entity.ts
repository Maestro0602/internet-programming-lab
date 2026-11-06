export const CATEGORIES = ['talk', 'workshop', 'social', 'sport'] as const;
export type Category = (typeof CATEGORIES)[number];

// The shape the API returns. Same fields as CampusEvent in the Vue app.
export interface CampusEvent {
  id: number;
  title: string;
  category: Category;
  startsAt: string; // ISO date
  location: string;
  capacity: number;
  booked: number;
  description: string;
}
