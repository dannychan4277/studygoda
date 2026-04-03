/**
 * Quiz layout — hides the BottomTabBar for full-screen immersive experience.
 * Overrides the root layout's bottom padding on mobile.
 */
export default function QuizLayout({ children }) {
  return (
    <>
      <style>{`
        nav[aria-label="主要導覽"] { display: none !important; }
        @media (max-width: 767px) {
          body { padding-bottom: 0 !important; }
        }
      `}</style>
      {children}
    </>
  );
}
