export interface MenuDir<T> {
  name: string,
  type: 'dir',
  children: (MenuDir<T> | T)[],
}
