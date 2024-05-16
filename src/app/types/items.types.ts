export type Item = {
  id: number,
  title: string,
  completed: boolean,
  count: number,
};

export type Visibility = 'all' | 'active' | 'completed';
