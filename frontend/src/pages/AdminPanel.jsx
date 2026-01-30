// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// const STORAGE_KEY = "medlens_admin_camps_v1";

// const emptyForm = { title: "", date: "", location: "", capacity: "", description: "" };

// const AdminPanel = () => {
//   const navigate = useNavigate();
//   const [camps, setCamps] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingIndex, setEditingIndex] = useState(-1);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) setCamps(JSON.parse(raw));
//     } catch (e) {
//       console.error("Failed to load camps from storage", e);
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(camps));
//     } catch (e) {
//       console.error("Failed to save camps to storage", e);
//     }
//   }, [camps]);

//   const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.title || !form.date || !form.location) return; // minimal validation

//     if (editingIndex >= 0) {
//       const next = [...camps];
//       next[editingIndex] = { ...next[editingIndex], ...form };
//       setCamps(next);
//       setEditingIndex(-1);
//     } else {
//       setCamps([{ ...form, id: Date.now() }, ...camps]);
//     }
//     setForm(emptyForm);
//   };

//   const handleEdit = (idx) => {
//     setEditingIndex(idx);
//     setForm(camps[idx]);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = (idx) => {
//     if (!confirm("Delete this camp?")) return;
//     setCamps(camps.filter((_, i) => i !== idx));
//   };

//   const move = (idx, dir) => {
//     const next = [...camps];
//     const swap = idx + dir;
//     if (swap < 0 || swap >= next.length) return;
//     [next[idx], next[swap]] = [next[swap], next[idx]];
//     setCamps(next);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
//       <div className="max-w-5xl mx-auto bg-card/95 backdrop-blur p-6 rounded-lg border">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold">Admin Panel — Health Camps</h1>
//           <div className="space-x-2">
//             <Button variant="secondary" onClick={() => navigate('/')}>View Site</Button>
//             <Button onClick={() => navigate('/login')}>Sign out</Button>
//           </div>
//         </div>

//         {/* Create / Edit Form */}
//         <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-2 space-y-2">
//             <div>
//               <Label>Title</Label>
//               <Input value={form.title} onChange={handleChange("title")} placeholder="Free Health Camp" required />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <div>
//                 <Label>Date</Label>
//                 <Input type="date" value={form.date} onChange={handleChange("date")} required />
//               </div>
//               <div>
//                 <Label>Location</Label>
//                 <Input value={form.location} onChange={handleChange("location")} placeholder="Community Center" required />
//               </div>
//               <div>
//                 <Label>Capacity</Label>
//                 <Input value={form.capacity} onChange={handleChange("capacity")} placeholder="100" />
//               </div>
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Textarea value={form.description} onChange={handleChange("description")} placeholder="Short description" />
//             </div>
//           </div>

//           <div className="flex flex-col justify-between">
//             <div>
//               <div className="mb-2 text-sm text-muted-foreground">Create or edit a health camp that will be shown to users.</div>
//               <Button type="submit" className="w-full mb-2">{editingIndex >= 0 ? "Save Changes" : "Create Camp"}</Button>
//               {editingIndex >= 0 && (
//                 <Button variant="ghost" onClick={() => { setEditingIndex(-1); setForm(emptyForm); }} className="w-full">Cancel Edit</Button>
//               )}
//             </div>
//             <div className="mt-4 text-xs text-muted-foreground">Changes are saved to browser storage.</div>
//           </div>
//         </form>

//         {/* Camps List */}
//         <section>
//           <h2 className="text-lg font-semibold mb-3">Existing Camps ({camps.length})</h2>
//           {camps.length === 0 && <div className="p-4 border rounded text-muted-foreground">No camps yet. Use the form above to create one.</div>}

//           <div className="space-y-3">
//             {camps.map((camp, idx) => (
//               <div key={camp.id || idx} className="p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <div className="flex items-center space-x-3">
//                     <div className="font-semibold">{camp.title}</div>
//                     <div className="text-sm text-muted-foreground">• {camp.date} • {camp.location}</div>
//                   </div>
//                   <div className="text-sm mt-2 text-muted-foreground">{camp.description}</div>
//                 </div>

//                 <div className="mt-3 md:mt-0 flex items-center space-x-2">
//                   <Button size="sm" variant="ghost" onClick={() => move(idx, -1)}>Move Up</Button>
//                   <Button size="sm" variant="ghost" onClick={() => move(idx, 1)}>Move Down</Button>
//                   <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>Edit</Button>
//                   <Button size="sm" variant="destructive" onClick={() => handleDelete(idx)}>Delete</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "medlens_admin_camps_v1";

const emptyForm = {
  title: "",
  date: "",
  location: "",
  capacity: "",
  description: "",
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingIndex, setEditingIndex] = useState(-1);

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    try {
      const user = localStorage.getItem("currentUser");
      if (!user) {
        navigate("/login", { replace: true });
      }
    } catch (e) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* LOAD CAMPS */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCamps(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load camps", e);
    }
  }, []);

  /* SAVE CAMPS */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(camps));
    } catch (e) {
      console.error("Failed to save camps", e);
    }
  }, [camps]);

  const handleChange = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) return;

    if (editingIndex >= 0) {
      const next = [...camps];
      next[editingIndex] = { ...next[editingIndex], ...form };
      setCamps(next);
      setEditingIndex(-1);
    } else {
      setCamps([{ ...form, id: Date.now() }, ...camps]);
    }
    setForm(emptyForm);
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setForm(camps[idx]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (idx) => {
    if (!confirm("Delete this camp?")) return;
    setCamps(camps.filter((_, i) => i !== idx));
  };

  const move = (idx, dir) => {
    const next = [...camps];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setCamps(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
      <div className="max-w-5xl mx-auto bg-card/95 backdrop-blur p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Admin Panel — Health Camps
          </h1>
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => navigate("/")}>
              View Site
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("currentUser");
                navigate("/login");
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        {/* Create / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="md:col-span-2 space-y-2">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={handleChange("title")}
                placeholder="Free Health Camp"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={handleChange("date")}
                  required
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={handleChange("location")}
                  placeholder="Community Center"
                  required
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input
                  value={form.capacity}
                  onChange={handleChange("capacity")}
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Short description"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <Button type="submit" className="w-full mb-2">
                {editingIndex >= 0 ? "Save Changes" : "Create Camp"}
              </Button>

              {editingIndex >= 0 && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setEditingIndex(-1);
                    setForm(emptyForm);
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Camps List */}
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Existing Camps ({camps.length})
          </h2>

          {camps.length === 0 && (
            <div className="p-4 border rounded text-muted-foreground">
              No camps yet.
            </div>
          )}

          <div className="space-y-3">
            {camps.map((camp, idx) => (
              <div
                key={camp.id || idx}
                className="p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold">{camp.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {camp.date} • {camp.location}
                  </div>
                  <div className="text-sm mt-2 text-muted-foreground">
                    {camp.description}
                  </div>
                </div>

                <div className="mt-3 md:mt-0 flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => move(idx, -1)}>
                    Up
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => move(idx, 1)}>
                    Down
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(idx)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
