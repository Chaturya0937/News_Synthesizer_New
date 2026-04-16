import React, { useState, useEffect } from "react";
import { Search, ShieldCheck, BarChart3, Newspaper, Zap } from "lucide-react";

const NewsSynthesizer = () => {
  const [topic, setTopic] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [news, setNews] = useState([]);
  const [synthesizedOutput, setSynthesizedOutput] = useState(""); 
  const [sourcesAudited, setSourcesAudited] = useState(0);
  const [ReliabilityScore, setReliabilityScore] = useState(0);
  const handleSynthesize = async (e) => {
  e.preventDefault();
  if (!topic) return;
  setIsSynthesizing(true);
  try {
    // 🔹 First: Fetch news
    const response = await fetch("http://127.0.0.1:5000/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic: topic }),
    });
    const data = await response.json();
    setSourcesAudited(data.Sources_Audited || 0);
    setNews(data.articles);
    // 🔹 Extract descriptions
    const descriptions = data.articles.map(
      (article) => article.description || ""
    );
    // 🔹 Second: Send descriptions to summarizer
    const summaryResponse = await fetch(
      "http://127.0.0.1:5000/summarized",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articles: descriptions }),
      }
    );
    const summaryData = await summaryResponse.json();
    // 🔹 Store summarized output separately
    setSynthesizedOutput(summaryData.summary);
    setReliabilityScore(summaryData.metrics.reliability_score);
    console.log(summaryData.metrics);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    setIsSynthesizing(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans ">
      {/* Navigation */}
      <nav className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            NewsSynthesizer
          </h1>
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-500">
          <button className="hover:text-indigo-600">History</button>
          <button className="hover:text-indigo-600">Methodology</button>
        </div>
      </nav>

      <main className="w-full px-12 py-12">
        {/* Header Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 text-slate-900">
            Neutralize the Narrative.
          </h2>
          <p className="text-slate-500 text-lg mx-auto">
            Enter a topic to strip away editorial bias and synthesize a
            balanced, factual overview.
          </p>
        </section>

        {/* Input Section */}
        <form onSubmit={handleSynthesize} className="relative mb-16">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={24}
            />
            <input
              type="text"
              placeholder="Enter a news topic (e.g., 'Economic Policy Reform')..."
              className="w-full pl-14 pr-32 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              type="submit"
              disabled={!topic}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
            >
              {isSynthesizing ? "Auditing..." : "Synthesize"}
            </button>
          </div>
        </form>

        {/* Results Placeholder (Conditional) */}
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Metric Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-indigo-600">
                <ShieldCheck size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Objectivity Score
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{ReliabilityScore*100}%</div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
                <div className="bg-indigo-500 h-2 rounded-full w-[88%]"></div>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <Newspaper size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Sources Audited
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{sourcesAudited}</div>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Verified news outlets
              </p>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <BarChart3 size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Bias Variance
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-800">Low</div>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Consistent reporting
              </p>
            </div>
          </div>

          {/* Main Synthesis Output */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-8 py-4 flex justify-between items-center">
              <span className="text-white font-medium">Synthesized Report</span>
              <span className="text-slate-400 text-xs">
                v1.2 Neutral News Auditor
              </span>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Summary of {topic || "[Enter Topic Above]"}
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                The synthesized output would appear here, providing a
                fact-based, non-partisan perspective by cross-referencing
                multiple sources and eliminating emotionally charged adjectives.
              </p>
              <div>
                {news.map((article, index) => {
                  // 1. Define variables clearly from the 'article' object
                  const title = article.title;
                  const content =
                    article.description ||
                    "No summary available for this synthesis.";
                  const sourceName = article.source?.name || "Global News";
                  const url=article.url || "#";

                  return (
                    <div
                      key={index} // 2. index is now available
                      className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow mb-6"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                          Verified Report
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">
                        {title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {content}
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                        <button className="text-indigo-600 font-semibold text-sm hover:underline" onClick={() => window.open(url, "_blank")}>
                          View Article →
                        </button>
                        <span className="text-slate-400 text-xs italic">
                          Source: {sourceName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <h1 className="font-bold text-2xl">Summarized News :</h1>
                <p className="whitespace-pre-line text-slate-700 text-lg">
                  {synthesizedOutput}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsSynthesizer;
