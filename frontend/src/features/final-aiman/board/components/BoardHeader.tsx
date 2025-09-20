// import { Button } from "@/components/ui/button";
// import {
//   Zap,
//   Filter,
//   Star,
//   Users,
//   Share2,
//   MoreHorizontal,
//   ChevronDown,
// } from "lucide-react";
// import { useBoardMembers } from "../hooks";

// interface BoardHeaderProps {
//   boardName: string;
//   boardId: string;
//   // members?: Array<{
//   //   id: string;
//   //   name: string;
//   //   avatar?: string;
//   //   isAdmin?: boolean;
//   // }>;
// }

// export default function BoardHeader({
//   boardName,
//   boardId,
// }: BoardHeaderProps) {
//   const {data:members} = useBoardMembers(boardId);
//   return (
//     <div className="inline-flex relative flex-wrap items-center h-auto w-[calc(100%-2px)] p-3 gap-1 bg-[#ffffff3d] backdrop-blur-[6px]">
//       {/* Left Section - Board Name and Dropdown */}
//       <div className="grow shrink basis-[20%] text-ellipsis flex flex-nowrap items-start w-full min-h-[32px]">
//         <div className="inline-flex gap-0 w-full h-[32px] mr-1 mb-0 rounded-[3px] leading-[32px] whitespace-nowrap">
//           <h1 className="text-[16px] h-full px-[10px] mb-[12px] bg-transparent font-bold leading-[32px] decoration-0 text-ellipsis whitespace-nowrap">
//             {boardName}
//           </h1>
//           <Button
//             size="sm"
//             className="text-white bg-transparent flex shadow-none hover:bg-white/10 rounded-[3px] has-[>svg]:p-1.5"
//           >
//             <img
//               src="/src/assets/three-bar-icon.svg"
//               alt="Menu"
//               className="w-5 h-5"
//             />
//             <ChevronDown />
//           </Button>
//         </div>
//       </div>

//       {/* Right Section - All Actions */}
//       <div className="flex items-center gap-3">
//         {/* Board Members */}
//         <div className="flex items-center gap-1">
//           {members.slice(0, 3).map((member, index) => {
//             // Generate a consistent background color based on the member's name
//             const getInitials = (name: string) => {
//               return name
//                 .split(" ")
//                 .map((word) => word.charAt(0))
//                 .join("")
//                 .toUpperCase()
//                 .slice(0, 2);
//             };

//             const getBackgroundColor = (name: string) => {
//               const colors = [
//                 "bg-blue-500",
//                 "bg-green-500",
//                 "bg-purple-500",
//                 "bg-pink-500",
//                 "bg-indigo-500",
//                 "bg-yellow-500",
//                 "bg-red-500",
//                 "bg-teal-500",
//                 "bg-orange-500",
//                 "bg-cyan-500",
//               ];
//               const hash = name.split("").reduce((a, b) => {
//                 a = (a << 5) - a + b.charCodeAt(0);
//                 return a & a;
//               }, 0);
//               return colors[Math.abs(hash) % colors.length];
//             };

//             return (
//               <div
//                 key={member.id}
//                 className="relative"
//                 style={{ zIndex: 3 - index }}
//               >
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="w-8 h-8 rounded-full p-0 hover:bg-white/20"
//                   title={`${member.name}${member.isAdmin ? " (Admin)" : ""}`}
//                 >
//                   <div
//                     className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getBackgroundColor(
//                       member.name
//                     )}`}
//                   >
//                     {getInitials(member.name)}
//                   </div>
//                   {member.isAdmin && (
//                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
//                   )}
//                 </Button>
//               </div>
//             );
//           })}
//         </div>

//         {/* Power-Ups */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white hover:bg-white/20 px-2 py-1"
//         >
//           <Zap className="w-4 h-4 mr-1" />
//           Power-Ups
//         </Button>

//         {/* Lightning Bolt (Automation) */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white hover:bg-white/20 px-2 py-1"
//         >
//           <Zap className="w-4 h-4" />
//         </Button>

//         {/* Filter */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white hover:bg-white/20 px-2 py-1"
//         >
//           <Filter className="w-4 h-4" />
//         </Button>

//         {/* Star */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white hover:bg-white/20 px-2 py-1"
//         >
//           <Star className="w-4 h-4" />
//         </Button>

//         {/* People (Visibility) */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white hover:bg-white/20 px-2 py-1"
//         >
//           <Users className="w-4 h-4" />
//         </Button>

//         {/* Share Button */}
//         <Button
//           size="sm"
//           className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
//         >
//           <Share2 className="w-4 h-4 mr-1" />
//           Share
//         </Button>

//         {/* Three Dots Menu */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white hover:bg-white/20 px-2 py-1"
//         >
//           <MoreHorizontal className="w-4 h-4" />
//         </Button>
//       </div>
//     </div>
//   );
// }
