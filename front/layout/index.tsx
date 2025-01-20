export default function Layout({ children }) {
  return (
    <>
      <div className="section" style={{ flexDirection: 'column' }}>
        {children}
      </div>
    </>
  );
}