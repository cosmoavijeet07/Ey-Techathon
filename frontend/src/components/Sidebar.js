import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-60 bg-gray-800 text-white h-screen">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-700">BPO System</h2>
      <nav className="p-4">
        <ul className="space-y-4">
          <li><Link to="/call-management" className="hover:text-blue-400">Call Management</Link></li>
          <li><Link to="/knowledge-base" className="hover:text-blue-400">Knowledge Base</Link></li>
          <li><Link to="/client-analysis" className="hover:text-blue-400">Client Analysis</Link></li>
          <li><Link to="/data-processing" className="hover:text-blue-400">Data Processing</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
