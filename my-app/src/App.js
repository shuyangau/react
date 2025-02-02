import configureStore from './store';
import { Provider } from 'react-redux';
import './App.css';
import ItemsTable from './components/ItemsTable/ItemsTable';


function App() {
  return (
    <Provider store={configureStore}>
    <div className="App" >
      <ItemsTable />
    </div>
  </Provider>
  );
}

export default App;
