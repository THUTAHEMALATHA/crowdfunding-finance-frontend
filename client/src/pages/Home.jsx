import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("new");

  useReveal();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiFetch("/api/projects");
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch = p.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "all" || p.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "goal") return b.funding_goal - a.funding_goal;
      if (sortBy === "popular") return b.amount_raised - a.amount_raised;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 reveal">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#111827] border border-gray-800 rounded-2xl p-4 animate-pulse"
            >
              <div className="h-40 bg-gray-800 rounded-xl mb-4" />
              <div className="h-4 bg-gray-800 rounded mb-2" />
              <div className="h-4 bg-gray-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col items-center px-4 py-24">

      {/* ================= HERO ================= */}
      <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden bg-[#020617] flex flex-col justify-center items-center text-center py-24 mb-16">

        {/* ORB 1 */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[320px] h-[320px] rounded-full blur-[80px] bg-blue-500/40 animate-pulse" />

        {/* ORB 2 */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[320px] h-[320px] rounded-full blur-[80px] bg-purple-500/40 animate-pulse" />

        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-5 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Fund the Future
          </h1>

          <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed">
            Discover innovative projects, support creators, and bring bold ideas to life.
          </p>
        </div>
      </div>
      {/* ================= END HERO ================= */}

      {/* DISCOVER */}
      <div className="mt-2 mb-10 flex justify-center w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          <span className="typewriter inline-block">Discover Projects</span>
        </h2>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="w-full max-w-6xl mx-auto mb-10 grid gap-4 md:grid-cols-3">
        <input
          placeholder="Search projects..."
          className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="tech">Technology</option>
          <option value="health">Healthcare</option>
          <option value="education">Education</option>
          <option value="environment">Environment</option>
        </select>

        <select
          className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="new">Newest</option>
          <option value="popular">Most Funded</option>
          <option value="goal">Highest Goal</option>
        </select>
      </div>

      {/* PROJECT GRID */}
      {filteredProjects.length === 0 ? (
        <p className="text-gray-400 text-center">No projects yet.</p>
      ) : (
        <div className="w-full max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const percent = Math.min(
              (project.amount_raised / project.funding_goal) * 100,
              100
            );

            return (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-4 hover:border-gray-600 transition"
              >
                <div className="h-40 bg-gray-800 rounded-xl mb-4 overflow-hidden">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                  {project.title}
                </h2>

                <div className="w-full bg-gray-800 h-2 rounded-full mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-sm text-gray-400">
                  ₹{project.amount_raised} raised of ₹{project.funding_goal}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ================= SUCCESS STORIES ================= */}
<div className="mt-24 max-w-6xl mx-auto w-full">
  <h2 className="text-3xl font-bold mb-10 text-center">
    Success Stories
  </h2>

  <div className="grid gap-6 md:grid-cols-3">

    {/* Card 1 */}
    <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:scale-[1.02] transition">
      <img
        src="https://images.unsplash.com/photo-1509395176047-4a66953fd231"
        alt="Solar Smart Charger"
        className="h-40 w-full object-cover"
      />
      <div className="p-6">
        <div className="text-lg font-semibold mb-2">
          Solar Smart Charger
        </div>
        <p className="text-gray-400 text-sm">
          Raised ₹1,20,000 from 540 backers and successfully launched.
        </p>
      </div>
    </div>

    {/* Card 2 */}
    <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:scale-[1.02] transition">
      <img
        src="https://images.unsplash.com/photo-1526406915894-7bcd65f60845"
        alt="Eco Water Bottle"
        className="h-40 w-full object-cover"
      />
      <div className="p-6">
        <div className="text-lg font-semibold mb-2">
          Eco Water Bottle
        </div>
        <p className="text-gray-400 text-sm">
          Fully funded in 3 days with overwhelming community support.
        </p>
      </div>
    </div>

    {/* Card 3 */}
    <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:scale-[1.02] transition">
      <img
        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd"
        alt="ConnectHub Platform"
        className="h-40 w-full object-cover"
      />
      <div className="p-6">
        <div className="text-lg font-semibold mb-2">
          ConnectHub Platform
        </div>
        <p className="text-gray-400 text-sm">
          Built a global creator community with 2,000+ early adopters.
        </p>
      </div>
    </div>

  </div>
</div>
{/* ================= END SUCCESS ================= */}

    </section>
  );
};

export default Home;