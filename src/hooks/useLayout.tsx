import {
  createContext,
  RefObject,
  useContext,
  useReducer,
  useRef,
} from 'react';

// export type LayoutContextType = {
//   mainRef: React.RefObject<HTMLDivElement>;
//   isSidebarAvailable: boolean;
//   setIsSidebarAvailable: React.Dispatch<React.SetStateAction<boolean>>;
//   isSidebarCollapsed: boolean;
//   setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
// };

type LayoutContextType = {
  isSidebarCollapsed: boolean;
  isSidebarAvailable: boolean;
  isFooterAvailable: boolean;
  mainRef: RefObject<HTMLDivElement> | null;
};
type LayoutDispatchContextType = React.Dispatch<LayoutActionType>;

type LayoutActionType =
  | { type: 'SET_ISSIDEBARCOLLAPSED'; payload: boolean }
  | { type: 'SET_ISSIDEBARAVAILABLE'; payload: boolean }
  | { type: 'SET_ISFOOTERAVAILABLE'; payload: boolean }
  | { type: 'SET_MAINREF'; payload: RefObject<HTMLDivElement> }
  | { type: 'POPULATE'; payload: LayoutContextType };

function reducer(state: LayoutContextType, action: LayoutActionType) {
  switch (action.type) {
    case 'SET_ISSIDEBARCOLLAPSED':
      return {
        ...state,
        isSidebarCollapsed: action.payload,
      };
    case 'SET_ISSIDEBARAVAILABLE':
      return {
        ...state,
        isSidebarAvailable: action.payload,
      };
    case 'SET_ISFOOTERAVAILABLE':
      return {
        ...state,
        isFooterAvailable: action.payload,
      };
    case 'SET_MAINREF':
      return {
        ...state,
        mainRef: action.payload,
      };
    case 'POPULATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      throw new Error('Unknown action type');
  }
}

export const LayoutContext = createContext<LayoutContextType>({
  isSidebarCollapsed: false,
  isSidebarAvailable: false,
  isFooterAvailable: false,
  mainRef: null,
});
export const LayoutDispatchContext = createContext<LayoutDispatchContextType>(
  () => {
    return;
  }
);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    isSidebarCollapsed: false,
    isSidebarAvailable: false,
    isFooterAvailable: false,
    mainRef: mainRef,
  });

  return (
    <LayoutContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
export const useLayoutDispatch = () => useContext(LayoutDispatchContext);
