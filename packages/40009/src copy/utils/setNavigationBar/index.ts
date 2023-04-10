export interface NavigationBarOptions {
  title?: string;
  fontColor?: string;
  backgroundColor?: string;
}

export default (options: NavigationBarOptions) =>
  (document.title = options.title || '');
