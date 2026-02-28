import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user }=useAuth();

  const [project, setProject] = useState(null);
  const isGoalReached =
  project &&
  Number(project?.amount_raised) >=
  Number( project.funding_goal);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [comments, setComments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [activeTab, setActiveTab] = useState("rewards");
  const [newComment, setNewComment] = useState("");
  const [rewardForm, setRewardForm] = useState({
  title: "",
  description: "",
  amount: "",
});
   const [milestoneTitle, setMilestoneTitle] = useState("");
const [milestoneAmount, setMilestoneAmount] = useState("");


  useEffect(() => {
    fetchProject();
    fetchExtras();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await apiFetch(`/api/projects/${id}`);
      setProject(data.project);
    } catch (err) {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const fetchExtras = async () => {
  try {
    const [r, c, m] = await Promise.all([
      apiFetch(`/api/rewards/project/${id}`),
      apiFetch(`/api/comments/project/${id}`),
      apiFetch(`/api/milestones/project/${id}`),
    ]);

    setRewards(r.rewards || []);
    setComments(c.comments || []);
    setMilestones(m.milestones || []);
  } catch (err) {
    console.error(err.message);
  }
};

const handleComment = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return toast.error("Login to comment");
  if (!newComment.trim()) return;

  try {
    await apiFetch("/api/comments/create", {
      method: "POST",
      body: JSON.stringify({
        project_id: id,
        user_id: user.id,
        content: newComment,
      }),
    });

    setNewComment("");
    fetchExtras();
    toast.success("Comment added");
  } catch {
    toast.error("Failed to comment");
  }
};

// 
const handleAddReward = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return toast.error("Login required");
  if (user.id !== project.creator_id)
    return toast.error("Only creator can add rewards");

  try {
    await apiFetch("/api/rewards/create", {
      method: "POST",
      body: JSON.stringify({
        project_id: id,
        ...rewardForm,
        amount: Number(rewardForm.amount),
      }),
    });

    setRewardForm({ title: "", description: "", amount: "" });
    fetchExtras();
    toast.success("Reward added");
  } catch {
    toast.error("Failed to add reward");
  }
};
// 
const handleAddMilestone = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return toast.error("Login required");
  if (user.id !== project.creator_id)
    return toast.error("Only creator can add milestones");

  try {
    await apiFetch("/api/milestones/create", {
      method: "POST",
      body: JSON.stringify({
        project_id: id,
        title: milestoneTitle,
        unlock_amount: Number(milestoneAmount),
      }),
    });

    setMilestoneTitle("");
    setMilestoneAmount("");
    fetchExtras();
    toast.success("Milestone added");
  } catch {
    toast.error("Failed to add milestone");
  }
};
// 
const handleDonate = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔒 login check
  if (!user) {
    return toast.error("Please login to donate");
  }

  // 🔒 amount check
  if (!donationAmount) {
    return toast.error("Enter amount");
  }

  // 🔒 GOAL REACHED GUARD (frontend safety)
  if (project?.amount_raised >= project?.funding_goal) {
    return toast.error("Funding goal already reached");
  }

  try {
    await apiFetch("/api/donations/create", {
      method: "POST",
      body: JSON.stringify({
        project_id: id,
        user_id: user.id, // (backend ignore - OK)
        reward_id: null,
        amount: Number(donationAmount),
      }),
    });

    toast.success("Donation successful");
    setDonationAmount("");

    // 🔄 refresh project data
    await fetchProject();
  } catch (err) {
    // ✅ backend message show అవుతుంది
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Donation failed";

    toast.error(message);
  }
};

// 
  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      toast.error("Share failed");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-white">
        <p>Project not found</p>
      </div>
    );
  }

  const percent = Math.min(
  ((project?.amount_raised || 0) / project?.funding_goal) * 100,
  100
  );

  return (
    <div className="min-h-screen text-white p-6">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="h-64 bg-gray-800 rounded-2xl mb-6 overflow-hidden">
            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

          <p className="text-gray-300 whitespace-pre-line">
            {project.description}
          </p>
        </div>

{/* TABS */}
<div className="mt-10">
  <div className="flex gap-3 mb-6 flex-wrap">
    {["rewards", "comments", "milestones"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 rounded-lg border ${
          activeTab === tab
            ? "bg-blue-600 border-blue-600"
            : "border-gray-700"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* TAB CONTENT */}
  <div>
    {activeTab === "rewards" && (
      <div className="grid gap-4">
        {project?.creator_id ===
  JSON.parse(localStorage.getItem("user"))?.id && (
  <div className="mb-6 space-y-2">
    <input
      placeholder="Reward title"
      className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      value={rewardForm.title}
      onChange={(e) =>
        setRewardForm({ ...rewardForm, title: e.target.value })
      }
    />

    <input
      placeholder="Amount"
      type="number"
      className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      value={rewardForm.amount}
      onChange={(e) =>
        setRewardForm({ ...rewardForm, amount: e.target.value })
      }
    />

    <button
      onClick={handleAddReward}
      className="bg-blue-600 px-4 py-2 rounded"
    >
      Add Reward
    </button>
  </div>
)}
        {rewards.length === 0 ? (
          <p className="text-gray-400">No rewards yet.</p>
        ) : (
          rewards.map((r) => (
            <div
              key={r.id}
              className="bg-[#111827] border border-gray-800 rounded-xl p-4"
            >
              <div className="font-semibold">₹{r.amount}</div>
              <div className="text-gray-300">{r.title}</div>
              <div className="text-gray-500 text-sm">
                {r.description}
              </div>
            </div>
          ))
        )}
      </div>
    )}

    {activeTab === "comments" && (
      <div className="space-y-3">
        {/* comment box */}
<div className="mb-4">
  <textarea
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    placeholder="Write a comment..."
    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white mb-2"
  />
  <button
    onClick={handleComment}
    className="bg-blue-600 px-4 py-2 rounded-lg"
  >
    Post Comment
  </button>
</div>
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="bg-[#111827] border border-gray-800 rounded-xl p-3"
            >
              {c.content}
            </div>
          ))
        )}
      </div>
    )}

    {activeTab === "milestones" && (
      <div className="space-y-4">
        {project?.creator_id ===
  JSON.parse(localStorage.getItem("user"))?.id && (
  <div className="mb-6 space-y-2">
    <input
      placeholder="Milestone title"
      className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      value={milestoneTitle}
      onChange={(e) => setMilestoneTitle(e.target.value)}
    />

    <input
      placeholder="Unlock amount"
      type="number"
      className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      value={milestoneAmount}
      onChange={(e) => setMilestoneAmount(e.target.value)}
    />

    <button
      onClick={handleAddMilestone}
      className="bg-blue-600 px-4 py-2 rounded"
    >
      Add Milestone
    </button>
  </div>
)}
        {milestones.length === 0 ? (
          <p className="text-gray-400">No milestones yet.</p>
        ) : (
          milestones.map((m) => (
            <div
              key={m.id}
              className="bg-[#111827] border border-gray-800 rounded-xl p-4"
            >
              <div className="font-semibold">{m.title}</div>
              <div className="text-gray-400 text-sm">
                Unlock at ₹{m.unlock_amount}
              </div>
            </div>
          ))
        )}
      </div>
    )}
  </div>
</div>
        {/* RIGHT FUNDING CARD */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 h-fit sticky top-6">
          <div className="text-2xl font-bold mb-2">
            ₹{project?.amount_raised}
          </div>

          <div className="text-gray-400 mb-4">
            raised of ₹{project?.funding_goal}
          </div>

          {/* progress */}
          <div className="w-full bg-gray-800 h-3 rounded-full mb-6">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>

          <input
           type="number"
           placeholder="Enter amount"
           value={donationAmount}
           onChange={(e) => setDonationAmount(e.target.value)}
           className="w-full mb-3 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3"
          />
          
          {/* donate button */}
          <button
            disabled={isGoalReached}
             onClick={handleDonate}
          >
            {isGoalReached ? "Goal Reached" : "Donate Now"}
          </button>
          {!user && (
              <p className="text-xs text-gray-400 mt-1">
                 Login required to donate
              </p>
           )}

          {/* share */}
          <button
            onClick={handleShare}
            className="w-full border border-gray-700 hover:border-gray-500 rounded-xl py-3"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;