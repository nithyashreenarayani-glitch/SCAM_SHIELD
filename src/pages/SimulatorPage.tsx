import React, { useState } from 'react';
import { SIMULATOR_QUESTIONS } from '../lib/data/simulatorData';
import { SimulatorQuestion, SimulatorOption } from '../types';
import {
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Award,
} from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<SimulatorOption | null>(null);
  const [score, setScore] = useState(0);
  const [answersState, setAnswersState] = useState<{ [qId: string]: boolean }>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: SimulatorQuestion = SIMULATOR_QUESTIONS[currentIndex];

  const handleSelectOption = (opt: SimulatorOption) => {
    if (selectedOption) return; // already answered
    setSelectedOption(opt);

    const isCorrect = opt.isSafe;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswersState((prev) => ({ ...prev, [currentQ.id]: isCorrect }));
  };

  const handleNext = () => {
    if (currentIndex < SIMULATOR_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswersState({});
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
          Interactive Defense Drill
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Can You Spot the Scam?
        </h1>
        <p className="text-sm text-slate-400">
          Realistic simulations to test your situational awareness against phishing, deceptive pre-payments, and urgent fraud alerts.
        </p>
      </div>

      {/* Score & Progress Tracker */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-semibold">Cyber Awareness Score:</span>
          <span className="font-mono tabular-nums text-white font-bold text-sm">
            {score} / {SIMULATOR_QUESTIONS.length}
          </span>
        </div>

        <div className="text-slate-400 font-mono">
          Question {currentIndex + 1} of {SIMULATOR_QUESTIONS.length}
        </div>
      </div>

      {isFinished ? (
        /* Results Screen */
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/80 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8 text-indigo-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Simulation Completed!</h2>
            <p className="text-sm text-slate-400">
              Your Final Defense Score:{' '}
              <span className="font-mono text-indigo-400 font-extrabold text-lg">
                {score} out of {SIMULATOR_QUESTIONS.length} correct
              </span>
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {score === SIMULATOR_QUESTIONS.length
                ? 'Outstanding! You demonstrated advanced threat discernment across multiple deception vectors.'
                : 'Good practice. Review the explanations to recognize sophisticated social engineering traps in the wild.'}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Simulation Drill</span>
          </button>
        </div>
      ) : (
        /* Active Scenario Container */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 space-y-6 shadow-xl">
          {/* Scenario Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase font-semibold">
                Scenario #{currentIndex + 1} · {currentQ.channel} Channel
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{currentQ.scenarioTitle}</h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Category: {currentQ.threatCategory}</span>
              <span>·</span>
              <span className="text-amber-400">{currentQ.difficulty}</span>
            </div>
          </div>

          {/* Scenario Mock Message Display */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            {currentQ.senderInfo && (
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                <span className="text-slate-400 font-semibold">From / Header:</span>
                <span>{currentQ.senderInfo}</span>
              </div>
            )}
            <p className="text-xs md:text-sm text-slate-200 font-mono leading-relaxed pt-1">
              "{currentQ.content}"
            </p>
          </div>

          {/* Question Prompt */}
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            What is the safest action to take?
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              let borderStyle = 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/40';

              if (selectedOption) {
                if (opt.isSafe) {
                  borderStyle = 'border-emerald-500/60 bg-emerald-950/20 text-emerald-200';
                } else if (isSelected && !opt.isSafe) {
                  borderStyle = 'border-red-500/60 bg-red-950/20 text-red-200';
                } else {
                  borderStyle = 'border-slate-800/60 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={Boolean(selectedOption)}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 rounded-xl border bg-slate-950/40 transition flex items-start gap-3 text-xs md:text-sm ${borderStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5">
                    {opt.id.split('-')[1]?.toUpperCase()}
                  </span>
                  <span className="flex-1 leading-relaxed text-slate-200">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Post-Answer Explanation Box */}
          {selectedOption && (
            <div
              className={`p-4 rounded-xl border space-y-2 animate-fade-in ${
                selectedOption.isSafe
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-100'
                  : 'border-red-500/30 bg-red-950/20 text-red-100'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                {selectedOption.isSafe ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">SAFE DECISION</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-300">UNSAFE / TRAP DECISION</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">{selectedOption.explanation}</p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow"
                >
                  <span>
                    {currentIndex < SIMULATOR_QUESTIONS.length - 1
                      ? 'Next Scenario'
                      : 'View Results'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
