import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import axios from "axios";
import { useState, useEffect } from "react";
import { withSwal } from "react-sweetalert2";

function Admins({ swal }) {
  const [email, setEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  function addAdmin(ev) {
    ev.preventDefault();
    axios.post("/api/admin", { email }).then((res) => {
      console.log(res.data);
      swal.fire({
        title: "Admin Created :)",
        icon: "success",
      });
      setEmail("");
      newAdminEmail();
    }).catch(err => {
        swal.fire({
            title: "Error",
            text: err.response.data.message,
            icon: "error",
        });
      })
  }
  function newAdminEmail() {
    setIsLoading(true);
    axios.get("/api/admin").then((res) => {
      setAdminEmail(res.data);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    newAdminEmail();
  }, []);

  function deleteAdmin(_id, email) {
    swal
      .fire({
        title: "Are you sure",
        text: `Do you want to delete ${email}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios.delete("/api/admin?_id=" + _id).then(() => {
            swal.fire({
              title: "Admin deleted!",
              icon: "success",
            });
            newAdminEmail();
          })
        }
      });
  }

  return (
    <Layout>
      <h1>Admins</h1>
      <h2>Add new Admin</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="text"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="mb-0"
            placeholder="google email"
          />

          <button type="submit" className="btn-primary py-1 whitespace-nowrap">
            Save
          </button>
        </div>
      </form>
      <h2>Existing Admins</h2>
      <table className="basic">
        <thead>
          <tr>
            <th>Admin's Google Email</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
        </thead>
        <tbody>
          {adminEmail.length > 0 &&
            adminEmail.map((email) => (
              <tr>
                <td>{email.email}</td>
                <td>{new Date(email.createdAt).toLocaleString()}</td>
                <button
                  className="btn-red ml-4"
                  onClick={() => deleteAdmin(email._id, email.email)}
                >
                  Delete
                </button>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }) => <Admins swal={swal} />);
