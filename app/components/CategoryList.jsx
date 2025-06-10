// // components/CategoryList.jsx
// import React from 'react';

// export default function CategoryList({ categories }) {
//   return (
//     <section className="mx-4 space-y-3">
//       {categories.map((category) => (
//         <div
//           key={category.id}
//           className="bg-gray-800/80 rounded-2xl p-4 flex items-center justify-between"
//         >
//           <div className="flex items-center gap-4">
//             <div
//               className={`w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center text-xl`}
//             >
//               {category.icon}
//             </div>
//             <span className="text-lg font-medium">{category.name}</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-gray-400 text-lg">{category.percentage}%</span>
//             <span className="text-xl font-medium">{category.amount}</span>
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// }