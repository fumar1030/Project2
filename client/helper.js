const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
  };
  
  const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler){
        handler(result);
    }
  };

  const sendDelete = async (url, data, onSuccess) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    if (response.ok) {
      onSuccess();
    } else {
      handleError(result.error);
    }
  };

  const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
  };

  module.exports = {
    handleError,
    sendPost,
    sendDelete,
    hideError,
  };