export interface Offer {
  id: string;
  /** Large headline value, e.g. "10%". */
  highlight: string;
  title: string;
  description: string;
  code: string;
  order: number;
}
