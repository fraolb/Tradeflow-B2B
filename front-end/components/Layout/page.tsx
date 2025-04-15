import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div
        style={{ backgroundColor: "rgb(213,237,213)" }}
        className="overflow-hidden flex flex-col min-h-screen"
      >
        <Header />
        <div className="p-2 px-4 pb-16 w-full md:w-1/3 mx-auto space-y-8">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
