import { K_FACTOR } from "../constants";
import { Character, StatCategory } from "../types";

export const calculateEloChange = (winnerElo: number, loserElo: number): number => {
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const eloChange = Math.round(K_FACTOR * (1 - expectedScoreWinner));
  return eloChange;
};

export const applyVote = (
  winner: Character,
  loser: Character,
  affectedCategories: StatCategory[] = [StatCategory.OVERALL]
): { winner: Character; loser: Character; change: number } => {
  // Always update Overall Elo
  const change = calculateEloChange(winner.overallElo, loser.overallElo);

  const updatedWinner = { ...winner };
  const updatedLoser = { ...loser };

  // Update Overall Stats (Counts wins/losses only once per battle)
  updatedWinner.overallElo += change;
  updatedWinner.wins += 1;
  
  updatedLoser.overallElo -= change;
  updatedLoser.losses += 1;

  // Add match history
  const timestamp = Date.now();
  updatedWinner.matchHistory.unshift({
    opponentId: loser.id,
    opponentName: loser.name,
    result: 'WIN',
    eloChange: change,
    date: timestamp
  });
  
  updatedLoser.matchHistory.unshift({
    opponentId: winner.id,
    opponentName: winner.name,
    result: 'LOSS',
    eloChange: -change,
    date: timestamp
  });

  // Limit match history size
  if (updatedWinner.matchHistory.length > 20) updatedWinner.matchHistory.pop();
  if (updatedLoser.matchHistory.length > 20) updatedLoser.matchHistory.pop();

  // Update Specific Categories
  // Note: We use the same K-factor for categories for simplicity, 
  // but we calculate the delta based on the *category specific* current ratings.
  // This allows a character to have high Battle IQ but low Hand-to-Hand, and they will converge differently.
  
  affectedCategories.forEach(cat => {
    if (cat === StatCategory.OVERALL) return; // Already handled above
    
    const catChange = calculateEloChange(updatedWinner[cat], updatedLoser[cat]);
    
    updatedWinner[cat] += catChange;
    updatedLoser[cat] -= catChange;
  });

  return {
    winner: updatedWinner,
    loser: updatedLoser,
    change
  };
};