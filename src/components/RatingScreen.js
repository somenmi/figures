const RatingScreen = ({ gridSize, onBack }) => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getRatings(gridSize);
      setRatings(data);
    };
    load();
  }, [gridSize]);

  return (
    <div className="screen-container">
      <Title level="1">Рейтинг {gridSize}x{gridSize}</Title>
      
      <div className="rating-list">
        {ratings.map((item, i) => (
          <div key={item.id} className="rating-item">
            <img src={item.photo} alt="" width={40} height={40} />
            <span>{i+1}. {item.name}</span>
            <span>{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};