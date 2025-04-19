import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
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
    { name: "Ann Takamaki", data: AnnTakamaki as RawConfidantRank[] },
    { name: "Chihaya Mifuine", data: ChihayaMifuine as RawConfidantRank[] },
    { name: "Futaba Sakura", data: FutabaSakura as RawConfidantRank[] },
    { name: "Goro Akechi", data: GoroAkechi as RawConfidantRank[] },
    { name: "Haru Okumura", data: HaruOkumura as RawConfidantRank[] },
    { name: "Hifumi Togo", data: HifumiTogo as RawConfidantRank[] },
    { name: "Ichiko Ohya", data: IchikoOhya as RawConfidantRank[] },
    { name: "Kasumi Yoshizawa", data: KasumiYoshizawa as RawConfidantRank[] },
    { name: "Makoto Nijima", data: MakotoNijima as RawConfidantRank[] },
    { name: "Munehisa Iwai", data: MunehisaIwai as RawConfidantRank[] },
    { name: "Ryuji Sakamoto", data: RyujiSakamoto as RawConfidantRank[] },
    { name: "Sadayo Kawakami", data: SadayoKawakami as RawConfidantRank[] },
    { name: "Shinya Oda", data: ShinyaOda as RawConfidantRank[] },
    { name: "Sojiro Sakura", data: SojiroSakura as RawConfidantRank[] },
    { name: "Tae Takemi", data: TaeTakemi as RawConfidantRank[] },
    { name: "Takuto Maruki", data: TakutoMaruki as RawConfidantRank[] },
    {
      name: "Toranosuke Yoshida",
      data: ToranosukeYoshida as RawConfidantRank[],
    },
    { name: "Yusuke Kitagawa", data: YusukeKitagawa as RawConfidantRank[] },
    { name: "Yuuki Mishima", data: YuukiMishima as RawConfidantRank[] },
  ];

  const confidants = confidantFiles.map((confidant, index) => ({
    id: (index + 1).toString(),
    name: confidant.name,
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
            if (response.response.toLowerCase().includes(searchTextLower)) {
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

// SearchBar Component
interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchBar = ({ searchText, setSearchText }: SearchBarProps) => {
  return (
    <div className="flex items-center px-4 py-2 bg-gray-800 rounded-lg shadow">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search..."
        className="w-full px-3 py-2 ml-2 text-gray-200 bg-transparent outline-none focus:outline-none"
      />
      {searchText && (
        <button
          onClick={() => setSearchText("")}
          className="text-gray-400 hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// ConfidantResponse Component
interface ConfidantResponseProps {
  response: ConfidantResponse;
  isOpen: boolean;
  toggleResponse: () => void;
}

const ConfidantResponse = ({
  response,
  isOpen,
  toggleResponse,
}: ConfidantResponseProps) => {
  return (
    <div className="mb-2">
      <div
        className="flex justify-between items-center p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
        onClick={toggleResponse}
      >
        <span className="font-medium text-gray-200">{response.response}</span>
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
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ConfidantRank Component
interface ConfidantRankProps {
  rank: ConfidantRank;
}

const ConfidantRank = ({ rank }: ConfidantRankProps) => {
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
    // Check if all responses are open
    const allOpen = rank.responses.every((_, index) => openResponses[index]);

    // Create a new state object with all responses set to the opposite of allOpen
    const newState: Record<number, boolean> = {};
    rank.responses.forEach((_, index) => {
      newState[index] = !allOpen;
    });

    setOpenResponses(newState);
  };
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
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
          <ConfidantResponse
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

// ConfidantView Component
interface ConfidantViewProps {
  confidant: Confidant;
}

const ConfidantView = ({ confidant }: ConfidantViewProps) => {
  return (
    <div className="bg-black rounded-lg shadow-lg p-4 mb-4">
      <h2 className="text-xl font-bold text-gray-100 mb-4">{confidant.name}</h2>
      <div>
        {confidant.ranks.map((rank, index) => (
          <ConfidantRank key={index} rank={rank} />
        ))}
      </div>
    </div>
  );
};

// ConfidantsListView Component
interface ConfidantsListViewProps {
  confidants: Confidant[];
}

const ConfidantsListView = ({ confidants }: ConfidantsListViewProps) => {
  return (
    <div>
      {confidants.map((confidant) => (
        <ConfidantView key={confidant.id} confidant={confidant} />
      ))}
    </div>
  );
};

// NegotiationView Component
interface NegotiationViewProps {
  negotiation: Negotiation;
}

const NegotiationView = ({ negotiation }: NegotiationViewProps) => {
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
              <th className="p-2 text-center text-gray-200 w-24">Gloomy</th>
              <th className="p-2 text-center text-gray-200 w-24">Irritable</th>
              <th className="p-2 text-center text-gray-200 w-24">Timid</th>
              <th className="p-2 text-center text-gray-200 w-24">Upbeat</th>
            </tr>
          </thead>
          <tbody>
            {negotiation.answers.map((answer, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="p-2 text-gray-300">{answer.answer}</td>
                <td className="p-2 text-center text-gray-300">
                  {answer.gloomy}
                </td>
                <td className="p-2 text-center text-gray-300">
                  {answer.irritable}
                </td>
                <td className="p-2 text-center text-gray-300">
                  {answer.timid}
                </td>
                <td className="p-2 text-center text-gray-300">
                  {answer.upbeat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// NegotiationsListView Component
interface NegotiationsListViewProps {
  negotiations: Negotiation[];
}

const NegotiationsListView = ({ negotiations }: NegotiationsListViewProps) => {
  return (
    <div>
      {negotiations.map((negotiation) => (
        <NegotiationView key={negotiation.id} negotiation={negotiation} />
      ))}
    </div>
  );
};

// ContentView Component
const ContentView = () => {
  const [searchText, setSearchText] = useState<string>("");
  const { filteredConfidants, filteredNegotiations, isLoading } = useData();

  const filtered = {
    confidants: filteredConfidants(searchText),
    negotiations: filteredNegotiations(searchText),
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sticky top-0 bg-black z-10">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-xl text-gray-400">Loading...</div>
          </div>
        ) : (
          <>
            {filtered.confidants.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  Confidants
                </h2>
                <ConfidantsListView confidants={filtered.confidants} />
              </div>
            )}

            {filtered.negotiations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  Negotiations
                </h2>
                <NegotiationsListView negotiations={filtered.negotiations} />
              </div>
            )}

            {searchText.length > 0 &&
              filtered.confidants.length === 0 &&
              filtered.negotiations.length === 0 && (
                <div className="flex justify-center items-center h-32">
                  <div className="text-xl text-gray-400">No results found</div>
                </div>
              )}

            {searchText.length > 0 && searchText.length < 4 && (
              <div className="flex justify-center items-center h-32">
                <div className="text-xl text-gray-400">
                  Please enter at least 4 characters to search
                </div>
              </div>
            )}

            {searchText.length === 0 && (
              <div className="flex justify-center items-center h-32">
                <div className="text-xl text-gray-400">
                  Enter a search term to see results
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [darkMode] = useState<boolean>(true);

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      <DataProvider>
        <div className={`min-h-screen bg-black text-gray-100`}>
          <header className="bg-red-950 shadow-lg">
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold">Persona 5 Royal Guide</h1>
            </div>
          </header>

          <main className="container mx-auto py-4">
            <ContentView />
          </main>
        </div>
      </DataProvider>
    </ThemeContext.Provider>
  );
};

export default App;
