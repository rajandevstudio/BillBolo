import Footer from "../components/layout/Footer";
import MaxWidth from "../components/layout/MaxWidth";
import Navbar from "../components/layout/NavBar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        <MaxWidth>{children}</MaxWidth>
        </main>
      <Footer />
    </>
  );
}
