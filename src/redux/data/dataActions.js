// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let name = await store
        .getState()
        .blockchain.smartContract.methods.name()
        .call();
      let allTokens = await store
        .getState()
        .blockchain.smartContract.methods.getAllTokens.call()
        .call();

      console.log("allTokens");
      console.log(allTokens);
      const ownedTokens = [];
      // const objects = [];
      let balance = await store
        .getState()
        .blockchain.smartContract.methods.balanceOf(account)
        .call();

      for (var i = 0; i < balance; i++) {
        const owner = await store
          .getState()
          .blockchain.smartContract.methods.ownerOf(i)
          .call();

        if (account === owner.toLowerCase()) {
          const targetToken = allTokens[i];
          ownedTokens.push(targetToken);
        }
      }

      // for (i = 0; i < ownedTokens.length; i++) {
      //   objects.push(
      //     await store
      //       .getState()
      //       .blockchain.smartContract.methods.tokenURI(tokenIdList[i])
      //       .call()
      //   );
      // }

      // alert(JSON.stringify(ownedTokens));

      dispatch(
        fetchDataSuccess({
          name,
          allTokens,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
