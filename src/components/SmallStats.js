const SmallStats = ({ wordStats }) => {
  const correctCount = wordStats.filter((w) => w.correct).length;
  const wordCount = wordStats.length;

  return (
    <div style={{ fontSize: "16px", color: "green" }}>
      Correct: {correctCount}/{wordCount}
    </div>
  );
};

export default SmallStats;
