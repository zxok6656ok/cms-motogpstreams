
import { Metadata } from "next";
import Dashboard from "./dashboard/page"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Admin",
  },
};
const page = () => {
  return (
    <Dashboard />
  )
}

export default page