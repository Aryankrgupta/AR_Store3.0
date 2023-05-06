import AdminStatus from "@/components/AdminStats";
import Layout from "@/components/layout";
import LoginHeader from "@/components/loginHeader";

export default function Home() {
  return <Layout>
    <LoginHeader />
    <AdminStatus />
</Layout>
}
