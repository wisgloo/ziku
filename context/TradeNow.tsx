import React, { useContext, useReducer } from "react";
import { COINS } from "../hooks/useCoinPrice";
import { otokens_otokens } from "../queries/__generated__/otokens";

export enum Steps {
  SELECT_ASSET = 1,
  EXPLAIN,
  SELECT_OPTION,
  BUY,
}

export enum OptionType {
  CALLS = 'calls',
  PUTS = 'puts',
}

export enum TradeActions {
  ASSET_SELECTED,
  OPTION_TYPE_SELECTED,
  OPTION_SELECTED,
  GO_BACK,
  GO_FORWARD,
}

type TradeNowType = {
  step: Steps;
  mostForwardStep: Steps;
  optionType: OptionType | null;
  asset: COINS | null;
  selectedOtoken: otokens_otokens | null,
};

type TradeContextType = {
  tradeState: TradeNowType;
  dispatch: any;
}

const initialState: TradeNowType = {
  step: Steps.SELECT_ASSET,
  mostForwardStep: Steps.SELECT_ASSET,
  optionType: OptionType.CALLS,
  asset: null,
  selectedOtoken: null,
};

const TradeContext = React.createContext(null);
const useTradeState = () => useContext<TradeContextType>(TradeContext);

const tradeReducer: (state: TradeNowType, action: any) => TradeNowType = (state, action) => {
  switch (action.type) {
    case TradeActions.ASSET_SELECTED:
      return { ...state, step: Steps.EXPLAIN, mostForwardStep: Steps.EXPLAIN, asset: action.payload };
    case TradeActions.OPTION_TYPE_SELECTED:
      return { ...state, step: Steps.SELECT_OPTION, mostForwardStep: Steps.SELECT_OPTION, optionType: action.payload };
    case TradeActions.OPTION_SELECTED:
      return { ...state, step: Steps.BUY, mostForwardStep: Steps.BUY, selectedOtoken: action.payload };
    case TradeActions.GO_BACK:
      return { ...state, step: state.step - 1 };
    case TradeActions.GO_FORWARD:
      return { ...state, step: state.step + 1 };
  }
  return state;
}

const TradeProvider: React.FC = ({ children }) => {
  const [tradeState, dispatch] = useReducer(tradeReducer, initialState);

  return (
    <TradeContext.Provider value={{ tradeState, dispatch }}>
      {children}
    </TradeContext.Provider>
  );
};

export { useTradeState, TradeProvider };
