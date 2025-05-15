declare module 'react-dom/client' {
  import { Root } from 'react-dom/client';
  export function createRoot(container: Element | DocumentFragment): Root;
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
} 