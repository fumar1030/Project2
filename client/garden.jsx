const helper = require('./helper');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//Handle planting a new flower
const handleFlower = (e, onFlowerAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#flowerName').value;

  if (!name) {
    helper.handleError('Flower name is required');
    return false;
  }

  helper.sendPost(e.target.action, { name }, onFlowerAdded);
  return false;
};

//Flower planting form
const FlowerForm = (props) => {
  return (
    <form
      id="flowerForm"
      onSubmit={(e) => handleFlower(e, props.triggerReload)}
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

//Display and water flowers
const FlowerList = (props) => {
  const [flowers, setFlowers] = useState(props.flowers);

  useEffect(() => {
    const loadFlowersFromServer = async () => {
      const response = await fetch('/getFlowers');
      const data = await response.json();
      setFlowers(data.flowers);
    };

    loadFlowersFromServer();
  }, [props.reloadFlowers]);

  const handleWater = async (id) => {
    await helper.sendPost(`/water/${id}`, {}, props.triggerReload);
  };

  if (flowers.length === 0) {
    return (
      <div className="flowerList">
        <h3 className="emptyFlower">No flowers planted yet!</h3>
      </div>
    );
  }

  const flowerNodes = flowers.map((flower) => {
    return (
      <div key={flower.id} className="flower">
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
          <button className="waterButton" onClick={() => handleWater(flower.id)}>
            Water 🌧️
          </button>
        )}
      </div>
    );
  });

  return <div className="flowerList">{flowerNodes}</div>;
};

//Main app layout
const App = () => {
  const [reloadFlowers, setReloadFlowers] = useState(false);

  return (
    <div>
      <div id="plantFlower">
        <FlowerForm triggerReload={() => setReloadFlowers(!reloadFlowers)} />
      </div>
      <div id="flowers">
        <FlowerList flowers={[]} reloadFlowers={reloadFlowers} triggerReload={() => setReloadFlowers(!reloadFlowers)} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;
