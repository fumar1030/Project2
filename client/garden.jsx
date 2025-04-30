// garden.jsx
const helper = require('./helper');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const getRandomPosition = () => ({
  top: `${Math.floor(Math.random() * 70) + 10}%`,
  left: `${Math.floor(Math.random() * 80) + 10}%`,
});

const FlowerForm = (props) => {
  const handleFlower = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#flowerName').value;
    if (!name) {
      helper.handleError('Flower name is required');
      return false;
    }

    helper.sendPost(e.target.action, { name }, props.triggerReload);
    return false;
  };

  return (
    <form
      id="flowerForm"
      onSubmit={handleFlower}
      name="flowerForm"
      action="/garden"
      method="POST"
      className="flowerForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="flowerName" type="text" name="name" placeholder="Task Name" />
      <input className="plantFlowerSubmit" type="submit" value="Plant Flower" />
    </form>
  );
};

const FlowerList = ({ reloadFlowers, triggerReload, isWatering }) => {
  const [flowers, setFlowers] = useState([]);
  const [positions, setPositions] = useState({});
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const loadFlowersFromServer = async () => {
      const response = await fetch('/getFlowers');
      const data = await response.json();

      const newPositions = { ...positions };
      data.flowers.forEach((f) => {
        if (!newPositions[f.id]) {
          newPositions[f.id] = getRandomPosition();
        }
      });

      setPositions(newPositions);
      setFlowers(data.flowers);
    };
    loadFlowersFromServer();
  }, [reloadFlowers]);

  const handleWater = async (id) => {
    await helper.sendPost(`/water/${id}`, {}, triggerReload);
  };

  return (
    <div className="flowerList" style={{ position: 'relative', width: '100%', height: '80vh' }}>
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="flower"
          style={{ position: 'absolute', ...positions[flower.id], cursor: 'pointer' }}
          onClick={() => {
            if (isWatering) {
              handleWater(flower.id);
            } else {
              setExpanded(expanded === flower.id ? null : flower.id);
            }
          }}
        >
          <img
            src={`/assets/img/flower_stage_${flower.progress}.png`}
            alt={`flower stage ${flower.progress}`}
            className="flowerImage"
          />
          <div className="nameTag">{flower.name}</div>
          {expanded === flower.id && (
            <div className="flowerDetails">
              <div className="flowerProgress">Progress: {flower.progress}/5</div>
              <div className="flowerStatus">Status: {flower.isBloomed ? 'Bloomed! 🌸' : 'Growing...'}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


const App = () => {
  const [reloadFlowers, setReloadFlowers] = useState(false);
  const [isWatering, setIsWatering] = useState(false);

  useEffect(() => {
    const buyBtn = document.getElementById('buySpaceBtn');
    if (buyBtn) {
      buyBtn.onclick = async () => {
        try {
          const response = await fetch('/buySpace', { method: 'POST' });
          const result = await response.json();
          if (!response.ok) {
            helper.handleError(result.error);
          } else {
            alert(result.message);
          }
        } catch (err) {
          helper.handleError('Error buying more space.');
        }
      };
    }
  }, []);

  return (
    <div>
      <div id="plantFlower">
        <FlowerForm triggerReload={() => setReloadFlowers(!reloadFlowers)} />
      </div>
      <div id="waterToggle" style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button className="waterModeToggle" onClick={() => setIsWatering(!isWatering)}>
          {isWatering ? 'Exit Water Mode 💧' : 'Enter Water Mode 💧'}
        </button>
      </div>
      <div id="flowers">
        <FlowerList
          reloadFlowers={reloadFlowers}
          triggerReload={() => setReloadFlowers(!reloadFlowers)}
          isWatering={isWatering}
        />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;