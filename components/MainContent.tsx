import { ReactNode } from "react";

/**
 * Main Content Wrapper
 *
 * Wraps page content with proper accessibility semantics:
 * - Provides skip navigation target via id="main-content"
 * - Uses semantic <main> element for landmark navigation
 * - Makes content programmatically focusable (tabIndex={-1})
 *
 * Usage:
 *   <MainContent>
 *     <YourPageContent />
 *   </MainContent>
 *
 * This ensures all pages have consistent skip navigation support
 * without developers needing to remember the implementation details.
 */
export function MainContent({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
  );
}
