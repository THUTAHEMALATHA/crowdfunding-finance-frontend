import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
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

  const handleDonate = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(donationAmount),
        projectId: id,
      }),
    });

    const order = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "FundSpark",
      description: "Donation",
      order_id: order.id,

      handler: function (response) {
        alert("Payment Successful");
        console.log("payment Id:", response.razorpay_payment_id);
        console.log("order Id:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);
      },

      prefill: {
        name: "Test User",
        email: "test@test.com",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

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

  const isGoalReached =
    project &&
    Number(project?._raised) >= Number(project.funding_goal);

  const percent = Math.min(
    ((project?._raised || 0) / project?.funding_goal) * 100,
    100
  );

  return (
    <div className="min-h-screen text-white p-6">
      <div className="grid lg:grid-cols-3 gap-8">
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

        {/* RIGHT */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 h-fit sticky top-6">
          <div className="text-2xl font-bold mb-2">₹{project?._raised}</div>

          <div className="text-gray-400 mb-4">
            raised of ₹{project?.funding_goal}
          </div>

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

          <button
            onClick={handleDonate}
            disabled={isGoalReached}
            className={`w-full py-3 mt-2 rounded-lg font-semibold text-white transition
              ${
                isGoalReached
                  ? "bg-gray-500 opacity-50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isGoalReached ? "Goal Reached" : "Donate Now"}
          </button>

          <button
            onClick={handleShare}
            className="w-full border border-gray-700 hover:border-gray-500 rounded-xl py-3 mt-3"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;