import {
   useState,
   useEffect,
   createContext,
   useContext,
   ReactNode,
} from "react";
import {
   ChevronDown,
   ChevronUp,
   Search,
   X,
   Home,
   Grid,
   List,
} from "lucide-react";

import AnnTakamaki from "./data/confidants/Ann_Takamaki.json";
import ChihayaMifuine from "./data/confidants/Chihaya_Mifuine.json";
import FutabaSakura from "./data/confidants/Futaba_Sakura.json";
import GoroAkechi from "./data/confidants/Goro_Akechi.json";
import HaruOkumura from "./data/confidants/Haru_Okumura.json";
import HifumiTogo from "./data/confidants/Hifumi_Togo.json";
import IchikoOhya from "./data/confidants/Ichiko_Ohya.json";
import KasumiYoshizawa from "./data/confidants/Kasumi_Yoshizawa.json";
import MakotoNijima from "./data/confidants/Makoto_Nijima.json";
import MunehisaIwai from "./data/confidants/Munehisa_Iwai.json";
import RyujiSakamoto from "./data/confidants/Ryuji_Sakamoto.json";
import SadayoKawakami from "./data/confidants/Sadayo_Kawakami.json";
import ShinyaOda from "./data/confidants/Shinya_Oda.json";
import SojiroSakura from "./data/confidants/Sojiro_Sakura.json";
import TaeTakemi from "./data/confidants/Tae_Takemi.json";
import TakutoMaruki from "./data/confidants/Takuto_Maruki.json";
import ToranosukeYoshida from "./data/confidants/Toranosuke_Yoshida.json";
import YusukeKitagawa from "./data/confidants/Yusuke_Kitagawa.json";
import YuukiMishima from "./data/confidants/Yuuki_Mishima.json";
import NegotiationData from "./data/negotiation.json";

// Types definitions
interface ConfidantResponse {
   response: string;
   values: string[];
}

interface ConfidantRank {
   rank: string;
   responses: ConfidantResponse[];
}

interface RawConfidantRank {
   rank: string;
   responses: ConfidantResponse[];
}

interface Confidant {
   id: string;
   name: string;
   shortName?: string; // For display in grid
   arcana?: string; // Optional arcana information
   icon?: string; // Icon path - will be replaced with actual icons
   ranks: ConfidantRank[];
}

interface NegotiationAnswer {
   answer: string;
   gloomy: string;
   irritable: string;
   timid: string;
   upbeat: string;
}

interface Negotiation {
   id: string;
   question: string;
   answers: NegotiationAnswer[];
}

interface DataContextType {
   confidants: Confidant[];
   negotiations: Negotiation[];
   filteredConfidants: (searchText: string) => Confidant[];
   filteredNegotiations: (searchText: string) => Negotiation[];
   isLoading: boolean;
}

interface ThemeContextType {
   darkMode: boolean;
}

// Create context for dark mode
const ThemeContext = createContext<ThemeContextType | null>(null);

// Data loader function that uses the imported JSON files
const loadData = (): {
   confidants: Confidant[];
   negotiations: Negotiation[];
} => {
   const confidantFiles = [
      {
         name: "Ann Takamaki",
         shortName: "Ann",
         arcana: "Lovers",
         data: AnnTakamaki as RawConfidantRank[],
      },
      {
         name: "Chihaya Mifuine",
         shortName: "Chihaya",
         arcana: "Fortune",
         data: ChihayaMifuine as RawConfidantRank[],
      },
      {
         name: "Futaba Sakura",
         shortName: "Futaba",
         arcana: "Hermit",
         data: FutabaSakura as RawConfidantRank[],
      },
      {
         name: "Goro Akechi",
         shortName: "Akechi",
         arcana: "Justice",
         data: GoroAkechi as RawConfidantRank[],
      },
      {
         name: "Haru Okumura",
         shortName: "Haru",
         arcana: "Empress",
         data: HaruOkumura as RawConfidantRank[],
      },
      {
         name: "Hifumi Togo",
         shortName: "Hifumi",
         arcana: "Star",
         data: HifumiTogo as RawConfidantRank[],
      },
      {
         name: "Ichiko Ohya",
         shortName: "Ohya",
         arcana: "Devil",
         data: IchikoOhya as RawConfidantRank[],
      },
      {
         name: "Kasumi Yoshizawa",
         shortName: "Kasumi",
         arcana: "Faith",
         data: KasumiYoshizawa as RawConfidantRank[],
      },
      {
         name: "Makoto Nijima",
         shortName: "Makoto",
         arcana: "Priestess",
         data: MakotoNijima as RawConfidantRank[],
      },
      {
         name: "Munehisa Iwai",
         shortName: "Iwai",
         arcana: "Hanged Man",
         data: MunehisaIwai as RawConfidantRank[],
      },
      {
         name: "Ryuji Sakamoto",
         shortName: "Ryuji",
         arcana: "Chariot",
         data: RyujiSakamoto as RawConfidantRank[],
      },
      {
         name: "Sadayo Kawakami",
         shortName: "Kawakami",
         arcana: "Temperance",
         data: SadayoKawakami as RawConfidantRank[],
      },
      {
         name: "Shinya Oda",
         shortName: "Shinya",
         arcana: "Tower",
         data: ShinyaOda as RawConfidantRank[],
      },
      {
         name: "Sojiro Sakura",
         shortName: "Sojiro",
         arcana: "Hierophant",
         data: SojiroSakura as RawConfidantRank[],
      },
      {
         name: "Tae Takemi",
         shortName: "Takemi",
         arcana: "Death",
         data: TaeTakemi as RawConfidantRank[],
      },
      {
         name: "Takuto Maruki",
         shortName: "Maruki",
         arcana: "Councillor",
         data: TakutoMaruki as RawConfidantRank[],
      },
      {
         name: "Toranosuke Yoshida",
         shortName: "Yoshida",
         arcana: "Sun",
         data: ToranosukeYoshida as RawConfidantRank[],
      },
      {
         name: "Yusuke Kitagawa",
         shortName: "Yusuke",
         arcana: "Emperor",
         data: YusukeKitagawa as RawConfidantRank[],
      },
      {
         name: "Yuuki Mishima",
         shortName: "Mishima",
         arcana: "Moon",
         data: YuukiMishima as RawConfidantRank[],
      },
   ];

   const confidants = confidantFiles.map((confidant, index) => ({
      id: (index + 1).toString(),
      name: confidant.name,
      shortName: confidant.shortName,
      arcana: confidant.arcana,
      ranks: confidant.data,
   }));

   // Add ID to each negotiation
   const negotiations = NegotiationData.map((negotiation, index) => ({
      ...negotiation,
      id: (index + 1).toString(),
   }));

   return { confidants, negotiations };
};

// Data Service Context
const DataContext = createContext<DataContextType | null>(null);

const DataProvider = ({ children }: { children: ReactNode }) => {
   const [confidants, setConfidants] = useState<Confidant[]>([]);
   const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      const data = loadData();
      setConfidants(data.confidants);
      setNegotiations(data.negotiations);
      setIsLoading(false);
   }, []);

   const filteredConfidants = (searchText: string): Confidant[] => {
      if (!searchText || searchText.length < 4) return [];

      const searchTextLower = searchText.toLowerCase();

      return confidants
         .map((confidant) => {
            // Filter ranks to only include those containing the search term
            const filteredRanks = confidant.ranks.filter((currentRank) => {
               // Check if rank name contains the search term
               if (currentRank.rank.toLowerCase().includes(searchTextLower)) {
                  return true;
               }

               // Check if any response contains the search term
               return currentRank.responses.some((response) => {
                  if (
                     response.response.toLowerCase().includes(searchTextLower)
                  ) {
                     return true;
                  }

                  // Check if any value contains the search term
                  return response.values.some((value) =>
                     value.toLowerCase().includes(searchTextLower)
                  );
               });
            });

            // If there are filtered ranks, return a modified confidant with only those ranks
            if (filteredRanks.length > 0) {
               return {
                  ...confidant,
                  ranks: filteredRanks,
               };
            }

            // If no ranks match, check if confidant name contains search term
            // In that case, include the confidant with all its ranks
            if (confidant.name.toLowerCase().includes(searchTextLower)) {
               return confidant;
            }

            // Otherwise, return null to filter out this confidant
            return null;
         })
         .filter((confidant): confidant is Confidant => confidant !== null);
   };

   const filteredNegotiations = (searchText: string): Negotiation[] => {
      if (!searchText || searchText.length < 4) return [];

      const searchTextLower = searchText.toLowerCase();

      return negotiations.filter((negotiation) => {
         // Check if question contains the search term
         if (negotiation.question.toLowerCase().includes(searchTextLower)) {
            return true;
         }

         // Check if any answer contains the search term
         return negotiation.answers.some((answer) =>
            answer.answer.toLowerCase().includes(searchTextLower)
         );
      });
   };

   return (
      <DataContext.Provider
         value={{
            confidants,
            negotiations,
            filteredConfidants,
            filteredNegotiations,
            isLoading,
         }}
      >
         {children}
      </DataContext.Provider>
   );
};

// Custom hook to use the data context
const useData = (): DataContextType => {
   const context = useContext(DataContext);
   if (context === undefined || context === null) {
      throw new Error("useData must be used within a DataProvider");
   }
   return context;
};

// ==============================
// NEW COMPONENTS
// ==============================

// Header component with navigation tabs
interface HeaderProps {
   activeTab: string;
   setActiveTab: (tab: string) => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
   return (
      <header className="bg-red-900 shadow-lg">
         <div className="container mx-auto p-2">
            <div className="flex justify-between items-center">
               <h1 className="text-xl font-bold">Persona 5 Royal Guide</h1>

               <div className="flex space-x-2 mt-2">
                  <button
                     onClick={() => setActiveTab("home")}
                     className={`p-2 rounded-t-lg flex items-center ${
                        activeTab === "home"
                           ? "bg-black text-white"
                           : "bg-red-950 text-gray-300"
                     }`}
                  >
                     <Home className="w-4 h-4 mr-1" />
                     <span className="hidden sm:inline">Home</span>
                  </button>

                  <button
                     onClick={() => setActiveTab("confidants")}
                     className={`p-2 rounded-t-lg flex items-center ${
                        activeTab === "confidants"
                           ? "bg-black text-white"
                           : "bg-red-950 text-gray-300"
                     }`}
                  >
                     <Grid className="w-4 h-4 mr-1" />
                     <span className="hidden sm:inline">Confidants</span>
                  </button>

                  <button
                     onClick={() => setActiveTab("negotiations")}
                     className={`p-2 rounded-t-lg flex items-center ${
                        activeTab === "negotiations"
                           ? "bg-black text-white"
                           : "bg-red-950 text-gray-300"
                     }`}
                  >
                     <List className="w-4 h-4 mr-1" />
                     <span className="hidden sm:inline">Negotiations</span>
                  </button>
               </div>
            </div>
         </div>
      </header>
   );
};

// Confidant Card for the grid view
interface ConfidantCardProps {
   confidant: Confidant;
   onClick: (id: string) => void;
   isSelected: boolean;
}

const ConfidantCard = ({
   confidant,
   onClick,
   isSelected,
}: ConfidantCardProps) => {
   // Placeholder background colors for confidants until you have proper icons
   const getBgColor = (id: string) => {
      const colors = [
         "bg-red-700",
         "bg-blue-700",
         "bg-green-700",
         "bg-yellow-700",
         "bg-purple-700",
         "bg-pink-700",
         "bg-indigo-700",
         "bg-teal-700",
      ];
      return colors[parseInt(id) % colors.length];
   };

   // Display initials if no icon is available
   const getInitials = (name: string) => {
      return name
         .split(" ")
         .map((n) => n[0])
         .join("");
   };

   return (
      <div
         onClick={() => onClick(confidant.id)}
         className={`p-2 rounded-lg cursor-pointer transform transition-all duration-200 ${
            isSelected
               ? "scale-105 ring-2 ring-blue-500 shadow-lg"
               : "hover:scale-105"
         }`}
      >
         <div className="flex flex-col items-center">
            <div
               className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white ${getBgColor(
                  confidant.id
               )}`}
            >
               {confidant.icon ? (
                  <img
                     src={confidant.icon}
                     alt={confidant.name}
                     className="w-full h-full rounded-full object-cover"
                  />
               ) : (
                  getInitials(confidant.name)
               )}
            </div>
            <div className="mt-2 text-center">
               <p className="text-sm font-medium">
                  {confidant.shortName || confidant.name}
               </p>
               {confidant.arcana && (
                  <p className="text-xs text-gray-400">{confidant.arcana}</p>
               )}
            </div>
         </div>
      </div>
   );
};

// Confidant Grid Component
interface ConfidantGridProps {
   confidants: Confidant[];
   onSelectConfidant: (id: string) => void;
   selectedConfidantId: string | null;
}

const ConfidantGrid = ({
   confidants,
   onSelectConfidant,
   selectedConfidantId,
}: ConfidantGridProps) => {
   return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
         {confidants.map((confidant) => (
            <ConfidantCard
               key={confidant.id}
               confidant={confidant}
               onClick={onSelectConfidant}
               isSelected={selectedConfidantId === confidant.id}
            />
         ))}
      </div>
   );
};

// Enhanced Confidant Response Component with better visualization
interface EnhancedConfidantResponseProps {
   response: ConfidantResponse;
   isOpen: boolean;
   toggleResponse: () => void;
}

const EnhancedConfidantResponse = ({
   response,
   isOpen,
   toggleResponse,
}: EnhancedConfidantResponseProps) => {
   // Function to highlight point values
   const highlightValue = (value: string) => {
      const matches = value.match(/\+(\d+)$/);
      if (matches) {
         const points = matches[1];
         const text = value.replace(/\+\d+$/, "");

         let color;
         if (parseInt(points) === 3) color = "text-green-500";
         else if (parseInt(points) === 2) color = "text-blue-400";
         else color = "text-gray-400";

         return (
            <>
               {text} <span className={`font-bold ${color}`}>+{points}</span>
            </>
         );
      }
      return value;
   };

   return (
      <div className="mb-2">
         <div
            className="flex justify-between items-center p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
            onClick={toggleResponse}
         >
            <span className="font-medium text-gray-200">
               {response.response}
            </span>
            {isOpen ? (
               <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
               <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
         </div>

         {isOpen && (
            <div className="mt-1 ml-4 pl-2 border-l-2 border-blue-500">
               {response.values.map((value, index) => (
                  <div key={index} className="py-1 text-gray-300">
                     {highlightValue(value)}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

// Enhanced Confidant Rank Component
interface EnhancedConfidantRankProps {
   rank: ConfidantRank;
}

const EnhancedConfidantRank = ({ rank }: EnhancedConfidantRankProps) => {
   const [openResponses, setOpenResponses] = useState<Record<number, boolean>>(
      {}
   );

   const toggleResponse = (index: number) => {
      setOpenResponses((prev) => ({
         ...prev,
         [index]: !prev[index],
      }));
   };

   const toggleAllResponses = () => {
      const allOpen = rank.responses.every((_, index) => openResponses[index]);
      const newState: Record<number, boolean> = {};
      rank.responses.forEach((_, index) => {
         newState[index] = !allOpen;
      });
      setOpenResponses(newState);
   };

   return (
      <div className="mb-4">
         <div className="flex justify-between items-center mb-2 bg-gray-900 p-2 rounded">
            <h3 className="text-blue-400 font-semibold">{rank.rank}</h3>
            <button
               onClick={toggleAllResponses}
               className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
               {rank.responses.every((_, index) => openResponses[index])
                  ? "Collapse All"
                  : "Expand All"}
            </button>
         </div>
         <div className="pl-2">
            {rank.responses.map((response, index) => (
               <EnhancedConfidantResponse
                  key={index}
                  response={response}
                  isOpen={!!openResponses[index]}
                  toggleResponse={() => toggleResponse(index)}
               />
            ))}
         </div>
      </div>
   );
};

// Enhanced Confidant View Component with back button
interface EnhancedConfidantViewProps {
   confidant: Confidant;
   onBack: () => void;
}

const EnhancedConfidantView = ({
   confidant,
   onBack,
}: EnhancedConfidantViewProps) => {
   return (
      <div className="bg-black rounded-lg shadow-lg p-4 mb-4">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100">
               {confidant.name}
            </h2>
            <button
               onClick={onBack}
               className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
               Back to Grid
            </button>
         </div>

         <div>
            {confidant.ranks.map((rank, index) => (
               <EnhancedConfidantRank key={index} rank={rank} />
            ))}
         </div>
      </div>
   );
};

// Improved Negotiation View with color coding
interface ImprovedNegotiationViewProps {
   negotiation: Negotiation;
}

const ImprovedNegotiationView = ({
   negotiation,
}: ImprovedNegotiationViewProps) => {
   const getResponseColor = (response: string) => {
      if (response.includes("GOOD")) return "text-green-500";
      if (response.includes("OK")) return "text-yellow-500";
      if (response.includes("BAD")) return "text-red-500";
      return "text-gray-500";
   };

   return (
      <div className="bg-black rounded-lg shadow-lg p-4 mb-4">
         <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <h3 className="font-bold text-gray-100">{negotiation.question}</h3>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-800">
                  <tr>
                     <th className="p-2 text-left text-gray-200">Answer</th>
                     <th className="p-2 text-center text-gray-200 w-20">
                        <span className="sm:hidden">G</span>
                        <span className="hidden sm:inline">Gloomy</span>
                     </th>
                     <th className="p-2 text-center text-gray-200 w-20">
                        <span className="sm:hidden">I</span>
                        <span className="hidden sm:inline">Irritable</span>
                     </th>
                     <th className="p-2 text-center text-gray-200 w-20">
                        <span className="sm:hidden">T</span>
                        <span className="hidden sm:inline">Timid</span>
                     </th>
                     <th className="p-2 text-center text-gray-200 w-20">
                        <span className="sm:hidden">U</span>
                        <span className="hidden sm:inline">Upbeat</span>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {negotiation.answers.map((answer, index) => (
                     <tr key={index} className="border-b border-gray-800">
                        <td className="p-2 text-gray-300">{answer.answer}</td>
                        <td
                           className={`p-2 text-center font-medium ${getResponseColor(
                              answer.gloomy
                           )}`}
                        >
                           {answer.gloomy === "-"
                              ? "-"
                              : answer.gloomy
                                   .split("🎶")
                                   .join("")
                                   .split("💦")
                                   .join("")
                                   .split("💢")
                                   .join("")}
                        </td>
                        <td
                           className={`p-2 text-center font-medium ${getResponseColor(
                              answer.irritable
                           )}`}
                        >
                           {answer.irritable === "-"
                              ? "-"
                              : answer.irritable
                                   .split("🎶")
                                   .join("")
                                   .split("💦")
                                   .join("")
                                   .split("💢")
                                   .join("")}
                        </td>
                        <td
                           className={`p-2 text-center font-medium ${getResponseColor(
                              answer.timid
                           )}`}
                        >
                           {answer.timid === "-"
                              ? "-"
                              : answer.timid
                                   .split("🎶")
                                   .join("")
                                   .split("💦")
                                   .join("")
                                   .split("💢")
                                   .join("")}
                        </td>
                        <td
                           className={`p-2 text-center font-medium ${getResponseColor(
                              answer.upbeat
                           )}`}
                        >
                           {answer.upbeat === "-"
                              ? "-"
                              : answer.upbeat
                                   .split("🎶")
                                   .join("")
                                   .split("💦")
                                   .join("")
                                   .split("💢")
                                   .join("")}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

// Negotiation Filter Controls
interface NegotiationFiltersProps {
   activeFilter: string;
   setActiveFilter: (filter: string) => void;
}

const NegotiationFilters = ({
   activeFilter,
   setActiveFilter,
}: NegotiationFiltersProps) => {
   return (
      <div className="mb-4 bg-gray-900 p-3 rounded-lg">
         <h3 className="text-white font-medium mb-2">
            Filter by personality type:
         </h3>
         <div className="flex flex-wrap gap-2">
            <button
               onClick={() => setActiveFilter("all")}
               className={`px-3 py-1 rounded ${
                  activeFilter === "all"
                     ? "bg-blue-600 text-white"
                     : "bg-gray-700 text-gray-300"
               }`}
            >
               All
            </button>
            <button
               onClick={() => setActiveFilter("gloomy")}
               className={`px-3 py-1 rounded ${
                  activeFilter === "gloomy"
                     ? "bg-blue-600 text-white"
                     : "bg-gray-700 text-gray-300"
               }`}
            >
               Gloomy
            </button>
            <button
               onClick={() => setActiveFilter("irritable")}
               className={`px-3 py-1 rounded ${
                  activeFilter === "irritable"
                     ? "bg-blue-600 text-white"
                     : "bg-gray-700 text-gray-300"
               }`}
            >
               Irritable
            </button>
            <button
               onClick={() => setActiveFilter("timid")}
               className={`px-3 py-1 rounded ${
                  activeFilter === "timid"
                     ? "bg-blue-600 text-white"
                     : "bg-gray-700 text-gray-300"
               }`}
            >
               Timid
            </button>
            <button
               onClick={() => setActiveFilter("upbeat")}
               className={`px-3 py-1 rounded ${
                  activeFilter === "upbeat"
                     ? "bg-blue-600 text-white"
                     : "bg-gray-700 text-gray-300"
               }`}
            >
               Upbeat
            </button>
         </div>
      </div>
   );
};

// Improved Negotiations List View
interface ImprovedNegotiationsListViewProps {
   negotiations: Negotiation[];
}

const ImprovedNegotiationsListView = ({
   negotiations,
}: ImprovedNegotiationsListViewProps) => {
   const [activeFilter, setActiveFilter] = useState("all");

   const filteredNegotiations =
      activeFilter === "all"
         ? negotiations
         : negotiations.filter((negotiation) =>
              negotiation.answers.some(
                 (answer) =>
                    answer[activeFilter as keyof NegotiationAnswer] &&
                    answer[activeFilter as keyof NegotiationAnswer].includes(
                       "GOOD"
                    )
              )
           );

   return (
      <div>
         <NegotiationFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
         />

         {filteredNegotiations.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
               No negotiations match the selected filter
            </div>
         ) : (
            filteredNegotiations.map((negotiation) => (
               <ImprovedNegotiationView
                  key={negotiation.id}
                  negotiation={negotiation}
               />
            ))
         )}
      </div>
   );
};

// Home screen with overview and instructions
const HomeScreen = () => {
   return (
      <div className="p-4">
         <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-white mb-3">
               Welcome to the P5R Guide
            </h2>
            <p className="text-gray-300 mb-2">
               This guide helps you optimize your Persona 5 Royal gameplay with
               easy access to:
            </p>
            <ul className="list-disc ml-6 text-gray-300 mb-4">
               <li className="mb-1">
                  Confidant conversation responses and points
               </li>
               <li className="mb-1">
                  Shadow negotiation answers for each personality type
               </li>
            </ul>
            <p className="text-gray-300">
               Select a tab above to get started, or use the search to find
               specific responses.
            </p>
         </div>

         <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
               Quick Tips
            </h3>
            <ul className="list-disc ml-6 text-gray-300">
               <li className="mb-1">
                  For Confidants: Focus on +3 responses (green) for faster rank
                  ups
               </li>
               <li className="mb-1">
                  For Negotiations: Match your answer to the shadow's
                  personality for best results
               </li>
               <li className="mb-1">
                  Use search to quickly find specific dialogue or questions
               </li>
            </ul>
         </div>
      </div>
   );
};

// Main App Content Component that uses the data context
const AppContent = () => {
   const [activeTab, setActiveTab] = useState<string>("home");
   const [searchText, setSearchText] = useState<string>("");
   const [selectedConfidantId, setSelectedConfidantId] = useState<
      string | null
   >(null);

   const {
      confidants,
      negotiations,
      filteredConfidants,
      filteredNegotiations,
      isLoading,
   } = useData();

   // Handle search text state
   const handleSearchTextChange = (text: string) => {
      setSearchText(text);
      // If search is active, switch to appropriate tab based on results
      if (text.length >= 4) {
         const confResults = filteredConfidants(text);
         const negResults = filteredNegotiations(text);

         if (confResults.length > 0 && negResults.length === 0) {
            setActiveTab("confidants");
         } else if (negResults.length > 0 && confResults.length === 0) {
            setActiveTab("negotiations");
         }
      }
   };

   // Handle escape key for the entire app
   useEffect(() => {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            if (searchText.length > 0) {
               setSearchText("");
            } else if (selectedConfidantId) {
               setSelectedConfidantId(null);
            }
         }
      };

      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => {
         document.removeEventListener("keydown", handleGlobalKeyDown);
      };
   }, [searchText, selectedConfidantId]);

   const renderContent = () => {
      if (isLoading) {
         return (
            <div className="flex justify-center items-center h-32">
               <div className="text-xl text-gray-400">Loading...</div>
            </div>
         );
      }

      // Search results have priority
      if (searchText.length >= 4) {
         const filtered = {
            confidants: filteredConfidants(searchText),
            negotiations: filteredNegotiations(searchText),
         };

         return (
            <div className="p-3">
               <h2 className="text-xl font-bold mb-3">Search Results</h2>

               {filtered.confidants.length === 0 &&
               filtered.negotiations.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                     <div className="text-xl text-gray-400">
                        No results found
                     </div>
                  </div>
               ) : (
                  <>
                     {filtered.confidants.length > 0 && (
                        <div className="mb-6">
                           <h2 className="text-2xl font-bold text-gray-100 mb-4">
                              Confidants
                           </h2>
                           <div>
                              {filtered.confidants.map((confidant) => (
                                 <EnhancedConfidantView
                                    key={confidant.id}
                                    confidant={confidant}
                                    onBack={() => setSelectedConfidantId(null)}
                                 />
                              ))}
                           </div>
                        </div>
                     )}
                     {filtered.negotiations.length > 0 && (
                        <div className="mb-6">
                           <h2 className="text-2xl font-bold text-gray-100 mb-4">
                              Negotiations
                           </h2>
                           <ImprovedNegotiationsListView
                              negotiations={filtered.negotiations}
                           />
                        </div>
                     )}
                  </>
               )}
            </div>
         );
      }

      // Render based on active tab
      switch (activeTab) {
         case "home":
            return <HomeScreen />;

         case "confidants":
            if (selectedConfidantId) {
               const selectedConfidant = confidants.find(
                  (c) => c.id === selectedConfidantId
               );
               if (selectedConfidant) {
                  return (
                     <EnhancedConfidantView
                        confidant={selectedConfidant}
                        onBack={() => setSelectedConfidantId(null)}
                     />
                  );
               }
            }

            return (
               <div>
                  <h2 className="text-xl font-bold p-4">Confidants</h2>
                  <ConfidantGrid
                     confidants={confidants}
                     onSelectConfidant={setSelectedConfidantId}
                     selectedConfidantId={selectedConfidantId}
                  />
               </div>
            );

         case "negotiations":
            return (
               <div className="p-3">
                  <h2 className="text-xl font-bold mb-3">
                     Shadow Negotiations
                  </h2>
                  <ImprovedNegotiationsListView negotiations={negotiations} />
               </div>
            );

         default:
            return <HomeScreen />;
      }
   };

   return (
      <div className="min-h-screen bg-black text-gray-100">
         <Header activeTab={activeTab} setActiveTab={setActiveTab} />

         <main className="container mx-auto py-2">
            {/* Search bar always visible at top */}
            <div className="sticky top-0 z-10 bg-black p-3">
               <div className="flex items-center px-3 py-2 bg-gray-800 rounded-lg shadow">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                     type="text"
                     value={searchText}
                     onChange={(e) => handleSearchTextChange(e.target.value)}
                     placeholder="Search..."
                     className="w-full px-3 py-1 ml-2 text-gray-200 bg-transparent outline-none"
                  />
                  {searchText && (
                     <button
                        onClick={() => handleSearchTextChange("")}
                        className="text-gray-400 hover:text-gray-200"
                     >
                        <X className="w-5 h-5" />
                     </button>
                  )}
               </div>
            </div>

            {/* Content based on active tab */}
            <div className="mt-2">{renderContent()}</div>
         </main>
      </div>
   );
};

// Main App Component
const App = () => {
   const [darkMode] = useState<boolean>(true);

   return (
      <ThemeContext.Provider value={{ darkMode }}>
         <DataProvider>
            <AppContent />
         </DataProvider>
      </ThemeContext.Provider>
   );
};

export default App;
