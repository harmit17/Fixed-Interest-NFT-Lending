import Navbar from "./Navrbar";
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      {/* Footer */}
      {/* You can add more things here  */}
    </>
  );
}