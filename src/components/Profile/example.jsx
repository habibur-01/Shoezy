// import React from "react";

// const LeaveRequest = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 p-6 text-black">
//       {/* Tabs */}
//       <div className="bg-white rounded-xl shadow mb-6">
//         <div className="flex gap-6 px-6 py-4 text-sm text-gray-500">
//           {[
//             "Leave Summary",
//             "Leave Application",
//             "Notification",
//             "Short leave Application",
//             "Leave History and Cancellation",
//             "Exchange and Compensatory Leave Request",
//           ].map((tab, i) => (
//             <span
//               key={i}
//               className={
//                 tab === "Leave Application"
//                   ? "text-green-600 border-b-2 border-green-600 pb-2"
//                   : "hover:text-gray-700"
//               }
//             >
//               {tab}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* LEFT MAIN CARD */}
//         {/* <div className="lg:col-span-2 bg-white rounded-xl shadow p-6"> */}
//         <div className="bg-white rounded-xl shadow p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center bg-green-600 text-white px-4 py-2 rounded mb-6">
//             <span>Welcome to Leave Application on behalf of Al-Amin</span>
//             <button className="text-sm underline">Switch To My leave</button>
//           </div>

//           {/* FORM + ATTENDANCE */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* LEFT HALF – FORM */}
//             <div className="space-y-4">
//               <Select label="Leave Year" options={["Search Year"]} />
//               <Select label="Leave Type*" options={["CL", "SL", "AL", "LWP"]} />

//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <label className="block text-sm mb-1">From Date*</label>
//                   <input
//                     type="date"
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <label className="block text-sm mb-1">To Date*</label>
//                   <input
//                     type="date"
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>
//               </div>
//               <span className="text-xs text-red-500">
//                 System will auto detect Pre or Post based on Leave date and
//                 Transaction date
//               </span>
//               <Input label="Total Day*" placeholder="10 Days" />
//               <Select label="Reason For Leave" options={["Auto Save"]} />
//               <Input label="Comments" placeholder="Leave a comment..." />
//               <Input
//                 label="On Duty Substitution"
//                 placeholder="Search or Select"
//               />
//             </div>

//             {/* RIGHT HALF – Text */}
//             <div className="p-6 h-fit mt-5">
//               <p>Leave Period: 01-Jan-2025 - 31-Dec-2025</p>
//             </div>
//           </div>

//           {/* APPROVE TYPE */}
//           <div className="mt-6 flex items-center gap-6 text-sm">
//             <span className="font-medium">Approve Type</span>

//             <label className="flex items-center gap-2">
//               <input type="radio" name="approveType" /> Pre
//             </label>

//             <label className="flex items-center gap-2">
//               <input type="radio" name="approveType" defaultChecked /> Post
//             </label>
//           </div>

//           {/* APPROVER */}
//           <div className="mt-6 flex items-center gap-6 text-sm">
//             <span className="font-medium">Approver</span>

//             {["2025 - Kamal", "2024 - Jamal", "2023 - Karin"].map((a) => (
//               <label key={a} className="flex items-center gap-2">
//                 <input type="radio" name="approver" /> {a}
//               </label>
//             ))}
//           </div>

//           {/* BUTTONS */}
//           <div className="flex justify-end gap-4 mt-8">
//             <button className="bg-green-600 text-white px-6 py-2 rounded">
//               Submit
//             </button>
//             <button className="bg-gray-500 text-white px-6 py-2 rounded">
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         {/* <div className="bg-white rounded-xl shadow p-6"> */}
//         <div className="bg-white rounded-xl shadow p-6">
//           {/* Profile */}
//           <div className="flex flex-col items-center mb-4">
//             <img
//               src="https://i.pravatar.cc/100"
//               className="w-20 h-20 rounded-full mb-2"
//             />
//             <h3 className="font-normal">Hasib Ahmed</h3>
//             <p className="text-sm font-semibold text-black-500">Manager-HR</p>
//           </div>

//           {/* Leave Balance */}
//           <div>
//             <h4 className="font-semibold mb-3">Leave Balance</h4>
//             <table className="w-full text-sm border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-2 py-1">Leave Type</th>
//                   <th className="border px-2 py-1">Entitilement</th>
//                   <th className="border px-2 py-1">Opening Balance</th>
//                   <th className="border px-2 py-1">Balance</th>
//                   <th className="border px-2 py-1">Availed</th>
//                   <th className="border px-2 py-1">Pending Approval</th>
//                   <th className="border px-2 py-1">Encash</th>
//                   <th className="border px-2 py-1">C/F Next Year</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="border px-2 py-1">CL</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">07.50</td>
//                   <td className="border px-2 py-1">02.50</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                 </tr>
//                 <tr>
//                   <td className="border px-2 py-1">SL</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">07.50</td>
//                   <td className="border px-2 py-1">02.50</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                 </tr>
//                 <tr>
//                   <td className="border px-2 py-1">AL</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">07.50</td>
//                   <td className="border px-2 py-1">02.50</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                 </tr>
//                 <tr>
//                   <td className="border px-2 py-1">LWP</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">10.00</td>
//                   <td className="border px-2 py-1">07.50</td>
//                   <td className="border px-2 py-1">02.50</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                   <td className="border px-2 py-1">01.00</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function Input({ label, placeholder }: { label: string; placeholder: string }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium mb-1">{label}</label>
//       <input
//         placeholder={placeholder}
//         className="w-full border rounded px-3 py-2 text-sm"
//       />
//     </div>
//   );
// }

// function Select({ label, options }: { label: string; options: string[] }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium mb-1">{label}</label>
//       <select className="w-full border rounded px-3 py-2 text-sm">
//         <option>-- Select --</option>
//         {options.map((o) => (
//           <option key={o}>{o}</option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default LeaveRequest;





import React, { useEffect, useState } from "react";

const LeaveRequest = () => {
  const [leaveYears, setLeaveYears] = useState<string[]>([]);
    const [startMonth, setStartMonth] = useState(null);
    const [endMonth, setEndMonth] = useState(null);
  console.log("🚀 ~ LeaveRequest ~ leaveYears:", leaveYears)
  const [leavePeriod, setLeavePeriod] = useState<string>("Loading...");

  useEffect(() => {
    fetch(
      "http://185.197.194.141:3000/api/OrganizationNode/getAllCalenderTypes",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const result = data?.result?.result;
        console.log("🚀 ~ LeaveRequest ~ result:", result)
        if (result) {
            
          setLeaveYears(result);
           setStartMonth(first?.start_month)
         setEndMonth(first?.end_month)
        }
      })
      .catch(() => setLeavePeriod("Failed to load"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="flex gap-6 px-6 py-4 text-sm text-gray-500">
          {[
            "Leave Summary",
            "Leave Application",
            "Notification",
            "Short leave Application",
            "Leave History and Cancellation",
            "Exchange and Compensatory Leave Request",
          ].map((tab) => (
            <span
              key={tab}
              className={
                tab === "Leave Application"
                  ? "text-green-600 border-b-2 border-green-600 pb-2"
                  : "hover:text-gray-700"
              }
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center bg-green-600 text-white px-4 py-2 rounded mb-6">
            <span>Welcome to Leave Application on behalf of Al-Amin</span>
            <button className="text-sm underline">Switch To My leave</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Select label="Leave Year" options={leaveYears} />
              <Select label="Leave Type*" options={["CL", "SL", "AL", "LWP"]} />

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1">From Date*</label>
                  <input type="date" className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">To Date*</label>
                  <input type="date" className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <span className="text-xs text-red-500">
                System will auto detect Pre or Post based on Leave date
              </span>

              <Input label="Total Day*" placeholder="10 Days" />
              <Select label="Reason For Leave" options={["Auto Save"]} />
              <Input label="Comments" placeholder="Leave a comment..." />
              <Input label="On Duty Substitution" placeholder="Search or Select" />
            </div>

            <div className="p-6 h-fit mt-5">
              <p className="font-medium">Leave Period: {getMonthName(startMonth)} - {getMonthName(endMonth)}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-6 text-sm">
            <span className="font-medium">Approve Type</span>
            <label className="flex gap-2">
              <input type="radio" name="approve" /> Pre
            </label>
            <label className="flex gap-2">
              <input type="radio" name="approve" defaultChecked /> Post
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button className="bg-green-600 text-white px-6 py-2 rounded">
              Submit
            </button>
            <button className="bg-gray-500 text-white px-6 py-2 rounded">
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white rounded-xl shadow p-6">
          {/* Profile */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="https://i.pravatar.cc/100"
              className="w-20 h-20 rounded-full mb-2"
            />
            <h3 className="font-normal">Hasib Ahmed</h3>
            <p className="text-sm font-semibold">Manager-HR</p>
          </div>

          {/* Leave Balance Table */}
          <h4 className="font-semibold mb-3">Leave Balance</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Leave Type",
                    "Entitlement",
                    "Opening Balance",
                    "Balance",
                    "Availed",
                    "Pending",
                    "Encash",
                    "C/F Next Year",
                  ].map((h) => (
                    <th key={h} className="border px-2 py-1 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["CL", "SL", "AL", "LWP"].map((type) => (
                  <tr key={type}>
                    <td className="border px-2 py-1">{type}</td>
                    <td className="border px-2 py-1">10.00</td>
                    <td className="border px-2 py-1">10.00</td>
                    <td className="border px-2 py-1">07.50</td>
                    <td className="border px-2 py-1">02.50</td>
                    <td className="border px-2 py-1">01.00</td>
                    <td className="border px-2 py-1">01.00</td>
                    <td className="border px-2 py-1">01.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helpers */
function getMonthName(month: number) {
  console.log("🚀 ~ getMonthName ~ month:", month)
  return [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ][month - 1];
}

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select className="w-full border rounded px-3 py-2 text-sm">
        <option>-- Select --</option>
        {options.map((o) => (
          <option key={o?.id}>{o?.name}</option>
        ))}
      </select>
    </div>
  );
}

export default LeaveRequest;


