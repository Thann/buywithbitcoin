import '@babel/polyfill';

function fetchUpdateList(originalAction) {
  const { token, username, body } = originalAction;

  return (dispatch) => {
    return fetch(`https://api.purse.io/api/v1/users/${username}/lists/1`, {
      method: 'PUT',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
        'origin': 'https://purse.io'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(async (res) => {
        const text = (res.items.length) ? res.items.length.toString() : '' ;
        chrome.browserAction.setBadgeText({ text });
        await dispatch(addCartItems(res.items))
      })
      .catch(console.log);
  };
}

function fetchUserInfo(originalAction) {
  const { token } = originalAction;
  
  return (dispatch) => {
    return fetch(`https://api.purse.io/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
        'origin': 'https://purse.io'
      }
    }).then(res => res.json())
      .then(res => {
        dispatch(addUserInfo(res));
      })
      .catch(console.log);
  }; 
}

function fetchCartItems(originalAction) {
  const { token } = originalAction;
  
  return (dispatch) => {
    return fetch(`https://api.purse.io/api/v1/users/me/lists`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
        'origin': 'https://purse.io'
      }
    }).then(res => res.json())
      .then(res => {
        if (res[0] && res[0].items) {
          dispatch(addCartItems(res[0].items));
          const text = (res[0].items.length) ? res[0].items.length.toString() : '' ;
          chrome.browserAction.setBadgeText({ text });
        }
      })
      .catch(console.log);
  };
}

function updateCartItems(token, username, body) {
  return {
    type: 'UPDATE_CART_ITEMS',
    token,
    username,
    body
  };
}

function getUserInfo(token) {
  return {
    type: 'GET_USERINFO',
    token
  };
}

function addUserInfo(user) {
  return {
    type: 'ADD_USERINFO',
    user
  };
}

function getCartItems(token) {
  return {
    type: 'GET_CART_ITEMS',
    token
  };
}

function addCartItems(items) {
  return {
    type: 'ADD_CART_ITEMS',
    items
  };
}

function addToken(token) {
  return {
    type: 'ADD_TOKEN',
    token: token
  };
}

export { addUserInfo, addCartItems, getUserInfo, getCartItems, addToken, 
         fetchUserInfo, fetchCartItems, fetchUpdateList, updateCartItems };