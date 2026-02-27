import { useState } from "react";
import { apiFetch } from "../lib/api";
import { toast } from "react-toastify";

const CreateProject = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    funding_goal: "",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error("Please login first");
    }

    try {
      await apiFetch("/api/projects/create", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          creator_id: user.id,
          funding_goal: Number(form.funding_goal),
        }),
      });

      toast.success("Project created");
    } catch {
      toast.error("Create failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-white">
          Create Project
        </h2>

        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Title"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Image URL"
          onChange={(e) =>
            setForm({ ...form, image_url: e.target.value })
          }
        />

        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Category"
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Funding Goal"
          onChange={(e) =>
            setForm({ ...form, funding_goal: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 py-3 rounded-lg text-white font-semibold">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;