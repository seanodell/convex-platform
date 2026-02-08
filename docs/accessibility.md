# Accessibility

This project implements WCAG 2.1 Level AA accessibility standards to ensure the application is usable by everyone, including people with disabilities who use assistive technologies like screen readers and keyboard-only navigation.

## Skip Navigation

Skip navigation links allow keyboard users to bypass repetitive navigation elements and jump directly to the main content. This is a WCAG 2.4.1 Level A requirement.

### How It Works

When a keyboard user presses **Tab** on any page, a "Skip to main content" link appears at the top of the screen. Pressing **Enter** moves focus directly to the main content area, bypassing the header and navigation.

### Implementation

The skip navigation system consists of two components:

**1. SkipLink Component** ([components/SkipLink.tsx](../components/SkipLink.tsx))

The skip link is visually hidden by default and only appears when focused:

```tsx
<SkipLink />
```

Added to the root layout, it becomes the first focusable element on every page.

**2. MainContent Component** ([components/MainContent.tsx](../components/MainContent.tsx))

Wraps page content with proper accessibility semantics:

```tsx
<MainContent>
  <YourPageContent />
</MainContent>
```

Benefits:

- Provides the `id="main-content"` anchor automatically
- Uses semantic `<main>` element for landmark navigation
- Makes content programmatically focusable for assistive technologies

### For New Pages

When creating a new page, simply wrap your content with `MainContent`:

```tsx
import { MainContent } from "@/components/MainContent";

export default function NewPage() {
  return (
    <MainContent>
      <div className="p-8">{/* Your page content */}</div>
    </MainContent>
  );
}
```

The skip navigation will work automatically - no additional configuration needed!

## Color Contrast

All text and interactive elements meet WCAG AA contrast requirements:

- Normal text: 4.5:1 minimum contrast ratio
- Large text (18pt+): 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio

The color choices throughout the application have been verified to meet these standards in both light and dark modes.

## Keyboard Navigation

All interactive elements (buttons, links, form controls) are fully keyboard accessible:

- **Tab** / **Shift+Tab**: Navigate forward/backward through focusable elements
- **Enter** / **Space**: Activate buttons and links
- **Escape**: Close modals and popovers
- **Arrow keys**: Navigate within components (where appropriate)

Focus indicators are clearly visible to show which element currently has keyboard focus.

## Automated Testing

The E2E test suite includes accessibility checks using [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright):

```bash
npm run test:e2e
```

These tests automatically scan every page for common accessibility violations and will fail the build if issues are found.

## Accessibility Checklist

When developing new features, ensure:

- [ ] All images have descriptive `alt` text
- [ ] Forms have proper `<label>` elements or `aria-label` attributes
- [ ] Interactive elements are keyboard accessible
- [ ] Color is not the only way to convey information
- [ ] Text has sufficient color contrast
- [ ] Headings follow a logical hierarchy (h1 → h2 → h3)
- [ ] Dynamic content updates announce to screen readers (using ARIA live regions when needed)
- [ ] Page content is wrapped in `<MainContent>` component

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
