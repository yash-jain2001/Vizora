import DashboardLayout from "../components/layout/DashboardLayout";

const Admin = () => {

  return (
    <DashboardLayout>

      <div className="text-white">

        <h1 className="text-5xl font-bold mb-6">
          Admin Panel
        </h1>

        <div className="bg-[#1F2937] p-8 rounded-2xl">

          <p className="text-xl">
            Only admins can access this page.
          </p>

        </div>

      </div>

    </DashboardLayout>
  )

}

export default Admin