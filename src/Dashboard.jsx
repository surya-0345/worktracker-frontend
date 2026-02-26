import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard({ userEmail }) {
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Development");
  const [editId, setEditId] = useState(null);
  const [workLogs, setWorkLogs] = useState([]);

  useEffect(() => {
    if (userEmail) {
      fetchLogs();
    }
  }, [userEmail]);

  const fetchLogs = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/logs?email=${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setWorkLogs(res.data))
      .catch((err) => {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          toast.error("Session expired or invalid. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "/login";
        } else {
          toast.error("Failed to fetch logs.");
        }
      });
  };

  const handleAddOrUpdate = () => {
    if (!date || !task) {
      toast.error("Please fill in date and task.");
      return;
    }

    const logData = { date, task, category, userEmail };
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const handleError = (err) => {
      if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        toast.error("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "/login";
      } else {
        toast.error("Operation failed.");
      }
    };

    if (editId) {
      axios
        .put(`${API_BASE_URL}/api/logs/${editId}`, logData, config)
        .then(() => {
          toast.success("Log updated!");
          resetForm();
          fetchLogs();
        })
        .catch(handleError);
    } else {
      axios
        .post(`${API_BASE_URL}/api/logs`, logData, config)
        .then((res) => {
          setWorkLogs([...workLogs, res.data]);
          resetForm();
          toast.success("Log added!");
        })
        .catch(handleError);
    }
  };

  const handleEdit = (log) => {
    setDate(log.date);
    setTask(log.task);
    setCategory(log.category || "Development");
    setEditId(log.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this entry?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`${API_BASE_URL}/api/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setWorkLogs(workLogs.filter((log) => log.id !== id));
        toast.success("Entry deleted.");
      })
      .catch((err) => {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          toast.error("Session expired or invalid. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "/login";
        } else {
          toast.error("Delete failed.");
        }
      });
  };

  const resetForm = () => {
    setDate("");
    setTask("");
    setCategory("Development");
    setEditId(null);
  };

  // Group logs by Date for Timeline View
  const groupedLogs = workLogs.reduce((acc, log) => {
    (acc[log.date] = acc[log.date] || []).push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="max-w-4xl mx-auto text-gray-800">

      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-light tracking-tight text-emerald-950">Daily Work Tracker</h1>
        <p className="text-emerald-600/70 mt-2">Record your daily achievements.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-xl shadow-emerald-50 border border-emerald-100 p-6 mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
        <div className="grid gap-4 pl-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-2.5 text-emerald-400" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-2.5 text-emerald-400" size={18} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none"
              >
                <option>Development</option>
                <option>Design</option>
                <option>Meeting</option>
                <option>Research</option>
                <option>Writing</option>
              </select>
            </div>
          </div>

          <textarea
            placeholder="What did you accomplish today?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition min-h-[100px] resize-none"
          ></textarea>

          <div className="flex justify-end gap-3">
            {editId && (
              <button
                onClick={resetForm}
                className="px-6 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleAddOrUpdate}
              className="bg-emerald-600 text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5"
            >
              {editId ? "Update Entry" : "Save Entry"}
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-4 bottom-0 w-px bg-emerald-200 hidden md:block"></div>

        <AnimatePresence>
          {sortedDates.map((dateKey) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative md:pl-20"
            >
              {/* Date Marker (Desktop) */}
              <div className="hidden md:flex absolute left-0 top-0 flex-col items-center w-16">
                <div className="w-3 h-3 bg-emerald-600 rounded-full border-4 border-white shadow-sm z-10 ring-1 ring-emerald-100"></div>
                <div className="mt-2 text-xs font-bold text-emerald-400 uppercase tracking-widest -rotate-90 origin-center whitespace-nowrap pt-8">
                  {new Date(dateKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Date Header (Mobile) */}
              <div className="md:hidden flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">
                  {new Date(dateKey).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {/* Logs for this date */}
              <div className="space-y-4">
                {groupedLogs[dateKey].map((log) => (
                  <div key={log.id} className="group bg-white p-5 rounded-xl border border-emerald-50 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md shadow-emerald-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2.5 py-1 mb-2 text-xs font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-50 rounded-md border border-emerald-100">
                          {log.category}
                        </span>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{log.task}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(log)} className="text-emerald-300 hover:text-emerald-600">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(log.id)} className="text-emerald-300 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {workLogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-light">Your timeline is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
