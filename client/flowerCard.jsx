const React = require('react');

const FlowerCard = ({ flower, onWater }) => {
  return (
    <div className="flower">
      <img
        src={`/assets/img/flower_stage_${flower.progress}.png`}
        alt={`flower stage ${flower.progress}`}
        className="flowerImage"
      />
      <h3 className="flowerName">🌼 Name: {flower.name}</h3>
      <h4 className="flowerProgress">Progress: {flower.progress} / 5</h4>
      <h4 className="flowerStatus">
        Status: {flower.isBloomed ? 'Bloomed! 🌸' : 'Growing...'}
      </h4>
      {!flower.isBloomed && (
        <button className="waterButton" onClick={() => onWater(flower.id)}>
          Water 🌧️
        </button>
      )}
        <button className="deleteButton" onClick={() => onDelete(flower.id)}>
        Delete 🗑️
      </button>
    </div>
  );
};

module.exports = FlowerCard;