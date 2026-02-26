
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Search, Download, User, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedLogs, setGroupedLogs] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8080/api/logs?email=suryaprakash0345@gmail.com",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLogs(res.data);
      groupLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs", err);
    }
  };

  const groupLogs = (data) => {
    const grouped = {};
    data.forEach((log) => {
      if (!grouped[log.userEmail]) grouped[log.userEmail] = [];
      grouped[log.userEmail].push(log);
    });

    Object.keys(grouped).forEach((email) => {
      grouped[email].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    setGroupedLogs(grouped);
  };

  const toggleExpand = (email) => {
    setExpandedUsers((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  // Stats Calculation
  const totalUsers = Object.keys(groupedLogs).length;
  const totalLogs = logs.length;
  const today = new Date().toISOString().split("T")[0];
  const logsToday = logs.filter(log => log.date === today).length;

  // Chart Data: Top Users by Log Count
  const userActivityData = Object.keys(groupedLogs).map(email => ({
    name: email.split('@')[0], // simple display name
    count: groupedLogs[email].length
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const filteredEmails = Object.keys(groupedLogs).filter((email) =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CSV Export
  const downloadCSV = (email = null) => {
    let dataToExport = email ? groupedLogs[email] : logs;
    if (!dataToExport || dataToExport.length === 0) return;

    const headers = ["User Email", "Date", "Category", "Task"];
    const rows = dataToExport.map((log) => [
      log.userEmail,
      log.date,
      log.category || "-",
      `"${(log.task || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", email ? `${email}_logs.csv` : `all_work_logs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-gray-800">

      {/* Header & Stats */}
      <div className="mb-12">
        <h1 className="text-4xl font-light mb-8 text-emerald-950">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-50/50">
            <div className="flex items-center gap-4 text-emerald-600 mb-2">
              <User size={20} />
              <span className="text-sm font-medium uppercase tracking-wide">Total Users</span>
            </div>
            <p className="text-4xl font-bold text-emerald-950">{totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-50/50">
            <div className="flex items-center gap-4 text-emerald-600 mb-2">
              <BarChart2 size={20} />
              <span className="text-sm font-medium uppercase tracking-wide">Total Logs</span>
            </div>
            <p className="text-4xl font-bold text-emerald-950">{totalLogs}</p>
          </div>
          <div className="bg-emerald-600 text-white p-6 rounded-xl border border-emerald-500 shadow-lg shadow-emerald-200">
            <div className="flex items-center gap-4 text-emerald-100 mb-2">
              <span className="text-sm font-medium uppercase tracking-wide">Logs Today</span>
            </div>
            <p className="text-4xl font-bold">{logsToday}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Activity Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-emerald-100 shadow-sm h-fit">
          <h3 className="text-sm font-bold uppercase text-emerald-400 tracking-wider mb-6">Top Contributors</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#065f46' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', borderColor: '#d1fae5' }} />
                <Bar dataKey="count" fill="#059669" barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: User List */}
        <div className="lg:col-span-2 space-y-6">

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-emerald-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => downloadCSV()}
              className="flex items-center justify-center space-x-2 bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg hover:border-emerald-500 hover:text-emerald-900 hover:bg-emerald-50 transition"
            >
              <Download size={18} />
              <span>Export All</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredEmails.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-emerald-100 rounded-xl bg-emerald-50/30">
                <p className="text-emerald-400">No users found.</p>
              </div>
            ) : (
              filteredEmails.map((email) => (
                <div key={email} className="bg-white border border-emerald-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-emerald-50/50 transition"
                    onClick={() => toggleExpand(email)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{email}</h3>
                        <p className="text-xs text-emerald-600/70">{groupedLogs[email].length} logs total</p>
                      </div>
                    </div>
                    {expandedUsers[email] ? <ChevronUp size={20} className="text-emerald-400" /> : <ChevronDown size={20} className="text-emerald-400" />}
                  </div>

                  {expandedUsers[email] && (
                    <div className="border-t border-emerald-100">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-left">
                          <thead className="bg-emerald-50/80 sticky top-0 backdrop-blur-sm">
                            <tr>
                              <th className="px-6 py-3 text-xs font-medium text-emerald-800 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-xs font-medium text-emerald-800 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-3 text-xs font-medium text-emerald-800 uppercase tracking-wider">Task</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-50">
                            {groupedLogs[email].map(log => (
                              <tr key={log.id} className="hover:bg-emerald-50/30">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    {log.category || 'General'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">{log.task}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
