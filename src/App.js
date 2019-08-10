import React from 'react';
import './App.css';
import SongList from './components/SongList'
import ControlCard from './components/Control/ControlCard'
import Notabase from 'notabase'
import BasePlayer from './components/BasePlayer'
import { PhosPlayerContext } from "./components/PhosPlayerContext";


function PhosPlayer() {
  const { state, dispatch } = React.useContext(PhosPlayerContext)

  React.useEffect(() => {
    let nb = new Notabase()
    const fetchData = async () => {
      console.log("fetchData")
      let db = await nb.fetch({
        songs: "https://www.notion.so/2628769120ad41d998ec068d6e2eb410?v=e8e69ac68a8d483792c54541e4d8ba72",
        albums: "https://www.notion.so/15f1759f38a34fedaa79262812b707f0?v=b385656739214101b2b8a159092a52e8",
        artists: "https://www.notion.so/31b8544ffb034964b1aa56bfa78497c1?v=1d9cbfcd279d4534964acdd374c9824e"
      })

      dispatch({
        type: 'loadData',
        payload: {
          data: db
        }
      })
    }
    fetchData()
  }, [])


  return (
    <div>
      <BasePlayer />
      <SongList />
      <ControlCard />
    </div>
  );
}

export default PhosPlayer;